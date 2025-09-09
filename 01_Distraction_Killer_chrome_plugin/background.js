// DistractionKiller Background Script

// Include gamification service
importScripts('gamification-service.js');

class DistractionKillerBackground {
    constructor() {
        this.currentSession = null;
        this.userSettings = null;
        this.blockedSites = this.initializeBlockedSites();
        this.pornBlocklist = null; // Will be loaded from JSON file
        this.milestoneThresholds = [0.25, 0.5, 0.75]; // 25%, 50%, 75%
        this.achievedMilestones = new Set();
        this.gamification = this.initializeGamification();
        this.setupMessageListener();
        this.setupNavigationListener();
        this.loadSessionData();
        this.loadUserSettings();
        this.loadPornBlocklist();
    }

    initializeGamification() {
        // Create a simple gamification object that works in service worker
        const service = new GamificationService();
        return {
            trackEvent: async (eventType, sessionId, data = {}) => {
                try {
                    const result = await service.trackEvent(eventType, sessionId, data);
                    // Show notification if there's a message
                    if (result.message) {
                        this.showGamificationNotification(result.message);
                    }
                    return result;
                } catch (error) {
                    console.error('Error tracking gamification event:', error);
                    return { pointsToAdd: 0, message: '' };
                }
            },
            getGamificationSummary: async () => await service.getGamificationSummary(),
            getGamificationReportData: async () => await service.getGamificationReportData()
        };
    }

