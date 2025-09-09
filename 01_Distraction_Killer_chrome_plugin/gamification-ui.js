// DistractionKiller Gamification UI Component
class GamificationUI {
    constructor() {
        this.gamification = null;
        this.initializeGamification();
    }

    async initializeGamification() {
        try {
            // Check if gamification is already available
            if (window.gamification) {
                this.gamification = window.gamification;
                this.updateDisplay();
                return;
            }

            // Try to load gamification script
            const script = document.createElement('script');
            script.src = chrome.runtime.getURL('gamification.js');
            script.onload = () => {
                this.gamification = window.gamification;
                this.updateDisplay();
            };
            script.onerror = () => {
                console.warn('Failed to load gamification script, using fallback');
                this.gamification = {
                    getGamificationSummary: () => ({ 
                        totalPoints: 0, 
                        currentLevel: 'Seedling Focus', 
                        dailyStreak: 0, 
                        weeklyStreak: 0, 
                        earnedBadges: [],
                        pointsToNextLevel: 50
                    }),
                    getGamificationReportData: () => ({ summary: {}, recentSessions: [] }),
                    getCurrentLevel: () => ({ name: 'Seedling Focus', min: 0, max: 49 })
                };
                this.updateDisplay();
            };
            document.head.appendChild(script);
        } catch (error) {
            console.error('Error initializing gamification UI:', error);
            // Fallback gamification object
            this.gamification = {
                getGamificationSummary: () => ({ 
                    totalPoints: 0, 
                    currentLevel: 'Seedling Focus', 
                    dailyStreak: 0, 
                    weeklyStreak: 0, 
                    earnedBadges: [],
                    pointsToNextLevel: 50
                }),
                getGamificationReportData: () => ({ summary: {}, recentSessions: [] }),
                getCurrentLevel: () => ({ name: 'Seedling Focus', min: 0, max: 49 })
            };
            this.updateDisplay();
        }
    }

    async updateDisplay() {
        if (!this.gamification) return;

        // Don't show gamification card in popup to maintain clean layout
        const isPopup = window.location.pathname.includes('popup') || 
                       document.querySelector('.popup-container') || 
                       document.querySelector('.container');
        
        if (isPopup) {
            return; // Don't render gamification card in popup
        }

        try {
            const summary = await this.gamification.getGamificationSummary();
            // Check if summary is valid before rendering
            if (summary && typeof summary === 'object' && summary.totalPoints !== undefined) {
                this.renderGamificationCard(summary);
            } else {
                console.warn('Invalid gamification summary received:', summary);
                // Use fallback summary
                const fallbackSummary = {
                    totalPoints: 0,
                    currentLevel: 'Seedling Focus',
                    dailyStreak: 0,
                    weeklyStreak: 0,
                    earnedBadges: [],
                    pointsToNextLevel: 50
                };
                this.renderGamificationCard(fallbackSummary);
            }
        } catch (error) {
            console.error('Error updating gamification display:', error);
            // Use fallback summary on error
            const fallbackSummary = {
                totalPoints: 0,
                currentLevel: 'Seedling Focus',
                dailyStreak: 0,
                weeklyStreak: 0,
                earnedBadges: [],
                pointsToNextLevel: 50
            };
            this.renderGamificationCard(fallbackSummary);
        }
    }

    renderGamificationCard(summary) {
        // Find or create gamification card container
        let card = document.getElementById('gamificationCard');
        if (!card) {
            card = this.createGamificationCard();
            this.insertGamificationCard(card);
        }

        // Update card content
        const levelElement = card.querySelector('.gamification-level');
        const pointsElement = card.querySelector('.gamification-points');
        const streakElement = card.querySelector('.gamification-streak');
        const progressElement = card.querySelector('.gamification-progress');
        const badgesElement = card.querySelector('.gamification-badges');

        if (levelElement) {
            levelElement.textContent = summary.currentLevel;
        }

        if (pointsElement) {
            pointsElement.textContent = `${summary.totalPoints.toLocaleString()} points`;
        }

        if (streakElement) {
            streakElement.textContent = `${summary.dailyStreak} day streak`;
        }

        if (progressElement) {
            const progressBar = progressElement.querySelector('.progress-bar-fill');
            const progressText = progressElement.querySelector('.progress-text');
            
            if (summary.pointsToNextLevel > 0) {
                const currentLevel = this.gamification.getCurrentLevel();
                const progress = ((summary.totalPoints - currentLevel.min) / (currentLevel.max - currentLevel.min + 1)) * 100;
                progressBar.style.width = `${Math.min(progress, 100)}%`;
                progressText.textContent = `${summary.pointsToNextLevel} to next level`;
            } else {
                progressBar.style.width = '100%';
                progressText.textContent = 'Max level reached!';
            }
        }

        if (badgesElement) {
            this.renderBadges(badgesElement, summary.earnedBadges);
        }
    }

