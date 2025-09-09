// DistractionKiller Gamification Service (Service Worker Compatible)
class GamificationService {
    constructor() {
        this.MIN_SESSION_MINUTES = 25;
        this.SESSION_POINT_CAP = 25;
        this.MAX_STREAK_BONUS = 7;
        
        this.levels = [
            { name: "Seedling Focus", min: 0, max: 49 },
            { name: "Attention Apprentice", min: 50, max: 149 },
            { name: "Ritual Novice", min: 150, max: 299 },
            { name: "Task Tamer", min: 300, max: 499 },
            { name: "Flow Initiate", min: 500, max: 749 },
            { name: "Focus Artisan", min: 750, max: 999 },
            { name: "Rhythm Keeper", min: 1000, max: 1299 },
            { name: "Clarity Crafter", min: 1300, max: 1599 },
            { name: "Momentum Maker", min: 1600, max: 1999 },
            { name: "Deep Diver", min: 2000, max: 2499 },
            { name: "Time Alchemist", min: 2500, max: 2999 },
            { name: "Discipline Architect", min: 3000, max: 3599 },
            { name: "Zen Practitioner", min: 3600, max: 4199 },
            { name: "Flow Architect", min: 4200, max: 4999 },
            { name: "Habit Vanguard", min: 5000, max: 5999 },
            { name: "Cognitive Commander", min: 6000, max: 7499 },
            { name: "Habit Sage", min: 7500, max: 8999 },
            { name: "Master of Momentum", min: 9000, max: 10999 },
            { name: "Deep Work Luminary", min: 11000, max: 12999 },
            { name: "Legend of Mastery", min: 13000, max: Infinity }
        ];
    }

    async trackEvent(eventType, sessionId, data = {}) {
        try {
            console.log('Gamification event:', eventType, sessionId, data);
            
            // Get current gamification data
            const result = await chrome.storage.local.get(['gamificationData']);
            let gamificationData = result.gamificationData || this.getDefaultGamificationData();
            
            // Process the event
            const eventResult = this.processEvent(eventType, data, gamificationData, sessionId);
            
            // Update gamification data
            await chrome.storage.local.set({ gamificationData: gamificationData });
            
            // Store event
            const eventsResult = await chrome.storage.local.get(['gamificationEvents']);
            const events = eventsResult.gamificationEvents || [];
            events.push({
                type: eventType,
                sessionId: sessionId,
                timestamp: Date.now(),
                data: data
            });
            await chrome.storage.local.set({ gamificationEvents: events });
            
            return eventResult;
        } catch (error) {
            console.error('Error tracking gamification event:', error);
            return { pointsToAdd: 0, message: '' };
        }
    }

    processEvent(eventType, data, gamificationData, sessionId = null) {
        const today = this.getTodayString();
        const weekStart = this.getWeekStartString();

        // Initialize daily/weekly points if needed
        if (!gamificationData.dailyPoints) gamificationData.dailyPoints = {};
        if (!gamificationData.weeklyPoints) gamificationData.weeklyPoints = {};
        if (!gamificationData.dailyPoints[today]) gamificationData.dailyPoints[today] = 0;
        if (!gamificationData.weeklyPoints[weekStart]) gamificationData.weeklyPoints[weekStart] = 0;

        let pointsToAdd = 0;
        let message = '';

        switch (eventType) {
            case 'blocked_attempt':
                pointsToAdd = -5;
                message = '-5 — blocked site attempt logged.';
                break;

            case 'override':
                pointsToAdd = -10;
                message = '-10 — override used and logged.';
                break;

            case 'pause_chosen':
                if (data.pauseMinutes === 5) {
                    pointsToAdd = 2;
                    message = '+2 — pause chosen. Good call, try again!';
                } else if (data.pauseMinutes === 10) {
                    pointsToAdd = 3;
                    message = '+3 — pause chosen. Good call, try again!';
                }
                break;

            case 'session_complete':
                if (this.isValidCompletion(data)) {
                    pointsToAdd = 20;
                    message = '+20 — session complete! Great work.';
                    
                    // Apply pause penalty if session was paused
                    if (data.wasPaused) {
                        pointsToAdd -= 5;
                    }
                    
                    // Apply streak bonus
                    const streakBonus = Math.min(gamificationData.dailyStreak || 0, this.MAX_STREAK_BONUS);
                    if (streakBonus > 0) {
                        pointsToAdd += streakBonus;
                    }
                }
                break;

            case 'session_abort':
                pointsToAdd = -15;
                message = '-15 — session stopped early; reflections saved.';
                break;
        }

        // Apply session point cap (only if sessionId is provided)
        if (sessionId) {
            const sessionPoints = this.getSessionPoints(sessionId, gamificationData);
            const newSessionPoints = sessionPoints + pointsToAdd;
            if (newSessionPoints > this.SESSION_POINT_CAP) {
                pointsToAdd = this.SESSION_POINT_CAP - sessionPoints;
            }
        }

        // Update points
        gamificationData.totalPoints = (gamificationData.totalPoints || 0) + pointsToAdd;
        gamificationData.dailyPoints[today] += pointsToAdd;
        gamificationData.weeklyPoints[weekStart] += pointsToAdd;

        // Update streaks
        if (eventType === 'session_complete' && this.isValidCompletion(data)) {
            this.updateStreaks(gamificationData);
        }

        return { pointsToAdd, message };
    }

