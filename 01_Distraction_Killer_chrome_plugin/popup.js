// DistractionKiller Popup Script
class DistractionKillerPopup {
    constructor() {
        this.currentSession = null;
        this.timerInterval = null;
        this.initializeElements();
        this.loadSessionData();
        this.setupEventListeners();
    }

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
        this.statusDot = this.statusIndicator.querySelector('.status-dot');
        this.statusText = this.statusIndicator.querySelector('.status-text');

        // Footer buttons
        this.viewReports = document.getElementById('viewReports');
        this.settings = document.getElementById('settings');
        this.help = document.getElementById('help');
    }

    setupEventListeners() {
        // Session duration change
        this.sessionDuration.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                this.customDuration.style.display = 'block';
                this.customMinutes.focus();
            } else {
                this.customDuration.style.display = 'none';
            }
        });

        // Start session
        this.startSession.addEventListener('click', () => this.startDeepWorkSession());

        // Pause/Resume session
        this.pauseSession.addEventListener('click', () => this.togglePauseSession());

        // Stop session
        this.stopSession.addEventListener('click', () => this.stopDeepWorkSession());

        // Start new session
        this.startNewSession.addEventListener('click', () => this.resetToSetup());

        // View report
        this.viewReport.addEventListener('click', () => this.showReport());

        // Footer buttons
        this.viewReports.addEventListener('click', () => this.showReports());
        this.settings.addEventListener('click', () => this.showSettings());
        this.help.addEventListener('click', () => this.showHelp());
    }

    async loadSessionData() {
        try {
            const result = await chrome.storage.local.get(['currentSession', 'sessionHistory']);
            this.currentSession = result.currentSession || null;
            this.sessionHistory = result.sessionHistory || [];

            if (this.currentSession && this.currentSession.isActive) {
                this.showActiveSession();
                this.startTimer();
            } else {
                this.showSessionSetup();
            }
        } catch (error) {
            console.error('Error loading session data:', error);
            this.showSessionSetup();
        }
    }

    async startDeepWorkSession() {
        const duration = this.getSessionDuration();
        const goal = this.focusGoal.value.trim();

        if (!duration || duration < 5) {
            this.showNotification('Please enter a valid duration (minimum 5 minutes)', 'error');
            return;
        }

        const sessionData = {
            id: Date.now().toString(),
            startTime: Date.now(),
            duration: duration * 60 * 1000, // Convert to milliseconds
            endTime: Date.now() + (duration * 60 * 1000),
            goal: goal || 'Deep focus session',
            isActive: true,
            isPaused: false,
            pausedTime: 0,
            blockedAttempts: 0,
            completed: false
        };

        try {
            await chrome.storage.local.set({ currentSession: sessionData });
            this.currentSession = sessionData;
            
            // Notify background script
            chrome.runtime.sendMessage({
                action: 'startSession',
                sessionData: sessionData
            });

            this.showActiveSession();
            this.startTimer();
            this.updateStatus('active');
            
            this.showNotification(`Deep work session started for ${duration} minutes!`, 'success');
        } catch (error) {
            console.error('Error starting session:', error);
            this.showNotification('Failed to start session. Please try again.', 'error');
        }
    }

    getSessionDuration() {
        const selectedDuration = this.sessionDuration.value;
        if (selectedDuration === 'custom') {
            return parseInt(this.customMinutes.value) || 0;
        }
        return parseInt(selectedDuration);
    }

    showActiveSession() {
        this.sessionSetup.style.display = 'none';
        this.sessionComplete.style.display = 'none';
        this.activeSession.style.display = 'block';
        this.activeSession.classList.add('fade-in');

        if (this.currentSession) {
            this.goalDisplay.textContent = this.currentSession.goal;
            this.updateTimerDisplay();
            this.updateStats();
        }
    }

    showSessionSetup() {
        this.activeSession.style.display = 'none';
        this.sessionComplete.style.display = 'none';
        this.sessionSetup.style.display = 'block';
        this.sessionSetup.classList.add('fade-in');
        this.updateStatus('inactive');
    }

    showSessionComplete() {
        this.activeSession.style.display = 'none';
        this.sessionSetup.style.display = 'none';
        this.sessionComplete.style.display = 'block';
        this.sessionComplete.classList.add('fade-in');

        if (this.currentSession) {
            const totalMinutes = Math.floor((this.currentSession.duration - this.currentSession.pausedTime) / 60000);
            this.totalTime.textContent = `${totalMinutes} min`;
            this.blockedTotal.textContent = this.currentSession.blockedAttempts;
        }
    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
        }, 1000);
    }

    updateTimerDisplay() {
        if (!this.currentSession) return;

        const now = Date.now();
        const remainingTime = this.currentSession.endTime - now - this.currentSession.pausedTime;

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
        const circumference = 2 * Math.PI * 45; // radius = 45
        const offset = circumference - (progress * circumference);
        
        this.timerProgress.style.strokeDashoffset = offset;
    }

    updateStats() {
        if (!this.currentSession) return;

        this.blockedAttempts.textContent = this.currentSession.blockedAttempts;
        
        // Calculate focus score (100% - blocked attempts * 5%)
        const focusScore = Math.max(0, 100 - (this.currentSession.blockedAttempts * 5));
        this.focusScore.textContent = `${focusScore}%`;
    }

    async togglePauseSession() {
        if (!this.currentSession) return;

        try {
            this.currentSession.isPaused = !this.currentSession.isPaused;
            
            if (this.currentSession.isPaused) {
                this.currentSession.pauseStartTime = Date.now();
                this.pauseSession.innerHTML = '<span class="btn-icon">▶️</span>Resume';
                clearInterval(this.timerInterval);
            } else {
                if (this.currentSession.pauseStartTime) {
                    this.currentSession.pausedTime += Date.now() - this.currentSession.pauseStartTime;
                    delete this.currentSession.pauseStartTime;
                }
                this.pauseSession.innerHTML = '<span class="btn-icon">⏸️</span>Pause';
                this.startTimer();
            }

            await chrome.storage.local.set({ currentSession: this.currentSession });
            chrome.runtime.sendMessage({
                action: 'updateSession',
                sessionData: this.currentSession
            });
        } catch (error) {
            console.error('Error toggling pause:', error);
        }
    }

    async stopDeepWorkSession() {
        if (!this.currentSession) return;

        // Show confirmation with friction
        const confirmed = await this.showStopConfirmation();
        if (!confirmed) return;

        try {
            this.currentSession.isActive = false;
            this.currentSession.completed = false;
            this.currentSession.endTime = Date.now();

            // Save to history
            this.sessionHistory.unshift(this.currentSession);
            if (this.sessionHistory.length > 50) { // Keep only last 50 sessions
                this.sessionHistory = this.sessionHistory.slice(0, 50);
            }

            // Clear any temporary access immediately
            await chrome.storage.local.remove(['temporaryAccess', 'lastBlockedUrl', 'lastBlockedTabId']);
            console.log('Cleared temporary access from popup');

            await chrome.storage.local.set({ 
                currentSession: null,
                sessionHistory: this.sessionHistory
            });

            chrome.runtime.sendMessage({
                action: 'stopSession'
            });

            clearInterval(this.timerInterval);
            this.showSessionComplete();
            this.updateStatus('inactive');
        } catch (error) {
            console.error('Error stopping session:', error);
        }
    }

    async completeSession() {
        if (!this.currentSession) return;

        try {
            this.currentSession.isActive = false;
            this.currentSession.completed = true;
            this.currentSession.endTime = Date.now();

            // Save to history
            this.sessionHistory.unshift(this.currentSession);
            if (this.sessionHistory.length > 50) {
                this.sessionHistory = this.sessionHistory.slice(0, 50);
            }

            await chrome.storage.local.set({ 
                currentSession: null,
                sessionHistory: this.sessionHistory
            });

            chrome.runtime.sendMessage({
                action: 'completeSession',
                sessionData: this.currentSession
            });

            clearInterval(this.timerInterval);
            this.showSessionComplete();
            this.updateStatus('inactive');
            
            this.showNotification('🎉 Deep work session completed! Great job!', 'success');
        } catch (error) {
            console.error('Error completing session:', error);
        }
    }

    async showStopConfirmation() {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'confirmation-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Stop Deep Work Session?</h3>
                    <p>You still have time remaining. Are you sure you want to stop?</p>
                    <div class="modal-actions">
                        <button class="btn-cancel">Continue Working</button>
                        <button class="btn-confirm">Stop Session</button>
                    </div>
                </div>
            `;

            // Add modal styles
            const style = document.createElement('style');
            style.textContent = `
                .confirmation-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    padding: 24px;
                    border-radius: 12px;
                    text-align: center;
                    max-width: 300px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                }
                .modal-content h3 {
                    margin-bottom: 12px;
                    color: #2d3748;
                }
                .modal-content p {
                    margin-bottom: 20px;
                    color: #718096;
                }
                .modal-actions {
                    display: flex;
                    gap: 12px;
                }
                .btn-cancel, .btn-confirm {
                    flex: 1;
                    padding: 12px 16px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                }
                .btn-cancel {
                    background: #e2e8f0;
                    color: #4a5568;
                }
                .btn-confirm {
                    background: #fed7d7;
                    color: #c53030;
                }
            `;

            document.head.appendChild(style);
            document.body.appendChild(modal);

            modal.querySelector('.btn-cancel').addEventListener('click', () => {
                document.body.removeChild(modal);
                document.head.removeChild(style);
                resolve(false);
            });

            modal.querySelector('.btn-confirm').addEventListener('click', () => {
                document.body.removeChild(modal);
                document.head.removeChild(style);
                resolve(true);
            });
        });
    }

    resetToSetup() {
        this.showSessionSetup();
        this.focusGoal.value = '';
        this.sessionDuration.value = '25';
        this.customDuration.style.display = 'none';
    }

    updateStatus(status) {
        if (status === 'active') {
            this.statusDot.classList.add('active');
            this.statusText.textContent = 'Active';
        } else {
            this.statusDot.classList.remove('active');
            this.statusText.textContent = 'Inactive';
        }
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 16px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            }
            .notification-success { background: #48bb78; }
            .notification-error { background: #f56565; }
            .notification-info { background: #4299e1; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 3000);
    }

    showReport() {
        // Open reports page in a new tab
        chrome.tabs.create({ url: chrome.runtime.getURL('reports.html') });
    }

    showReports() {
        // Open reports page in a new tab
        chrome.tabs.create({ url: chrome.runtime.getURL('reports.html') });
    }

    showSettings() {
        chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
    }

    showHelp() {
        // TODO: Implement help view
        this.showNotification('Help feature coming soon!', 'info');
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DistractionKillerPopup();
});
