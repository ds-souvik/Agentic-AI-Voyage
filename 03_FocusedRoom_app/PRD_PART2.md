# FOCUSED ROOM MOBILE APP - PRD (PART 2)

## 4.E PERSONALITY-DRIVEN PERSONALIZATION

### 4.E.1 Big Five Integration

**Integration Flow:**
1. User completes Big Five test on website (focusedroom.com)
2. Test results stored in backend database
3. User signs into mobile app with same account
4. App fetches Big Five scores via API
5. AI generates personalized recommendations

**Big Five Traits & Scores:**
- **Openness**: 0-100 score
- **Conscientiousness**: 0-100 score
- **Extraversion**: 0-100 score
- **Agreeableness**: 0-100 score
- **Neuroticism**: 0-100 score

**API Endpoint:**
```
GET /api/v1/user/personality
Response: {
  "scores": {
    "openness": 72.5,
    "conscientiousness": 65.0,
    "extraversion": 55.0,
    "agreeableness": 80.0,
    "neuroticism": 45.0
  },
  "percentiles": {...},
  "report_url": "https://..."
}
```

### 4.E.2 Customized Session Durations

**Recommendation Engine:**

**High Conscientiousness (70-100):**
- **Default Session**: 50 minutes
- **Rationale**: High conscientiousness correlates with better sustained attention
- **Suggestion**: "Your personality profile suggests you thrive in longer focus blocks. Try 50-minute sessions."

**Medium Conscientiousness (40-69):**
- **Default Session**: 35 minutes
- **Rationale**: Balance between challenge and achievability
- **Suggestion**: "Build up your focus muscle with 35-minute sessions"

**Low Conscientiousness (0-39):**
- **Default Session**: 25 minutes
- **Rationale**: Avoid overwhelming, build habit first
- **Suggestion**: "Start with 25-minute Pomodoros and gradually increase"

**High Openness (70-100):**
- **Warning**: "High Openness = rabbit hole risk. Block Reddit, YouTube?"
- **Session Variety**: Suggest varying session lengths to avoid boredom

**High Neuroticism (70-100):**
- **Shorter Sessions**: Default 25 min to reduce anxiety
- **More Breaks**: Suggest more frequent breaks
- **Stress Prompts**: "Take 3 deep breaths before starting"

**High Extraversion (70-100):**
- **Social Features**: Prompt to join accountability groups
- **Shorter Sessions**: May struggle with long solo work
- **Break Activities**: "Call a friend during your break"

**Low Extraversion (Introversion, 0-30):**
- **Longer Sessions**: Default 60 min (introverts thrive in solo deep work)
- **Solo Mode**: Emphasize private progress, not leaderboards

### 4.E.3 App Blocking Recommendations

**Personalized Blocklist Suggestions:**

**High Openness:**
- **Apps**: Reddit, YouTube, Wikipedia, Twitter
- **Reason**: "You love learning and exploring. These apps can send you down endless rabbit holes."
- **Message**: "Block these curiosity traps during focus time. Explore them guilt-free during breaks."

**High Neuroticism:**
- **Apps**: News apps, Twitter, Reddit
- **Reason**: "High Neuroticism = anxiety triggers from news/social media"
- **Message**: "Protect your mental health by blocking anxiety-inducing apps"

**High Extraversion:**
- **Apps**: All social media, messaging apps (WhatsApp, Discord, Snapchat)
- **Reason**: "You love connecting with people. These apps are your biggest distraction."
- **Message**: "Block social apps during focus time. Catch up with friends during breaks."

**Low Conscientiousness:**
- **Apps**: Games, entertainment apps, short-form video (TikTok, Reels)
- **Reason**: "Build discipline by blocking instant gratification apps"
- **Message**: "These apps are designed to be addictive. Block them to build your focus muscle."

**AI-Powered Suggestions:**
- **Usage Pattern Analysis**: "You open Instagram 40 times/day. Your Openness score (85) suggests you're curious. Block Instagram to avoid endless scroll."
- **Failure Pattern Analysis**: "You've overridden Instagram blocks 15 times this week. Need harder friction?"

### 4.E.4 Stress Management Prompts (High Neuroticism)

**For Users with Neuroticism Score 70-100:**