    createGamificationCard() {
        const card = document.createElement('div');
        card.id = 'gamificationCard';
        card.className = 'gamification-card';
        card.innerHTML = `
            <div class="gamification-header">
                <h3>🎯 Focus Journey</h3>
            </div>
            <div class="gamification-content">
                <div class="gamification-stats">
                    <div class="stat-item">
                        <div class="stat-label">Level</div>
                        <div class="stat-value gamification-level">Loading...</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Points</div>
                        <div class="stat-value gamification-points">Loading...</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Streak</div>
                        <div class="stat-value gamification-streak">Loading...</div>
                    </div>
                </div>
                <div class="gamification-progress">
                    <div class="progress-bar">
                        <div class="progress-bar-fill"></div>
                    </div>
                    <div class="progress-text">Loading...</div>
                </div>
                <div class="gamification-badges">
                    <div class="badges-title">Recent Badges</div>
                    <div class="badges-list"></div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .gamification-card {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                padding: 16px;
                margin: 12px 0;
                color: white;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .gamification-header h3 {
                margin: 0 0 12px 0;
                font-size: 16px;
                font-weight: 600;
            }
            
            .gamification-stats {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 12px;
                margin-bottom: 16px;
            }
            
            .stat-item {
                text-align: center;
            }
            
            .stat-label {
                font-size: 12px;
                opacity: 0.8;
                margin-bottom: 4px;
            }
            
            .stat-value {
                font-size: 14px;
                font-weight: 600;
            }
            
            .gamification-progress {
                margin-bottom: 16px;
            }
            
            .progress-bar {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                height: 6px;
                overflow: hidden;
                margin-bottom: 4px;
            }
            
            .progress-bar-fill {
                background: rgba(255, 255, 255, 0.8);
                height: 100%;
                border-radius: 8px;
                transition: width 0.3s ease;
            }
            
            .progress-text {
                font-size: 11px;
                opacity: 0.8;
                text-align: center;
            }
            
            .badges-title {
                font-size: 12px;
                opacity: 0.8;
                margin-bottom: 8px;
            }
            
            .badges-list {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
            }
            
            .badge {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 10px;
                font-weight: 500;
            }
        `;
        document.head.appendChild(style);

        return card;
    }

    insertGamificationCard(card) {
        // Don't insert gamification card in popup to maintain clean layout
        // Only show gamification in reports page
        const isPopup = window.location.pathname.includes('popup') || 
                       document.querySelector('.popup-container') || 
                       document.querySelector('.container');
        
        if (isPopup) {
            // Don't show gamification card in popup
            return;
        }
        
        // Insert after the status indicator or at the top of main content for other pages
        const statusIndicator = document.getElementById('statusIndicator');
        const mainContent = document.getElementById('mainContent');
        
        if (statusIndicator && statusIndicator.nextSibling) {
            statusIndicator.parentNode.insertBefore(card, statusIndicator.nextSibling);
        } else if (mainContent) {
            mainContent.insertBefore(card, mainContent.firstChild);
        }
    }

    renderBadges(container, badges) {
        const badgesList = container.querySelector('.badges-list');
        badgesList.innerHTML = '';

        if (badges.length === 0) {
            badgesList.innerHTML = '<div class="badge">No badges yet</div>';
            return;
        }

        // Show only recent badges (last 3)
        const recentBadges = badges.slice(-3);
        recentBadges.forEach(badge => {
            const badgeElement = document.createElement('div');
            badgeElement.className = 'badge';
            badgeElement.textContent = badge.name;
            badgeElement.title = badge.description;
            badgesList.appendChild(badgeElement);
        });
    }

    async showSessionSummary(sessionData) {
        if (!this.gamification) return;

        try {
            const sessionGamification = this.gamification.getSessionGamificationData ? 
                this.gamification.getSessionGamificationData(sessionData.id) : 
                { sessionPoints: 0, attempts: 0, overrides: 0, wasPaused: false, stoppedEarly: false };
            const summary = await this.gamification.getGamificationSummary();
        
            const modal = document.createElement('div');
        modal.className = 'session-summary-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Session Summary</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="summary-outcome">
                        <strong>Outcome:</strong> ${this.getSessionOutcome(sessionData, sessionGamification)}
                    </div>
                    <div class="summary-points">
                        <strong>Session points:</strong> ${sessionGamification.sessionPoints > 0 ? '+' : ''}${sessionGamification.sessionPoints}
                    </div>
                    <div class="summary-total">
                        <strong>Total points:</strong> ${summary.totalPoints.toLocaleString()} — ${summary.currentLevel}
                    </div>
                    <div class="summary-progress">
                        ${summary.pointsToNextLevel > 0 ? `${summary.pointsToNextLevel} to next level` : 'Max level reached!'}
                    </div>
                    <div class="summary-streak">
                        <strong>Streak:</strong> ${summary.dailyStreak} days
                    </div>
                    ${sessionGamification.attempts > 0 ? `<div class="summary-attempts">Blocked attempts: ${sessionGamification.attempts}</div>` : ''}
                    ${sessionGamification.overrides > 0 ? `<div class="summary-overrides">Overrides used: ${sessionGamification.overrides}</div>` : ''}
                    ${sessionGamification.wasPaused ? `<div class="summary-paused">Session was paused</div>` : ''}
                </div>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .session-summary-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
            }
            
            .modal-content {
                background: white;
                border-radius: 12px;
                padding: 24px;
                max-width: 400px;
                width: 90%;
                position: relative;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .modal-header h2 {
                margin: 0;
                font-size: 20px;
                color: #2d3748;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #718096;
            }
            
            .modal-body > div {
                margin-bottom: 12px;
                font-size: 14px;
            }
            
            .summary-outcome {
                font-size: 16px;
                margin-bottom: 16px;
            }
            
            .summary-points {
                color: ${sessionGamification.sessionPoints > 0 ? '#38a169' : '#e53e3e'};
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Close modal handlers
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });

        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });
        } catch (error) {
            console.error('Error showing session summary:', error);
        }
    }

    getSessionOutcome(sessionData, sessionGamification) {
        if (sessionGamification.stoppedEarly) {
            return 'Aborted';
        } else if (sessionGamification.wasPaused) {
            return 'Paused & Completed';
        } else if (sessionGamification.attempts > 0 || sessionGamification.overrides > 0) {
            return 'Distracted';
        } else {
            return 'Completed';
        }
    }
}

// Initialize gamification UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gamificationUI = new GamificationUI();
});
