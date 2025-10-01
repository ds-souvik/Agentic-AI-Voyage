/**
 * Notification Service for DistractionKiller
 * Handles session completion notifications with action buttons
 */
class NotificationService {
    constructor() {
        this.notificationId = 'distraction-killer-session-complete';
    }

    /**
     * Show session completion notification
     * @param {Object} sessionData - Completed session data
     */
    async showSessionCompleteNotification(sessionData) {
        try {
            // Clear any existing notification
            await chrome.notifications.clear(this.notificationId);

            // Create notification
            const notificationOptions = {
                type: 'basic',
                iconUrl: chrome.runtime.getURL('assets/icons/icon48.png'),
                title: '🎉 Deep Work Session Completed!',
                message: `Great job! You completed a ${Math.floor(sessionData.durationMinutes || 0)}-minute session.`,
                buttons: [
                    { title: 'Start Another Session' },
                    { title: 'Schedule Later' }
                ],
                priority: 2
            };

            // Show notification
            await chrome.notifications.create(this.notificationId, notificationOptions);
            
            console.log('✅ Session completion notification shown');
        } catch (error) {
            console.error('❌ Error showing notification:', error);
            // Fail silently - don't break the app
        }
    }

    /**
     * Handle notification button clicks
     * @param {string} notificationId - ID of the notification
     * @param {number} buttonIndex - Index of clicked button
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

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationService;
} else {
    window.NotificationService = NotificationService;
}