**Pre-Session Prompts:**
- "Before starting, take 3 deep breaths. You got this."
- "Remember: Progress, not perfection."
- "25 minutes is all you need. One step at a time."

**During Session:**
- "10 minutes down! You're doing great."
- "Feeling anxious? That's normal. Breathe and continue."

**Post-Session:**
- "You completed a session despite the discomfort. That's growth."
- "Celebrate this win. You're building resilience."

**Break Suggestions:**
- "Take a walk outside. Nature reduces anxiety."
- "Practice 4-7-8 breathing technique"
- "Call a supportive friend"

**Gemini AI Integration:**
- Generate personalized affirmations based on user's specific personality
- "Based on your Neuroticism (75) and Conscientiousness (60), you tend to worry about performance. Remember: consistent effort matters more than perfect results."

### 4.E.5 Social Accountability Features (High Extraversion)

**For Users with Extraversion Score 70-100:**

**Accountability Partners:**
- **Feature**: Match with another user as accountability partners
- **Functionality**: 
  - See each other's daily progress
  - Send encouragement messages
  - Compete on weekly goals
- **Prompt**: "You're highly extraverted! Want to find an accountability partner?"

**Co-Working Sessions:**
- **Feature**: Join virtual "focus rooms" with other users
- **Functionality**:
  - See how many people are currently in a session
  - Optional video call for co-working
  - Group chat during breaks
- **Prompt**: "12 people are focusing right now. Join them?"

**Community Challenges:**
- **Feature**: Join weekly/monthly challenges
- **Examples**:
  - "100 Hours in October" (complete 100 hours of focus time)
  - "30-Day Streak Challenge"
  - "Early Bird Challenge" (10 morning sessions)
- **Prompt**: "Looking for motivation? Join this week's challenge!"

**Social Sharing Prompts:**
- "Share your 7-day streak on social media?"
- "Your friends would love to see your progress!"

### 4.E.6 Content Personalization

**Blog Article Recommendations:**

**High Openness:**
- Articles about: Learning techniques, creativity, exploring new topics
- Examples: "How Curiosity Can Hurt Productivity", "Channeling Openness into Deep Work"

**High Conscientiousness:**
- Articles about: Systems, routines, optimization
- Examples: "The Perfect Morning Routine", "Building Unbreakable Habits"

**High Neuroticism:**
- Articles about: Stress management, anxiety reduction, self-compassion
- Examples: "Deep Work for Anxious Minds", "Self-Compassion in Productivity"

**High Extraversion:**
- Articles about: Social accountability, group productivity, networking
- Examples: "The Power of Accountability Partners", "Productive Collaboration"

**Low Conscientiousness:**
- Articles about: Starting small, building momentum, quick wins
- Examples: "The 2-Minute Rule", "Tiny Habits for Focus"

**In-App Display:**
- **Home Screen Section**: "Recommended for You"
- **Push Notifications**: "New article perfect for your personality: [Title]"
- **After Session**: "Great session! Read this: [Article]"

---

## 4.F COMPREHENSIVE REPORTING & ANALYTICS

### 4.F.1 Daily Reports

**Metrics:**
- **Total Focus Time**: "3h 45min focused today"
- **Sessions Completed**: "5 sessions (4 valid, 1 invalid)"
- **Points Earned**: "+87 points today"
- **Current Streak**: "12 days 🔥"
- **Distraction Attempts**: "8 blocked attempts"
- **Override Count**: "2 overrides (Instagram, TikTok)"
- **Most Productive Hour**: "10-11am (2 sessions, 0 attempts)"

**Visualizations:**
- **Time Chart**: Bar chart showing focus time per hour
- **Session Quality**: Pie chart (valid vs invalid sessions)
- **App Attempts**: Bar chart showing most-attempted apps

**Comparisons:**
- **vs Yesterday**: "↑ 45min more focus time than yesterday"
- **vs Last Week**: "↑ 12% improvement from last week"
- **vs Your Average**: "↑ Above your 30-day average by 23%"

**UI/UX:**
- **Quick View**: Card on home screen with key metrics
- **Detailed View**: Tap card → Full report page
- **Share Button**: Share daily report as image

### 4.F.2 Weekly Reports

