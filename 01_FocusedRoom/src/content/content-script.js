/**
 * DistractionKiller Content Script
 * 
 * Runs on all web pages to:
 * - Check if the current page should be blocked during an active session
 * - Redirect to blocked page if necessary
 * - Handle session state changes
 */
class DistractionKillerContent {
    constructor() {
        this.currentSession = null;
        this.isBlockedPage = false;
        this.initialize();
    }

    /**
     * Initialize the content script
     */
    async initialize() {
        // Skip initialization on blocked pages
        if (window.location.href.includes('blocked.html')) {
            this.isBlockedPage = true;
            return;
        }

        try {
            // Set up message listener for session updates
            this.setupMessageListener();

            // Load current session data
            await this.loadSessionData();
            
            // Check if current site should be blocked during active session
            if (this.currentSession?.isActive) {
                await this.checkAndBlockSite();
            }
        } catch (error) {
            console.error('Error initializing DistractionKiller content script:', error);
        }
    }

    /**
     * Load session data from background script
     */
    async loadSessionData() {
        try {
            const response = await chrome.runtime.sendMessage({ action: 'getSessionData' });
            this.currentSession = response.currentSession;
        } catch (error) {
            console.error('Error loading session data:', error);
        }
    }

    /**
     * Check if current site should be blocked and handle accordingly
     */
    async checkAndBlockSite() {
        try {
            const response = await chrome.runtime.sendMessage({ 
                action: 'checkBlockedSite', 
                url: window.location.href 
            });
            
            if (response.isBlocked) {
                this.blockCurrentSite(response.category);
            }
        } catch (error) {
            console.error('Error checking blocked site:', error);
        }
    }

    /**
     * Block the current site by redirecting to blocked page
     */
    blockCurrentSite(category) {
        try {
            // Prevent the page from loading further
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    document.documentElement.innerHTML = '<div>Redirecting to Distraction Killer blocked page...</div>';
                });
            } else {
                document.documentElement.innerHTML = '<div>Redirecting to Distraction Killer blocked page...</div>';
            }
            
            // Redirect to blocked page
            const blockedPageUrl = chrome.runtime.getURL('src/ui/blocked.html') + 
                                  '?blocked=' + encodeURIComponent(window.location.href);
            window.location.href = blockedPageUrl;
        } catch (error) {
            console.error('Error blocking site:', error);
        }
    }

    /**
     * Set up message listener for session updates from background script
     */
    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'sessionUpdated') {
                this.handleSessionUpdate(request.sessionData);
            }
        });
    }

    /**
     * Handle session state updates
     */
    handleSessionUpdate(sessionData) {
        this.currentSession = sessionData;
        
        // If session is no longer active, remove any blocking overlays
        if (!this.currentSession?.isActive) {
            this.removeBlockingOverlay();
        }
    }

    /**
     * Remove any blocking overlays (for future use)
     */
    removeBlockingOverlay() {
        const overlays = document.querySelectorAll('.distraction-killer-overlay');
        overlays.forEach(overlay => overlay.remove());
    }
}

// Initialize content script when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new DistractionKillerContent();
    });
} else {
    new DistractionKillerContent();
}
