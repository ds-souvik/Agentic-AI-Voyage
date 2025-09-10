/**
 * DistractionKiller Reports Interface
 * 
 * Displays comprehensive reports of deep work sessions including:
 * - Session history and statistics
 * - Gamification progress and scores
 * - Time period filtering (daily, weekly, complete)
 * - Export functionality for CSV reports
 */
class DistractionKillerReports {
    constructor() {
        this.sessionHistory = [];
        this.currentPeriod = 'today';
        this.gamificationService = new GamificationService();
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadData();
    }

    initializeElements() {
        this.periodButtons = document.querySelectorAll('.period-btn');
        this.totalSessions = document.getElementById('totalSessions');
        this.totalTime = document.getElementById('totalTime');
        this.avgSession = document.getElementById('avgSession');
        this.focusScore = document.getElementById('focusScore');
        this.cumulativeScore = document.getElementById('cumulativeScore');
        this.sessionsList = document.getElementById('sessionsList');
        this.sessionsEmpty = document.getElementById('sessionsEmpty');
        this.exportCSV = document.getElementById('exportCSV');
        this.exportHTML = document.getElementById('exportHTML');
        this.totalPoints = document.getElementById('totalPoints');
        this.pointsToday = document.getElementById('pointsToday');
        this.currentLevel = document.getElementById('currentLevel');
        this.progressToNext = document.getElementById('progressToNext');
        this.dailyStreak = document.getElementById('dailyStreak');
        this.weeklyStreak = document.getElementById('weeklyStreak');
        this.recentSessionsList = document.getElementById('recentSessionsList');
        this.backToPopup = document.getElementById('backToPopup');
    }