    showGamificationNotification(message) {
        try {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'Distraction Killer',
                message: message
            });
        } catch (error) {
            console.error('Error showing gamification notification:', error);
        }
    }

    async trackGamificationEvent(eventType, data = {}) {
        if (!this.gamification || !this.currentSession) {
            console.log('Gamification or session not available, skipping event tracking');
            return;
        }

        try {
            const sessionId = this.currentSession.id;
            if (typeof this.gamification.trackEvent === 'function') {
                await this.gamification.trackEvent(eventType, sessionId, data);
            } else {
                console.log('Gamification trackEvent method not available');
            }
        } catch (error) {
            console.error('Error tracking gamification event:', error);
        }
    }

    initializeBlockedSites() {
        return {
            "social": [
                "facebook.com", "instagram.com", "twitter.com", "x.com", "tiktok.com",
                "snapchat.com", "pinterest.com", "reddit.com", "tumblr.com", "discord.com",
                "twitch.tv", "linkedin.com", "wechat.com", "weibo.com", "vk.com",
                "ok.ru", "telegram.org", "quora.com", "clubhouse.com", "mastodon.social",
                "threads.net", "truthsocial.com", "kooapp.com", "sharechat.com",
                "mojapp.in", "hike.in"
            ],
            "ecommerce": [
                "amazon.com", "amazon.in", "flipkart.com", "ebay.com", "aliexpress.com",
                "walmart.com", "target.com", "bestbuy.com", "costco.com", "homedepot.com",
                "etsy.com", "rakuten.com", "jd.com", "shopify.com", "myntra.com",
                "ajio.com", "nykaa.com", "snapdeal.com", "paytmmall.com", "bigbasket.com",
                "grofers.com", "zomato.com", "swiggy.com", "olx.in", "meesho.com",
                "pepperfry.com", "firstcry.com", "bookmyshow.com", "bewakoof.com", "tatacliq.com"
            ],
            "news": [
                "cnn.com", "bbc.com", "nytimes.com", "theguardian.com", "washingtonpost.com",
                "reuters.com", "aljazeera.com", "foxnews.com", "nbcnews.com", "cbsnews.com",
                "abcnews.go.com", "sky.com", "huffpost.com", "forbes.com", "bloomberg.com",
                "economist.com", "indiatoday.in", "ndtv.com", "timesofindia.indiatimes.com",
                "thehindu.com", "hindustantimes.com", "livemint.com", "business-standard.com",
                "moneycontrol.com", "financialexpress.com", "scroll.in", "thewire.in",
                "opindia.com", "news18.com", "deccanherald.com", "newindianexpress.com",
                "tribuneindia.com", "firstpost.com"
            ],
            "porn": [
                "pornhub.com", "xvideos.com", "xhamster.com", "xnxx.com", "redtube.com",
                "youporn.com", "tube8.com", "porn.com", "xvideos2.com", "spankbang.com",
                "sex.com", "beeg.com", "youporn.xxx", "xtube.com", "youjizz.com",
                "pornhd.com", "zoosexmovies.com", "tnaflix.com", "keezmovies.com",
                "hclips.com", "hentaihaven.com", "porndig.com", "4tube.com", "fapdu.com",
                "empflix.com", "hentaicafe.com", "hentaibooks.com", "hentaiperks.com",
                "porn05.com", "tushy.com", "bangbros.com", "lewdplace.com", "nuvid.com",
                "redporn.me", "xxx.com", "hdporn.com", "pornmd.com", "eporner.com",
                "xhamster2.com", "hentairules.com", "pornhd88.com", "pornrabbit.com",
                "porn4k.com", "youjizz.xxx", "sexvid.xxx", "hclips.xxx", "xtube.xxx"
            ],
            "entertainment": [
                "youtube.com", "netflix.com", "hulu.com", "disney.com", "hbo.com",
                "primevideo.com", "spotify.com", "soundcloud.com", "twitch.tv",
                "vimeo.com", "dailymotion.com", "crunchyroll.com", "funimation.com",
                "paramountplus.com", "peacock.com", "appletv.com", "max.com"
            ],
            "keywords": {
                "social": [
                    "facebook", "instagram", "twitter", "x.com", "snapchat", "tiktok",
                    "reddit", "pinterest", "linkedin", "tumblr", "discord", "twitch",
                    "telegram", "whatsapp", "wechat", "weibo", "vk", "ok.ru",
                    "clubhouse", "mastodon", "threads", "kooapp", "sharechat", "moj"
                ],
                "ecommerce": [
                    "amazon", "flipkart", "ebay", "walmart", "aliexpress", "ajio",
                    "myntra", "nykaa", "snapdeal", "paytmmall", "bigbasket", "grofers",
                    "meesho", "tatacliq", "pepperfry", "firstcry", "shopclues",
                    "zomato", "swiggy", "olx", "bookmyshow", "bewakoof", "shop",
                    "buy", "cart", "sale", "deal", "discount", "offer", "checkout"
                ],
                "news": [
                    "news", "cnn", "bbc", "nytimes", "guardian", "reuters", "aljazeera",
                    "foxnews", "nbcnews", "cbsnews", "abcnews", "huffpost", "forbes",
                    "bloomberg", "economist", "indiatoday", "ndtv", "timesofindia",
                    "thehindu", "hindustantimes", "livemint", "business-standard",
                    "moneycontrol", "financialexpress", "scroll", "thewire", "opindia",
                    "news18", "deccanherald", "newindianexpress", "tribuneindia",
                    "firstpost", "press", "journal", "times", "daily"
                ],
                "porn": [
                    "porn", "xxx", "sex", "adult", "hentai", "cam", "escort", "fuck",
                    "nude", "erotic", "fetish", "onlyfans", "bdsm", "anal", "orgy",
                    "milf", "teen", "hardcore", "xhamster", "xnxx", "spank", "redtube",
                    "youporn", "xvideos", "tnaflix", "fap", "amateur"
                ],
                "entertainment": [
                    "youtube", "netflix", "hulu", "disney", "hbo", "primevideo",
                    "spotify", "soundcloud", "twitch", "vimeo", "dailymotion",
                    "crunchyroll", "funimation", "paramountplus", "peacock", "appletv", "max"
                ]
            }
        };
    }

    convertAchievedMilestonesToSet(sessionData) {
        if (sessionData && sessionData.achievedMilestones) {
            if (Array.isArray(sessionData.achievedMilestones)) {
                sessionData.achievedMilestones = new Set(sessionData.achievedMilestones);
            } else if (!(sessionData.achievedMilestones instanceof Set)) {
                sessionData.achievedMilestones = new Set();
            }
        }
        return sessionData;
    }

    getBaseDomain(hostname) {
        // Extract base domain from hostname
        // e.g., www.linkedin.com -> linkedin.com, subdomain.example.com -> example.com
        const parts = hostname.split('.');
        if (parts.length >= 2) {
            return parts.slice(-2).join('.');
        }
        return hostname;
    }

    checkTemporaryAccess(url, hostname, fullUrl, accessData) {
        console.log('Checking temporary access for:', url, 'with access data:', accessData);
        
        // Check exact URL match
        if (accessData.url === url) {
            console.log('✅ Exact URL match');
            return true;
        }

        // Check domain matches
        const accessUrlObj = new URL(accessData.url);
        const accessHostname = accessUrlObj.hostname.toLowerCase();
        const baseDomain = this.getBaseDomain(hostname);
        const accessBaseDomain = accessData.baseDomain || this.getBaseDomain(accessData.domain);

        if (hostname === accessHostname || 
            hostname === accessData.domain ||
            baseDomain === accessBaseDomain ||
            hostname.endsWith('.' + accessData.domain) ||
            accessData.domain.endsWith('.' + hostname) ||
            hostname.endsWith('.' + accessBaseDomain) ||
            accessBaseDomain.endsWith('.' + hostname)) {
            console.log('✅ Domain match');
            return true;
        }

        // Check keyword match - if access was granted for a keyword, allow any URL containing that keyword
        if (accessData.keyword) {
            const keyword = accessData.keyword.toLowerCase();
            console.log('Checking keyword match for:', keyword, 'in URL:', fullUrl);
            
            if (fullUrl.includes(keyword) || hostname.includes(keyword)) {
                console.log('✅ Keyword match for:', keyword);
                return true;
            }
            
            // Also check if the keyword matches the domain (e.g., "facebook" matches "facebook.com")
            if (hostname.includes(keyword) || keyword.includes(hostname.split('.')[0])) {
                console.log('✅ Domain-keyword match for:', keyword);
                return true;
            }
        }

        console.log('❌ No temporary access match found');
        return false;
    }

    storeBlockingReason(url, type, value, category) {
        // Store the reason why this URL was blocked for temporary access
        const blockingReason = {
            url: url,
            type: type, // 'domain' or 'keyword'
            value: value, // the domain or keyword that caused blocking
            category: category,
            timestamp: Date.now()
        };
        
        chrome.storage.local.set({ blockingReason: blockingReason });
        console.log('Stored blocking reason:', blockingReason);
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            // Handle async operations properly
            const handleAsync = async () => {
                switch (request.action) {
                    case 'startSession':
                        await this.startSession(this.convertAchievedMilestonesToSet(request.sessionData));
                        break;
                    case 'stopSession':
                        await this.stopSession();
                        break;
                    case 'updateSession':
                        await this.updateSession(this.convertAchievedMilestonesToSet(request.sessionData));
                        break;
                    case 'completeSession':
                        await this.completeSession(this.convertAchievedMilestonesToSet(request.sessionData));
                        break;
                    case 'checkBlockedSite':
                        // Handle async isSiteBlocked
                        const isBlocked = await this.isSiteBlocked(request.url);
                        const category = await this.getBlockedCategory(request.url);
                        sendResponse({ 
                            isBlocked, 
                            category: category 
                        });
                        return;
                    case 'getSessionData':
                        sendResponse({ currentSession: this.currentSession });
                        break;
                    case 'settingsUpdated':
                        this.userSettings = request.settings;
                        console.log('Settings updated in background:', this.userSettings);
                        console.log('Social media enabled:', this.userSettings?.siteCategories?.socialMedia);
                        // Reload settings to ensure they're properly applied
                        await this.loadUserSettings();
                        break;
                    case 'checkMilestone':
                        this.checkMilestone(this.convertAchievedMilestonesToSet(request.sessionData));
                        break;
                    case 'grantTemporaryAccess':
                        // Handle temporary access grant
                        console.log('Temporary access granted:', request.accessData);
                        break;
                    case 'trackGamificationEvent':
                        await this.trackGamificationEvent(request.eventType, request.data);
                        break;
                    case 'getPornBlocklistStats':
                        const stats = await this.getPornBlocklistStats();
                        sendResponse(stats);
                        return;
                }
            };

            // Execute async handler
            handleAsync().catch(error => {
                console.error('Error handling message:', error);
            });

            // Return true for async operations that need sendResponse
            return request.action === 'checkBlockedSite';
        });
    }

    setupNavigationListener() {
        chrome.webNavigation.onBeforeNavigate.addListener((details) => {
            if (details.frameId === 0 && this.currentSession && this.currentSession.isActive) {
                this.handleNavigation(details);
            }
        });
    }

    async loadSessionData() {
        try {
            const result = await chrome.storage.local.get(['currentSession']);
            this.currentSession = result.currentSession;
            
            // Convert achievedMilestones from array to Set if it exists
            if (this.currentSession && this.currentSession.achievedMilestones) {
                if (Array.isArray(this.currentSession.achievedMilestones)) {
                    this.currentSession.achievedMilestones = new Set(this.currentSession.achievedMilestones);
                } else if (!(this.currentSession.achievedMilestones instanceof Set)) {
                    this.currentSession.achievedMilestones = new Set();
                }
            }
            
            if (this.currentSession && this.currentSession.isActive) {
                this.achievedMilestones.clear();
            }
        } catch (error) {
            console.error('Error loading session data:', error);
        }
    }

    async loadUserSettings() {
        try {
            const result = await chrome.storage.local.get(['userSettings']);
            this.userSettings = result.userSettings;
            console.log('User settings loaded on startup:', this.userSettings);
            
            // If no settings exist, create default settings
            if (!this.userSettings) {
                console.log('No user settings found, creating defaults');
                this.userSettings = {
                    customSites: [],
                    siteCategories: {
                        socialMedia: true,
                        news: true,
                        shopping: true,
                        entertainment: true,
                        adult: true
                    },
                    customKeywords: [],
                    frictionText: "I'm about to waste precious time on this site instead of working toward my goals. Every minute spent here is a minute I could've used to learn something new, finish a task, or make progress on what truly matters. I know I'm capable of better choices. Why am I letting distractions win?",
                    notifications: {
                        sessionStart: true,
                        sessionEnd: true,
                        sessionMilestone: true,
                        dailyGoal: true,
                        weeklyStreak: true,
                        focusTime: true
                    },
                    theme: 'auto',
                    timerStyle: 'circular',
                    sounds: {
                        session: true,
                        blocking: false,
                        milestone: true,
                        volume: 50
                    },
                    animations: {
                        speed: 1.0,
                        reduceMotion: false
                    }
                };
                await chrome.storage.local.set({ userSettings: this.userSettings });
            }
        } catch (error) {
            console.error('Error loading user settings:', error);
        }
    }

    async loadPornBlocklist() {
        try {
            // Check if we have a flag indicating the external list is available
            const cached = await chrome.storage.local.get(['pornBlocklistAvailable']);
            
            if (cached.pornBlocklistAvailable) {
                console.log('External porn blocklist is available, will load on-demand');
                this.pornBlocklist = null; // Will be loaded when needed
                return;
            }

            console.log('Loading porn blocklist from file...');
            const response = await fetch(chrome.runtime.getURL('porn_blocklist.json'));
            if (response.ok) {
                const data = await response.json();
                this.pornBlocklist = data.domains;
                console.log(`Porn blocklist loaded: ${this.pornBlocklist.length} domains`);
                
                // Only store a flag that the list is available, not the actual data
                await chrome.storage.local.set({ 
                    pornBlocklistAvailable: true,
                    pornBlocklistCount: this.pornBlocklist.length
                });
            } else {
                console.error('Failed to load porn blocklist:', response.status);
                // Fallback to basic list
                this.pornBlocklist = this.blockedSites.porn;
                console.log(`Using fallback porn blocklist: ${this.pornBlocklist.length} domains`);
            }
        } catch (error) {
            console.error('Error loading porn blocklist:', error);
            // Fallback to basic list
            this.pornBlocklist = this.blockedSites.porn;
            console.log(`Using fallback porn blocklist: ${this.pornBlocklist.length} domains`);
        }
    }

    async loadPornBlocklistOnDemand() {
        if (this.pornBlocklist) {
            return this.pornBlocklist; // Already loaded
        }

        try {
            console.log('Loading porn blocklist on-demand...');
            const response = await fetch(chrome.runtime.getURL('porn_blocklist.json'));
            if (response.ok) {
                const data = await response.json();
                this.pornBlocklist = data.domains;
                console.log(`Porn blocklist loaded on-demand: ${this.pornBlocklist.length} domains`);
                return this.pornBlocklist;
            } else {
                console.error('Failed to load porn blocklist on-demand:', response.status);
                return this.blockedSites.porn;
            }
        } catch (error) {
            console.error('Error loading porn blocklist on-demand:', error);
            return this.blockedSites.porn;
        }
    }

    // Method to check if porn blocklist is ready
    isPornBlocklistReady() {
        return this.pornBlocklist && this.pornBlocklist.length > 0;
    }

    // Method to get porn blocklist stats
    async getPornBlocklistStats() {
        try {
            const cached = await chrome.storage.local.get(['pornBlocklistAvailable', 'pornBlocklistCount']);
            
            if (cached.pornBlocklistAvailable) {
                return {
                    loaded: true,
                    count: cached.pornBlocklistCount || 'Unknown',
                    source: 'external',
                    status: 'Available for on-demand loading'
                };
            } else {
                return {
                    loaded: false,
                    count: this.blockedSites.porn.length,
                    source: 'fallback',
                    status: 'Using basic fallback list'
                };
            }
        } catch (error) {
            console.error('Error getting porn blocklist stats:', error);
            return {
                loaded: false,
                count: this.blockedSites.porn.length,
                source: 'fallback',
                status: 'Error loading stats'
            };
        }
    }

    async startSession(sessionData) {
        this.currentSession = sessionData;
        this.achievedMilestones.clear(); // Reset milestones for new session
        await chrome.storage.local.set({ currentSession: sessionData });
        
        // Clear any existing temporary access from previous sessions
        await chrome.storage.local.remove(['temporaryAccess', 'lastBlockedUrl', 'lastBlockedTabId']);
        console.log('Cleared temporary access for new session');
        
        // Set up blocking rules
        this.setupBlockingRules();
        
        console.log('Deep work session started:', sessionData);
    }

    async stopSession() {
        console.log('Deep work session stopped');

        this.currentSession = null;
        this.achievedMilestones.clear();
        await chrome.storage.local.set({ currentSession: null });
        
        // Clear any temporary access when session ends
        await chrome.storage.local.remove(['temporaryAccess', 'lastBlockedUrl', 'lastBlockedTabId']);
        
        // Clear blocking rules
        this.clearBlockingRules();
    }

    async updateSession(sessionData) {
        this.currentSession = sessionData;
        await chrome.storage.local.set({ currentSession: sessionData });
        
        // Check for milestones
        this.checkMilestone(sessionData);
    }

    async completeSession(sessionData) {
        // Track gamification event for session completion
        if (this.gamification) {
            const durationMinutes = Math.floor(sessionData.duration / 60000);
            const hadBlockedAttempts = (sessionData.blockedAttempts || 0) > 0;
            const hadOverrides = (sessionData.overrides || 0) > 0;
            const wasPaused = (sessionData.pausedTime || 0) > 0;
            
            await this.trackGamificationEvent('session_complete', {
                durationMinutes,
                hadBlockedAttempts,
                hadOverrides,
                wasPaused
            });
        }

        // Show completion notification if enabled
        if (this.userSettings?.notifications?.sessionEnd) {
            console.log('Showing completion notification...');
            this.showNotification(
                'Deep Work Session Completed! 🎉',
                `Congratulations! You completed your ${Math.floor(sessionData.duration / 60000)}-minute focus session. Great job!`,
                'session-complete'
            );
        }

        // Save completed session to history
        const result = await chrome.storage.local.get(['sessionHistory']);
        const sessionHistory = result.sessionHistory || [];
        sessionHistory.unshift(sessionData);
        
        // Keep only last 50 sessions
        if (sessionHistory.length > 50) {
            sessionHistory.splice(50);
        }
        
        await chrome.storage.local.set({ 
            currentSession: null,
            sessionHistory: sessionHistory
        });
        
        // Clear any temporary access when session completes
        await chrome.storage.local.remove(['temporaryAccess', 'lastBlockedUrl', 'lastBlockedTabId']);
        
        this.currentSession = null;
        this.achievedMilestones.clear();
        this.clearBlockingRules();
        
        console.log('Deep work session completed:', sessionData);
    }

    checkMilestone(sessionData) {
        if (!sessionData || !sessionData.isActive || !this.userSettings?.notifications?.sessionMilestone) {
            return;
        }

        const now = Date.now();
        const elapsed = now - sessionData.startTime - (sessionData.pausedTime || 0);
        const progress = elapsed / sessionData.duration;

        for (const threshold of this.milestoneThresholds) {
            const milestoneKey = `${Math.floor(threshold * 100)}%`;
            
            // Check both the session's achievedMilestones and the background's achievedMilestones
            const sessionHasMilestone = sessionData.achievedMilestones && sessionData.achievedMilestones.has(milestoneKey);
            const backgroundHasMilestone = this.achievedMilestones.has(milestoneKey);
            
            if (progress >= threshold && !sessionHasMilestone && !backgroundHasMilestone) {
                // Add to both sets
                if (sessionData.achievedMilestones) {
                    sessionData.achievedMilestones.add(milestoneKey);
                }
                this.achievedMilestones.add(milestoneKey);
                
                const milestoneMessages = {
                    '25%': {
                        title: '25% Complete! 🎯',
                        message: 'You\'re making great progress! Keep up the focus!'
                    },
                    '50%': {
                        title: 'Halfway There! 💪',
                        message: 'You\'re doing amazing! The hardest part is behind you!'
                    },
                    '75%': {
                        title: 'Almost Done! 🔥',
                        message: 'You\'re in the final stretch! Finish strong!'
                    }
                };

                const milestone = milestoneMessages[milestoneKey];
                if (milestone) {
                    console.log(`Showing milestone notification: ${milestoneKey}`);
                    this.showNotification(milestone.title, milestone.message, 'milestone');
                }
            }
        }
    }

    setupBlockingRules() {
        // This would set up declarative net request rules
        // For now, we'll handle blocking in the content script
        console.log('Blocking rules activated');
    }

    clearBlockingRules() {
        // Clear any blocking rules
        console.log('Blocking rules cleared');
    }

    async handleNavigation(details) {
        const url = details.url;
        const isBlocked = await this.isSiteBlocked(url);
        
        if (isBlocked) {
            // Increment blocked attempts
            if (this.currentSession) {
                this.currentSession.blockedAttempts = (this.currentSession.blockedAttempts || 0) + 1;
                this.updateSession(this.currentSession);
            }
            
            // Store the blocked URL for potential temporary access
            chrome.storage.local.set({ 
                lastBlockedUrl: url,
                lastBlockedTabId: details.tabId 
            });
            
            // Redirect to blocked page with the original URL as parameter
            const blockedPageUrl = chrome.runtime.getURL('blocked.html') + '?blocked=' + encodeURIComponent(url);
            chrome.tabs.update(details.tabId, {
                url: blockedPageUrl
            });
        }
    }

    async isSiteBlocked(url) {
        if (!this.currentSession || !this.currentSession.isActive) {
            return false;
        }

        console.log('=== BLOCKING CHECK ===');
        console.log('URL:', url);
        console.log('User settings:', this.userSettings);
        console.log('Current session:', this.currentSession);

        // Check if there's temporary access granted for this URL/domain/keyword
        try {
            const result = await chrome.storage.local.get(['temporaryAccess']);
            console.log('Checking temporary access for:', url, 'Result:', result);
            
            if (result.temporaryAccess && result.temporaryAccess.granted) {
                const accessData = result.temporaryAccess;
                const now = Date.now();
                
                console.log('Temporary access found:', {
                    url: accessData.url,
                    domain: accessData.domain,
                    keyword: accessData.keyword,
                    sessionId: accessData.sessionId,
                    currentSessionId: this.currentSession.id,
                    endTime: accessData.endTime,
                    now: now,
                    timeValid: now < accessData.endTime,
                    sessionValid: accessData.sessionId === this.currentSession.id
                });
                
                // Check if access is still valid and for the current session
                if (now < accessData.endTime && accessData.sessionId === this.currentSession.id) {
                    const urlObj = new URL(url);
                    const hostname = urlObj.hostname.toLowerCase();
                    const pathname = urlObj.pathname.toLowerCase();
                    const search = urlObj.search.toLowerCase();
                    const fullUrl = (hostname + pathname + search).toLowerCase();
                    
                    // Check if this URL has temporary access
                    const hasAccess = this.checkTemporaryAccess(url, hostname, fullUrl, accessData);
                    
                    if (hasAccess) {
                        console.log('✅ Allowing access due to temporary permission');
                        return false; // Allow access
                    } else {
                        console.log('❌ No temporary access match found for:', hostname);
                    }
                } else {
                    // Access expired or wrong session, remove it
                    console.log('Removing expired/invalid temporary access');
                    chrome.storage.local.remove(['temporaryAccess']);
                }
            } else {
                console.log('No temporary access found');
            }
        } catch (error) {
            console.error('Error checking temporary access:', error);
        }

        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            const pathname = urlObj.pathname.toLowerCase();
            const search = urlObj.search.toLowerCase();
            const fullUrl = (hostname + pathname + search).toLowerCase();
            
            // Check exact domain matches (respecting user settings)
            for (const category in this.blockedSites) {
                if (category === 'keywords') continue;
                
                // Check if this category is enabled in user settings
                if (this.userSettings && this.userSettings.siteCategories) {
                    const categoryKey = this.getCategoryKey(category);
                    const isEnabled = this.userSettings.siteCategories[categoryKey];
                    console.log(`Checking domain category ${category} -> ${categoryKey}, enabled:`, isEnabled);
                    if (categoryKey && !isEnabled) {
                        console.log(`Skipping domain category ${category} because it's disabled in settings`);
                        continue; // Skip this category if disabled
                    }
                } else {
                    console.log('No user settings or siteCategories found, using default blocking');
                }
                
                // Use external porn blocklist for porn category
                let domainsToCheck = this.blockedSites[category];
                if (category === 'porn') {
                    // Load porn blocklist on-demand to avoid storage quota issues
                    domainsToCheck = await this.loadPornBlocklistOnDemand();
                    console.log(`Using external porn blocklist with ${domainsToCheck.length} domains`);
                }
                
                for (const domain of domainsToCheck) {
                    if (hostname === domain || hostname.endsWith('.' + domain)) {
                        console.log(`Blocking ${url} - matched domain ${domain} in category ${category}`);
                        // Store blocking reason for temporary access
                        this.storeBlockingReason(url, 'domain', domain, category);
                        // Track gamification event
                        this.trackGamificationEvent('blocked_attempt', { url, category, domain });
                        return true;
                    }
                }
            }
            
            // Check custom sites from user settings
            if (this.userSettings && this.userSettings.customSites) {
                for (const customSite of this.userSettings.customSites) {
                    if (hostname === customSite || hostname.endsWith('.' + customSite)) {
                        console.log(`Blocking ${url} - matched custom site ${customSite}`);
                        // Store blocking reason for temporary access
                        this.storeBlockingReason(url, 'domain', customSite, 'custom');
                        // Track gamification event
                        this.trackGamificationEvent('blocked_attempt', { url, category: 'custom', domain: customSite });
                        return true;
                    }
                }
            }
            
            // Check keyword matches (respecting user settings)
            console.log('Checking keywords in URL:', fullUrl);
            
            for (const category in this.blockedSites.keywords) {
                // Check if this category is enabled in user settings
                if (this.userSettings && this.userSettings.siteCategories) {
                    const categoryKey = this.getCategoryKey(category);
                    const isEnabled = this.userSettings.siteCategories[categoryKey];
                    console.log(`Checking keyword category ${category} -> ${categoryKey}, enabled:`, isEnabled);
                    if (categoryKey && !isEnabled) {
                        console.log(`Skipping keyword category ${category} because it's disabled in settings`);
                        continue; // Skip this category if disabled
                    }
                } else {
                    console.log('No user settings found for keyword checking, using default blocking');
                }
                
                for (const keyword of this.blockedSites.keywords[category]) {
                    if (fullUrl.includes(keyword.toLowerCase())) {
                        console.log(`Blocking ${url} - matched keyword "${keyword}" in category ${category}`);
                        // Store blocking reason for temporary access
                        this.storeBlockingReason(url, 'keyword', keyword, category);
                        // Track gamification event
                        this.trackGamificationEvent('blocked_attempt', { url, category, keyword });
                        return true;
                    }
                }
            }
            
            // Check custom keywords from user settings
            if (this.userSettings && this.userSettings.customKeywords) {
                for (const keyword of this.userSettings.customKeywords) {
                    if (fullUrl.includes(keyword.toLowerCase())) {
                        console.log(`Blocking ${url} - matched custom keyword "${keyword}"`);
                        // Store blocking reason for temporary access
                        this.storeBlockingReason(url, 'keyword', keyword, 'custom');
                        // Track gamification event
                        this.trackGamificationEvent('blocked_attempt', { url, category: 'custom', keyword });
                        return true;
                    }
                }
            }
            
            console.log(`Allowing ${url} - no blocking rules matched`);
            return false;
        } catch (error) {
            console.error('Error checking if site is blocked:', error);
            return false;
        }
    }

    getCategoryKey(category) {
        // Map internal category names to settings keys
        const categoryMap = {
            'social': 'socialMedia',
            'ecommerce': 'shopping',
            'news': 'news',
            'porn': 'adult',
            'entertainment': 'entertainment'
        };
        return categoryMap[category] || category;
    }

    async getBlockedCategory(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            const pathname = urlObj.pathname.toLowerCase();
            const search = urlObj.search.toLowerCase();
            const fullUrl = (hostname + pathname + search).toLowerCase();
            
            // Check exact domain matches first
            for (const category in this.blockedSites) {
                if (category === 'keywords') continue;
                
                // Use external porn blocklist for porn category
                let domainsToCheck = this.blockedSites[category];
                if (category === 'porn') {
                    // Load porn blocklist on-demand to avoid storage quota issues
                    domainsToCheck = await this.loadPornBlocklistOnDemand();
                }
                
                for (const domain of domainsToCheck) {
                    if (hostname === domain || hostname.endsWith('.' + domain)) {
                        return category;
                    }
                }
            }
            
            // Check keyword matches
            for (const category in this.blockedSites.keywords) {
                for (const keyword of this.blockedSites.keywords[category]) {
                    if (fullUrl.includes(keyword.toLowerCase())) {
                        return category;
                    }
                }
            }
            
            return 'unknown';
        } catch (error) {
            console.error('Error getting blocked category:', error);
            return 'unknown';
        }
    }

    async showNotification(title, message, type = 'info') {
        try {
            // Check if notifications are enabled
            if (!this.userSettings?.notifications) {
                console.log('Notifications disabled in settings');
                return;
            }

            // Create notification options
            const notificationOptions = {
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: title,
                message: message,
                priority: 2,
                requireInteraction: type === 'session-complete' || type === 'milestone'
            };

            // Show the notification
            const notificationId = `distraction-killer-${type}-${Date.now()}`;
            await chrome.notifications.create(notificationId, notificationOptions);
            
            console.log(`System notification shown: ${title} - ${message}`);
            
            // Auto-dismiss after 5 seconds for non-critical notifications
            if (type !== 'session-complete') {
                setTimeout(() => {
                    chrome.notifications.clear(notificationId);
                }, 5000);
            }
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }
}

// Initialize background script
new DistractionKillerBackground();