**Metrics:**
- **Total Focus Time**: "18h 30min this week"
- **Total Sessions**: "23 sessions (20 valid, 3 invalid)"
- **Points Earned**: "+412 points this week"
- **Streak Progress**: "7/7 days with valid sessions ⭐"
- **Total Distractions**: "47 blocked attempts, 12 overrides"
- **Top Distraction Apps**: "Instagram (15), TikTok (12), YouTube (8)"
- **Best Day**: "Wednesday: 4h 15min, +95 pts"
- **Leaderboard Rank**: "#234 globally (↑ 47 from last week)"

**Visualizations:**
- **Weekly Trend**: Line chart showing daily focus time
- **Session Heatmap**: Calendar view with color intensity
- **App Breakdown**: Donut chart of time by app category
- **Points Flow**: Waterfall chart showing point gains/losses

**Insights (AI-Generated via Gemini):**
- "Your focus peaks on Tuesday-Thursday. Schedule deep work then."
- "Instagram is your #1 distraction. Consider blocking it permanently."
- "You completed 12% more sessions than last week. Keep it up!"

**Weekly Email:**
- **Opt-In**: User can receive weekly summary email
- **Contents**: Same metrics as in-app report + motivational message
- **Personalization**: Based on personality + progress

### 4.F.3 Monthly Reports

**Metrics:**
- **Total Focus Time**: "72h 45min this month"
- **Total Sessions**: "94 sessions (85 valid, 9 invalid)"
- **Points Earned**: "+1,847 points this month"
- **Longest Streak**: "15 days"
- **Level Progress**: "Started: Task Tamer, Now: Flow Initiate"
- **Achievements Unlocked**: "3 new badges this month"
- **Total Distractions Blocked**: "184 attempts prevented"
- **Productivity Score**: "87/100 (Excellent)"

**Year-Over-Year:**
- **Lifetime Focus Time**: "412 hours since joining"
- **Total Points**: "8,234 points (Discipline Architect level)"
- **All-Time Streak**: "45 days (longest ever)"

**Visualizations:**
- **Monthly Trends**: Multi-line chart (focus time, points, sessions)
- **Progress Spider Chart**: Radar chart comparing 5 metrics
- **Level Timeline**: Visual journey through levels achieved

**Insights (AI-Generated):**
- "Your focus time increased 34% this month. You're building a real habit!"
- "You're in the top 15% of all users. Incredible work!"
- "At this rate, you'll reach Zen Practitioner in 2 months."

### 4.F.4 Visual Progress Tracking

**Points Chart:**
- Line chart: Points over time (daily, weekly, monthly views)
- Milestone markers: Level-up events
- Color-coded: Green (positive days), red (negative days)

**Level Progress:**
- Progress bar: Current points vs next level
- "523 / 1000 pts to Rhythm Keeper"
- Visual badge: Current level badge with glow effect

**Streak Calendar:**
- Month view: Each day colored by session status
  - Green: Valid session completed
  - Yellow: Session completed but invalid
  - Gray: No session
  - Red: Streak broken
- Tap day: See that day's details

**Category Breakdown:**
- Donut chart: Time saved by blocking each category
- "Social Media: 47h saved this month"
- "Entertainment: 23h saved"

### 4.F.5 Trend Analysis

**AI-Powered Insights:**

**Pattern Recognition:**
- "You focus best 9-11am. Schedule deep work then."
- "Friday productivity drops 40%. Need accountability?"
- "After 90 minutes, your attempt rate doubles. Take breaks."

**Prediction:**
- "At your current pace, you'll hit 10,000 points in 45 days"
- "Your streak is at risk. Complete a session today!"

**Recommendations:**
- "Consider blocking YouTube on weekends. 80% of your weekend overrides are YouTube."
- "Your invalid session rate is 15%. Focus on quality over quantity."

**Personality-Driven Analysis:**
- "High Openness users average 12 attempts/week. You're at 8. Great self-control!"
- "Your conscientiousness score (65) suggests you can handle longer sessions. Try 60 minutes."

### 4.F.6 Export Options

**CSV Export:**
- **Contents**: All session data
- **Fields**: Date, Start Time, Duration, Goal, Valid/Invalid, Points, Attempts, Overrides, Level
- **Use Case**: Personal analysis, import into Excel/Sheets

