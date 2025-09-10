/**
 * DistractionKiller Popup Interface
 * 
 * Manages the popup UI for the Distraction Killer extension:
 * - Session setup and controls
 * - Timer display and progress tracking
 * - Gamification progress display
 * - Navigation to reports and settings
 */
class DistractionKillerPopup {
    constructor() {
        this.currentSession = null;
        this.timerInterval = null;
        this.sessionHistory = [];
        this.gamificationService = new GamificationService();
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadData();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        // Session setup elements
        this.sessionSetup = document.getElementById('sessionSetup');
        this.sessionDuration = document.getElementById('sessionDuration');
        this.customDuration = document.getElementById('customDuration');
        this.customMinutes = document.getElementById('customMinutes');
        this.focusGoal = document.getElementById('focusGoal');
        this.startSession = document.getElementById('startSession');

        // Active session elements
        this.activeSession = document.getElementById('activeSession');
        this.goalDisplay = document.getElementById('goalDisplay');
        this.timerProgress = document.getElementById('timerProgress');
        this.timeRemaining = document.getElementById('timeRemaining');
        this.blockedAttempts = document.getElementById('blockedAttempts');
        this.focusScore = document.getElementById('focusScore');
        this.pauseSession = document.getElementById('pauseSession');
        this.stopSession = document.getElementById('stopSession');

        // Session complete elements
        this.sessionComplete = document.getElementById('sessionComplete');
        this.totalTime = document.getElementById('totalTime');
        this.blockedTotal = document.getElementById('blockedTotal');
        this.startNewSession = document.getElementById('startNewSession');
        this.viewReport = document.getElementById('viewReport');

        // Status indicator
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusDot = this.statusIndicator?.querySelector('.status-dot');
        this.statusText = this.statusIndicator?.querySelector('.status-text');

        // Gamification elements
        this.totalPoints = document.getElementById('totalPoints');
        this.pointsToday = document.getElementById('pointsToday');
        this.currentLevel = document.getElementById('currentLevel');
        this.progressToNext = document.getElementById('progressToNext');
        this.dailyStreak = document.getElementById('dailyStreak');

        // Footer buttons
        this.viewReports = document.getElementById('viewReports');
        this.settings = document.getElementById('settings');
        this.help = document.getElementById('help');
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Session duration change
        this.sessionDuration?.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                this.customDuration.style.display = 'block';
            } else {
                this.customDuration.style.display = 'none';
            }
        });

        // Start session
        this.startSession?.addEventListener('click', () => this.startDeepWorkSession());

        // Session controls
        this.pauseSession?.addEventListener('click', () => this.togglePauseSession());
        this.stopSession?.addEventListener('click', () => this.stopDeepWorkSession());

        // Session complete actions
        this.startNewSession?.addEventListener('click', () => this.resetToSetup());
        this.viewReport?.addEventListener('click', () => this.showReports());

        // Footer navigation
        this.viewReports?.addEventListener('click', () => this.showReports());
        this.settings?.addEventListener('click', () => this.showSettings());
        this.help?.addEventListener('click', () => this.showHelp());
    }

    /**
     * Load session data and initialize UI
     */
    async loadData() {
        try {
            await this.loadSessionData();
            await this.updateGamificationDisplay();
            this.updateDisplay();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showSessionSetup();
        }
    }

    /**
     * Load session data from background
     */
    async loadSessionData() {
        try {
            const response = await chrome.runtime.sendMessage({ action: 'getSessionData' });
            this.currentSession = response.currentSession;
            
            // Load session history
            const result = await chrome.storage.local.get(['sessionHistory']);
            this.sessionHistory = result.sessionHistory || [];

            // Convert achievedMilestones to Set if needed
            if (this.currentSession?.achievedMilestones && Array.isArray(this.currentSession.achievedMilestones)) {
                    this.currentSession.achievedMilestones = new Set(this.currentSession.achievedMilestones);
            }
        } catch (error) {
            console.error('Error loading session data:', error);
        }
    }

    /**
     * Update the display based on current session state
     */
    updateDisplay() {
        if (this.currentSession?.isActive) {
            this.showActiveSession();
            this.startTimer();
        } else if (this.currentSession?.completed) {
            this.showSessionComplete();
        } else {
            this.showSessionSetup();
        }
    }

    /**
     * Show session setup screen
     */
    showSessionSetup() {
        this.sessionSetup.style.display = 'block';
        this.activeSession.style.display = 'none';
        this.sessionComplete.style.display = 'none';
        this.updateStatus('inactive');
    }

    /**
     * Show active session screen
     */
    showActiveSession() {
        this.sessionSetup.style.display = 'none';
        this.sessionComplete.style.display = 'none';
        this.activeSession.style.display = 'block';
        this.activeSession.classList.add('fade-in');

        if (this.currentSession) {
            this.goalDisplay.textContent = this.currentSession.goal || 'Deep Work Session';
            this.updateTimerDisplay();
            this.updateStats();
        }
        
        this.updateStatus('active');
    }

    /**
     * Show session complete screen
     */
    showSessionComplete() {
        this.sessionSetup.style.display = 'none';
        this.activeSession.style.display = 'none';
        this.sessionComplete.style.display = 'block';
        this.sessionComplete.classList.add('fade-in');

        if (this.currentSession) {
            const duration = this.currentSession.endTime - this.currentSession.startTime;
            const minutes = Math.floor(duration / 60000);
            const seconds = Math.floor((duration % 60000) / 1000);
            
            this.totalTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            this.blockedTotal.textContent = this.currentSession.blockedAttempts || 0;
        }
        
        this.updateStatus('completed');
    }

    /**
     * Start a new deep work session
     */
    async startDeepWorkSession() {
        try {
        const duration = this.getSessionDuration();
        const goal = this.focusGoal.value.trim();

        if (!duration || duration < 5) {
            this.showNotification('Please enter a valid duration (minimum 5 minutes)', 'error');
            return;
        }

        const sessionData = {
            id: Date.now().toString(),
            startTime: Date.now(),
                duration: duration * 60 * 1000,
            endTime: Date.now() + (duration * 60 * 1000),
                goal: goal || 'Deep Work Session',
            isActive: true,
            isPaused: false,
            pausedTime: 0,
            blockedAttempts: 0,
                hadBlockedAttempts: false,
                hadOverrides: false,
            completed: false,
                achievedMilestones: new Set()
            };

            // Start session via background script
            await chrome.runtime.sendMessage({
                action: 'startSession',
                sessionData: sessionData
            });

            this.currentSession = sessionData;
            this.showActiveSession();
            this.startTimer();
            
        } catch (error) {
            console.error('Error starting session:', error);
            this.showNotification('Failed to start session. Please try again.', 'error');
        }
    }

    /**
     * Stop the current session early
     */
    async stopDeepWorkSession() {
        if (!this.currentSession) return;

        try {
            // Get latest session data from background
            const response = await chrome.runtime.sendMessage({ action: 'getSessionData' });
            const latestSessionData = response.currentSession || this.currentSession;
            
            // Show stop confirmation (simplified for now)
            const confirmed = confirm('Are you sure you want to stop your deep work session early?');
            if (!confirmed) return;

            // Update session with latest data
            this.currentSession = {
                ...this.currentSession,
                ...latestSessionData,
                isActive: false,
                completed: false,
                endTime: Date.now(),
                stoppedEarly: true
            };

            // Stop session via background script
            await chrome.runtime.sendMessage({ action: 'stopSession' });

            this.clearTimer();
            this.showSessionComplete();
            await this.updateGamificationDisplay();

        } catch (error) {
            console.error('Error stopping session:', error);
        }
    }

    /**
     * Complete the current session
     */
    async completeSession() {
        if (!this.currentSession) return;

        try {
            // Get latest session data from background
            const response = await chrome.runtime.sendMessage({ action: 'getSessionData' });
            const latestSessionData = response.currentSession || this.currentSession;
            
            // Update session with completion data
            this.currentSession = {
                ...this.currentSession,
                ...latestSessionData,
                isActive: false,
                completed: true,
                endTime: Date.now()
            };

            // Complete session via background script
            await chrome.runtime.sendMessage({
                action: 'completeSession',
                sessionData: this.currentSession
            });

            this.clearTimer();
            this.showSessionComplete();
            await this.updateGamificationDisplay();

        } catch (error) {
            console.error('Error completing session:', error);
        }
    }

    /**
     * Toggle pause/resume session
     */
    async togglePauseSession() {
        if (!this.currentSession) return;

        try {
            if (this.currentSession.isPaused) {
                await chrome.runtime.sendMessage({ action: 'resumeSession' });
                this.pauseSession.textContent = '⏸️ Pause';
            } else {
                await chrome.runtime.sendMessage({ 
                    action: 'pauseSession',
                    pauseData: { minutes: 5 }
                });
                this.pauseSession.textContent = '▶️ Resume';
            }
            
            // Reload session data
            await this.loadSessionData();
        } catch (error) {
            console.error('Error toggling pause:', error);
        }
    }

    /**
     * Get selected session duration in minutes
     */
    getSessionDuration() {
        const selected = this.sessionDuration.value;
        if (selected === 'custom') {
            return parseInt(this.customMinutes.value) || 0;
        }
        return parseInt(selected) || 0;
    }

    /**
     * Start the timer for active session
     */
    startTimer() {
        this.clearTimer();
        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
        }, 1000);
    }

    /**
     * Clear the timer
     */
    clearTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Update timer display
     */
    updateTimerDisplay() {
        if (!this.currentSession) return;

        const now = Date.now();
        let remainingTime;

        if (this.currentSession.isPaused) {
            remainingTime = this.currentSession.endTime - this.currentSession.startTime - this.currentSession.pausedTime;
        } else {
            remainingTime = this.currentSession.endTime - now;
        }

        if (remainingTime <= 0) {
            this.completeSession();
            return;
        }

        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        this.timeRemaining.textContent = timeString;

        // Update progress circle
        const totalDuration = this.currentSession.duration;
        const elapsed = totalDuration - remainingTime;
        const progress = Math.max(0, Math.min(1, elapsed / totalDuration));
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (progress * circumference);
        
        this.timerProgress.style.strokeDashoffset = offset;
    }

    /**
     * Update session statistics
     */
    updateStats() {
        if (!this.currentSession) return;

        this.blockedAttempts.textContent = this.currentSession.blockedAttempts || 0;
        
        const blockedCount = this.currentSession.blockedAttempts || 0;
        const focusScore = Math.max(0, 100 - (blockedCount * 5));
        this.focusScore.textContent = `${focusScore}%`;
    }

    /**
     * Update gamification display
     */
    async updateGamificationDisplay() {
        try {
            const summary = await this.gamificationService.getGamificationSummary();
            
            this.totalPoints.textContent = summary.totalPoints.toLocaleString();
            this.pointsToday.textContent = summary.dailyPoints.toLocaleString();
            this.currentLevel.textContent = summary.currentLevel;
            this.progressToNext.textContent = summary.pointsToNextLevel > 0 
                ? `${summary.pointsToNextLevel} points to go` 
                : 'Max level reached!';
            this.dailyStreak.textContent = `${summary.dailyStreak} days`;
        } catch (error) {
            console.error('Error updating gamification display:', error);
        }
    }

    /**
     * Update status indicator
     */
    updateStatus(status) {
        if (!this.statusDot || !this.statusText) return;

        switch (status) {
            case 'active':
                this.statusDot.className = 'status-dot active';
                this.statusText.textContent = 'Active';
                break;
            case 'paused':
                this.statusDot.className = 'status-dot paused';
                this.statusText.textContent = 'Paused';
                break;
            case 'completed':
                this.statusDot.className = 'status-dot completed';
                this.statusText.textContent = 'Completed';
                break;
            default:
                this.statusDot.className = 'status-dot';
                this.statusText.textContent = 'Inactive';
        }
    }

    /**
     * Reset to setup screen
     */
    resetToSetup() {
        this.currentSession = null;
        this.clearTimer();
        this.showSessionSetup();
        
        // Reset form
        this.sessionDuration.value = '25';
        this.customDuration.style.display = 'none';
        this.focusGoal.value = '';
    }

    /**
     * Show reports page
     */
    showReports() {
        chrome.tabs.create({ url: chrome.runtime.getURL('src/ui/reports.html') });
    }

    /**
     * Show settings page
     */
    showSettings() {
        chrome.tabs.create({ url: chrome.runtime.getURL('src/ui/settings.html') });
    }

    /**
     * Show help
     */
    showHelp() {
        this.showNotification('Help: Start a deep work session to block distracting websites and stay focused!', 'info');
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Simple notification implementation
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#3182ce'};
                color: white;
            border-radius: 4px;
            z-index: 1000;
                font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DistractionKillerPopup();
});