    setupEventListeners() {
        this.periodButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentPeriod = e.target.dataset.period;
                this.updatePeriodButtons();
                this.updateDisplay();
            });
        });

        this.exportCSV?.addEventListener('click', () => this.exportReport('csv'));
        this.exportHTML?.addEventListener('click', () => this.exportReport('html'));
        this.backToPopup?.addEventListener('click', () => window.close());
    }

    async loadData() {
        try {
            await this.loadSessionHistory();
            await this.updateGamificationDisplay();
            this.updateDisplay();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    async loadSessionHistory() {
        try {
            const result = await chrome.storage.local.get(['sessionHistory']);
            this.sessionHistory = result.sessionHistory || [];
        } catch (error) {
            console.error('Error loading session history:', error);
            this.sessionHistory = [];
        }
    }

    updateDisplay() {
        const filteredSessions = this.getFilteredSessions();
        this.updateSummaryCards(filteredSessions);
        this.updateSessionsList(filteredSessions);
    }

    getFilteredSessions() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeek = new Date(today);
        thisWeek.setDate(today.getDate() - today.getDay());

        return this.sessionHistory.filter(session => {
            const sessionDate = new Date(session.startTime);
            
            switch (this.currentPeriod) {
                case 'today':
                    return sessionDate >= today;
                case 'week':
                    return sessionDate >= thisWeek;
                case 'complete':
                default:
                    return true;
            }
        });
    }

    updateSummaryCards(sessions) {
        const totalSessions = sessions.length;
        const totalTimeMs = sessions.reduce((sum, session) => {
            return sum + (session.endTime - session.startTime);
        }, 0);
        const totalHours = Math.floor(totalTimeMs / (1000 * 60 * 60));
        const totalMinutes = Math.floor((totalTimeMs % (1000 * 60 * 60)) / (1000 * 60));
        
        const avgSessionMs = totalSessions > 0 ? totalTimeMs / totalSessions : 0;
        const avgMinutes = Math.floor(avgSessionMs / (1000 * 60));
        
        const completedSessions = sessions.filter(s => s.completed).length;
        const focusScore = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

        this.totalSessions.textContent = totalSessions;
        this.totalTime.textContent = `${totalHours}h ${totalMinutes}m`;
        this.avgSession.textContent = `${avgMinutes}m`;
        this.focusScore.textContent = `${focusScore}%`;

        this.updateCumulativeScore();
    }

    async updateCumulativeScore() {
        try {
            const summary = await this.gamificationService.getGamificationSummary();
            let score = 0;

            switch (this.currentPeriod) {
                case 'today':
                    score = summary.dailyPoints || 0;
                    break;
                case 'week':
                    const result = await chrome.storage.local.get(['gamificationData']);
                    const gamificationData = result.gamificationData || {};
                    const weekStart = this.getWeekStartString();
                    score = gamificationData.weeklyPoints?.[weekStart] || 0;
                    break;
                case 'complete':
                default:
                    score = summary.totalPoints || 0;
                    break;
            }

            this.cumulativeScore.textContent = score;
            this.cumulativeScore.className = `stat-value ${score >= 0 ? 'positive' : 'negative'}`;
            
        } catch (error) {
            console.error('Error updating cumulative score:', error);
            this.cumulativeScore.textContent = '0';
        }
    }

    updateSessionsList(sessions) {
        if (sessions.length === 0) {
            this.sessionsList.style.display = 'none';
            this.sessionsEmpty.style.display = 'block';
            return;
        }

        this.sessionsList.style.display = 'block';
        this.sessionsEmpty.style.display = 'none';

        const sortedSessions = [...sessions].sort((a, b) => b.startTime - a.startTime);

        this.sessionsList.innerHTML = sortedSessions.map(session => {
            const startTime = new Date(session.startTime);
            const duration = session.endTime - session.startTime;
            const durationMinutes = Math.floor(duration / (1000 * 60));
            const status = session.completed ? 'Completed' : session.stoppedEarly ? 'Stopped Early' : 'Incomplete';
            const statusClass = session.completed ? 'success' : session.stoppedEarly ? 'warning' : 'info';
            
            const sessionScore = this.getSessionScore(session);
            const scoreClass = sessionScore >= 0 ? 'positive' : 'negative';

            return `
                <div class="session-item">
                    <div class="session-info">
                        <div class="session-time">
                            <strong>${startTime.toLocaleDateString()}</strong>
                            <span>${startTime.toLocaleTimeString()}</span>
                    </div>
                        <div class="session-details">
                            <div class="session-goal">${session.goal || 'Deep Work Session'}</div>
                    <div class="session-stats">
                                <span class="stat-item">Duration: ${durationMinutes}m</span>
                                <span class="stat-item">Status: <span class="status ${statusClass}">${status}</span></span>
                                <span class="stat-item">Blocked: ${session.blockedAttempts || 0}</span>
                                <span class="stat-item session-score-item">Score: <span class="stat-value ${scoreClass}">${sessionScore > 0 ? '+' : ''}${sessionScore}</span></span>
                        </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getSessionScore(session) {
                if (session.completed) {
            let score = 20;
            
            if (session.blockedAttempts) {
                score -= session.blockedAttempts * 5;
            }
            if (session.hadOverrides) {
                score -= 10;
            }
            if (session.wasPaused) {
                score -= 5;
            }
            
            return Math.max(-15, Math.min(25, score));
        } else if (session.stoppedEarly) {
            let score = -15;
            
            if (session.blockedAttempts) {
                score -= session.blockedAttempts * 5;
            }
            if (session.hadOverrides) {
                score -= 10;
            }
            
            return score;
        }
        
        return 0;
    }

    async updateGamificationDisplay() {
        try {
            const summary = await this.gamificationService.getGamificationSummary();
            const reportData = await this.gamificationService.getGamificationReportData();

            this.totalPoints.textContent = summary.totalPoints.toLocaleString();
            this.pointsToday.textContent = summary.dailyPoints.toLocaleString();
            this.currentLevel.textContent = summary.currentLevel;
            this.progressToNext.textContent = summary.pointsToNextLevel > 0 
                ? `${summary.pointsToNextLevel} points to go` 
                : 'Max level reached!';
            this.dailyStreak.textContent = `${summary.dailyStreak} days`;
            this.weeklyStreak.textContent = `${summary.weeklyStreak} weeks`;

            this.updateRecentSessionsList(reportData.recentSessions || []);

        } catch (error) {
            console.error('Error updating gamification display:', error);
        }
    }

    updateRecentSessionsList(recentSessions) {
        if (!this.recentSessionsList) return;

        if (recentSessions.length === 0) {
            this.recentSessionsList.innerHTML = '<div class="no-sessions">No recent sessions</div>';
            return;
        }

        this.recentSessionsList.innerHTML = recentSessions.slice(0, 5).map(session => {
            const startTime = new Date(session.startTime);
            const score = session.score || 0;
            const scoreClass = score >= 0 ? 'positive-score' : 'negative-score';

            return `
                <div class="recent-session-item">
                    <div class="session-time">${startTime.toLocaleDateString()}</div>
                    <div class="session-details">
                        <span class="session-goal">${session.goal || 'Deep Work'}</span>
                        <span class="session-score ${scoreClass}">${score > 0 ? '+' : ''}${score}</span>
            </div>
            </div>
        `;
        }).join('');
    }

    updatePeriodButtons() {
        this.periodButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.period === this.currentPeriod);
        });
    }

    async exportReport(format) {
        try {
            const filteredSessions = this.getFilteredSessions();
            const summary = await this.gamificationService.getGamificationSummary();
            
            const data = {
                period: this.currentPeriod,
                exportDate: new Date().toISOString(),
                sessions: filteredSessions,
                summary: summary,
                statistics: this.calculateStatistics(filteredSessions)
            };

            if (format === 'csv') {
                this.exportCSVReport(data);
            } else if (format === 'html') {
                this.exportHTMLReport(data);
            }

            this.showNotification(`Report exported successfully as ${format.toUpperCase()}`, 'success');
            
        } catch (error) {
            console.error('Error exporting report:', error);
            this.showNotification('Failed to export report', 'error');
        }
    }

    exportCSVReport(data) {
        const csvContent = [
            'Deep Work Report - ' + this.currentPeriod.charAt(0).toUpperCase() + this.currentPeriod.slice(1),
            'Generated on: ' + new Date().toLocaleString(),
            '',
            'SUMMARY',
            `Total Points,${data.summary.totalPoints}`,
            `Daily Points,${data.summary.dailyPoints}`,
            `Current Level,${data.summary.currentLevel}`,
            `Daily Streak,${data.summary.dailyStreak}`,
            `Total Sessions,${data.sessions.length}`,
            `Total Time,${this.formatDuration(data.statistics.totalTime)}`,
            '',
            'SESSIONS',
            'Date,Time,Goal,Duration (min),Status,Blocked Attempts,Score',
            ...data.sessions.map(session => {
                const startTime = new Date(session.startTime);
                const duration = Math.floor((session.endTime - session.startTime) / (1000 * 60));
                const status = session.completed ? 'Completed' : session.stoppedEarly ? 'Stopped Early' : 'Incomplete';
                const score = this.getSessionScore(session);
                
                return `${startTime.toLocaleDateString()},${startTime.toLocaleTimeString()},"${session.goal || 'Deep Work Session'}",${duration},${status},${session.blockedAttempts || 0},${score}`;
            })
        ].join('\n');

        this.downloadFile(csvContent, `distraction-killer-report-${this.currentPeriod}-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    }

    exportHTMLReport(data) {
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Deep Work Report - ${this.currentPeriod}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .summary h3 { margin-top: 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .stat-item { background: white; padding: 15px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .sessions table { width: 100%; border-collapse: collapse; }
        .sessions th, .sessions td { padding: 12px; border: 1px solid #ddd; text-align: left; }
        .sessions th { background: #f8f9fa; }
        .positive-score { color: #38a169; }
        .negative-score { color: #e53e3e; }
    </style>
</head>
<body>
        <div class="header">
        <h1>🎯 Deep Work Report</h1>
        <p>Period: ${this.currentPeriod.charAt(0).toUpperCase() + this.currentPeriod.slice(1)}</p>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>

    <div class="summary">
        <h3>Summary</h3>
        <div class="stats-grid">
            <div class="stat-item"><strong>Total Points:</strong> ${data.summary.totalPoints}</div>
            <div class="stat-item"><strong>Daily Points:</strong> ${data.summary.dailyPoints}</div>
            <div class="stat-item"><strong>Current Level:</strong> ${data.summary.currentLevel}</div>
            <div class="stat-item"><strong>Daily Streak:</strong> ${data.summary.dailyStreak} days</div>
            <div class="stat-item"><strong>Total Sessions:</strong> ${data.sessions.length}</div>
            <div class="stat-item"><strong>Total Time:</strong> ${this.formatDuration(data.statistics.totalTime)}</div>
            </div>
        </div>

    <div class="sessions">
        <h3>Sessions</h3>
        <table>
                <thead>
                    <tr>
                        <th>Date</th>
                    <th>Time</th>
                        <th>Goal</th>
                    <th>Duration</th>
                        <th>Status</th>
                        <th>Blocked</th>
                    <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                ${data.sessions.map(session => {
                    const startTime = new Date(session.startTime);
                    const duration = Math.floor((session.endTime - session.startTime) / (1000 * 60));
                    const status = session.completed ? 'Completed' : session.stoppedEarly ? 'Stopped Early' : 'Incomplete';
                    const score = this.getSessionScore(session);
                    const scoreClass = score >= 0 ? 'positive-score' : 'negative-score';

                        return `
                            <tr>
                            <td>${startTime.toLocaleDateString()}</td>
                            <td>${startTime.toLocaleTimeString()}</td>
                            <td>${session.goal || 'Deep Work Session'}</td>
                            <td>${duration}m</td>
                            <td>${status}</td>
                                <td>${session.blockedAttempts || 0}</td>
                            <td class="${scoreClass}">${score > 0 ? '+' : ''}${score}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
</body>
</html>`;

        this.downloadFile(htmlContent, `distraction-killer-report-${this.currentPeriod}-${new Date().toISOString().split('T')[0]}.html`, 'text/html');
    }

    calculateStatistics(sessions) {
        const totalTime = sessions.reduce((sum, session) => {
            return sum + (session.endTime - session.startTime);
        }, 0);

        const completedSessions = sessions.filter(s => s.completed).length;
        const totalBlocked = sessions.reduce((sum, session) => sum + (session.blockedAttempts || 0), 0);

        return {
            totalTime,
            completedSessions,
            totalBlocked,
            completionRate: sessions.length > 0 ? (completedSessions / sessions.length) * 100 : 0
        };
    }

    formatDuration(ms) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        chrome.downloads.download({
            url: url,
            filename: filename,
            saveAs: false
        }, () => {
        URL.revokeObjectURL(url);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#3182ce'};
                color: white;
            border-radius: 4px;
                z-index: 1000;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }

    getWeekStartString() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - dayOfWeek);
        return weekStart.toISOString().split('T')[0];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DistractionKillerReports();
});