**PDF Report:**
- **Contents**: Formatted report with charts and insights
- **Sections**: Summary, Daily Breakdown, Weekly Trends, Achievements
- **Use Case**: Share with accountability partner, therapist, coach

**JSON Export:**
- **Contents**: Raw data in JSON format
- **Use Case**: Developers, data scientists, API integrations

**Export Triggers:**
- **Settings Menu**: "Export My Data"
- **Reports Page**: "Download Report" button
- **Email**: "Email me my weekly report every Monday"

### 4.F.7 Cross-Device Dashboard

**Web Dashboard** (focusedroom.com/dashboard):
- **Purpose**: Unified view of productivity across all devices
- **Sections**:
  - **Overview**: Total stats (mobile + desktop)
  - **Device Breakdown**: Mobile vs Desktop focus time
  - **Session History**: All sessions across devices
  - **Sync Status**: "Last synced: 2 minutes ago"

**Mobile Dashboard:**
- **Home Screen Widget**: Today's stats at a glance
- **App Home**: Focus time, points, streak prominently displayed
- **Quick Actions**: Start session, view report, check leaderboard

**Desktop Dashboard** (Chrome Extension):
- **Popup View**: Similar to mobile home screen
- **Reports Tab**: Link to web dashboard

**Sync Indicators:**
- **Real-Time Sync**: "Synced" badge when data is up-to-date
- **Sync Lag**: "Syncing..." if delayed
- **Offline Mode**: "Offline - will sync when connected"

---

## 4.G CROSS-PLATFORM SYNCHRONIZATION

### 4.G.1 User Account System

**Authentication Methods:**
- **Email + Password**: Traditional sign-up
- **Google OAuth**: "Sign in with Google"
- **Apple Sign-In**: "Sign in with Apple" (iOS)
- **Magic Link**: Passwordless email link

**Account Linking:**
1. User creates account on website (Big Five test)
2. User installs mobile app
3. User signs in with same credentials
4. App automatically links to web account
5. All data syncs

**Security:**
- **Password Requirements**: Min 8 characters, 1 uppercase, 1 number
- **2FA (Optional)**: Two-factor authentication for security-conscious users
- **Biometric Login**: Face ID, Touch ID for mobile
- **Session Management**: Logout on all devices option

### 4.G.2 Data Synchronization

**What Syncs:**
- **Session Data**: All sessions (start time, duration, goal, valid/invalid, points)
- **Gamification Progress**: Total points, level, streaks, badges
- **Blocklists**: Custom blocked apps/websites
- **Settings**: Category toggles, friction settings, theme preference
- **Big Five Results**: Personality scores and report
- **User Profile**: Name, avatar, bio

**Sync Architecture:**

**Backend (Node.js + PostgreSQL):**
- **API**: RESTful API with WebSocket support
- **Database**: PostgreSQL for relational data (users, sessions, scores)
- **Real-Time**: Firebase Cloud Messaging or Pusher for live updates
- **Storage**: AWS S3 for user avatars, report PDFs

**Sync Strategies:**

**1. Real-Time Sync (via WebSocket):**
- **Trigger**: Session start/stop, point change, level up
- **Latency**: <1 second
- **Use Case**: Cross-device session sync

**2. Periodic Sync (via API Polling):**
- **Frequency**: Every 30 seconds when app is active
- **Trigger**: App foreground, manual refresh
- **Use Case**: Check for updates from other devices

**3. On-Demand Sync:**
- **Trigger**: User taps "Refresh" button
- **Use Case**: Force sync when needed

**4. Background Sync:**
- **iOS**: Background fetch every 15 minutes (system-controlled)
- **Android**: WorkManager for periodic background sync
- **Use Case**: Keep data fresh even when app closed

**Conflict Resolution:**
- **Last Write Wins**: If same data edited on two devices, most recent wins
- **Merge Strategy**: For session data, append both (no conflicts possible)
- **User Prompt**: If critical conflict (e.g., two sessions at same time), ask user

### 4.G.3 Offline Mode

**Offline Capabilities:**
- **Start Session**: Works fully offline (stored locally)
- **View Reports**: Last synced data available
- **Modify Settings**: Changes queued for sync
- **Blocked Apps**: Blocking works offline (no server needed)

