// DistractionKiller Content Script
class DistractionKillerContent {
    constructor() {
        this.currentSession = null;
        this.isBlockedPage = false;
        this.initialize();
    }

    async initialize() {
        // Check if this is already a blocked page
        if (window.location.href.includes('blocked.html')) {
            this.isBlockedPage = true;
            return;
        }

        // Load session data
        await this.loadSessionData();
        
        // Check if current site should be blocked
        if (this.currentSession && this.currentSession.isActive) {
            await this.checkAndBlockSite();
        }
    }

    async loadSessionData() {
        try {
            const response = await chrome.runtime.sendMessage({ action: 'getSessionData' });
            this.currentSession = response.currentSession;
        } catch (error) {
            console.error('Error loading session data:', error);
        }
    }

    async checkAndBlockSite() {
        try {
            const response = await chrome.runtime.sendMessage({ 
                action: 'checkBlockedSite', 
                url: window.location.href 
            });
            
            if (response.isBlocked) {
                this.blockSite(response.category);
            }
        } catch (error) {
            console.error('Error checking blocked site:', error);
        }
    }

    blockSite(category) {
        // Prevent the page from loading
        document.documentElement.innerHTML = '';
        
        // Redirect to blocked page
        window.location.href = chrome.runtime.getURL('blocked.html');
    }

    // Listen for session updates
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'sessionUpdated') {
            this.currentSession = request.sessionData;
            
            // If session is no longer active, allow normal browsing
            if (!this.currentSession || !this.currentSession.isActive) {
                // Remove any blocking overlays
                this.removeBlockingOverlay();
            }
        }
    });

    removeBlockingOverlay() {
        // Remove any blocking overlays if they exist
        const overlays = document.querySelectorAll('.distraction-killer-overlay');
        overlays.forEach(overlay => overlay.remove());
    }
}

// Initialize content script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new DistractionKillerContent();
    });
} else {
    new DistractionKillerContent();
}