    isValidCompletion(sessionData) {
        return sessionData.durationMinutes >= this.MIN_SESSION_MINUTES &&
               !sessionData.hadBlockedAttempts &&
               !sessionData.hadOverrides;
    }

    getSessionPoints(sessionId, gamificationData) {
        // This is a simplified version - in a real implementation,
        // you'd calculate based on stored events
        return 0;
    }

    updateStreaks(gamificationData) {
        const today = this.getTodayString();
        const yesterday = this.getYesterdayString();
        
        // Update daily streak
        if (gamificationData.lastSessionDate === yesterday) {
            gamificationData.dailyStreak = (gamificationData.dailyStreak || 0) + 1;
        } else if (gamificationData.lastSessionDate !== today) {
            gamificationData.dailyStreak = 1;
        }
        
        gamificationData.lastSessionDate = today;

        // Update weekly streak
        const weekStart = this.getWeekStartString();
        const lastWeekStart = this.getLastWeekStartString();
        
        if (gamificationData.lastWeekStart === lastWeekStart) {
            gamificationData.weeklyStreak = (gamificationData.weeklyStreak || 0) + 1;
        } else if (gamificationData.lastWeekStart !== weekStart) {
            gamificationData.weeklyStreak = 1;
        }
        
        gamificationData.lastWeekStart = weekStart;
    }

    async getGamificationSummary() {
        try {
            const result = await chrome.storage.local.get(['gamificationData']);
            const gamificationData = result.gamificationData || this.getDefaultGamificationData();
            
            const totalPoints = gamificationData.totalPoints || 0;
            const currentLevel = this.getCurrentLevel(totalPoints);
            const nextLevel = this.levels[this.levels.indexOf(currentLevel) + 1];
            const pointsToNextLevel = nextLevel ? nextLevel.min - totalPoints : 0;
            
            return {
                totalPoints: totalPoints,
                currentLevel: currentLevel.name,
                dailyStreak: gamificationData.dailyStreak || 0,
                weeklyStreak: gamificationData.weeklyStreak || 0,
                earnedBadges: gamificationData.earnedBadges || [],
                pointsToNextLevel: Math.max(0, pointsToNextLevel)
            };
        } catch (error) {
            console.error('Error getting gamification summary:', error);
            return {
                totalPoints: 0,
                currentLevel: 'Seedling Focus',
                dailyStreak: 0,
                weeklyStreak: 0,
                earnedBadges: [],
                pointsToNextLevel: 50
            };
        }
    }

    getCurrentLevel(totalPoints) {
        return this.levels.find(level => totalPoints >= level.min && totalPoints <= level.max) || this.levels[0];
    }

    async getGamificationReportData() {
        try {
            const summary = await this.getGamificationSummary();
            const result = await chrome.storage.local.get(['gamificationEvents']);
            const events = result.gamificationEvents || [];
            
            // Group events by session
            const sessionMap = new Map();
            events.forEach(event => {
                if (!sessionMap.has(event.sessionId)) {
                    sessionMap.set(event.sessionId, {
                        sessionId: event.sessionId,
                        timestamp: event.timestamp,
                        sessionPoints: 0,
                        attempts: 0,
                        overrides: 0,
                        wasPaused: false,
                        pausedMinutes: 0,
                        stoppedEarly: false
                    });
                }
                const session = sessionMap.get(event.sessionId);
                session.sessionPoints += event.points || 0;
                
                if (event.type === 'blocked_attempt') session.attempts++;
                if (event.type === 'override') session.overrides++;
                if (event.type === 'pause_chosen') {
                    session.wasPaused = true;
                    session.pausedMinutes += event.data.pauseMinutes || 0;
                }
                if (event.type === 'session_abort') session.stoppedEarly = true;
            });
            
            const recentSessions = Array.from(sessionMap.values())
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 10); // Last 10 sessions
            
            return {
                summary: summary,
                recentSessions: recentSessions,
                allBadges: summary.earnedBadges || [],
                levelProgression: this.levels
            };
        } catch (error) {
            console.error('Error getting gamification report data:', error);
            return {
                summary: await this.getGamificationSummary(),
                recentSessions: [],
                allBadges: [],
                levelProgression: this.levels
            };
        }
    }

    getDefaultGamificationData() {
        return {
            totalPoints: 0,
            dailyStreak: 0,
            weeklyStreak: 0,
            lastSessionDate: null,
            lastWeekStart: null,
            earnedBadges: [],
            sessionHistory: [],
            dailyPoints: {},
            weeklyPoints: {}
        };
    }

    // Utility methods
    getTodayString() {
        return new Date().toISOString().split('T')[0];
    }

    getYesterdayString() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    }

    getWeekStartString() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - dayOfWeek);
        return weekStart.toISOString().split('T')[0];
    }

    getLastWeekStartString() {
        const weekStart = new Date(this.getWeekStartString());
        weekStart.setDate(weekStart.getDate() - 7);
        return weekStart.toISOString().split('T')[0];
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.GamificationService = GamificationService;
}