**Sync Queue:**
- **Queue System**: All offline actions stored in queue
- **Auto-Sync**: When connection restored, queue processes automatically
- **Conflict Handling**: Server adjudicates any conflicts

**UI Indicators:**
- **Offline Badge**: "Offline Mode" banner at top
- **Sync Status**: "Pending sync: 3 sessions"
- **Connection Restored**: "Connection restored. Syncing..."

### 4.G.4 Cross-Device Features

**Session Handoff:**
- **Scenario**: User starts session on mobile, switches to desktop
- **Implementation**: 
  1. Mobile session syncs to server via WebSocket
  2. Desktop extension receives session update
  3. Desktop asks: "Continue session from mobile?"
  4. User confirms → Desktop joins session
  5. Both devices now in sync

**Multi-Device Blocking:**
- **Scenario**: User starts session on desktop
- **Result**: Mobile app automatically blocks distracting apps
- **Benefit**: Can't cheat by switching devices

**Universal Settings:**
- Change settings on any device → Applied everywhere
- Example: Block Instagram on mobile → Also blocked in Chrome extension

**Unified Notifications:**
- **Smart Notifications**: Don't duplicate (e.g., don't notify on both devices simultaneously)
- **Device Priority**: Notify on device currently in use

---

## 4.H SETTINGS & CUSTOMIZATION

### 4.H.1 Blocking Settings

**Category Management:**
- **Toggle Categories**: On/off switches for each of 6 categories
- **View Apps**: Tap category → See all apps in category
- **Individual Toggles**: Within category, toggle specific apps

**Custom Blocklists:**
- **Add App**: Search installed apps → Tap to add
- **Remove App**: Swipe to delete from blocklist
- **Import from Usage**: "Block my top 10 most-used apps"
- **Manual Entry**: Type app name (for apps not installed)

**Smart Suggestions:**
- **AI Recommendations**: "Based on your usage, block these 5 apps?"
- **Personality-Based**: "High Openness? Block Reddit to avoid rabbit holes"

**Whitelist:**
- **Add to Whitelist**: Mark apps as "Never Block" (e.g., work apps)
- **Session-Specific**: "Allow WhatsApp for this session only"

### 4.H.2 Friction Settings

**Typing Challenge:**
- **Difficulty**: Easy (30 chars), Medium (60 chars), Hard (90 chars)
- **Custom Message**: Write your own shame message (max 200 chars)
- **Preview**: See what challenge looks like before starting session

**Mindful Pause:**
- **Duration**: 10 seconds, 20 seconds, 30 seconds
- **Breathing Exercise**: On/off toggle
- **Sound**: Enable/disable breathing guidance audio

**Reflection Prompts:**
- **Enable/Disable**: Turn reflection prompts on or off
- **Frequency**: Show prompts: Always, Sometimes (50%), Rarely (20%)

**Adaptive Friction:**
- **Learn from Me**: AI adjusts friction based on my override patterns
- **Manual Override**: Force specific friction type for specific apps

### 4.H.3 Session Settings

**Default Duration:**
- **Pomodoro**: 25 min (default)
- **Custom**: Set your own default (5 min - 8 hours)
- **Smart Default**: Let AI choose based on personality + history

**Break Settings:**
- **Short Break**: 5 min (default), 3 min, 10 min
- **Long Break**: 15 min (default), 10 min, 20 min, 30 min
- **Auto-Resume**: Automatically resume after break (on/off)

**Session Goals:**
- **Require Goal**: Force user to enter goal before starting session
- **Goal Suggestions**: AI suggests goals based on time of day, history

**Notifications:**
- **Milestone Alerts**: "10 minutes done!", "Halfway there!"
- **Frequency**: Every 10 min, Every 25 min, Off
- **Completion Sound**: On/off

### 4.H.4 Theme & Appearance

**Theme Options:**
- **Light Mode**: Default light theme
- **Dark Mode**: OLED-friendly dark theme
- **Auto**: Follow system settings
- **Schedule**: Dark mode 8pm-7am, Light mode otherwise

