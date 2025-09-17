/**
 * Session Notification Manager - Standalone Module
 * Handles session completion notifications without impacting existing functionality
 */
class SessionNotificationManager {
    constructor() {
        this.notificationId = 'distraction-killer-session-complete';
        this.isInitialized = false;
        this.initialize();
    }

    /**
     * Initialize the notification manager
     */
    async initialize() {
        try {
            if (this.isInitialized) return;
            
            // Set up event listeners for session completion
            this.setupEventListeners();
            this.isInitialized = true;
            
            console.log('🔔 Session Notification Manager initialized');
        } catch (error) {
            console.error('❌ Error initializing notification manager:', error);
            // Fail silently - don't break the app
        }
    }

    /**
     * Set up event listeners for session completion
     */
    setupEventListeners() {
        try {
            // Listen for storage changes to detect session completion
            chrome.storage.onChanged.addListener((changes, namespace) => {
                if (namespace === 'local' && changes.gamificationData) {
                    this.handleGamificationDataChange(changes.gamificationData);
                }
            });

            // Listen for notification button clicks
            chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
                this.handleNotificationClick(notificationId, buttonIndex);
            });

            // Listen for notification clicks
            chrome.notifications.onClicked.addListener((notificationId) => {
                this.handleNotificationClick(notificationId, 0);
            });

        } catch (error) {
            console.error('❌ Error setting up event listeners:', error);
        }
    }

    /**
     * Handle gamification data changes to detect session completion
     */
    async handleGamificationDataChange(change) {
        try {
            const newData = change.newValue;
            const oldData = change.oldValue;

            // Check if a new session was completed
            if (newData && newData.sessionHistory && oldData && oldData.sessionHistory) {
                const newSessions = newData.sessionHistory;
                const oldSessions = oldData.sessionHistory;

                // Find newly completed sessions
                if (newSessions.length > oldSessions.length) {
                    const newSession = newSessions[0]; // Most recent session
                    if (newSession && newSession.completed) {
                        await this.showSessionCompleteNotification(newSession);
                    }
                }
            }
        } catch (error) {
            console.error('❌ Error handling gamification data change:', error);
        }
    }

    /**
     * Show session completion notification
     */
    async showSessionCompleteNotification(sessionData) {
        try {
            // Clear any existing notification
            await chrome.notifications.clear(this.notificationId);

            // Calculate session duration
            const durationMinutes = sessionData.durationMinutes || 
                Math.floor((sessionData.duration || 0) / 60000);

            // Create notification
            const notificationOptions = {
                type: 'basic',
                iconUrl: chrome.runtime.getURL('assets/icons/icon48.png'),
                title: '🎉 Deep Work Session Completed!',
                message: `Great job! You completed a ${durationMinutes}-minute session.`,
                buttons: [
                    { title: 'Start Another Session' },
                    { title: 'Schedule Later' }
                ],
                priority: 2
            };

            // Show notification
            await chrome.notifications.create(this.notificationId, notificationOptions);
            
            console.log('🔔 Session completion notification shown');
        } catch (error) {
            console.error('❌ Error showing notification:', error);
            // Fail silently - don't break the app
        }
    }

    /**
     * Handle notification button clicks
     */
    async handleNotificationClick(notificationId, buttonIndex) {
        try {
            if (notificationId !== this.notificationId) return;

            // Clear the notification
            await chrome.notifications.clear(notificationId);

            if (buttonIndex === 0) {
                // "Start Another Session" clicked
                await this.openSessionDialog();
            } else if (buttonIndex === 1) {
                // "Schedule Later" clicked
                console.log('📅 User chose to schedule later');
            }
        } catch (error) {
            console.error('❌ Error handling notification click:', error);
        }
    }

    /**
     * Open session dialog for starting another session
     */
    async openSessionDialog() {
        try {
            // Open popup to start new session
            await chrome.action.openPopup();
        } catch (error) {
            console.error('❌ Error opening session dialog:', error);
        }
    }

    /**
     * Clear all notifications
     */
    async clearAllNotifications() {
        try {
            await chrome.notifications.clear(this.notificationId);
        } catch (error) {
            console.error('❌ Error clearing notifications:', error);
        }
    }
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    window.sessionNotificationManager = new SessionNotificationManager();
} else {
    // In service worker context
    self.sessionNotificationManager = new SessionNotificationManager();
}
