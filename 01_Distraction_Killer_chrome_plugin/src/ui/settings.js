// Distraction Killer Settings Script
class DistractionKillerSettings {
    constructor() {
        this.settings = {};
        this.defaultSettings = this.getDefaultSettings();
        this.initializeElements();
        this.setupEventListeners();
        this.loadSettings();
    }

    getDefaultSettings() {
        return {
            // Blocking Behavior
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
            
            // Notifications & Alerts
            notifications: {
                sessionStart: true,
                sessionEnd: true,
                sessionMilestone: true,
                dailyGoal: true,
                weeklyStreak: true,
                focusTime: true
            },
            
            // Appearance & Interface
            theme: 'auto', // Changed default to auto
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
    }

    initializeElements() {
        // Navigation
        this.backToPopup = document.getElementById('backToPopup');
        
        // Custom Sites
        this.customSiteInput = document.getElementById('customSiteInput');
        this.addCustomSiteBtn = document.getElementById('addCustomSite');
        this.customSitesList = document.getElementById('customSitesList');
        
        // Site Categories
        this.categoryToggles = document.getElementById('categoryToggles');
        
        // Keywords
        this.keywordInput = document.getElementById('keywordInput');
        this.addKeywordBtn = document.getElementById('addKeyword');
        this.keywordsList = document.getElementById('keywordsList');
        
        // Friction Text
        this.frictionText = document.getElementById('frictionText');
        this.resetFrictionTextBtn = document.getElementById('resetFrictionText');
        this.saveFrictionTextBtn = document.getElementById('saveFrictionText');
        
        // Theme Options
        this.themeOptions = document.querySelectorAll('.theme-option');
        
        // Timer Style
        this.timerStyleInputs = document.querySelectorAll('input[name="timerStyle"]');
        
        // Volume Control
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeValue = document.getElementById('volumeValue');
        
        // Animation Speed
        this.animationSpeed = document.getElementById('animationSpeed');
        this.speedValue = document.getElementById('speedValue');
        
        // Actions
        this.resetSettingsBtn = document.getElementById('resetSettings');
        this.saveSettingsBtn = document.getElementById('saveSettings');
    }

    setupEventListeners() {
        // Navigation
        this.backToPopup.addEventListener('click', () => this.goBack());
        
        // Custom Sites
        this.addCustomSiteBtn.addEventListener('click', () => this.addCustomSiteHandler());
        this.customSiteInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addCustomSiteHandler();
        });
        
