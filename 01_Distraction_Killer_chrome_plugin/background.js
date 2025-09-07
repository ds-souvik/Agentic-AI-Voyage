// DistractionKiller Background Script
class DistractionKillerBackground {
    constructor() {
        this.currentSession = null;
        this.userSettings = null;
        this.blockedSites = this.initializeBlockedSites();
        this.setupMessageListener();
        this.setupNavigationListener();
        this.loadSessionData();
        this.loadUserSettings();
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

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.action) {
                case 'startSession':
                    this.startSession(request.sessionData);
                    break;
                case 'stopSession':
                    this.stopSession();
                    break;
                case 'updateSession':
                    this.updateSession(request.sessionData);
                    break;
                case 'completeSession':
                    this.completeSession(request.sessionData);
                    break;
                case 'checkBlockedSite':
                    // Handle async isSiteBlocked
                    this.isSiteBlocked(request.url).then(isBlocked => {
                        sendResponse({ 
                            isBlocked, 
                            category: this.getBlockedCategory(request.url) 
                        });
                    });
                    return true; // Keep message channel open for async response
                case 'getSessionData':
                    sendResponse({ currentSession: this.currentSession });
                    break;
                case 'settingsUpdated':
                    this.userSettings = request.settings;
                    console.log('Settings updated in background:', this.userSettings);
                    console.log('Social media enabled:', this.userSettings?.siteCategories?.socialMedia);
                    // Reload settings to ensure they're properly applied
                    this.loadUserSettings();
                    break;
            }
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

    async startSession(sessionData) {
        this.currentSession = sessionData;
        await chrome.storage.local.set({ currentSession: sessionData });
        
        // Clear any existing temporary access from previous sessions
        await chrome.storage.local.remove(['temporaryAccess', 'lastBlockedUrl', 'lastBlockedTabId']);
        console.log('Cleared temporary access for new session');
        
        // Set up blocking rules
        this.setupBlockingRules();
        
        console.log('Deep work session started:', sessionData);
    }

    async stopSession() {
        this.currentSession = null;
        await chrome.storage.local.set({ currentSession: null });
        
        // Clear any temporary access when session ends
        await chrome.storage.local.remove(['temporaryAccess', 'lastBlockedUrl', 'lastBlockedTabId']);
        
        // Clear blocking rules
        this.clearBlockingRules();
        
        console.log('Deep work session stopped');
    }

    async updateSession(sessionData) {
        this.currentSession = sessionData;
        await chrome.storage.local.set({ currentSession: sessionData });
    }

    async completeSession(sessionData) {
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
        this.clearBlockingRules();
        
        console.log('Deep work session completed:', sessionData);
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

        // Check if there's temporary access granted for this URL/domain
        try {
            const result = await chrome.storage.local.get(['temporaryAccess']);
            console.log('Checking temporary access for:', url, 'Result:', result);
            
            if (result.temporaryAccess && result.temporaryAccess.granted) {
                const accessData = result.temporaryAccess;
                const now = Date.now();
                
                console.log('Temporary access found:', {
                    url: accessData.url,
                    domain: accessData.domain,
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
                    
                    // Check if this URL or domain has temporary access
                    if (accessData.url === url || accessData.domain === hostname) {
                        console.log('Allowing access due to temporary permission');
                        return false; // Allow access
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
            
            // Check exact domain matches (respecting user settings)
            for (const category in this.blockedSites) {
                if (category === 'keywords') continue;
                
                // Check if this category is enabled in user settings
                if (this.userSettings && this.userSettings.siteCategories) {
                    const categoryKey = this.getCategoryKey(category);
                    const isEnabled = this.userSettings.siteCategories[categoryKey];
                    console.log(`Checking category ${category} -> ${categoryKey}, enabled:`, isEnabled);
                    if (categoryKey && !isEnabled) {
                        console.log(`Skipping category ${category} because it's disabled in settings`);
                        continue; // Skip this category if disabled
                    }
                } else {
                    console.log('No user settings or siteCategories found, using default blocking');
                }
                
                for (const domain of this.blockedSites[category]) {
                    if (hostname === domain || hostname.endsWith('.' + domain)) {
                        console.log(`Blocking ${url} - matched domain ${domain} in category ${category}`);
                        return true;
                    }
                }
            }
            
            // Check custom sites from user settings
            if (this.userSettings && this.userSettings.customSites) {
                for (const customSite of this.userSettings.customSites) {
                    if (hostname === customSite || hostname.endsWith('.' + customSite)) {
                        console.log(`Blocking ${url} - matched custom site ${customSite}`);
                        return true;
                    }
                }
            }
            
            // Check keyword matches (respecting user settings)
            const fullUrl = (hostname + pathname + search).toLowerCase();
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
                }
                
                for (const keyword of this.blockedSites.keywords[category]) {
                    if (fullUrl.includes(keyword.toLowerCase())) {
                        console.log(`Blocking ${url} - matched keyword ${keyword} in category ${category}`);
                        return true;
                    }
                }
            }
            
            // Check custom keywords from user settings
            if (this.userSettings && this.userSettings.customKeywords) {
                for (const keyword of this.userSettings.customKeywords) {
                    if (fullUrl.includes(keyword.toLowerCase())) {
                        console.log(`Blocking ${url} - matched custom keyword ${keyword}`);
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

    getBlockedCategory(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            const pathname = urlObj.pathname.toLowerCase();
            const search = urlObj.search.toLowerCase();
            const fullUrl = (hostname + pathname + search).toLowerCase();
            
            // Check exact domain matches first
            for (const category in this.blockedSites) {
                if (category === 'keywords') continue;
                
                for (const domain of this.blockedSites[category]) {
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
}

// Initialize background script
new DistractionKillerBackground();