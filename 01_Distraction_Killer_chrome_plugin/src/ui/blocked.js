// DistractionKiller Blocked Page Script
class DistractionKillerBlocked {
    constructor() {
        this.currentSession = null;
        this.timerInterval = null;
        this.originalBlockedUrl = null;
        this.challengeParagraph = "I'm about to waste precious time on this site instead of working toward my goals. Every minute spent here is a minute I could've used to learn something new, finish a task, or make progress on what truly matters. I know I'm capable of better choices. Why am I letting distractions win?";
        
        this.getOriginalUrl();
        this.initializeElements();
        this.loadUserSettings();    // Load settings FIRST (may override challengeParagraph)
        this.loadSessionData();      // Then load session data and update display
        this.setupEventListeners();
        this.startTimer();
    }

    getOriginalUrl() {
        // Get the blocked URL from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        this.originalBlockedUrl = urlParams.get('blocked');
        
        if (!this.originalBlockedUrl) {
            // Fallback: try to get from storage
            chrome.storage.local.get(['lastBlockedUrl']).then(result => {
                this.originalBlockedUrl = result.lastBlockedUrl;
            });
        }
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

    initializeElements() {
        // Timer elements
        this.timerProgress = document.getElementById('timerProgress');
        this.timeRemaining = document.getElementById('timeRemaining');
        this.sessionStatus = document.getElementById('sessionStatus');

        // Friction elements
        this.frictionSection = document.getElementById('frictionSection');
        this.accessDuration = document.getElementById('accessDuration');
        this.challengeParagraphEl = document.getElementById('challengeParagraph');
        this.userInput = document.getElementById('userInput');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.grantAccess = document.getElementById('grantAccess');
        this.cancelAccess = document.getElementById('cancelAccess');

        // Alternative action elements
        this.goBack = document.getElementById('goBack');
        this.newTab = document.getElementById('newTab');
        this.stopSession = document.getElementById('stopSession');

        // Stats elements
        this.blockedAttempts = document.getElementById('blockedAttempts');
        this.focusScore = document.getElementById('focusScore');
        this.sessionGoal = document.getElementById('sessionGoal');
    }

    setupEventListeners() {
        // Friction mechanism
        this.userInput.addEventListener('input', () => this.checkTypingProgress());
        this.grantAccess.addEventListener('click', () => this.grantTemporaryAccess());
        this.cancelAccess.addEventListener('click', () => this.cancelAccessRequest());

        // Prevent copy/paste/cut/drop in typing area (programmatic event listeners)
        this.preventCopyPasteEvents();

        // Alternative actions
        this.goBack.addEventListener('click', () => this.goBackToPreviousPage());
        this.newTab.addEventListener('click', () => this.openNewTab());
        this.stopSession.addEventListener('click', () => this.stopDeepWorkSession());

        // Listen for session updates
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'sessionUpdated') {
                this.currentSession = request.sessionData;
                this.updateDisplay();
            }
        });
    }

    async loadSessionData() {
        try {
            const response = await chrome.runtime.sendMessage({ action: 'getSessionData' });
            this.currentSession = response.currentSession;
            
            // Also load blocking reason
            const result = await chrome.storage.local.get(['blockingReason']);
            this.blockingReason = result.blockingReason;
            this.updateDisplay();
        } catch (error) {
            console.error('Error loading session data:', error);
        }
    }

    async loadUserSettings() {
        try {
            const result = await chrome.storage.local.get(['userSettings']);
            if (result.userSettings && result.userSettings.frictionText) {
                this.challengeParagraph = result.userSettings.frictionText;
                // Update display if already loaded
                if (this.challengeParagraphEl) {
                    this.challengeParagraphEl.textContent = this.challengeParagraph;
                }
            }
        } catch (error) {
            console.error('Error loading user settings:', error);
        }
    }

    updateDisplay() {
        if (!this.currentSession) {
            this.showSessionInactive();
            return;
        }

        // Update session status
        if (this.currentSession.isActive) {
            this.sessionStatus.textContent = 'Active';
            this.sessionStatus.style.background = 'rgba(81, 207, 102, 0.2)';
        } else {
            this.sessionStatus.textContent = 'Inactive';
            this.sessionStatus.style.background = 'rgba(255, 107, 107, 0.2)';
        }

        // Update stats
        this.blockedAttempts.textContent = this.currentSession.blockedAttempts || 0;
        this.sessionGoal.textContent = this.currentSession.goal || 'Deep Work';
        
        // Calculate focus score
        const focusScore = Math.max(0, 100 - ((this.currentSession.blockedAttempts || 0) * 5));
        this.focusScore.textContent = `${focusScore}%`;

        // Update challenge paragraph from JavaScript (single source of truth for comparison)
        this.challengeParagraphEl.textContent = this.challengeParagraph;
        
        // Show which site was blocked
        if (this.originalBlockedUrl) {
            const domain = new URL(this.originalBlockedUrl).hostname;
            const focusQuote = document.querySelector('.focus-quote p');
            if (focusQuote) {
                focusQuote.textContent = `You tried to access ${domain}. This website is blocked to help you maintain focus on what truly matters.`;
            }
        }
        
        // Enable the input field for typing
        this.userInput.disabled = false;
        this.userInput.focus(); // Automatically focus the input
    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    updateTimer() {
        if (!this.currentSession || !this.currentSession.isActive) {
            this.timeRemaining.textContent = '00:00';
            return;
        }

        const now = Date.now();
        const remainingTime = this.currentSession.endTime - now - (this.currentSession.pausedTime || 0);

        if (remainingTime <= 0) {
            this.showSessionComplete();
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

    checkTypingProgress() {
        const userText = this.userInput.value;
        const targetText = this.challengeParagraph;
        
        // Calculate similarity (character-by-character comparison)
        let correctChars = 0;
        const minLength = Math.min(userText.length, targetText.length);
        
        for (let i = 0; i < minLength; i++) {
            if (userText[i] === targetText[i]) {
                correctChars++;
            }
        }
        
        const progress = (correctChars / targetText.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.progressText.textContent = `${Math.round(progress)}% complete`;
        
        // Enable grant access button when 95% complete
        if (progress >= 95) {
            this.grantAccess.disabled = false;
            this.grantAccess.style.background = '#667eea';
        } else {
            this.grantAccess.disabled = true;
            this.grantAccess.style.background = '#cbd5e0';
        }
    }

    async grantTemporaryAccess() {
        const duration = parseInt(this.accessDuration.value);
        
        if (!this.currentSession) {
            this.showNotification('No active session found', 'error');
            return;
        }

        if (!this.originalBlockedUrl) {
            this.showNotification('Original blocked URL not found', 'error');
            return;
        }

        try {
            const urlObj = new URL(this.originalBlockedUrl);
            const domain = urlObj.hostname.toLowerCase();
            
            const accessData = {
                url: this.originalBlockedUrl,
                domain: domain,
                sessionId: this.currentSession.id,
                minutes: duration
            };
            
            console.log('🚀 Granting temporary access for:', this.originalBlockedUrl);
            
            // Send to background script and wait for confirmation
            const response = await chrome.runtime.sendMessage({
                action: 'grantTemporaryAccess',
                accessData: accessData
            });
            
            if (!response || !response.success) {
                throw new Error('Background script failed to grant access');
            }
            
            // Verify access was stored by checking storage directly
            const verification = await chrome.storage.local.get(['temporaryAccess']);
            if (!verification.temporaryAccess?.granted) {
                throw new Error('Temporary access verification failed');
            }
            
            console.log('✅ Temporary access verified and stored');
            this.showNotification(`Temporary access granted for ${duration} minutes`, 'success');
            
            // Redirect immediately after verification
            window.location.href = this.originalBlockedUrl;
            
        } catch (error) {
            console.error('❌ Error granting temporary access:', error);
            this.showNotification(`Failed to grant access: ${error.message}`, 'error');
        }
    }

    cancelAccessRequest() {
        this.userInput.value = '';
        this.progressFill.style.width = '0%';
        this.progressText.textContent = '0% complete';
        this.grantAccess.disabled = true;
        this.grantAccess.style.background = '#cbd5e0';
    }

    goBackToPreviousPage() {
        // Try to go back in history
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // If no history, open a new tab
            this.openNewTab();
        }
    }

    openNewTab() {
        chrome.tabs.create({ url: 'chrome://newtab/' });
    }

    async stopDeepWorkSession() {
        if (!this.currentSession) {
            this.showNotification('No active session found', 'error');
            return;
        }

        // Show confirmation with friction
        const confirmed = await this.showStopConfirmation();
        if (!confirmed) return;

        try {
            // Clear any temporary access immediately
            await chrome.storage.local.remove(['temporaryAccess', 'lastBlockedUrl', 'lastBlockedTabId']);
            console.log('Cleared temporary access from blocked page');
            
            // Notify background script to stop session
            chrome.runtime.sendMessage({ action: 'stopSession' });
            
            this.showNotification('Deep work session stopped', 'info');
            
            // Redirect to new tab after stopping
            setTimeout(() => {
                this.openNewTab();
            }, 2000);

        } catch (error) {
            console.error('Error stopping session:', error);
            this.showNotification('Failed to stop session. Please try again.', 'error');
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
                    padding: 32px;
                    border-radius: 16px;
                    text-align: center;
                    max-width: 400px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                }
                .modal-content h3 {
                    margin-bottom: 16px;
                    color: #2d3748;
                    font-size: 20px;
                }
                .modal-content p {
                    margin-bottom: 24px;
                    color: #718096;
                    font-size: 16px;
                }
                .modal-actions {
                    display: flex;
                    gap: 16px;
                }
                .btn-cancel, .btn-confirm {
                    flex: 1;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                    font-size: 14px;
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

    showSessionComplete() {
        this.timeRemaining.textContent = '00:00';
        this.sessionStatus.textContent = 'Complete';
        this.sessionStatus.style.background = 'rgba(81, 207, 102, 0.2)';
        
        // Show completion message
        this.showNotification('🎉 Deep work session completed! Great job!', 'success');
    }

    showSessionInactive() {
        this.timeRemaining.textContent = '00:00';
        this.sessionStatus.textContent = 'Inactive';
        this.sessionStatus.style.background = 'rgba(255, 107, 107, 0.2)';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                animation: slideIn 0.3s ease;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, 4000);
    }

    /**
     * Prevent copy, paste, cut, and drop operations in the typing challenge
     * Uses programmatic event listeners for reliable prevention on all platforms (Windows, macOS, Linux)
     */
    preventCopyPasteEvents() {
        if (!this.userInput) {
            console.error('userInput element not found');
            return;
        }

        // Prevent paste from keyboard (Ctrl+V, Cmd+V) and context menu
        this.userInput.addEventListener('paste', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showBriefWarning('❌ Pasting is not allowed. Please type the text manually.');
        }, true);

        // Prevent drag and drop
        this.userInput.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showBriefWarning('❌ Drag and drop is not allowed. Please type the text manually.');
        }, true);

        // Prevent dragging over (required to prevent drop)
        this.userInput.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, true);

        // Prevent drag enter
        this.userInput.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, true);

        // Prevent copy to clipboard
        this.userInput.addEventListener('copy', (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, true);

        // Prevent cut to clipboard
        this.userInput.addEventListener('cut', (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, true);

        // Prevent context menu (right-click) which provides copy/paste options
        this.userInput.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showBriefWarning('❌ Right-click menu is disabled. Please type manually.');
        }, true);

        console.log('✅ Copy/paste prevention enabled for typing challenge');
    }

    /**
     * Show a brief warning message to the user
     * Non-intrusive visual feedback for prevented actions
     */
    showBriefWarning(message) {
        // Check if warning already exists to prevent spam
        if (document.querySelector('.paste-warning')) {
            return;
        }

        const warning = document.createElement('div');
        warning.className = 'paste-warning';
        warning.textContent = message;
        
        const style = document.createElement('style');
        style.id = 'paste-warning-style';
        style.textContent = `
            .paste-warning {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 20px 30px;
                background: linear-gradient(135deg, rgba(245, 101, 101, 0.95), rgba(229, 62, 62, 0.95));
                color: white;
                border-radius: 12px;
                font-weight: 600;
                font-size: 15px;
                z-index: 10000;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                animation: warningPulse 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                max-width: 90%;
                text-align: center;
                pointer-events: none;
                user-select: none;
            }
            @keyframes warningPulse {
                0% { 
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.05);
                }
                100% { 
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
            }
        `;
        
        // Add style only if it doesn't exist
        if (!document.getElementById('paste-warning-style')) {
            document.head.appendChild(style);
        }
        document.body.appendChild(warning);
        
        // Remove warning after 2 seconds
        setTimeout(() => {
            if (document.body.contains(warning)) {
                warning.style.opacity = '0';
                warning.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    if (document.body.contains(warning)) {
                        document.body.removeChild(warning);
                    }
                }, 300);
            }
        }, 2000);
    }
}

// Initialize blocked page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DistractionKillerBlocked();
});