        // Keywords
        this.addKeywordBtn.addEventListener('click', () => this.addKeywordHandler());
        this.keywordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addKeywordHandler();
        });
        
        // Friction Text
        this.resetFrictionTextBtn.addEventListener('click', () => this.resetFrictionText());
        this.saveFrictionTextBtn.addEventListener('click', () => this.saveFrictionText());
        
        // Theme Selection
        this.themeOptions.forEach(option => {
            option.addEventListener('click', () => this.selectTheme(option.dataset.theme));
        });
        
        // Timer Style
        this.timerStyleInputs.forEach(input => {
            input.addEventListener('change', () => this.updateTimerStyle(input.value));
        });
        
        // Volume Control
        this.volumeSlider.addEventListener('input', () => this.updateVolume());
        
        // Animation Speed
        this.animationSpeed.addEventListener('input', () => this.updateAnimationSpeed());
        
        // Toggle Switches
        this.setupToggleListeners();
        
        // Actions
        this.resetSettingsBtn.addEventListener('click', () => this.resetAllSettings());
        this.saveSettingsBtn.addEventListener('click', () => this.saveAllSettings());
        
        // Auto-save on changes
        this.setupAutoSave();
        
        // Listen for system theme changes
        this.setupSystemThemeListener();
    }

    setupSystemThemeListener() {
        // Listen for system theme changes when using auto theme
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (this.settings.theme === 'auto') {
                    this.applyThemeDirectly('auto');
                }
            });
        }
    }

    setupToggleListeners() {
        // Site Categories - use event delegation
        this.categoryToggles.addEventListener('change', (e) => {
            if (e.target.classList.contains('toggle-input')) {
                this.updateCategorySettings();
            }
        });
        
        // Notification toggles - use event delegation
        const notificationsSection = document.getElementById('notificationsSection');
        if (notificationsSection) {
            notificationsSection.addEventListener('change', (e) => {
                if (e.target.classList.contains('toggle-input')) {
                    this.updateNotificationSettings();
                }
            });
        }
        
        // Sound toggles - use event delegation
        const appearanceSection = document.getElementById('appearanceSection');
        if (appearanceSection) {
            appearanceSection.addEventListener('change', (e) => {
                if (e.target.classList.contains('toggle-input')) {
                    this.updateSoundSettings();
                }
            });
        }
    }

    setupAutoSave() {
        // Auto-save friction text
        this.frictionText.addEventListener('input', this.debounce(() => {
            this.settings.frictionText = this.frictionText.value;
            this.saveSettings();
        }, 1000));
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.local.get(['userSettings']);
            console.log('Loaded settings from storage:', result.userSettings);
            this.settings = { ...this.defaultSettings, ...result.userSettings };
            console.log('Final settings object:', this.settings);
            console.log('Site categories after merge:', this.settings.siteCategories);
            this.applySettings();
            
            // Apply theme immediately after settings load
            this.applyThemeImmediately();
        } catch (error) {
            console.error('Error loading settings:', error);
            this.settings = { ...this.defaultSettings };
            this.applySettings();
            this.applyThemeImmediately();
        }
    }

    applySettings() {
        // Apply custom sites
        this.renderCustomSites();
        
        // Apply site categories
        Object.keys(this.settings.siteCategories).forEach(category => {
            const input = document.getElementById(category);
            // FIXED (CORRECT):
            if (input) {
                input.checked = this.settings.siteCategories[category];
            } else {
                console.warn(`Input element not found for category: ${category}`);
            }
        });
        
        // Apply keywords
        this.renderKeywords();
        
        // Apply friction text
        this.frictionText.value = this.settings.frictionText;
        
        // Apply notifications
        Object.keys(this.settings.notifications).forEach(notif => {
            const input = document.getElementById(notif);
            if (input) {
                input.checked = this.settings.notifications[notif];
            }
        });
        
        // Apply theme (without saving to avoid circular calls)
        this.applyThemeOnly(this.settings.theme);
        
        // Apply timer style
        const timerInput = document.querySelector(`input[name="timerStyle"][value="${this.settings.timerStyle}"]`);
        if (timerInput) {
            timerInput.checked = true;
        }
        
        // Apply sounds
        Object.keys(this.settings.sounds).forEach(sound => {
            if (sound === 'volume') {
                this.volumeSlider.value = this.settings.sounds.volume;
                this.volumeValue.textContent = `${this.settings.sounds.volume}%`;
            } else {
                const input = document.getElementById(`sound${sound.charAt(0).toUpperCase() + sound.slice(1)}`);
                if (input) {
                    input.checked = this.settings.sounds[sound];
                }
            }
        });
        
        // Apply animations
        this.animationSpeed.value = this.settings.animations.speed;
        this.speedValue.textContent = `${this.settings.animations.speed}x`;
        
        const reduceMotionInput = document.getElementById('reduceMotion');
        if (reduceMotionInput) {
            reduceMotionInput.checked = this.settings.animations.reduceMotion;
        }
    }

    renderCustomSites() {
        this.customSitesList.innerHTML = '';
        this.settings.customSites.forEach((site, index) => {
            const siteElement = this.createListItem(site, () => this.removeCustomSite(index));
            this.customSitesList.appendChild(siteElement);
        });
    }

    renderKeywords() {
        this.keywordsList.innerHTML = '';
        this.settings.customKeywords.forEach((keyword, index) => {
            const keywordElement = this.createListItem(keyword, () => this.removeKeyword(index));
            this.keywordsList.appendChild(keywordElement);
        });
    }

    createListItem(text, removeCallback) {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <span>${text}</span>
            <button class="remove-item" title="Remove">×</button>
        `;
        item.querySelector('.remove-item').addEventListener('click', removeCallback);
        return item;
    }

    addCustomSiteHandler() {
        const url = this.customSiteInput.value.trim();
        if (!url) return;
        
        try {
            const urlObj = new URL(url);
            const domain = urlObj.hostname;
            
            if (!this.settings.customSites.includes(domain)) {
                this.settings.customSites.push(domain);
                this.renderCustomSites();
                this.customSiteInput.value = '';
                this.saveSettings();
                this.showMessage('Site added successfully!', 'success');
            } else {
                this.showMessage('Site already exists in the list.', 'error');
            }
        } catch (error) {
            this.showMessage('Please enter a valid URL.', 'error');
        }
    }

    removeCustomSite(index) {
        this.settings.customSites.splice(index, 1);
        this.renderCustomSites();
        this.saveSettings();
        this.showMessage('Site removed successfully!', 'success');
    }

    addKeywordHandler() {
        const keyword = this.keywordInput.value.trim().toLowerCase();
        if (!keyword) return;
        
        if (!this.settings.customKeywords.includes(keyword)) {
            this.settings.customKeywords.push(keyword);
            this.renderKeywords();
            this.keywordInput.value = '';
            this.saveSettings();
            this.showMessage('Keyword added successfully!', 'success');
        } else {
            this.showMessage('Keyword already exists in the list.', 'error');
        }
    }

    removeKeyword(index) {
        this.settings.customKeywords.splice(index, 1);
        this.renderKeywords();
        this.saveSettings();
        this.showMessage('Keyword removed successfully!', 'success');
    }

    updateCategorySettings() {
        const categoryInputs = this.categoryToggles.querySelectorAll('.toggle-input');
        categoryInputs.forEach(input => {
            this.settings.siteCategories[input.id] = input.checked;
        });
        this.saveSettings();
    }

    updateNotificationSettings() {
        const notificationInputs = document.querySelectorAll('#notificationsSection .toggle-input');
        notificationInputs.forEach(input => {
            this.settings.notifications[input.id] = input.checked;
        });
        this.saveSettings();
    }

    updateSoundSettings() {
        const soundInputs = document.querySelectorAll('#appearanceSection .toggle-input');
        soundInputs.forEach(input => {
            const soundKey = input.id.replace('sound', '').toLowerCase();
            if (soundKey === 'session' || soundKey === 'blocking' || soundKey === 'milestone') {
                this.settings.sounds[soundKey] = input.checked;
            }
        });
        this.saveSettings();
    }

    resetFrictionText() {
        this.frictionText.value = this.defaultSettings.frictionText;
        this.settings.frictionText = this.defaultSettings.frictionText;
        this.saveSettings();
        this.showMessage('Friction text reset to default!', 'success');
    }

    saveFrictionText() {
        this.settings.frictionText = this.frictionText.value;
        this.saveSettings();
        this.showMessage('Friction text saved!', 'success');
    }

    selectTheme(themeName) {
        this.settings.theme = themeName;
        
        // Update UI
        this.themeOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === themeName);
        });
        
        // Save settings first
        this.saveSettings();
        
        // Apply theme immediately
        this.applyThemeDirectly(themeName);
        
        // Notify all tabs about theme change
        this.notifyThemeChange(themeName);
        
        // Show feedback
        this.showMessage(`Theme changed to ${themeName}!`, 'success');
    }

    async notifyThemeChange(themeName) {
        try {
            // Get all tabs and send theme change message
            const tabs = await chrome.tabs.query({});
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'themeChanged',
                    theme: themeName,
                    animationSpeed: this.settings.animations.speed,
                    reduceMotion: this.settings.animations.reduceMotion
                }).catch(() => {
                    // Ignore errors for tabs that don't have content scripts
                });
            });
        } catch (error) {
            console.log('Could not notify all tabs:', error);
        }
    }

    applyThemeImmediately() {
        // Apply theme immediately after settings load
        this.applyThemeDirectly(this.settings.theme);
        
        // Update header background
        const header = document.querySelector('.settings-header');
        if (header) {
            header.style.background = `var(--primary-gradient)`;
        }
    }

    applyThemeOnly(themeName) {
        // Apply theme without saving to avoid circular calls
        this.applyThemeDirectly(themeName);
    }

    applyThemeDirectly(themeName) {
        const root = document.documentElement;
        
        // Set data attribute for CSS
        if (themeName === 'auto') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', themeName);
        }
        
        // Apply CSS variables
        switch (themeName) {
            case 'dark':
                root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)');
                root.style.setProperty('--accent-color', '#4299e1');
                root.style.setProperty('--text-primary', '#f7fafc');
                root.style.setProperty('--text-secondary', '#a0aec0');
                root.style.setProperty('--background-primary', '#2d3748');
                root.style.setProperty('--background-secondary', '#4a5568');
                root.style.setProperty('--border-color', '#4a5568');
                break;
            case 'forest':
                root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)');
                root.style.setProperty('--accent-color', '#38a169');
                root.style.setProperty('--text-primary', '#2d3748');
                root.style.setProperty('--text-secondary', '#718096');
                root.style.setProperty('--background-primary', '#ffffff');
                root.style.setProperty('--background-secondary', '#f0fff4');
                root.style.setProperty('--border-color', '#c6f6d5');
                break;
            case 'sunset':
                root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)');
                root.style.setProperty('--accent-color', '#ed8936');
                root.style.setProperty('--text-primary', '#2d3748');
                root.style.setProperty('--text-secondary', '#718096');
                root.style.setProperty('--background-primary', '#ffffff');
                root.style.setProperty('--background-secondary', '#fffaf0');
                root.style.setProperty('--border-color', '#fed7aa');
                break;
            case 'auto':
                // Reset to default values, let CSS media queries handle the rest
                root.style.removeProperty('--primary-gradient');
                root.style.removeProperty('--accent-color');
                root.style.removeProperty('--text-primary');
                root.style.removeProperty('--text-secondary');
                root.style.removeProperty('--background-primary');
                root.style.removeProperty('--background-secondary');
                root.style.removeProperty('--border-color');
                break;
            default: // default
                root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #7A9E9F 0%, #6B8B8C 100%)');
                root.style.setProperty('--accent-color', '#7A9E9F');
                root.style.setProperty('--text-primary', '#2d3748');
                root.style.setProperty('--text-secondary', '#718096');
                root.style.setProperty('--background-primary', '#ffffff');
                root.style.setProperty('--background-secondary', '#f7fafc');
                root.style.setProperty('--border-color', '#e2e8f0');
                break;
        }
        
        // Update header background
        const header = document.querySelector('.settings-header');
        if (header) {
            header.style.background = `var(--primary-gradient)`;
        }
        
        console.log('Theme applied directly:', themeName);
    }

    updateTimerStyle(style) {
        this.settings.timerStyle = style;
        this.saveSettings();
    }

    updateVolume() {
        const volume = parseInt(this.volumeSlider.value);
        this.settings.sounds.volume = volume;
        this.volumeValue.textContent = `${volume}%`;
        this.saveSettings();
    }

    updateAnimationSpeed() {
        const speed = parseFloat(this.animationSpeed.value);
        this.settings.animations.speed = speed;
        this.speedValue.textContent = `${speed}x`;
        
        // Apply animation speed to current page
        document.documentElement.style.setProperty('--animation-speed', `${1/speed}s`);
        this.saveSettings();
    }

    async saveSettings() {
        try {
            await chrome.storage.local.set({ userSettings: this.settings });
            
            // Notify background script of settings change
            chrome.runtime.sendMessage({
                action: 'settingsUpdated',
                settings: this.settings
            }).catch(error => {
                console.log('Background script not available:', error);
            });
            
            console.log('Settings saved successfully:', this.settings);
            console.log('Site categories saved:', this.settings.siteCategories);
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showMessage('Error saving settings. Please try again.', 'error');
        }
    }

    async saveAllSettings() {
        try {
            await this.saveSettings();
            this.showMessage('All settings saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving all settings:', error);
            this.showMessage('Error saving settings. Please try again.', 'error');
        }
    }

    async resetAllSettings() {
        if (!confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
            return;
        }
        
        this.settings = { ...this.defaultSettings };
        await this.saveSettings();
        this.applySettings();
        this.showMessage('All settings reset to default!', 'success');
    }

    goBack() {
        window.close();
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `${type}-message`;
        messageElement.textContent = message;
        
        // Insert at top of content
        const content = document.querySelector('.settings-content');
        content.insertBefore(messageElement, content.firstChild);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 3000);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Test method to verify settings are working
    testSettings() {
        console.log('=== Settings Test ===');
        console.log('Current settings:', this.settings);
        console.log('Default settings:', this.defaultSettings);
        console.log('Site categories:', this.settings.siteCategories);
        console.log('Custom sites:', this.settings.customSites);
        console.log('Theme:', this.settings.theme);
        console.log('Notifications:', this.settings.notifications);
        
        // Test category toggles
        const categoryInputs = this.categoryToggles.querySelectorAll('.toggle-input');
        console.log('Category inputs found:', categoryInputs.length);
        categoryInputs.forEach(input => {
            console.log(`${input.id}: ${input.checked}`);
        });
    }
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new DistractionKillerSettings();
    
    // Add global test function
    window.testSettings = () => {
        if (window.settingsManager) {
            window.settingsManager.testSettings();
        } else {
            console.log('Settings manager not initialized');
        }
    };
});