/**
 * DistractionKiller Background Service Worker
 * 
 * Handles the core functionality of the Distraction Killer extension:
 * - Session management (start, pause, stop, complete)
 * - Website blocking and navigation interception
 * - Temporary access management
 * - Gamification event tracking
 * - Communication between popup, content scripts, and other components
 */

// Import core services
importScripts('../core/gamification.js');
importScripts('../core/blocklist-manager.js');

class DistractionKillerBackground {
    constructor() {
        this.currentSession = null;
        this.userSettings = null;
        this.gamificationService = new GamificationService();
        this.blocklistManager = new BlocklistManager();
        this.milestoneThresholds = [0.25, 0.5, 0.75]; // 25%, 50%, 75%
        this.achievedMilestones = new Set();
        
        this.initialize();
    }

    /**
     * Initialize the background service
     */
    async initialize() {
        console.log('DistractionKiller Background Service starting...');
        
        // Set up event listeners
        this.setupMessageListener();
        this.setupNavigationListener();
        this.setupAlarmListener();
        
        // Load initial data
        await this.loadSessionData();
        await this.loadUserSettings();
        await this.blocklistManager.initializeBlocklists();
        
        console.log('DistractionKiller Background Service initialized');
    }

    /**
     * Set up message listener for communication with popup and content scripts
     */
    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true; // Keep message channel open for async responses
        });
    }

    /**
     * Handle messages from popup, content scripts, and other components
     */
    async handleMessage(request, sender, sendResponse) {
        try {
            console.log('Background received message:', request.action);

            switch (request.action) {
                case 'getSessionData':
                    sendResponse({
                        currentSession: this.currentSession,
                        userSettings: this.userSettings
                    });
                    break;

                case 'startSession':
                    await this.startSession(request.sessionData);
                    sendResponse({ success: true });
                    break;

                case 'pauseSession':
                    await this.pauseSession(request.pauseData);
                    sendResponse({ success: true });
                    break;

                case 'resumeSession':
                    await this.resumeSession();
                    sendResponse({ success: true });
                    break;

                case 'stopSession':
                    await this.stopSession();
                    sendResponse({ success: true });
                    break;

                case 'completeSession':
                    await this.completeSession(request.sessionData);
                    sendResponse({ success: true });
                    break;

                case 'updateSession':
                    await this.updateSession(request.sessionData);
                    sendResponse({ success: true });
                    break;

                case 'checkBlockedSite':
                    const blockResult = await this.blocklistManager.shouldBlockUrl(request.url, this.userSettings);
                    sendResponse({
                        isBlocked: blockResult.shouldBlock,
                        category: blockResult.category || null,
                        matchType: blockResult.matchType || null,
                        matchValue: blockResult.matchValue || null
                    });
                    break;

                case 'grantTemporaryAccess':
                    await this.grantTemporaryAccess(request.accessData);
                    sendResponse({ success: true });
                    break;

                case 'trackGamificationEvent':
                    await this.trackGamificationEvent(request.eventType, request.data);
                    sendResponse({ success: true });
                    break;

                case 'getBlocklistStats':
                    const stats = this.blocklistManager.getBlocklistStats();
                    sendResponse(stats);
                    break;

                case 'updateSettings':
                    await this.updateUserSettings(request.settings);
                    sendResponse({ success: true });
                    break;

                default:
                    console.warn('Unknown action:', request.action);
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            console.error('Error handling message:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    /**
     * Set up navigation listener to intercept and block websites
     */
    setupNavigationListener() {
        chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
            // Only block main frame navigations during active sessions
            if (details.frameId === 0 && this.currentSession?.isActive) {
                await this.handleNavigation(details.url, details.tabId);
            }
        });
    }

    /**
     * Set up alarm listener for session timing
     */
    setupAlarmListener() {
        chrome.alarms.onAlarm.addListener(async (alarm) => {
            if (alarm.name === 'sessionComplete' && this.currentSession) {
                await this.completeSession(this.currentSession);
            }
        });
    }

    /**
     * Handle navigation attempt during active session
     */
    async handleNavigation(url, tabId) {
        try {
            // Check for temporary access first
            const hasTemporaryAccess = await this.checkTemporaryAccess(url);
            if (hasTemporaryAccess) {
                console.log('Allowing navigation due to temporary access:', url);
                return;
            }

            // Check if site should be blocked
            const blockResult = await this.blocklistManager.shouldBlockUrl(url, this.userSettings);
            
            if (blockResult.shouldBlock) {
                console.log('Blocking navigation to:', url);
                
                // Update session blocked attempts counter
                if (this.currentSession) {
                    this.currentSession.blockedAttempts = (this.currentSession.blockedAttempts || 0) + 1;
                    this.currentSession.hadBlockedAttempts = true;
                    await this.updateSession(this.currentSession);
                }
                
                // Track gamification event
                await this.trackGamificationEvent('blocked_attempt', {
                    url: url,
                    category: blockResult.category,
                    matchType: blockResult.matchType,
                    matchValue: blockResult.matchValue
                });
                
                // Store blocked URL data for potential temporary access
                await this.storeBlockingReason(url, blockResult);
                
                // Redirect to blocked page
                this.redirectToBlockedPage(url, tabId);
            }
        } catch (error) {
            console.error('Error handling navigation:', error);
        }
    }

    /**
     * Start a new deep work session
     */
    async startSession(sessionData) {
        try {
            console.log('Starting deep work session:', sessionData);
            
            this.currentSession = {
                ...sessionData,
                isActive: true,
                isPaused: false,
                pausedTime: 0,
                blockedAttempts: 0,
                hadBlockedAttempts: false,
                hadOverrides: false,
                achievedMilestones: new Set()
            };
            
            // Save session to storage
            await chrome.storage.local.set({ currentSession: this.currentSession });
            
            // Clear any existing temporary access
            await chrome.storage.local.remove(['temporaryAccess', 'lastBlockedUrl', 'lastBlockedTabId']);
            
            // Track gamification event
            await this.trackGamificationEvent('session_start', {
                sessionId: sessionData.id,
                startTime: sessionData.startTime,
                duration: sessionData.duration,
                goal: sessionData.goal
            });
            
            // Set up session completion alarm
            const alarmTime = new Date(sessionData.endTime);
            chrome.alarms.create('sessionComplete', { when: alarmTime.getTime() });
            
            console.log('Deep work session started successfully');
            
        } catch (error) {
            console.error('Error starting session:', error);
            throw error;
        }
    }

    /**
     * Pause the current session
     */
    async pauseSession(pauseData) {
        if (!this.currentSession) return;

        try {
            this.currentSession.isPaused = true;
            this.currentSession.pauseStartTime = Date.now();
            this.currentSession.wasPaused = true;
            
            await this.updateSession(this.currentSession);
            
            // Track gamification event for pause
            await this.trackGamificationEvent('pause_chosen', {
                pauseMinutes: pauseData.minutes || 5
            });
            
            console.log('Session paused');
        } catch (error) {
            console.error('Error pausing session:', error);
        }
    }

    /**
     * Resume the current session
     */
    async resumeSession() {
        if (!this.currentSession || !this.currentSession.isPaused) return;

        try {
            const pauseDuration = Date.now() - this.currentSession.pauseStartTime;
            this.currentSession.pausedTime += pauseDuration;
            this.currentSession.isPaused = false;
            this.currentSession.endTime += pauseDuration; // Extend session by pause duration
            
            delete this.currentSession.pauseStartTime;
            
            await this.updateSession(this.currentSession);
            
            // Update the alarm
            const alarmTime = new Date(this.currentSession.endTime);
            chrome.alarms.create('sessionComplete', { when: alarmTime.getTime() });
            
            console.log('Session resumed');
        } catch (error) {
            console.error('Error resuming session:', error);
        }
    }

    /**
     * Stop the current session early
     */
    async stopSession() {
        if (!this.currentSession) return;

        try {
            this.currentSession.isActive = false;
            this.currentSession.completed = false;
            this.currentSession.endTime = Date.now();
            this.currentSession.stoppedEarly = true;
            
            // Track gamification event
            await this.trackGamificationEvent('session_abort', {
                sessionId: this.currentSession.id,
                duration: this.currentSession.endTime - this.currentSession.startTime,
                durationMinutes: Math.floor((this.currentSession.endTime - this.currentSession.startTime) / 60000),
                stoppedEarly: true
            });
            
            // Save to session history
            await this.saveSessionToHistory(this.currentSession);
            
            // Clear current session
            this.currentSession = null;
            await chrome.storage.local.remove(['currentSession']);
            
            // Clear alarms and temporary access
            chrome.alarms.clear('sessionComplete');
            await chrome.storage.local.remove(['temporaryAccess', 'lastBlockedUrl', 'lastBlockedTabId']);
            
            console.log('Session stopped early');
        } catch (error) {
            console.error('Error stopping session:', error);
        }
    }

    /**
     * Complete the current session
     */
    async completeSession(sessionData) {
        try {
            const finalSessionData = sessionData || this.currentSession;
            if (!finalSessionData) return;

            finalSessionData.isActive = false;
            finalSessionData.completed = true;
            finalSessionData.endTime = Date.now();
            
            // Calculate final duration and other completion data
            const finalDuration = finalSessionData.endTime - finalSessionData.startTime;
            const durationMinutes = Math.floor(finalDuration / 60000);
            
            // Track gamification event
            await this.trackGamificationEvent('session_complete', {
                sessionId: finalSessionData.id,
                duration: finalDuration,
                durationMinutes: durationMinutes,
                blockedAttempts: finalSessionData.blockedAttempts || 0,
                hadBlockedAttempts: finalSessionData.hadBlockedAttempts || false,
                hadOverrides: finalSessionData.hadOverrides || false,
                wasPaused: finalSessionData.wasPaused || false,
                pausedTime: finalSessionData.pausedTime || 0,
                endTime: finalSessionData.endTime
            });
            
            // Save to session history
            await this.saveSessionToHistory(finalSessionData);
            
            // Clear current session
            this.currentSession = null;
            await chrome.storage.local.remove(['currentSession']);
            
            // Clear alarms and temporary access
            chrome.alarms.clear('sessionComplete');
            await chrome.storage.local.remove(['temporaryAccess', 'lastBlockedUrl', 'lastBlockedTabId']);
            
            console.log('Session completed successfully');
        } catch (error) {
            console.error('Error completing session:', error);
        }
    }

    /**
     * Update the current session data
     */
    async updateSession(sessionData) {
        try {
            this.currentSession = sessionData;
            await chrome.storage.local.set({ currentSession: sessionData });
        } catch (error) {
            console.error('Error updating session:', error);
        }
    }

    /**
     * Save session to history
     */
    async saveSessionToHistory(sessionData) {
        try {
            const result = await chrome.storage.local.get(['sessionHistory']);
            const sessionHistory = result.sessionHistory || [];
            
            // Check if session already exists to avoid duplicates
            const existingIndex = sessionHistory.findIndex(s => s.id === sessionData.id);
            if (existingIndex !== -1) {
                sessionHistory[existingIndex] = sessionData;
            } else {
                sessionHistory.unshift(sessionData);
            }
            
            // Keep only last 100 sessions
            if (sessionHistory.length > 100) {
                sessionHistory.splice(100);
            }
            
            await chrome.storage.local.set({ sessionHistory });
        } catch (error) {
            console.error('Error saving session to history:', error);
        }
    }

    /**
     * Track a gamification event
     */
    async trackGamificationEvent(eventType, data = {}) {
        try {
            if (!this.currentSession) {
                console.log('No active session, skipping gamification event');
                return;
            }

            const sessionId = this.currentSession.id;
            const result = await this.gamificationService.trackEvent(eventType, sessionId, data);
            
            // Update session data for certain events
            if (eventType === 'override' && this.currentSession) {
                this.currentSession.hadOverrides = true;
                this.currentSession.overrideCount = (this.currentSession.overrideCount || 0) + 1;
                await this.updateSession(this.currentSession);
            }
            
            return result;
        } catch (error) {
            console.error('Error tracking gamification event:', error);
        }
    }

    /**
     * Grant temporary access to a blocked site
     */
    async grantTemporaryAccess(accessData) {
        try {
            const temporaryAccess = {
                url: accessData.url,
                domain: accessData.domain,
                keyword: accessData.keyword,
                sessionId: this.currentSession?.id,
                endTime: Date.now() + (accessData.minutes * 60 * 1000),
                granted: true
            };
            
            await chrome.storage.local.set({ temporaryAccess });
            
            // Track as override event
            await this.trackGamificationEvent('override', {
                url: accessData.url,
                minutes: accessData.minutes
            });
            
            console.log('Temporary access granted:', temporaryAccess);
        } catch (error) {
            console.error('Error granting temporary access:', error);
        }
    }

    /**
     * Check if URL has temporary access
     */
    async checkTemporaryAccess(url) {
        try {
            const result = await chrome.storage.local.get(['temporaryAccess']);
            const temporaryAccess = result.temporaryAccess;
            
            if (!temporaryAccess?.granted) return false;
            
            const now = Date.now();
            
            // Check if access is still valid
            if (temporaryAccess.sessionId !== this.currentSession?.id || now >= temporaryAccess.endTime) {
                await chrome.storage.local.remove(['temporaryAccess']);
                return false;
            }
            
            // Check if URL matches
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            
            if (temporaryAccess.url && url === temporaryAccess.url) return true;
            if (temporaryAccess.domain && (hostname === temporaryAccess.domain || hostname.endsWith('.' + temporaryAccess.domain))) return true;
            if (temporaryAccess.keyword && url.toLowerCase().includes(temporaryAccess.keyword.toLowerCase())) return true;
            
            return false;
        } catch (error) {
            console.error('Error checking temporary access:', error);
            return false;
        }
    }

    /**
     * Store blocking reason for potential temporary access
     */
    async storeBlockingReason(url, blockResult) {
        try {
            const blockingReason = {
                url: url,
                category: blockResult.category,
                matchType: blockResult.matchType,
                matchValue: blockResult.matchValue,
                timestamp: Date.now()
            };
            
            await chrome.storage.local.set({ 
                lastBlockedUrl: url,
                blockingReason: blockingReason 
            });
        } catch (error) {
            console.error('Error storing blocking reason:', error);
        }
    }

    /**
     * Redirect to blocked page
     */
    redirectToBlockedPage(url, tabId) {
        try {
            const blockedPageUrl = chrome.runtime.getURL('blocked.html') + '?blocked=' + encodeURIComponent(url);
            chrome.tabs.update(tabId, { url: blockedPageUrl });
        } catch (error) {
            console.error('Error redirecting to blocked page:', error);
        }
    }

    /**
     * Load session data from storage
     */
    async loadSessionData() {
        try {
            const result = await chrome.storage.local.get(['currentSession']);
            this.currentSession = result.currentSession;
            
            if (this.currentSession?.isActive) {
                console.log('Resuming active session:', this.currentSession);
                
                // Convert achievedMilestones back to Set if needed
                if (Array.isArray(this.currentSession.achievedMilestones)) {
                    this.currentSession.achievedMilestones = new Set(this.currentSession.achievedMilestones);
                } else if (!this.currentSession.achievedMilestones) {
                    this.currentSession.achievedMilestones = new Set();
                }
            }
        } catch (error) {
            console.error('Error loading session data:', error);
        }
    }

    /**
     * Load user settings from storage
     */
    async loadUserSettings() {
        try {
            const result = await chrome.storage.local.get(['userSettings']);
            this.userSettings = result.userSettings || this.getDefaultSettings();
        } catch (error) {
            console.error('Error loading user settings:', error);
            this.userSettings = this.getDefaultSettings();
        }
    }

    /**
     * Update user settings
     */
    async updateUserSettings(newSettings) {
        try {
            this.userSettings = { ...this.userSettings, ...newSettings };
            await chrome.storage.local.set({ userSettings: this.userSettings });
        } catch (error) {
            console.error('Error updating user settings:', error);
        }
    }

    /**
     * Get default user settings
     */
    getDefaultSettings() {
        return {
            siteCategories: {
                socialMedia: true,
                shopping: true,
                news: true,
                adult: true,
                entertainment: true
            },
            customSites: [],
            customKeywords: [],
            frictionSettings: {
                requireTyping: true,
                minTypingTime: 30,
                minLength: 100
            }
        };
    }
}

// Initialize the background service
const distractionKiller = new DistractionKillerBackground();
