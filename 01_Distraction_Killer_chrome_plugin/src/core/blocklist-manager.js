/**
 * DistractionKiller Blocklist Manager
 * 
 * Manages loading and checking against different categories of blocked content:
 * - Social Media (facebook, instagram, twitter, etc.)
 * - Shopping/E-commerce (amazon, flipkart, ebay, etc.)
 * - News & Media (cnn, bbc, nytimes, etc.)
 * - Entertainment (youtube, netflix, spotify, etc.)
 * - Adult Content (comprehensive adult content database)
 * 
 * Loads blocklists from JSON files in Block_list/ directory to protect IP.
 */
class BlocklistManager {
    constructor() {
        this.blocklists = {
            social: null,
            shopping: null,
            news: null,
            entertainment: null,
            adult: null
        };
        
        this.categoryMapping = {
            'social': 'socialMedia',
            'shopping': 'shopping', 
            'news': 'news',
            'entertainment': 'entertainment',
            'adult': 'adult'
        };
    }

    /**
     * Initialize all blocklists by loading from JSON files
     */
    async initializeBlocklists() {
        try {
            console.log('Loading blocklists from JSON files...');

            // Load each category from its respective JSON file
            const loadPromises = [
                this.loadBlocklistFile('social_blocklist.json', 'social'),
                this.loadBlocklistFile('shopping_blocklist.json', 'shopping'),
                this.loadBlocklistFile('news_blocklist.json', 'news'),
                this.loadBlocklistFile('entertainment_blocklist.json', 'entertainment'),
                this.loadBlocklistFile('porn_blocklist.json', 'adult')
            ];

            await Promise.all(loadPromises);
            console.log('All blocklists loaded successfully');
            
        } catch (error) {
            console.error('Error initializing blocklists:', error);
            this.initializeFallbackBlocklists();
        }
    }

    /**
     * Load a specific blocklist file
     */
    async loadBlocklistFile(filename, category) {
        try {
            const response = await fetch(chrome.runtime.getURL(`Block_list/${filename}`));
            const data = await response.json();
            
            this.blocklists[category] = {
                domains: data.domains || [],
                keywords: data.keywords || []
            };
            
            console.log(`Loaded ${category} blocklist:`, {
                domains: this.blocklists[category].domains.length,
                keywords: this.blocklists[category].keywords.length
            });
            
        } catch (error) {
            console.error(`Error loading ${category} blocklist:`, error);
            this.blocklists[category] = { domains: [], keywords: [] };
        }
    }

    /**
     * Initialize minimal fallback blocklists if JSON loading fails
     */
    initializeFallbackBlocklists() {
        console.log('Initializing fallback blocklists...');
        
        this.blocklists = {
            social: {
                domains: ['facebook.com', 'instagram.com', 'twitter.com', 'x.com'],
                keywords: ['facebook', 'instagram', 'twitter']
            },
            shopping: {
                domains: ['amazon.com', 'flipkart.com', 'ebay.com'],
                keywords: ['amazon', 'shop', 'buy']
            },
            news: {
                domains: ['cnn.com', 'bbc.com', 'nytimes.com'],
                keywords: ['news', 'cnn', 'bbc']
            },
            entertainment: {
                domains: ['youtube.com', 'netflix.com', 'spotify.com'],
                keywords: ['youtube', 'netflix', 'spotify']
            },
            adult: {
                domains: [],
                keywords: ['porn', 'xxx', 'adult']
            }
        };
    }

    /**
     * Check if a URL should be blocked based on user settings
     */
    async shouldBlockUrl(url, userSettings) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            const pathname = urlObj.pathname.toLowerCase();
            const search = urlObj.search.toLowerCase();
            const fullUrl = (hostname + pathname + search).toLowerCase();
            
            // Check each category if enabled in user settings
            for (const category in this.blocklists) {
                const settingsKey = this.categoryMapping[category];
                
                // Skip if category is disabled in settings
                if (userSettings?.siteCategories && !userSettings.siteCategories[settingsKey]) {
                    continue;
                }
                
                const blocklist = this.blocklists[category];
                if (!blocklist) continue;
                
                // Check domain matches
                for (const domain of blocklist.domains) {
                    if (hostname === domain || hostname.endsWith('.' + domain)) {
                        console.log(`Blocking ${url} - matched domain ${domain} in category ${category}`);
                        return {
                            shouldBlock: true,
                            category: category,
                            matchType: 'domain',
                            matchValue: domain
                        };
                    }
                }
                
                // Check keyword matches
                for (const keyword of blocklist.keywords) {
                    if (fullUrl.includes(keyword.toLowerCase())) {
                        console.log(`Blocking ${url} - matched keyword "${keyword}" in category ${category}`);
                        return {
                            shouldBlock: true,
                            category: category,
                            matchType: 'keyword',
                            matchValue: keyword
                        };
                    }
                }
            }
            
            // Check custom sites from user settings
            if (userSettings?.customSites) {
                for (const customSite of userSettings.customSites) {
                    if (hostname === customSite || hostname.endsWith('.' + customSite)) {
                        console.log(`Blocking ${url} - matched custom site ${customSite}`);
                        return {
                            shouldBlock: true,
                            category: 'custom',
                            matchType: 'domain',
                            matchValue: customSite
                        };
                    }
                }
            }
            
            // Check custom keywords from user settings
            if (userSettings?.customKeywords) {
                for (const keyword of userSettings.customKeywords) {
                    if (fullUrl.includes(keyword.toLowerCase())) {
                        console.log(`Blocking ${url} - matched custom keyword "${keyword}"`);
                        return {
                            shouldBlock: true,
                            category: 'custom',
                            matchType: 'keyword',
                            matchValue: keyword
                        };
                    }
                }
            }
            
            console.log(`Allowing ${url} - no blocking rules matched`);
            return { shouldBlock: false };
            
        } catch (error) {
            console.error('Error checking if site is blocked:', error);
            return { shouldBlock: false };
        }
    }

    /**
     * Get statistics about loaded blocklists
     */
    getBlocklistStats() {
        const stats = {};
        
        for (const category in this.blocklists) {
            const blocklist = this.blocklists[category];
            stats[category] = {
                domains: blocklist ? blocklist.domains.length : 0,
                keywords: blocklist ? blocklist.keywords.length : 0,
                loaded: !!blocklist
            };
        }
        
        return stats;
    }

    /**
     * Get blocked category for a specific URL (for reporting)
     */
    async getBlockedCategory(url, userSettings) {
        const blockResult = await this.shouldBlockUrl(url, userSettings);
        return blockResult.shouldBlock ? blockResult.category : null;
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.BlocklistManager = BlocklistManager;
}
