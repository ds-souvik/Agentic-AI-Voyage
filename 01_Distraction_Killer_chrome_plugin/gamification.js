// DistractionKiller Gamification System
class DistractionKillerGamification {
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
        
        this.badges = [
            { id: 'first_session', name: 'First Steps', description: 'Completed your first focus session', threshold: 1 },
            { id: 'week_streak', name: 'Week Warrior', description: '7-day completion streak', threshold: 7 },
            { id: 'month_streak', name: 'Month Master', description: '30-day completion streak', threshold: 30 },
            { id: 'thousand_points', name: 'Point Pioneer', description: 'Earned 1,000 total points', threshold: 1000 },
            { id: 'five_thousand', name: 'Focus Five', description: 'Earned 5,000 total points', threshold: 5000 },
            { id: 'ten_thousand', name: 'Decade Dedication', description: 'Earned 10,000 total points', threshold: 10000 }
        ];
        
        this.gamificationData = null;
        this.loadGamificationData();
    }

    async loadGamificationData() {
        try {
            const result = await chrome.storage.local.get(['gamificationData']);
            this.gamificationData = result.gamificationData || this.getDefaultGamificationData();
            await this.saveGamificationData();
        } catch (error) {
            console.error('Error loading gamification data:', error);
            this.gamificationData = this.getDefaultGamificationData();
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

    async saveGamificationData() {
        try {
            await chrome.storage.local.set({ gamificationData: this.gamificationData });
        } catch (error) {
            console.error('Error saving gamification data:', error);
        }
    }

    // Event tracking methods
    async trackEvent(eventType, sessionId, data = {}) {
        if (!this.gamificationData) {
            console.warn('Gamification data not loaded, skipping event tracking');
            return { type: eventType, sessionId, timestamp: Date.now(), data };
        }

        const event = {
            type: eventType,
            sessionId: sessionId,
            timestamp: Date.now(),
            data: data
        };

        // Add to session history
        if (!this.gamificationData.sessionHistory) {
            this.gamificationData.sessionHistory = [];
        }
        this.gamificationData.sessionHistory.push(event);

        // Process the event
        await this.processEvent(event);
        await this.saveGamificationData();

        return event;
    }

    async processEvent(event) {
        if (!this.gamificationData) {
            console.warn('Gamification data not loaded, skipping event processing');
            return { pointsToAdd: 0, message: '' };
        }

        const { type, sessionId, data } = event;
        const today = this.getTodayString();
        const weekStart = this.getWeekStartString();

        // Initialize daily/weekly points if needed
        if (!this.gamificationData.dailyPoints) {
            this.gamificationData.dailyPoints = {};
        }
        if (!this.gamificationData.weeklyPoints) {
            this.gamificationData.weeklyPoints = {};
        }
        if (!this.gamificationData.dailyPoints[today]) {
            this.gamificationData.dailyPoints[today] = 0;
        }
        if (!this.gamificationData.weeklyPoints[weekStart]) {
            this.gamificationData.weeklyPoints[weekStart] = 0;
        }

        let pointsToAdd = 0;
        let message = '';

        switch (type) {
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
                    const streakBonus = Math.min(this.gamificationData.dailyStreak, this.MAX_STREAK_BONUS);
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

        // Apply session point cap
        const sessionPoints = this.getSessionPoints(sessionId);
        const newSessionPoints = sessionPoints + pointsToAdd;
        if (newSessionPoints > this.SESSION_POINT_CAP) {
            pointsToAdd = this.SESSION_POINT_CAP - sessionPoints;
        }

        // Update points
        this.gamificationData.totalPoints += pointsToAdd;
        this.gamificationData.dailyPoints[today] += pointsToAdd;
        this.gamificationData.weeklyPoints[weekStart] += pointsToAdd;

        // Update streaks
        if (type === 'session_complete' && this.isValidCompletion(data)) {
            await this.updateStreaks();
        }

        // Check for new badges
        await this.checkBadges();

        // Show notification
        if (message) {
            this.showNotification(message);
        }

        return { pointsToAdd, message };
    }

    isValidCompletion(sessionData) {
        if (!sessionData) return false;
        return sessionData.durationMinutes >= this.MIN_SESSION_MINUTES &&
               !sessionData.hadBlockedAttempts &&
               !sessionData.hadOverrides;
    }

    getSessionPoints(sessionId) {
        if (!this.gamificationData || !this.gamificationData.sessionHistory) {
            return 0;
        }
        
        const sessionEvents = this.gamificationData.sessionHistory.filter(e => e.sessionId === sessionId);
        return sessionEvents.reduce((total, event) => {
            switch (event.type) {
                case 'blocked_attempt': return total - 5;
                case 'override': return total - 10;
                case 'pause_chosen': 
                    return total + (event.data.pauseMinutes === 5 ? 2 : 3);
                case 'session_complete': 
                    if (this.isValidCompletion(event.data)) {
                        let points = 20;
                        if (event.data.wasPaused) points -= 5;
                        return total + points;
                    }
                    return total;
                case 'session_abort': return total - 15;
                default: return total;
            }
        }, 0);
    }

    async updateStreaks() {
        if (!this.gamificationData) {
            console.warn('Gamification data not loaded, skipping streak update');
            return;
        }

        const today = this.getTodayString();
        const yesterday = this.getYesterdayString();
        
        // Update daily streak
        if (this.gamificationData.lastSessionDate === yesterday) {
            this.gamificationData.dailyStreak = (this.gamificationData.dailyStreak || 0) + 1;
        } else if (this.gamificationData.lastSessionDate !== today) {
            this.gamificationData.dailyStreak = 1;
        }
        
        this.gamificationData.lastSessionDate = today;

        // Update weekly streak
        const weekStart = this.getWeekStartString();
        const lastWeekStart = this.getLastWeekStartString();
        
        if (this.gamificationData.lastWeekStart === lastWeekStart) {
            this.gamificationData.weeklyStreak = (this.gamificationData.weeklyStreak || 0) + 1;
        } else if (this.gamificationData.lastWeekStart !== weekStart) {
            this.gamificationData.weeklyStreak = 1;
        }
        
        this.gamificationData.lastWeekStart = weekStart;
    }

    async checkBadges() {
        if (!this.gamificationData) {
            console.warn('Gamification data not loaded, skipping badge check');
            return;
        }

        const totalPoints = this.gamificationData.totalPoints || 0;
        const dailyStreak = this.gamificationData.dailyStreak || 0;
        const earnedBadges = this.gamificationData.earnedBadges || [];

        for (const badge of this.badges) {
            if (!earnedBadges.includes(badge.id)) {
                let shouldEarn = false;
                
                switch (badge.id) {
                    case 'first_session':
                        shouldEarn = this.gamificationData.sessionHistory.some(e => e.type === 'session_complete');
                        break;
                    case 'week_streak':
                        shouldEarn = dailyStreak >= 7;
                        break;
                    case 'month_streak':
                        shouldEarn = dailyStreak >= 30;
                        break;
                    case 'thousand_points':
                        shouldEarn = totalPoints >= 1000;
                        break;
                    case 'five_thousand':
                        shouldEarn = totalPoints >= 5000;
                        break;
                    case 'ten_thousand':
                        shouldEarn = totalPoints >= 10000;
                        break;
                }
                
                if (shouldEarn) {
                    earnedBadges.push(badge.id);
                    this.showNotification(`🏆 Badge earned: ${badge.name}!`);
                }
            }
        }
    }

    getCurrentLevel() {
        if (!this.gamificationData) {
            return this.levels[0]; // Return first level if data not loaded
        }
        const totalPoints = this.gamificationData.totalPoints || 0;
        for (const level of this.levels) {
            if (totalPoints >= level.min && totalPoints <= level.max) {
                return level;
            }
        }
        return this.levels[this.levels.length - 1]; // Return highest level if over max
    }

    getPointsToNextLevel() {
        if (!this.gamificationData) {
            return 50; // Default points to next level
        }
        const currentLevel = this.getCurrentLevel();
        const nextLevel = this.levels.find(level => level.min > currentLevel.max);
        if (nextLevel) {
            return nextLevel.min - (this.gamificationData.totalPoints || 0);
        }
        return 0; // Already at max level
    }

    getGamificationSummary() {
        if (!this.gamificationData) {
            return {
                totalPoints: 0,
                pointsToday: 0,
                pointsWeek: 0,
                currentLevel: 'Seedling Focus',
                pointsToNextLevel: 50,
                dailyStreak: 0,
                weeklyStreak: 0,
                earnedBadges: []
            };
        }
        
        const currentLevel = this.getCurrentLevel();
        const pointsToNext = this.getPointsToNextLevel();
        const today = this.getTodayString();
        const weekStart = this.getWeekStartString();

        return {
            totalPoints: this.gamificationData.totalPoints || 0,
            pointsToday: (this.gamificationData.dailyPoints && this.gamificationData.dailyPoints[today]) || 0,
            pointsWeek: (this.gamificationData.weeklyPoints && this.gamificationData.weeklyPoints[weekStart]) || 0,
            currentLevel: currentLevel.name,
            pointsToNextLevel: pointsToNext,
            dailyStreak: this.gamificationData.dailyStreak || 0,
            weeklyStreak: this.gamificationData.weeklyStreak || 0,
            earnedBadges: (this.gamificationData.earnedBadges || []).map(id => 
                this.badges.find(badge => badge.id === id)
            ).filter(Boolean)
        };
    }

    getSessionGamificationData(sessionId) {
        if (!this.gamificationData || !this.gamificationData.sessionHistory) {
            return {
                sessionPoints: 0,
                attempts: 0,
                overrides: 0,
                wasPaused: false,
                pausedMinutes: 0,
                stoppedEarly: false,
                events: []
            };
        }
        
        const sessionEvents = this.gamificationData.sessionHistory.filter(e => e.sessionId === sessionId);
        const sessionPoints = this.getSessionPoints(sessionId);
        
        const attempts = sessionEvents.filter(e => e.type === 'blocked_attempt').length;
        const overrides = sessionEvents.filter(e => e.type === 'override').length;
        const pauses = sessionEvents.filter(e => e.type === 'pause_chosen');
        const wasPaused = pauses.length > 0;
        const pausedMinutes = pauses.reduce((total, pause) => total + (pause.data.pauseMinutes || 0), 0);
        const stoppedEarly = sessionEvents.some(e => e.type === 'session_abort');
        
        return {
            sessionPoints,
            attempts,
            overrides,
            wasPaused,
            pausedMinutes,
            stoppedEarly,
            events: sessionEvents
        };
    }

    showNotification(message) {
        try {
            // Send notification to popup or show system notification
            chrome.runtime.sendMessage({
                action: 'showGamificationNotification',
                message: message
            }).catch(() => {
                // Fallback to system notification
                if (chrome.notifications) {
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: 'icons/icon48.png',
                        title: 'Distraction Killer',
                        message: message
                    });
                }
            });
        } catch (error) {
            console.warn('Could not show notification:', error);
        }
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

    // Export methods for reports
    getGamificationReportData() {
        if (!this.gamificationData) {
            return {
                summary: this.getGamificationSummary(),
                recentSessions: [],
                allBadges: this.badges,
                levelProgression: this.levels
            };
        }

        const summary = this.getGamificationSummary();
        const recentSessions = (this.gamificationData.sessionHistory || [])
            .filter(e => e.type === 'session_complete' || e.type === 'session_abort')
            .slice(-10) // Last 10 sessions
            .map(event => {
                const sessionData = this.getSessionGamificationData(event.sessionId);
                return {
                    sessionId: event.sessionId,
                    timestamp: event.timestamp,
                    type: event.type,
                    ...sessionData
                };
            });

        return {
            summary,
            recentSessions,
            allBadges: this.badges,
            levelProgression: this.levels
        };
    }
}

// Make it available globally for UI pages
if (typeof window !== 'undefined') {
    window.gamification = new DistractionKillerGamification();
    window.DistractionKillerGamification = DistractionKillerGamification;
}

// Export the class for module import (if supported)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DistractionKillerGamification };
}
