// Shared Theme Manager for Distraction Killer
class ThemeManager {
    constructor() {
        this.currentTheme = 'default';
        this.currentAnimationSpeed = 1;
        this.reduceMotion = false;
        this.init();
    }

    async init() {
        await this.loadSettings();
        this.applyTheme();
        this.setupMessageListener();
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.local.get(['userSettings']);
            if (result.userSettings) {
                this.currentTheme = result.userSettings.theme || 'default';
                this.currentAnimationSpeed = result.userSettings.animations?.speed || 1;
                this.reduceMotion = result.userSettings.animations?.reduceMotion || false;
            }
        } catch (error) {
            console.error('Error loading theme settings:', error);
        }
    }

    applyTheme() {
        const root = document.documentElement;
        
        // Apply theme
        root.setAttribute('data-theme', this.currentTheme);
        
        // Apply animation speed
        root.setAttribute('data-animation-speed', this.currentAnimationSpeed.toString());
        
        // Apply reduce motion
        root.setAttribute('data-reduce-motion', this.reduceMotion.toString());
        
        // Update CSS custom properties for immediate effect
        this.updateCSSVariables();
        
        console.log(`Theme applied: ${this.currentTheme}, Speed: ${this.currentAnimationSpeed}x, Reduce Motion: ${this.reduceMotion}`);
    }

    updateCSSVariables() {
        const root = document.documentElement;
        
        switch (this.currentTheme) {
            case 'dark':
                root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)');
                root.style.setProperty('--accent-color', '#4299e1');
                root.style.setProperty('--accent-hover', '#3182ce');
                root.style.setProperty('--text-primary', '#f7fafc');
                root.style.setProperty('--text-secondary', '#a0aec0');
                root.style.setProperty('--background-primary', '#2d3748');
                root.style.setProperty('--background-secondary', '#4a5568');
                root.style.setProperty('--border-color', '#4a5568');
                root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
                break;
            case 'forest':
                root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)');
                root.style.setProperty('--accent-color', '#38a169');
                root.style.setProperty('--accent-hover', '#2f855a');
                root.style.setProperty('--text-primary', '#2d3748');
                root.style.setProperty('--text-secondary', '#718096');
                root.style.setProperty('--background-primary', '#ffffff');
                root.style.setProperty('--background-secondary', '#f0fff4');
                root.style.setProperty('--border-color', '#c6f6d5');
                root.style.setProperty('--shadow-color', 'rgba(56, 161, 105, 0.1)');
                break;
            case 'sunset':
                root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)');
                root.style.setProperty('--accent-color', '#ed8936');
                root.style.setProperty('--accent-hover', '#dd6b20');
                root.style.setProperty('--text-primary', '#2d3748');
                root.style.setProperty('--text-secondary', '#718096');
                root.style.setProperty('--background-primary', '#ffffff');
                root.style.setProperty('--background-secondary', '#fffaf0');
                root.style.setProperty('--border-color', '#fed7aa');
                root.style.setProperty('--shadow-color', 'rgba(237, 137, 54, 0.1)');
                break;
            default: // default
                root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
                root.style.setProperty('--accent-color', '#667eea');
                root.style.setProperty('--accent-hover', '#5a67d8');
                root.style.setProperty('--text-primary', '#2d3748');
                root.style.setProperty('--text-secondary', '#718096');
                root.style.setProperty('--background-primary', '#ffffff');
                root.style.setProperty('--background-secondary', '#f7fafc');
                root.style.setProperty('--border-color', '#e2e8f0');
                root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
                break;
        }
        
        // Apply animation speed
        root.style.setProperty('--animation-speed', `${1/this.currentAnimationSpeed}s`);
    }

    setupMessageListener() {
        // Listen for theme changes from settings page
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'themeChanged') {
                this.currentTheme = request.theme;
                this.currentAnimationSpeed = request.animationSpeed || 1;
                this.reduceMotion = request.reduceMotion || false;
                this.applyTheme();
            }
        });
    }

    // Method to be called when settings change
    updateTheme(theme, animationSpeed = 1, reduceMotion = false) {
        this.currentTheme = theme;
        this.currentAnimationSpeed = animationSpeed;
        this.reduceMotion = reduceMotion;
        this.applyTheme();
    }
}

// Auto-initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});
