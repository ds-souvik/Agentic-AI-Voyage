# 🎯 FOCUSED ROOM MOBILE APP - PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Version**: 1.0.0  
**Status**: APPROVED - Ready for Development  
**Created**: October 15, 2025  
**Product Owner**: Souvik Ganguly  
**Target Platforms**: iOS & Android (React Native)  
**Expected Launch**: Q2 2026

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Goals](#2-product-vision--goals)
3. [Target Audience](#3-target-audience)
4. [Key Features](#4-key-features-detailed-specification)
5. [User Experience (UX) & User Interface (UI)](#5-user-experience-ux--user-interface-ui)
6. [Technical Requirements](#6-technical-requirements)
7. [Monetization Strategy](#7-monetization-strategy)
8. [Success Metrics & KPIs](#8-success-metrics--kpis)
9. [Phased Rollout Plan](#9-phased-rollout-plan)
10. [Open Questions & Future Considerations](#10-open-questions--future-considerations)

---

## 1. EXECUTIVE SUMMARY

### 1.1 Product Purpose

The **Focused Room Mobile App** is a revolutionary productivity application designed to help individuals reclaim their attention, build deep work habits, and achieve their goals in an era of unprecedented digital distraction. It is the mobile-first expansion of the Focused Room ecosystem, which currently includes a Chrome extension and a personality-driven web platform.

### 1.2 Target Audience

**Primary Users:**
- Students (high school, college, graduate) struggling with phone distractions while studying
- Professionals (knowledge workers, creatives, developers) seeking to maximize productivity
- Entrepreneurs and creators who need extended focus sessions to build their ventures

**Secondary Users:**
- Parents wanting to help their children develop healthy phone habits
- Anyone experiencing phone addiction or seeking digital wellness

### 1.3 Key Value Proposition

**"The only productivity app that fights fire with fire—using behavioral psychology, AI-powered personalization, and adaptive friction to help you build unbreakable focus habits across all your devices."**

**Unique Differentiators:**
1. **Personality-Driven**: Integrates Big Five personality test results for truly personalized recommendations
2. **Friction, Not Restriction**: Innovative friction mechanism that makes users conscious without frustrating them
3. **Cross-Platform Ecosystem**: Seamless sync between mobile app, Chrome extension, and web platform
4. **Gamification That Works**: 20-level progression system with streaks, achievements, and social sharing
5. **Privacy-First**: All sensitive data stays on device, no selling user attention data
6. **Science-Backed**: Built on cognitive behavioral psychology and behavioral science research

### 1.4 Success Vision

**By Q4 2026:**
- 100,000+ active users across iOS and Android
- 4.5+ star rating on App Store and Google Play
- Average user increases deep work time by 2+ hours per day
- 40%+ of users complete onboarding and schedule their first deep work session
- Top 10 productivity app in both stores

---

## 2. PRODUCT VISION & GOALS

### 2.1 Ecosystem Vision

The Focused Room ecosystem operates on three core pillars:

```
┌─────────────────────────────────────────────────────────────┐
│                    FOCUSED ROOM ECOSYSTEM                    │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   PILLAR 1   │  │   PILLAR 2   │  │   PILLAR 3   │      │
│  │              │  │              │  │              │      │
│  │  UNDERSTAND  │  │   PROTECT    │  │    GROW      │      │
│  │     SELF     │  │     FOCUS    │  │ ONE STEP AT  │      │
│  │              │  │              │  │     A TIME   │      │
│  │  Big Five    │  │  Distraction │  │   Weekly     │      │
│  │  Personality │  │  Blocker     │  │  Articles &  │      │
│  │     Test     │  │  Ecosystem   │  │  Newsletter  │      │
│  │              │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ↓                  ↓                  ↓             │
│     FOUNDATION       IMPLEMENTATION      SUSTAINED GROWTH   │
└─────────────────────────────────────────────────────────────┘
```

**The mobile app is the CORE of Pillar 2**, bringing comprehensive distraction protection to where it matters most—the device people use 70% of their digital time.

### 2.2 Product Goals

**Primary Goals:**
1. **Increase Daily Focused Time**: Help users achieve 3+ hours of deep work per day
2. **Reduce Phone Distractions**: Decrease distracting app opens by 60%+
3. **Drive Habit Formation**: 30-day retention rate of 50%+
4. **Enable Cross-Device Productivity**: Seamless experience across phone, tablet, and desktop
5. **Build Viral Growth**: Social sharing and leaderboards drive organic user acquisition

**Secondary Goals:**
1. Become the #1 productivity app in App Store and Google Play
2. Generate actionable insights from user behavior to improve the ecosystem
3. Create a community of focused, high-achievers
4. Establish Focused Room as the global standard for attention management

### 2.3 Problem Statement

**The Crisis:**
- Average person checks phone **96 times per day**
- **3+ hours** spent on social media daily
- Task switching every **3 minutes**
- **2.5 hours** lost daily to digital distractions
- 70% of internet time is on mobile devices

**Existing Solutions Fail Because:**
- Too easy to bypass (one button to disable)
- All-or-nothing approach (frustrating hard blocks)
- No behavior change (users just uninstall)
- No personalization (one-size-fits-all)
- Desktop-only (missing where distraction happens most)

**Our Solution:**
The Focused Room Mobile App uses **adaptive friction**, **personality-driven personalization**, **gamification**, and **cross-platform sync** to create sustainable behavior change, not temporary restriction.

---

## 3. TARGET AUDIENCE

### 3.1 Primary User Personas

#### Persona 1: "Sarah the Student" (Age 19-25)
**Background:**
- College student majoring in Computer Science
- Struggles to study for 3+ hour periods
- Gets distracted by Instagram, TikTok, and Snapchat every 15 minutes
- Has big career ambitions but feels overwhelmed

**Pain Points:**
- Can't resist phone during study sessions
- FOMO when blocking social media completely
- Feels guilty after wasting 2 hours scrolling
- Poor grades despite high intelligence

**Goals:**
- Study for 4-6 hours per day
- Stop checking phone every 10 minutes
- Maintain social life without letting it dominate
- Get better grades and feel accomplished

**How Focused Room Helps:**
- App-level blocking during study sessions
- Friction override allows emergency access without frustration
- Gamification makes studying feel like a game with rewards
- Personality-driven recommendations optimize her study schedule
- Streaks motivate her to maintain consistency

#### Persona 2: "David the Developer" (Age 26-35)
**Background:**
- Software developer at a startup
- Needs 4+ hour deep work blocks for complex coding
- Constantly interrupted by Slack, email, Twitter
- Side project he never has time to work on

**Pain Points:**
- Context switching kills productivity
- Phone distractions break flow state
- Works 10 hours but only 4 are productive
- Dreams slipping away due to lack of focused time

**Goals:**
- 3-4 hour uninterrupted coding sessions
- Ship side project in 6 months
- Work 6 productive hours instead of 10 distracted ones
- Feel less stressed and more accomplished

**How Focused Room Helps:**
- Blocks all distracting apps during deep work sessions
- Cross-device sync: desktop extension + mobile app work together
- Detailed analytics show productivity improvement
- Streaks and levels gamify the process
- AI suggestions based on personality optimize his schedule

#### Persona 3: "Maria the Manager" (Age 30-45)
**Background:**
- Marketing manager at mid-size company
- Needs focus for strategy work but constantly interrupted
- Phone is both a tool and a distraction
- Wants to advance career but feels stuck

**Pain Points:**
- Can't say "no" to notifications
- Scrolls LinkedIn/Instagram during work
- Takes work home but never gets to it
- Feels burned out but not accomplished

**Goals:**
- 2-3 hour strategic thinking blocks
- Stop reactive mode, become proactive
- Advance to director level
- Better work-life balance

**How Focused Room Helps:**
- Schedule-based automatic blocking
- Whitelist work apps (Slack, Email) while blocking social
- Reports show tangible productivity gains to justify focus time
- Personality insights help her understand her work style
- Achievement system provides dopamine previously from phone

### 3.2 Secondary Personas

#### Persona 4: "Parent Patricia" (Age 35-50)
- Concerned about teenager's phone addiction
- Wants tools to help child develop healthy habits
- Needs parental controls with educational component

#### Persona 5: "Entrepreneur Eric" (Age 22-40)
- Building a startup, time is money
- Needs maximum productivity with limited hours
- Phone is both essential tool and biggest distraction
- Wants to optimize every hour

### 3.3 User Demographics

**Age**: 16-45 (primary), 45+ (secondary)  
**Education**: High school to postgraduate  
**Income**: $0 (students) to $150K+ (professionals)  
**Tech Savviness**: Medium to high  
**Geography**: Global, initially US, India, Europe  
**Device**: iOS and Android smartphones, tablets

---

## 4. KEY FEATURES (DETAILED SPECIFICATION)

### 4.A APP-LEVEL BLOCKING

#### 4.A.1 Core Functionality

**Objective**: Block distracting applications on iOS and Android during scheduled focus sessions or on-demand.

**Technical Implementation:**

**iOS:**
- **Screen Time API**: Use `FamilyControls` and `ManagedSettings` frameworks
- **App Extensions**: Create App Extension to monitor and block app launches
- **Restrictions**: Block app launching, hide app icons (optional), gray out apps
- **Limitations**: iOS 15+ required, user must grant permissions

**Android:**
- **UsageStatsManager API**: Monitor app usage and launches
- **AccessibilityService**: Detect app launches and overlay blocking screen
- **DeviceAdminReceiver**: For enterprise/parental control features
- **Foreground Service**: Maintain persistent blocking even when app is backgrounded

**Blocking Behavior:**
1. User schedules deep work session or enables blocking
2. System monitors for launch of blocked apps
3. When blocked app is launched:
   - App launch is intercepted
   - User redirected to **Friction Override Screen** (see Section 4.B)
   - Session timer and motivational message displayed
4. If user passes friction challenge, temporary access granted
5. All attempts logged for gamification and analytics

#### 4.A.2 Blocklist Management

**Pre-Defined Categories** (sourced from Chrome extension blocklists):

1. **Social Media** (porn_blocklist.json → convert to apps)
   - Instagram, TikTok, Facebook, Snapchat, Twitter/X, Reddit, Discord, BeReal, etc.
   - ~50+ popular social media apps

2. **Entertainment**
   - YouTube, Netflix, Disney+, Hulu, Spotify, Twitch, Prime Video, etc.
   - ~40+ streaming and entertainment apps

3. **News & Media**
   - CNN, BBC News, Reddit News, Apple News, Flipboard, etc.
   - ~30+ news apps

4. **Shopping**
   - Amazon, eBay, Alibaba, Walmart, Target, Etsy, Shein, etc.
   - ~35+ shopping apps

5. **Adult Content**
   - Browser-based access to adult sites
   - Adult content apps (requires careful implementation for app store approval)
   - ~20+ entries

6. **Games**
   - Mobile games (Candy Crush, PUBG, Call of Duty Mobile, etc.)
   - Gambling apps
   - ~50+ popular games

**UI/UX:**
- **Category Toggle Screen**: List all categories with on/off toggles
- **App Count Badge**: Show "42 apps" next to each category
- **Quick Setup**: "Block All Distracting Apps" preset
- **Search**: Find specific apps quickly

**Custom Blocking:**
- **Add Custom App**: Browse installed apps, search, and add to blocklist
- **Import from Usage**: "Show me my most-used apps" → one-tap add
- **Manual Entry**: For apps not detected automatically

**Smart Suggestions:**
- **AI-Powered**: "Based on your personality (High Openness), we suggest blocking Reddit and YouTube to avoid rabbit holes"
- **Usage-Based**: "You opened Instagram 47 times yesterday. Block it?"

#### 4.A.3 Scheduled Blocking

**Integration with Deep Work Sessions:**
- When user starts a session, all enabled categories auto-block
- When session ends, blocking automatically lifts
- Pause session = temporarily lift blocks

**Advanced Scheduling:**
- **Recurring Schedule**: "Block social media Mon-Fri, 9am-5pm"
- **Smart Schedule**: AI suggests optimal blocking times based on usage patterns
- **Calendar Integration**: Auto-block during calendar events tagged "Focus Time"

**iOS Focus Mode Integration:**
- Detect when iOS Focus Mode is enabled
- Automatically start Focused Room session
- Sync blocking categories with Focus Mode filters

**Android Do Not Disturb Integration:**
- Similar integration with Android DND
- Custom DND profiles trigger Focused Room sessions

#### 4.A.4 Whitelisting

**Use Case**: Need to block "Social Media" category but keep WhatsApp for work communication.

**Implementation:**
- **Category-Level Whitelisting**: Within each category, toggle individual apps on/off
- **Session-Specific Whitelisting**: "For this session only, allow WhatsApp"
- **Smart Whitelist**: AI suggests: "You use Slack for work. Whitelist it?"

**UI/UX:**
- Tap category → See all apps in category → Toggle specific apps
- Visual indicator: Whitelisted apps shown with checkmark/different color

#### 4.A.5 Emergency Bypass

**Scenario**: True emergency requires immediate access to a blocked app.

**Implementation:**
- **Emergency Mode**: Prominent button "Emergency? Disable All Blocks"
- **Consequences**: Clear warning: "This will cost you 25 points and break your streak"
- **Friction**: Still requires typing challenge (shorter) to ensure it's truly an emergency
- **Cooldown**: Can't use Emergency Mode again for 2 hours

---

### 4.B FRICTION OVERRIDE MECHANISM

#### 4.B.1 Philosophy

**Traditional blockers**: Hard block → User frustrated → User uninstalls app  
**Focused Room approach**: Adaptive friction → User becomes conscious → Behavior changes over time

**Goal**: Make accessing distractions **annoying enough** to discourage impulsive use, but **not impossible** to avoid frustration.

#### 4.B.2 Friction Types

**Type 1: Typing Challenge (Primary)**

**Desktop Version (Chrome Extension):**
- User types: "I'm about to waste precious time on this site instead of working toward my goals..."
- ~140 characters
- No copy-paste allowed

**Mobile Adaptation:**
- **Shortened Version**: "I choose distraction over my goals right now" (~45 characters)
- **Keyboard Optimization**: Mobile typing is slower, so shorter challenge
- **Voice Input Disabled**: Prevent cheating via voice typing
- **Timer**: Show "This will take ~15 seconds"

**Dynamic Difficulty:**
- **First Offense**: Short phrase (30 chars)
- **Second Offense (same day)**: Longer phrase (60 chars)
- **Third+ Offense**: Longest phrase (90 chars) + additional wait time

**Personality-Based:**
- **High Conscientiousness**: Slightly harder challenges (they appreciate discipline)
- **Low Conscientiousness**: Easier challenges (avoid overwhelming them)

**Type 2: Mindful Pause (Secondary)**

**Implementation:**
- User must wait 10-30 seconds with a breathing exercise
- Animated circle: "Breathe in (4 seconds)... Hold (4 seconds)... Breathe out (6 seconds)"
- **Skip button appears after 10 seconds** (but points penalty applies)

**Psychology**: Forces a moment of mindfulness, breaking autopilot behavior.

**Type 3: Reflection Prompts (Tertiary)**

**Questions (shown randomly):**
- "Why do you want to open [App Name] right now?"
- "What were you working on before this urge?"
- "Will this help you achieve your goal: [User's Goal]?"
- "How will you feel in 30 minutes if you open this app?"

**User Response:**
- Must tap one of multiple choice answers
- No "right" answer, but forces reflection
- Answers logged for AI insights

**Type 4: Social Accountability**

**Implementation:**
- "Your accountability partner Sarah completed 3 sessions today. Give up now?"
- "You're on a 7-day streak. Really want to break it?"
- "12 people are in a focus session right now. Join them instead?"

**Effectiveness**: Leverages social proof and FOMO in a positive direction.

#### 4.B.3 Temporary Access System

**After passing friction challenge:**

**Access Durations:**
- 5 minutes: -10 points
- 15 minutes: -15 points  
- 30 minutes: -20 points

**UI/UX:**
- Dropdown selector: "Allow [App] for:"
- Clear point cost shown: "5 min (-10 pts)"
- **Countdown Timer**: Persistent notification showing remaining time
- **Extension Option**: "Need more time? +5 min for -5 pts"

**Auto-Block After Time:**
- When time expires, app automatically blocks again
- Notification: "Your 15 minutes on Instagram is up. Back to work!"

**Analytics:**
- Track which apps users override most
- Feed data into AI recommendations

#### 4.B.4 Adaptive Friction (AI-Powered)

**Learning System:**
- Monitor which friction types are most effective per user
- A/B test different challenge lengths
- Adjust difficulty based on success rate

**Examples:**
- User always completes typing challenges quickly → Increase length
- User abandons breathing exercises → Switch to reflection prompts
- User overrides Instagram 80% of the time → Make Instagram challenges harder

**Goal**: Optimize for **behavior change**, not punishment.

#### 4.B.5 Friction-Free Zones

**Exceptions** (apps never blocked/frictionless access):
- **Emergency Apps**: Phone, Messages, Emergency SOS
- **Work Apps** (if user designates): Slack, Email, Calendar, Zoom
- **Health/Safety**: Maps, Health, Medical apps
- **Whitelisted Apps**: User's custom whitelist

---

### 4.C DEEP WORK SESSIONS

#### 4.C.1 Session Scheduling

**Quick Start:**
- Tap "Start Session" → Default duration (25 min Pomodoro) begins immediately
- Blocks activate, timer starts, focus mode engaged

**Custom Duration:**
- **Pomodoro Presets**: 25 min, 50 min (2x), 90 min (3x + breaks)
- **Flexible Range**: 5 minutes to 8+ hours
- **Slider + Input**: Visual slider + manual time entry

**Personality-Driven Defaults:**
- **High Conscientiousness**: Default 50 min (longer focus tolerance)
- **Low Conscientiousness**: Default 25 min (build up gradually)
- **High Neuroticism**: Default 25 min (avoid overwhelming anxiety)

**AI Recommendations:**
- "Based on your patterns, you focus best in 40-minute blocks at 10am"
- "Your average successful session is 35 minutes. Start there?"

#### 4.C.2 Session Controls

**Start:**
- Tap "Start" button
- Optional: Enter session goal (e.g., "Finish Chapter 3", "Code API endpoint")
- Countdown begins
- All enabled blocking categories activate
- Persistent notification shows timer

**Pause:**
- Tap "Pause" button
- Two options:
  - **5-minute break**: +2 points (encouraging healthy breaks)
  - **10-minute break**: +3 points
- During pause: All blocks temporarily lifted
- Timer pauses
- Notification: "Break time! Back in 5 minutes"

**Resume:**
- Automatic after break time expires
- Manual: Tap "Resume" in notification or app
- Blocks re-engage
- Timer continues from where paused

**Stop (Abort):**
- Tap "Stop Session"
- **Friction Required**: "Are you sure? This will cost you 15 points"
- Typing challenge: "I choose to give up on my goals"
- If confirmed: Session ends, -15 points applied

**Complete (Natural End):**
- Timer reaches 0
- Celebration screen: "🎉 Session Complete!"
- Points awarded (see Section 4.D)
- Notification with action buttons:
  - "Start Another Session"
  - "Take a Long Break"

#### 4.C.3 Break Reminders

**Short Break (After 25-50 min sessions):**
- Notification: "Time for a 5-minute break!"
- Suggestions: "Stand up, stretch, drink water"
- Auto-resume option: "Resume in 5 min"

**Long Break (After 4 Pomodoros):**
- Notification: "Great work! Take a 15-30 minute break"
- Suggestions: "Take a walk, eat a snack, call a friend"
- App blocks lifted during break

**AI-Powered Break Timing:**
- Learn optimal break patterns for each user
- Suggest breaks before user burns out
- "You've been focused for 90 min. Your productivity usually drops after this. Take a break?"

#### 4.C.4 Distraction Alerts

**During Active Session:**
- User attempts to open blocked app
- **Alert Type 1**: Banner notification
  - "You're in a session! 23 minutes remaining"
  - "Stay focused, you're doing great!"
- **Alert Type 2**: Gentle vibration
- **Alert Type 3**: Sound (optional, customizable)

**Friction Override Screen** (if user proceeds):
- Full-screen takeover
- Session timer prominently displayed
- Motivational message
- Goal reminder: "You wanted to: Finish Chapter 3"
- Friction challenge (see Section 4.B)

**Analytics:**
- Log every distraction attempt
- Show in reports: "You attempted to open TikTok 8 times during this session"

#### 4.C.5 Cross-Device Sync

**Scenario 1: Start on Desktop, Continue on Mobile**
1. User starts session in Chrome extension
2. Mobile app receives push notification: "Session started on Desktop"
3. Mobile blocks activate automatically
4. User's phone is now part of the session
5. Timer syncs in real-time

**Scenario 2: Start on Mobile, Continue on Desktop**
1. User starts session in mobile app
2. Chrome extension detects active session via API
3. Desktop blocks activate automatically
4. Both devices show same timer

**Implementation:**
- **WebSocket Connection**: Real-time sync via Firebase or Pusher
- **Fallback Polling**: API polling every 15 seconds if WebSocket fails
- **Offline Mode**: Session continues locally, syncs when connection restored

**UI Indicators:**
- **Mobile**: "Synced with Desktop" badge
- **Desktop**: "Synced with Mobile" badge
- **Multi-Device Icon**: Shows all active devices

**Conflict Resolution:**
- If user pauses on one device, other device auto-pauses
- If user stops on one device, prompt on other: "Session stopped on Desktop. Stop here too?"

---

### 4.D GAMIFICATION SYSTEM

*Refer to the attached flowchart image for the complete gamification logic flow.*

#### 4.D.1 Point-Based Scoring (Exact Chrome Extension Logic)

**Scoring Rules:**

**Session Completion (Valid):**
- **Base Points**: +20
- **Requirements for Valid Completion**:
  - Duration ≥ 25 minutes
  - No blocked attempts during session
  - No friction overrides used
  - Session completed (not aborted)
- **Streak Bonus**: +1 to +7 (based on daily streak)
- **Session Cap**: Maximum 25 points per session
- **Calculation**: `min(20 + streak_bonus, 25)`

**Example:**
- 30-minute session, no attempts, 3-day streak
- Points: 20 (base) + 3 (streak) = 23 points ✅

**Session Completion (Invalid):**
- **Points**: 0 base points (only penalties from events apply)
- **Invalid If**:
  - Had blocked attempts during session
  - Had friction overrides during session
  - Duration < 25 minutes

**Example:**
- 30-minute session, 2 blocked attempts, 1 override
- Points: 0 (base) - 10 (2×5 attempts) - 10 (override) = -20 points ❌

**Blocked Attempt:**
- **Points**: -5 per attempt
- **Definition**: User tries to open blocked app, sees friction screen, but doesn't override
- **Logged**: Immediately when attempt occurs
- **Added to Total**: At session completion

**Friction Override:**
- **Points**: -10 per override
- **Definition**: User completes friction challenge and gains temporary access
- **Logged**: Immediately when override granted
- **Added to Total**: At session completion

**Session Abort:**
- **Points**: -15
- **Definition**: User manually stops session before completion
- **Calculation**: Running session score (from attempts/overrides) + (-15)
- **Added to Total**: Immediately when abort confirmed

**Example:**
- User starts 60-min session
- 15 minutes in: 3 blocked attempts (-15 pts running score)
- Decides to abort: -15 (abort penalty)
- Total: -15 + -15 = -30 points added to account ❌

**Pause Chosen:**
- **5-minute pause**: +2 points (encouraging healthy breaks)
- **10-minute pause**: +3 points
- **Pause Penalty**: -5 if session was paused and then completed
- **Logic**: Encourage breaks, but slightly penalize for interrupting flow

**Example:**
- 30-min session, took one 5-min pause, completed
- Calculation: 20 (base) - 5 (pause penalty) + 2 (pause bonus) = 17 points
- Streak bonus: +3 (if 3-day streak)
- Final: 17 + 3 = 20 points (before cap)

**Minimum Score:**
- **Floor**: No floor (can go negative)
- **Rationale**: Users can "dig themselves into a hole" to create urgency to improve

**Total Points:**
- **Lifetime Total**: Sum of all session scores across all time
- **Daily Points**: Sum of session scores for current day (resets at midnight local time)
- **Weekly Points**: Sum of session scores for current week (Monday-Sunday)

#### 4.D.2 Level Progression (20 Achievement Levels)

**Level System** (directly from Chrome extension):

| Level | Name | Min Points | Max Points |
|-------|------|-----------|-----------|
| 1 | Seedling Focus | 0 | 49 |
| 2 | Attention Apprentice | 50 | 149 |
| 3 | Ritual Novice | 150 | 299 |
| 4 | Task Tamer | 300 | 499 |
| 5 | Flow Initiate | 500 | 749 |
| 6 | Focus Artisan | 750 | 999 |
| 7 | Rhythm Keeper | 1000 | 1299 |
| 8 | Clarity Crafter | 1300 | 1599 |
| 9 | Momentum Maker | 1600 | 1999 |
| 10 | Deep Diver | 2000 | 2499 |
| 11 | Time Alchemist | 2500 | 2999 |
| 12 | Discipline Architect | 3000 | 3599 |
| 13 | Zen Practitioner | 3600 | 4199 |
| 14 | Flow Architect | 4200 | 4999 |
| 15 | Habit Vanguard | 5000 | 5999 |
| 16 | Cognitive Commander | 6000 | 7499 |
| 17 | Habit Sage | 7500 | 8999 |
| 18 | Master of Momentum | 9000 | 10999 |
| 19 | Deep Work Luminary | 11000 | 12999 |
| 20 | Legend of Mastery | 13000 | ∞ |

**UI/UX:**
- **Progress Bar**: Visual indicator showing progress to next level
- **Level Badge**: Displayed prominently on profile screen
- **Level-Up Animation**: Celebration when user reaches new level
- **Points to Next Level**: "523 points to Rhythm Keeper"

**Notifications:**
- "🎉 Level Up! You're now a Task Tamer!"
- "You're 47 points away from becoming a Flow Initiate. Keep going!"

#### 4.D.3 Daily & Weekly Streaks

**Daily Streak:**
- **Definition**: Number of consecutive days with at least one valid session
- **Valid Session**: ≥25 min, no attempts, no overrides, completed
- **Increment**: +1 for each consecutive day
- **Reset**: If user misses a day (no valid session), streak resets to 0
- **Maximum Bonus**: +7 points per session

**Streak Bonus Application:**
- **Day 1**: +1 point per valid session
- **Day 2**: +2 points per valid session
- **Day 3**: +3 points per valid session
- **Day 7+**: +7 points per valid session (capped)

**Example:**
- User on 5-day streak
- Completes valid 30-min session
- Base: 20 points
- Streak bonus: +5 points
- Total: 25 points (hits cap)

**Weekly Streak:**
- **Definition**: Number of consecutive weeks with valid sessions on all 7 days (Monday-Sunday)
- **Increment**: +1 for each consecutive week with 7/7 days completed
- **Reset**: If user misses any single day in a week, weekly streak resets to 0
- **Purpose**: Motivation only (no point bonus)

**UI/UX:**
- **Daily Streak**: "🔥 5 Day Streak"
- **Weekly Streak**: "⭐ 2 Week Streak"
- **Streak Calendar**: Visual calendar showing which days had valid sessions
- **Streak Shield**: Optional in-app purchase to "save" a missed day (monetization)

**Notifications:**
- **Reminder**: "Don't break your 12-day streak! Complete a session today"
- **Encouragement**: "5 more days to your first weekly streak!"
- **Celebration**: "🎉 Amazing! 30-day streak achieved!"

#### 4.D.4 Badges & Achievements

**Achievement Categories:**

**1. Session-Based:**
- "First Steps" - Complete first session
- "Morning Person" - Complete 10 sessions before 9am
- "Night Owl" - Complete 10 sessions after 9pm
- "Marathon Master" - Complete a 4-hour session
- "Consistency King/Queen" - Complete 30 sessions in 30 days

**2. Streak-Based:**
- "Week Warrior" - 7-day streak
- "Month Master" - 30-day streak
- "Unstoppable" - 100-day streak
- "Legend" - 365-day streak

**3. Points-Based:**
- "Century Club" - Reach 100 points
- "Thousand Triumphs" - Reach 1000 points
- "Five Figures" - Reach 10,000 points

**4. Resistance-Based:**
- "Distraction Dodger" - Complete 10 sessions with 0 attempts
- "Override Avoider" - Complete 30 sessions with 0 overrides
- "Friction Master" - Pass 100 friction challenges

**5. Social-Based:**
- "Influencer" - Share your streak on social media
- "Team Player" - Join an accountability group
- "Leaderboard Legend" - Reach top 10 on leaderboard

**6. Special:**
- "Weekend Warrior" - Complete sessions on Saturday AND Sunday
- "Early Adopter" - One of first 1000 users
- "Personality Pioneer" - Complete Big Five test

**UI/UX:**
- **Badge Gallery**: Scrollable grid of all badges
- **Locked vs Unlocked**: Grayscale locked, full color unlocked
- **Progress Indicators**: "7/10 sessions before 9am"
- **Badge Notifications**: Push notification when badge unlocked
- **Badge Showcase**: Display top 3 badges on profile

#### 4.D.5 Leaderboards (NEW - Not in Chrome Extension)

**Leaderboard Types:**

**1. Global Leaderboard:**
- Top 100 users worldwide by total points
- Updated daily
- Public (usernames only, no personal data)

**2. Weekly Leaderboard:**
- Top 100 users by points earned this week
- Resets every Monday
- More achievable for new users

**3. Friends Leaderboard:**
- Compare with friends who also use the app
- Requires explicit friend connection (privacy-first)

**4. Community Leaderboards:**
- Join communities: "Students", "Developers", "Entrepreneurs"
- Compete within your community

**Privacy Controls:**
- **Opt-In**: Users must explicitly opt into leaderboards
- **Anonymous Mode**: Use anonymous username instead of real name
- **Hide Me**: Completely hide from all leaderboards

**UI/UX:**
- **Leaderboard Tab**: Dedicated tab in bottom navigation
- **Your Rank**: "You're #472 globally, #23 among Students"
- **Rank Changes**: "↑ 47" (moved up 47 places this week)
- **Profile Avatars**: Small avatar images (if user opts in)
- **Points Display**: "Sarah T. - 12,450 pts"

**Gamification Psychology:**
- **Healthy Competition**: Motivates without being toxic
- **Achievable Goals**: Weekly leaderboard gives everyone a chance
- **Social Proof**: "If they can do it, so can I"

#### 4.D.6 Social Sharing

**Share Triggers:**
1. **Level Up**: "I just became a Flow Architect on @FocusedRoom! 🎯"
2. **Streak Milestone**: "30-day streak achieved! 🔥 #DeepWork #FocusedRoom"
3. **Achievement Unlocked**: "Just earned the Marathon Master badge! 4 hours of deep work 💪"
4. **Session Completion**: "Completed a 90-minute deep work session! [Progress Image]"
5. **Weekly Summary**: "This week: 18 hours of focused work, 12-day streak 🚀"

**Share Destinations:**
- Twitter/X
- LinkedIn
- Instagram Stories
- Facebook
- WhatsApp
- Copy Link

**Visual Assets:**
- **Auto-Generated Images**: Beautiful share cards with:
  - User's level badge
  - Stat being shared (streak, points, etc.)
  - Focused Room branding
  - Call-to-action: "Join me at focusedroom.com"

**Privacy:**
- **Opt-In**: Explicit permission before first share
- **Customization**: Edit message before sharing
- **Disable**: Turn off share prompts in settings

**Viral Growth Strategy:**
- Every share includes app download link
- Referral tracking: "Joined via Sarah's link"
- Potential referral bonuses (future monetization)

---

*[CONTINUED IN NEXT MESSAGE DUE TO LENGTH]*

