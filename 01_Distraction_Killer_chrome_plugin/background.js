// DistractionKiller Background Script
class DistractionKillerBackground {
    constructor() {
        this.currentSession = null;
        this.blockedSites = this.initializeBlockedSites();
        this.setupMessageListener();
        this.setupNavigationListener();
        this.loadSessionData();
    }

    initializeBlockedSites() {
        return {
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
            "keywords": {
                "porn": [
                    "porn", "xxx", "sex", "adult", "hentai", "cam", "escort", "fuck",
                    "nude", "erotic", "fetish", "onlyfans", "bdsm", "anal", "orgy",
                    "milf", "teen", "hardcore", "xhamster", "xnxx", "spank", "redtube",
                    "youporn", "xvideos", "tnaflix", "fap", "amateur"
                ],
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
            
            // Check exact domain matches
            for (const category in this.blockedSites) {
                if (category === 'keywords') continue;
                
                for (const domain of this.blockedSites[category]) {
                    if (hostname === domain || hostname.endsWith('.' + domain)) {
                        return true;
                    }
                }
            }
            
            // Check keyword matches
            const fullUrl = (hostname + pathname + search).toLowerCase();
            for (const category in this.blockedSites.keywords) {
                for (const keyword of this.blockedSites.keywords[category]) {
                    if (fullUrl.includes(keyword.toLowerCase())) {
                        return true;
                    }
                }
            }
            
            return false;
        } catch (error) {
            console.error('Error checking if site is blocked:', error);
            return false;
        }
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
