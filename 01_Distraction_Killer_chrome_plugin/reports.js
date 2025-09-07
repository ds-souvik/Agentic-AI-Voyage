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
        // Calculate total focus time using the same logic as session list
        const totalMinutes = sessions.reduce((total, session) => {
            let actualDuration;
            if (session.completed) {
                // For completed sessions, use the full planned duration minus paused time
                actualDuration = Math.floor((session.duration - (session.pausedTime || 0)) / 60000);
            } else {
                // For stopped sessions, calculate from start to end time
                const endTime = session.endTime || Date.now();
                const totalElapsed = endTime - session.startTime;
                actualDuration = Math.floor((totalElapsed - (session.pausedTime || 0)) / 60000);
            }
            return total + actualDuration;
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
            const status = session.completed ? 'Completed' : 'Stopped';
            const statusClass = session.completed ? 'completed' : 'stopped';
            
            // Calculate planned duration (the original session length)
            const plannedDuration = Math.floor(session.duration / 60000);
            
            // Calculate actual duration (time actually worked)
            let actualDuration;
            if (session.completed) {
                // For completed sessions, use the full planned duration minus paused time
                actualDuration = Math.floor((session.duration - (session.pausedTime || 0)) / 60000);
            } else {
                // For stopped sessions, calculate from start to end time
                const endTime = session.endTime || Date.now();
                const totalElapsed = endTime - session.startTime;
                actualDuration = Math.floor((totalElapsed - (session.pausedTime || 0)) / 60000);
            }
            
            const focusScore = Math.max(0, 100 - ((session.blockedAttempts || 0) * 5));
            const completionRate = Math.round((actualDuration / plannedDuration) * 100);

            return `
                <div class="session-item">
                    <div class="session-info">
                        <div class="session-date">${sessionDate.toLocaleDateString()} at ${sessionDate.toLocaleTimeString()}</div>
                        <div class="session-goal">${session.goal || 'Deep Work Session'}</div>
                        <div class="session-duration">${actualDuration} ${actualDuration === 1 ? 'minute' : 'minutes'} • ${status}</div>
                        ${!session.completed ? `<div class="session-completion">Completed ${completionRate}% of planned time</div>` : ''}
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
                        <div class="stat-item">
                            <span class="stat-value">${this.formatTimeUnits(actualDuration)}/${this.formatTimeUnits(plannedDuration)}</span>
                            <span class="stat-label">Time Done</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    formatTimeUnits(minutes) {
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            if (remainingMinutes === 0) {
                return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
            } else {
                return `${hours}h ${remainingMinutes}m`;
            }
        } else {
            return `${minutes} ${minutes === 1 ? 'min' : 'min'}`;
        }
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
                let actualDuration;
                if (session.completed) {
                    // For completed sessions, use the full planned duration minus paused time
                    actualDuration = Math.floor((session.duration - (session.pausedTime || 0)) / 60000);
                } else {
                    // For stopped sessions, calculate from start to end time
                    const endTime = session.endTime || Date.now();
                    const totalElapsed = endTime - session.startTime;
                    actualDuration = Math.floor((totalElapsed - (session.pausedTime || 0)) / 60000);
                }
                dailyData[date] += actualDuration;
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
        
        // Calculate total focus time using consistent duration logic
        const totalMinutes = sessions.reduce((total, session) => {
            let actualDuration;
            if (session.completed) {
                // For completed sessions, use the full planned duration minus paused time
                actualDuration = Math.floor((session.duration - (session.pausedTime || 0)) / 60000);
            } else {
                // For stopped sessions, calculate from start to end time
                const endTime = session.endTime || Date.now();
                const totalElapsed = endTime - session.startTime;
                actualDuration = Math.floor((totalElapsed - (session.pausedTime || 0)) / 60000);
            }
            return total + actualDuration;
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

            // Analyze blocked site usage patterns
            const blockedSessions = sessions.filter(session => session.blockedAttempts > 0);
            const totalBlockedTime = blockedSessions.reduce((total, session) => {
                let actualDuration;
                if (session.completed) {
                    // For completed sessions, use the full planned duration minus paused time
                    actualDuration = Math.floor((session.duration - (session.pausedTime || 0)) / 60000);
                } else {
                    // For stopped sessions, calculate from start to end time
                    const endTime = session.endTime || Date.now();
                    const totalElapsed = endTime - session.startTime;
                    actualDuration = Math.floor((totalElapsed - (session.pausedTime || 0)) / 60000);
                }
                return total + actualDuration;
            }, 0);
            
            insights.push({
                icon: '📊',
                title: 'Blocked Site Usage Analysis',
                description: `Out of ${blockedSessions.length} sessions with blocked attempts, you still completed ${totalBlockedTime} minutes of focused work. Your resistance to distractions is building!`
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

        // Analyze completion rates
        const completedSessions = sessions.filter(session => session.completed);
        const stoppedSessions = sessions.filter(session => !session.completed);
        const completionRate = Math.round((completedSessions.length / sessions.length) * 100);

        if (stoppedSessions.length > 0) {
            const avgStoppedTime = Math.round(stoppedSessions.reduce((total, session) => {
                // For stopped sessions, calculate actual time from start to end
                const endTime = session.endTime || Date.now();
                const totalElapsed = endTime - session.startTime;
                const actualTime = Math.floor((totalElapsed - (session.pausedTime || 0)) / 60000);
                const plannedTime = Math.floor(session.duration / 60000);
                return total + (actualTime / plannedTime * 100);
            }, 0) / stoppedSessions.length);

            insights.push({
                icon: '⏱️',
                title: 'Session Completion Analysis',
                description: `You have a ${completionRate}% completion rate. When you stop early, you average ${avgStoppedTime}% of your planned time. Even partial sessions build focus!`
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
            let data, baseFilename, title;
            
            switch (type) {
                case 'daily':
                    data = this.filterSessionsByPeriod(this.sessionHistory, 'today');
                    baseFilename = `Distraction-Killer-Daily-${new Date().toISOString().split('T')[0]}`;
                    title = 'Daily Deep Work Report';
                    break;
                case 'weekly':
                    data = this.filterSessionsByPeriod(this.sessionHistory, 'week');
                    baseFilename = `Distraction-Killer-Weekly-Week${this.getWeekNumber()}`;
                    title = 'Weekly Deep Work Report';
                    break;
                case 'all':
                default:
                    data = this.sessionHistory;
                    baseFilename = `Distraction-Killer-Complete-${new Date().toISOString().split('T')[0]}`;
                    title = 'Complete Deep Work Report';
                    break;
            }

            // Generate both CSV and HTML reports
            await this.generateCSVReport(data, title, baseFilename);
            await this.generateHTMLReport(data, title, baseFilename);
            
            this.showNotification(`${title} exported as CSV and HTML!`, 'success');
        } catch (error) {
            console.error('Error exporting report:', error);
            this.showNotification('Failed to export report. Please try again.', 'error');
        }
    }

    generateCSVReport(sessions, title, baseFilename) {
        const csvHeaders = [
            'Date',
            'Start Time',
            'Duration (Minutes)',
            'Goal',
            'Completed',
            'Distractions Blocked',
            'Focus Score (%)',
            'Session Quality'
        ];

        const csvData = sessions.map(session => {
            const startDate = new Date(session.startTime);
            let actualDuration;
            if (session.completed) {
                // For completed sessions, use the full planned duration minus paused time
                actualDuration = Math.floor((session.duration - (session.pausedTime || 0)) / 60000);
            } else {
                // For stopped sessions, calculate from start to end time
                const endTime = session.endTime || Date.now();
                const totalElapsed = endTime - session.startTime;
                actualDuration = Math.floor((totalElapsed - (session.pausedTime || 0)) / 60000);
            }
            const focusScore = Math.max(0, 100 - ((session.blockedAttempts || 0) * 5));
            const quality = focusScore >= 90 ? 'Excellent' : 
                           focusScore >= 75 ? 'Good' : 
                           focusScore >= 60 ? 'Fair' : 'Needs Improvement';

            return [
                startDate.toLocaleDateString(),
                startDate.toLocaleTimeString(),
                actualDuration,
                session.goal || 'No specific goal',
                session.completed ? 'Yes' : 'No',
                session.blockedAttempts || 0,
                focusScore,
                quality
            ];
        });

        // Add summary row
        const totalMinutes = sessions.reduce((total, session) => {
            let actualDuration;
            if (session.completed) {
                // For completed sessions, use the full planned duration minus paused time
                actualDuration = Math.floor((session.duration - (session.pausedTime || 0)) / 60000);
            } else {
                // For stopped sessions, calculate from start to end time
                const endTime = session.endTime || Date.now();
                const totalElapsed = endTime - session.startTime;
                actualDuration = Math.floor((totalElapsed - (session.pausedTime || 0)) / 60000);
            }
            return total + actualDuration;
        }, 0);
        const totalBlocked = sessions.reduce((total, session) => {
            return total + (session.blockedAttempts || 0);
        }, 0);
        const avgFocusScore = sessions.length > 0 
            ? Math.round(sessions.reduce((total, session) => {
                const score = Math.max(0, 100 - ((session.blockedAttempts || 0) * 5));
                return total + score;
            }, 0) / sessions.length) : 0;

        csvData.unshift(['']); // Empty row
        csvData.unshift([
            'SUMMARY',
            `${sessions.length} sessions`,
            `${totalMinutes} total minutes`,
            `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
            `${sessions.filter(s => s.completed).length} completed`,
            `${totalBlocked} total blocked`,
            `${avgFocusScore}% average`,
            new Date().toLocaleDateString()
        ]);
        csvData.unshift(['']); // Empty row
        csvData.unshift(csvHeaders);

        const csvContent = csvData.map(row => 
            row.map(cell => `"${cell}"`).join(',')
        ).join('\n');

        this.downloadFile(csvContent, `${baseFilename}.csv`, 'text/csv');
    }

    generateHTMLReport(sessions, title, baseFilename) {
        const totalMinutes = sessions.reduce((total, session) => {
            let actualDuration;
            if (session.completed) {
                // For completed sessions, use the full planned duration minus paused time
                actualDuration = Math.floor((session.duration - (session.pausedTime || 0)) / 60000);
            } else {
                // For stopped sessions, calculate from start to end time
                const endTime = session.endTime || Date.now();
                const totalElapsed = endTime - session.startTime;
                actualDuration = Math.floor((totalElapsed - (session.pausedTime || 0)) / 60000);
            }
            return total + actualDuration;
        }, 0);
        const totalBlocked = sessions.reduce((total, session) => {
            return total + (session.blockedAttempts || 0);
        }, 0);
        const avgFocusScore = sessions.length > 0 
            ? Math.round(sessions.reduce((total, session) => {
                const score = Math.max(0, 100 - ((session.blockedAttempts || 0) * 5));
                return total + score;
            }, 0) / sessions.length) : 0;

        const dailyData = this.groupSessionsByDay(sessions);
        const chartData = Object.entries(dailyData).map(([date, minutes]) => ({
            date,
            minutes
        }));

        const htmlContent = this.generateHTMLTemplate(
            title,
            {
                totalSessions: sessions.length,
                totalFocusTime: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
                totalBlocked,
                avgFocusScore,
                completedSessions: sessions.filter(s => s.completed).length
            },
            sessions,
            chartData
        );

        this.downloadFile(htmlContent, `${baseFilename}.html`, 'text/html');
    }

    generateHTMLTemplate(title, summary, sessions, chartData) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Distraction Killer</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #2d3748;
            margin-bottom: 10px;
            font-size: 32px;
        }
        .header p {
            color: #718096;
            font-size: 16px;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .summary-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 24px;
            border-radius: 12px;
            text-align: center;
        }
        .summary-card h3 {
            font-size: 32px;
            margin-bottom: 8px;
            font-weight: 700;
        }
        .summary-card p {
            font-size: 14px;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .chart-container {
            background: #f7fafc;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 40px;
        }
        .chart-container h2 {
            color: #2d3748;
            margin-bottom: 20px;
            text-align: center;
        }
        .sessions-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .sessions-table th,
        .sessions-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        .sessions-table th {
            background: #f7fafc;
            font-weight: 600;
            color: #2d3748;
        }
        .status-completed { color: #48bb78; font-weight: 500; }
        .status-stopped { color: #f56565; font-weight: 500; }
        .score-excellent { color: #48bb78; font-weight: 600; }
        .score-good { color: #4299e1; font-weight: 600; }
        .score-fair { color: #ed8936; font-weight: 600; }
        .score-poor { color: #f56565; font-weight: 600; }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #718096;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 ${title}</h1>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>

        <div class="summary-grid">
            <div class="summary-card">
                <h3>${summary.totalSessions}</h3>
                <p>Total Sessions</p>
            </div>
            <div class="summary-card">
                <h3>${summary.totalFocusTime}</h3>
                <p>Focus Time</p>
            </div>
            <div class="summary-card">
                <h3>${summary.totalBlocked}</h3>
                <p>Distractions Blocked</p>
            </div>
            <div class="summary-card">
                <h3>${summary.avgFocusScore}%</h3>
                <p>Average Focus Score</p>
            </div>
        </div>

        <div class="chart-container">
            <h2>📈 Daily Focus Time Trend</h2>
            <canvas id="focusChart" width="400" height="200"></canvas>
        </div>

        <div class="chart-container">
            <h2>📊 Session Details</h2>
            <table class="sessions-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>Duration</th>
                        <th>Goal</th>
                        <th>Status</th>
                        <th>Blocked</th>
                        <th>Focus Score</th>
                    </tr>
                </thead>
                <tbody>
                    ${sessions.map(session => {
                        const startDate = new Date(session.startTime);
                        let actualDuration;
                        if (session.completed) {
                            // For completed sessions, use the full planned duration minus paused time
                            actualDuration = Math.floor((session.duration - (session.pausedTime || 0)) / 60000);
                        } else {
                            // For stopped sessions, calculate from start to end time
                            const endTime = session.endTime || Date.now();
                            const totalElapsed = endTime - session.startTime;
                            actualDuration = Math.floor((totalElapsed - (session.pausedTime || 0)) / 60000);
                        }
                        const focusScore = Math.max(0, 100 - ((session.blockedAttempts || 0) * 5));
                        const scoreClass = focusScore >= 90 ? 'score-excellent' : 
                                         focusScore >= 75 ? 'score-good' : 
                                         focusScore >= 60 ? 'score-fair' : 'score-poor';
                        const statusClass = session.completed ? 'status-completed' : 'status-stopped';
                        const statusText = session.completed ? 'Completed' : 'Stopped';

                        return `
                            <tr>
                                <td>${startDate.toLocaleDateString()}</td>
                                <td>${startDate.toLocaleTimeString()}</td>
                                <td>${actualDuration} min</td>
                                <td>${session.goal || 'No specific goal'}</td>
                                <td class="${statusClass}">${statusText}</td>
                                <td>${session.blockedAttempts || 0}</td>
                                <td class="${scoreClass}">${focusScore}%</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <div class="footer">
            <p>Generated by Distraction Killer - Deep Focus Assistant</p>
            <p>Keep up the great work! 🚀</p>
        </div>
    </div>

    <script>
        // Generate chart
        const ctx = document.getElementById('focusChart').getContext('2d');
        const chartData = ${JSON.stringify(chartData)};
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.map(d => d.date),
                datasets: [{
                    label: 'Focus Time (minutes)',
                    data: chartData.map(d => d.minutes),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Minutes'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    </script>
</body>
</html>`;
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