**Color Customization:**
- **Primary Color**: Choose from 5 preset colors (Teal, Blue, Purple, Green, Red)
- **Advanced**: Full color picker for power users (requires Pro)

**Font Size:**
- **Small**: For those with good eyesight
- **Medium**: Default
- **Large**: Accessibility (easier to read)
- **Extra Large**: Maximum accessibility

**Animations:**
- **Full**: All animations enabled
- **Reduced**: Minimal animations (respects system settings)
- **Off**: No animations (performance mode)

### 4.H.5 Notification Settings

**Push Notifications:**
- **Session Reminders**: "Time for your daily focus session!"
- **Streak Reminders**: "Don't break your 12-day streak!"
- **Level Up**: "🎉 You leveled up!"
- **Achievement Unlocked**: "New badge: Week Warrior"
- **Weekly Report**: "Your weekly report is ready"

**Granular Control:**
- Toggle each notification type on/off
- **Quiet Hours**: No notifications 10pm-8am
- **Do Not Disturb**: Respect phone's DND mode

**In-App Alerts:**
- **Distraction Attempts**: Alert when trying to open blocked app
- **Session Milestones**: "10 minutes done!"
- **Break Time**: "Time for a break"

### 4.H.6 Privacy & Security

**Data Collection:**
- **Analytics**: On/off (Opt-in for usage analytics to improve app)
- **Personalization**: On/off (Disable AI recommendations if desired)
- **Crash Reports**: On/off (Help fix bugs)

**Account Management:**
- **Change Password**
- **Enable 2FA**
- **Linked Accounts**: View/unlink Google, Apple accounts
- **Delete Account**: Permanent deletion (cannot be undone)

**Data Export:**
- **Download My Data**: Export all data as ZIP file
- **Data Portability**: GDPR-compliant data export

**Permissions:**
- **Screen Time**: Manage iOS Screen Time permissions
- **Accessibility**: Manage Android Accessibility permissions
- **Notifications**: Manage notification permissions

### 4.H.7 Advanced Settings

**Developer Mode (Hidden):**
- **Debug Logs**: Enable detailed logging
- **API Endpoint**: Switch between production/staging
- **Force Sync**: Manually trigger sync
- **Clear Cache**: Clear local cache

**Experimental Features:**
- **Beta Features**: Opt-in to test new features
- **AI Coaching**: (Future) AI-powered focus coach
- **Community Features**: (Future) Accountability groups

**App Behavior:**
- **Battery Optimization**: Aggressive, Balanced, Performance
- **Data Usage**: Wi-Fi only sync, or allow cellular
- **Storage Management**: Auto-delete old sessions (>1 year)

---

## 4.J SOCIAL & COMMUNITY FEATURES

**📖 Complete Specification**: See **[PRD_COMMUNITY_FEATURES.md](./PRD_COMMUNITY_FEATURES.md)** for full details.

**Priority**: Phase 2-4 (Post-MVP, but architected now)  
**Vision**: Transform Focused Room into a thriving social productivity ecosystem where users connect, compete, and grow together.

### Quick Overview

**Core Social Features:**
- ✅ **Friends System**: Connect with accountability partners, see real-time progress
- ✅ **Accountability Pods**: Small groups (2-8 people) with daily check-ins
- ✅ **Communities**: Join niche groups (Medical Students, Developers, Writers, etc.)
- ✅ **Social Challenges**: Compete with friends, pods, or globally
- ✅ **Enhanced Leaderboards**: Global, friends, pods, communities, local
- ✅ **Real-Time Feed**: Celebrate friends' wins, milestones, level-ups
- ✅ **Social Sharing**: Auto-generated profile cards with stats

**Key Insight**: Research shows **65% higher goal achievement** with accountability partners. Social features will:
- Increase retention by **2-3x**
- Drive viral growth (**5x** referrals)
- Boost conversion by **1.5x** (social users convert more)

**Privacy-First**: Granular controls per stat, opt-in social features, block/report tools.

**Rollout**: Phase 2 (Friends & Pods) → Phase 3 (Communities) → Phase 4 (Advanced Social)

👉 **Read PRD_COMMUNITY_FEATURES.md for complete specifications, UI flows, database schema, and API endpoints.**

---

*[CONTINUED IN NEXT FILE: PRD_PART3.md]*

