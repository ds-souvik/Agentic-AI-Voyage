// DistractionKiller Reports Script
class DistractionKillerReports {
    constructor() {
        this.sessionHistory = [];
        this.currentPeriod = 'today';
        this.initializeElements();
        this.loadSessionData();
        this.setupEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        // Summary elements
        this.totalFocusTime = document.getElementById('totalFocusTime');
        this.totalSessions = document.getElementById('totalSessions');
        this.totalBlocked = document.getElementById('totalBlocked');
        this.averageScore = document.getElementById('averageScore');

        // Period selector
        this.periodButtons = document.querySelectorAll('.period-btn');

        // Charts
        this.focusChart = document.getElementById('focusChart');
        this.blockedChartCanvas = document.getElementById('blockedChartCanvas');

        // Session list
        this.sessionList = document.getElementById('sessionList');

        // Export buttons
        this.exportDaily = document.getElementById('exportDaily');
        this.exportWeekly = document.getElementById('exportWeekly');
        this.exportAll = document.getElementById('exportAll');

        // Back button
        this.backToPopup = document.getElementById('backToPopup');

        // Insights
        this.insightsList = document.getElementById('insightsList');
    }

    setupEventListeners() {
        // Period selector
        this.periodButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.periodButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentPeriod = e.target.dataset.period;
                this.updateDisplay();
            });
        });

        // Export buttons
        this.exportDaily.addEventListener('click', () => this.exportReport('daily'));
        this.exportWeekly.addEventListener('click', () => this.exportReport('weekly'));
        this.exportAll.addEventListener('click', () => this.exportReport('all'));

        // Back button
        this.backToPopup.addEventListener('click', () => {
            window.close();
        });
    }

    async loadSessionData() {
        try {
            const result = await chrome.storage.local.get(['sessionHistory']);
            this.sessionHistory = result.sessionHistory || [];
            this.updateDisplay();
        } catch (error) {
            console.error('Error loading session data:', error);
        }
    }

    updateDisplay() {
        const filteredSessions = this.filterSessionsByPeriod(this.sessionHistory);
        this.updateSummaryCards(filteredSessions);
        this.updateSessionList(filteredSessions);
        this.updateCharts(filteredSessions);
        this.updateInsights(filteredSessions);
    }

    filterSessionsByPeriod(sessions) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        return sessions.filter(session => {
            const sessionDate = new Date(session.startTime);
            
            switch (this.currentPeriod) {
                case 'today':
                    return sessionDate >= today;
                case 'week':
                    return sessionDate >= weekAgo;
                case 'month':
                    return sessionDate >= monthAgo;
                case 'all':
                default:
                    return true;
            }
        });
    }

    updateSummaryCards(sessions) {
        // Calculate total focus time
        const totalMinutes = sessions.reduce((total, session) => {
            const duration = session.duration - (session.pausedTime || 0);
            return total + Math.floor(duration / 60000);
        }, 0);

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        this.totalFocusTime.textContent = `${hours}h ${minutes}m`;

        // Total sessions
        this.totalSessions.textContent = sessions.length;

        // Total blocked attempts
        const totalBlocked = sessions.reduce((total, session) => {
            return total + (session.blockedAttempts || 0);
        }, 0);
        this.totalBlocked.textContent = totalBlocked;

        // Average focus score
        const averageScore = sessions.length > 0 
            ? Math.round(sessions.reduce((total, session) => {
                const score = Math.max(0, 100 - ((session.blockedAttempts || 0) * 5));
                return total + score;
            }, 0) / sessions.length)
            : 0;
        this.averageScore.textContent = `${averageScore}%`;
    }

    updateSessionList(sessions) {
        if (sessions.length === 0) {
            this.sessionList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <h3>No sessions found</h3>
                    <p>Start your first deep work session to see your progress here.</p>
                </div>
            `;
            return;
        }

        this.sessionList.innerHTML = sessions.map(session => {
            const sessionDate = new Date(session.startTime);
            const duration = Math.floor((session.duration - (session.pausedTime || 0)) / 60000);
            const focusScore = Math.max(0, 100 - ((session.blockedAttempts || 0) * 5));
            const status = session.completed ? 'Completed' : 'Stopped';
            const statusClass = session.completed ? 'completed' : 'stopped';

            return `
                <div class="session-item">
                    <div class="session-info">
                        <div class="session-date">${sessionDate.toLocaleDateString()} at ${sessionDate.toLocaleTimeString()}</div>
                        <div class="session-goal">${session.goal || 'Deep Work Session'}</div>
                        <div class="session-duration">${duration} minutes • ${status}</div>
                    </div>
                    <div class="session-stats">
                        <div class="stat-item">
                            <span class="stat-value">${session.blockedAttempts || 0}</span>
                            <span class="stat-label">Blocked</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${focusScore}%</span>
                            <span class="stat-label">Focus</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateCharts(sessions) {
        // Simple chart implementation without external libraries
        this.updateFocusTimeChart(sessions);
        this.updateBlockedChart(sessions);
    }

    updateFocusTimeChart(sessions) {
        const ctx = this.focusChart.getContext('2d');
        const canvas = this.focusChart;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (sessions.length === 0) {
            this.drawEmptyChart(ctx, canvas, 'No focus time data available');
            return;
        }

        // Group sessions by day
        const dailyData = this.groupSessionsByDay(sessions);
        const days = Object.keys(dailyData).sort();
        const maxMinutes = Math.max(...Object.values(dailyData));

        // Draw chart
        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        const barWidth = chartWidth / days.length * 0.8;

        ctx.fillStyle = '#667eea';
        ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';

        days.forEach((day, index) => {
            const minutes = dailyData[day];
            const barHeight = (minutes / maxMinutes) * chartHeight;
            const x = padding + (index * chartWidth / days.length) + (chartWidth / days.length - barWidth) / 2;
            const y = padding + chartHeight - barHeight;

            // Draw bar
            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw label
            ctx.fillStyle = '#4a5568';
            ctx.textAlign = 'center';
            ctx.fillText(day, x + barWidth / 2, canvas.height - 10);
            ctx.fillStyle = '#667eea';
        });

        // Draw title
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Focus Time (minutes)', canvas.width / 2, 20);
    }

    updateBlockedChart(sessions) {
        const ctx = this.blockedChartCanvas.getContext('2d');
        const canvas = this.blockedChartCanvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (sessions.length === 0) {
            this.drawEmptyChart(ctx, canvas, 'No blocking data available');
            return;
        }

        // Group sessions by day
        const dailyData = this.groupSessionsByDay(sessions, 'blockedAttempts');
        const days = Object.keys(dailyData).sort();
        const maxBlocked = Math.max(...Object.values(dailyData));

        // Draw chart
        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        const barWidth = chartWidth / days.length * 0.8;

        ctx.fillStyle = '#f56565';
        ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';

        days.forEach((day, index) => {
            const blocked = dailyData[day];
            const barHeight = (blocked / maxBlocked) * chartHeight;
            const x = padding + (index * chartWidth / days.length) + (chartWidth / days.length - barWidth) / 2;
            const y = padding + chartHeight - barHeight;

            // Draw bar
            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw label
            ctx.fillStyle = '#4a5568';
            ctx.textAlign = 'center';
            ctx.fillText(day, x + barWidth / 2, canvas.height - 10);
            ctx.fillStyle = '#f56565';
        });

        // Draw title
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Distractions Blocked', canvas.width / 2, 20);
    }

    drawEmptyChart(ctx, canvas, message) {
        ctx.fillStyle = '#718096';
        ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    }

    groupSessionsByDay(sessions, field = 'duration') {
        const dailyData = {};
        
        sessions.forEach(session => {
            const date = new Date(session.startTime).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
            
            if (!dailyData[date]) {
                dailyData[date] = 0;
            }
            
            if (field === 'duration') {
                const minutes = Math.floor((session.duration - (session.pausedTime || 0)) / 60000);
                dailyData[date] += minutes;
            } else {
                dailyData[date] += session[field] || 0;
            }
        });
        
        return dailyData;
    }

    updateInsights(sessions) {
        if (sessions.length === 0) {
            this.insightsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💡</div>
                    <h3>No insights available</h3>
                    <p>Complete some deep work sessions to get personalized insights.</p>
                </div>
            `;
            return;
        }

        const insights = this.generateInsights(sessions);
        this.insightsList.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <div class="insight-icon">${insight.icon}</div>
                <div class="insight-content">
                    <h4>${insight.title}</h4>
                    <p>${insight.description}</p>
                </div>
            </div>
        `).join('');
    }

    generateInsights(sessions) {
        const insights = [];
        
        // Calculate total focus time
        const totalMinutes = sessions.reduce((total, session) => {
            const duration = session.duration - (session.pausedTime || 0);
            return total + Math.floor(duration / 60000);
        }, 0);

        // Calculate average session length
        const avgSessionLength = Math.round(totalMinutes / sessions.length);

        // Calculate total blocked attempts
        const totalBlocked = sessions.reduce((total, session) => {
            return total + (session.blockedAttempts || 0);
        }, 0);

        // Calculate average focus score
        const avgFocusScore = Math.round(sessions.reduce((total, session) => {
            const score = Math.max(0, 100 - ((session.blockedAttempts || 0) * 5));
            return total + score;
        }, 0) / sessions.length);

        // Generate insights based on data
        if (totalMinutes > 0) {
            insights.push({
                icon: '⏱️',
                title: 'Focus Time Achievement',
                description: `You've spent ${Math.floor(totalMinutes / 60)} hours and ${totalMinutes % 60} minutes in deep work sessions. Great job!`
            });
        }

        if (avgSessionLength > 45) {
            insights.push({
                icon: '🎯',
                title: 'Excellent Focus Duration',
                description: `Your average session length is ${avgSessionLength} minutes, which is excellent for deep work!`
            });
        } else if (avgSessionLength < 25) {
            insights.push({
                icon: '📈',
                title: 'Room for Improvement',
                description: `Your average session length is ${avgSessionLength} minutes. Try extending to 45+ minutes for better deep work results.`
            });
        }

        if (totalBlocked > 0) {
            insights.push({
                icon: '🚫',
                title: 'Distraction Management',
                description: `You've blocked ${totalBlocked} distraction attempts. The friction mechanism is working!`
            });
        }

        if (avgFocusScore > 80) {
            insights.push({
                icon: '🏆',
                title: 'High Focus Score',
                description: `Your average focus score is ${avgFocusScore}%. You're maintaining excellent focus during sessions!`
            });
        } else if (avgFocusScore < 60) {
            insights.push({
                icon: '💪',
                title: 'Focus Improvement',
                description: `Your average focus score is ${avgFocusScore}%. Try to minimize distractions to improve your focus.`
            });
        }

        // Add motivational insight
        if (sessions.length >= 7) {
            insights.push({
                icon: '🔥',
                title: 'Consistency Champion',
                description: `You've completed ${sessions.length} sessions! Consistency is key to building deep work habits.`
            });
        }

        return insights;
    }

    async exportReport(type) {
        try {
            let data, filename, title;
            
            switch (type) {
                case 'daily':
                    data = this.filterSessionsByPeriod(this.sessionHistory, 'today');
                    filename = `distraction-killer-daily-${new Date().toISOString().split('T')[0]}.json`;
                    title = 'Daily Deep Work Report';
                    break;
                case 'weekly':
                    data = this.filterSessionsByPeriod(this.sessionHistory, 'week');
                    filename = `distraction-killer-weekly-${this.getWeekNumber()}.json`;
                    title = 'Weekly Deep Work Report';
                    break;
                case 'all':
                default:
                    data = this.sessionHistory;
                    filename = `distraction-killer-all-data-${new Date().toISOString().split('T')[0]}.json`;
                    title = 'Complete Deep Work Report';
                    break;
            }

            const report = this.generateReport(data, title);
            this.downloadFile(JSON.stringify(report, null, 2), filename, 'application/json');
            
            this.showNotification(`${title} exported successfully!`, 'success');
        } catch (error) {
            console.error('Error exporting report:', error);
            this.showNotification('Failed to export report. Please try again.', 'error');
        }
    }

    generateReport(sessions, title) {
        const totalMinutes = sessions.reduce((total, session) => {
            const duration = session.duration - (session.pausedTime || 0);
            return total + Math.floor(duration / 60000);
        }, 0);

        const totalBlocked = sessions.reduce((total, session) => {
            return total + (session.blockedAttempts || 0);
        }, 0);

        const avgFocusScore = sessions.length > 0 
            ? Math.round(sessions.reduce((total, session) => {
                const score = Math.max(0, 100 - ((session.blockedAttempts || 0) * 5));
                return total + score;
            }, 0) / sessions.length)
            : 0;

        return {
            title,
            generatedAt: new Date().toISOString(),
            summary: {
                totalSessions: sessions.length,
                totalFocusTimeMinutes: totalMinutes,
                totalFocusTimeHours: Math.floor(totalMinutes / 60),
                totalDistractionsBlocked: totalBlocked,
                averageFocusScore: avgFocusScore
            },
            sessions: sessions.map(session => ({
                id: session.id,
                startTime: new Date(session.startTime).toISOString(),
                duration: session.duration,
                goal: session.goal,
                blockedAttempts: session.blockedAttempts || 0,
                completed: session.completed,
                focusScore: Math.max(0, 100 - ((session.blockedAttempts || 0) * 5))
            }))
        };
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    getWeekNumber() {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
        return Math.ceil((days + startOfYear.getDay() + 1) / 7);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                animation: slideIn 0.3s ease;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            .notification-success { background: #48bb78; }
            .notification-error { background: #f56565; }
            .notification-info { background: #4299e1; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, 4000);
    }
}

// Initialize reports when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DistractionKillerReports();
});
