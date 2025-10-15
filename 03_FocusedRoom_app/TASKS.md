# 🎯 FOCUSED ROOM MOBILE APP - DEVELOPMENT TASKS BREAKDOWN

**Version**: 1.0.0  
**Status**: Ready for Development  
**Total Estimated Timeline**: 16 weeks (4 months) for MVP  

---

## 📋 TABLE OF CONTENTS

1. [Phase 1: Project Setup](#phase-1-project-setup)
2. [Phase 2: Authentication & User Management](#phase-2-authentication--user-management)
3. [Phase 3: Core App Blocking](#phase-3-core-app-blocking)
4. [Phase 4: Deep Work Sessions](#phase-4-deep-work-sessions)
5. [Phase 5: Gamification System](#phase-5-gamification-system)
6. [Phase 6: Reports & Analytics](#phase-6-reports--analytics)
7. [Phase 7: Cross-Platform Sync](#phase-7-cross-platform-sync)
8. [Phase 8: Settings & Customization](#phase-8-settings--customization)
9. [Phase 9: Testing & QA](#phase-9-testing--qa)
10. [Phase 10: Launch Preparation](#phase-10-launch-preparation)

---

## PHASE 1: PROJECT SETUP (Week 1)

### 1.1 Development Environment Setup
**Priority**: P0 (Critical)  
**Estimated Time**: 1 day

**Tasks:**
- [ ] 1.1.1: Install Node.js (v18+), npm/yarn
- [ ] 1.1.2: Install React Native CLI and dependencies
- [ ] 1.1.3: Set up Android Studio + Android SDK
- [ ] 1.1.4: Set up Xcode + iOS Simulator (macOS only)
- [ ] 1.1.5: Install VS Code with React Native extensions
- [ ] 1.1.6: Set up Git and GitHub repository
- [ ] 1.1.7: Configure ESLint, Prettier, TypeScript

**Acceptance Criteria:**
- [ ] Can run `npx react-native init` successfully
- [ ] Can build and run empty project on iOS simulator
- [ ] Can build and run empty project on Android emulator
- [ ] Code formatting and linting works

---

### 1.2 Project Initialization
**Priority**: P0  
**Estimated Time**: 1 day

**Tasks:**
- [ ] 1.2.1: Create React Native project with TypeScript
  ```bash
  npx react-native init FocusedRoom --template react-native-template-typescript
  ```
- [ ] 1.2.2: Install core dependencies:
  - Redux Toolkit + React Redux
  - React Navigation v6
  - React Native Vector Icons
  - Axios (API calls)
  - AsyncStorage (local storage)
  - React Native Keychain (secure storage)
- [ ] 1.2.3: Set up folder structure (see FOLDER_STRUCTURE.md)
- [ ] 1.2.4: Configure app icons and splash screen
- [ ] 1.2.5: Set up environment variables (.env files)
- [ ] 1.2.6: Configure app name, bundle ID, package name
  - iOS: com.focusedroom.app
  - Android: com.focusedroom.app

**Acceptance Criteria:**
- [ ] Project builds without errors
- [ ] Folder structure matches industry standards
- [ ] App displays custom splash screen and icon
- [ ] Environment variables load correctly

---

### 1.3 Design System Implementation
**Priority**: P0  
**Estimated Time**: 2 days

**Tasks:**
- [ ] 1.3.1: Create theme configuration file (`src/theme/index.ts`)
- [ ] 1.3.2: Define color tokens (from design system):
  - Primary: #7A9E9F, #6B8B8C
  - Accent: #38a169 (green), #667eea (purple)
  - Danger: #e53e3e
  - Neutrals, borders, backgrounds
- [ ] 1.3.3: Define typography scale (font sizes, weights, line heights)
- [ ] 1.3.4: Define spacing scale (4px, 8px, 12px, 16px, 24px, 32px, 48px)
- [ ] 1.3.5: Create reusable components:
  - `<Button>` (primary, secondary, ghost variants)
  - `<Card>` (with shadow, border radius)
  - `<Input>` (text input with validation states)
  - `<Badge>` (for streaks, counts)
- [ ] 1.3.6: Implement dark mode support
- [ ] 1.3.7: Create Storybook for component library (optional but recommended)

**Acceptance Criteria:**
- [ ] All color tokens accessible via theme
- [ ] Typography system works across all components
- [ ] Dark mode toggles correctly
- [ ] Reusable components render properly

---

### 1.4 Navigation Setup
**Priority**: P0  
**Estimated Time**: 1 day

**Tasks:**
- [ ] 1.4.1: Install and configure React Navigation
- [ ] 1.4.2: Set up tab navigator (bottom tabs):
  - Home
  - Sessions
  - Reports
  - Learn
  - Profile
- [ ] 1.4.3: Set up stack navigator for each tab
- [ ] 1.4.4: Create placeholder screens for each tab
- [ ] 1.4.5: Implement navigation types (TypeScript)
- [ ] 1.4.6: Add tab bar icons and labels
- [ ] 1.4.7: Configure screen headers and styles

**Acceptance Criteria:**
- [ ] Can navigate between all 5 tabs
- [ ] Tab bar displays correct icons and labels
- [ ] Screen headers match design system
- [ ] TypeScript navigation is fully typed

---

## PHASE 2: AUTHENTICATION & USER MANAGEMENT (Week 2)

### 2.1 Backend API Setup
**Priority**: P0  
**Estimated Time**: 2 days

**Tasks:**
- [ ] 2.1.1: Set up Node.js + Express server
- [ ] 2.1.2: Configure PostgreSQL database
- [ ] 2.1.3: Set up database migrations (Knex.js or TypeORM)
- [ ] 2.1.4: Create `users` table schema
- [ ] 2.1.5: Implement JWT authentication middleware
- [ ] 2.1.6: Create API routes:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/logout`
  - `POST /auth/refresh`
  - `GET /user/profile`
  - `PUT /user/profile`
- [ ] 2.1.7: Set up CORS and security headers
- [ ] 2.1.8: Deploy backend to Heroku/Railway/Render (staging)

**Acceptance Criteria:**
- [ ] API endpoints respond correctly
- [ ] JWT tokens generated and validated
- [ ] Database connections work
- [ ] API is accessible from mobile app

---

### 2.2 Email/Password Authentication
**Priority**: P0  
**Estimated Time**: 2 days

**Tasks:**
- [ ] 2.2.1: Create login screen UI
  - Email input
  - Password input
  - "Sign In" button
  - "Forgot Password?" link
  - "Don't have an account? Sign Up" link
- [ ] 2.2.2: Create sign-up screen UI
  - Full name input
  - Email input
  - Password input
  - "Create Account" button
  - Password strength indicator
- [ ] 2.2.3: Implement form validation (email format, password strength)
- [ ] 2.2.4: Create Redux slice for auth state
- [ ] 2.2.5: Implement API calls (login, register)
- [ ] 2.2.6: Store JWT token in AsyncStorage
- [ ] 2.2.7: Implement auto-login (check token on app launch)
- [ ] 2.2.8: Handle errors (invalid credentials, network errors)

**Acceptance Criteria:**
- [ ] User can sign up with email/password
- [ ] User can log in with valid credentials
- [ ] Errors display clearly (e.g., "Email already exists")
- [ ] Token persists across app restarts

---

### 2.3 OAuth Authentication (Google & Apple)
**Priority**: P1  
**Estimated Time**: 2 days

**Tasks:**
- [ ] 2.3.1: Set up Google Sign-In:
  - Install `@react-native-google-signin/google-signin`
  - Configure Google Cloud Console
  - Get OAuth client IDs (iOS, Android, Web)
  - Implement "Sign in with Google" button
- [ ] 2.3.2: Set up Apple Sign-In (iOS only):
  - Install `@invertase/react-native-apple-authentication`
  - Configure Apple Developer Console
  - Implement "Sign in with Apple" button
- [ ] 2.3.3: Implement backend OAuth handlers:
  - `POST /auth/google` (verify Google token)
  - `POST /auth/apple` (verify Apple token)
- [ ] 2.3.4: Link OAuth accounts to user records
- [ ] 2.3.5: Handle OAuth errors (cancelled, network)

**Acceptance Criteria:**
- [ ] Google Sign-In works on iOS and Android
- [ ] Apple Sign-In works on iOS
- [ ] OAuth tokens verified on backend
- [ ] User profile created/linked correctly

---

### 2.4 User Profile
**Priority**: P1  
**Estimated Time**: 1 day

**Tasks:**
- [ ] 2.4.1: Create profile screen UI
  - Avatar (with upload option)
  - Full name
  - Email (read-only)
  - Member since date
  - Current level badge
  - Points, streak display
- [ ] 2.4.2: Implement profile edit functionality
- [ ] 2.4.3: Add avatar upload (AWS S3 or Cloudinary)
- [ ] 2.4.4: Create Redux slice for user profile
- [ ] 2.4.5: Implement API calls (get profile, update profile)

**Acceptance Criteria:**
- [ ] Profile screen displays user info correctly
- [ ] User can edit name and upload avatar
- [ ] Changes persist on backend

---

## PHASE 3: CORE APP BLOCKING (Weeks 3-4)

### 3.1 iOS App Blocking (Screen Time API)
**Priority**: P0  
**Estimated Time**: 3 days

**Tasks:**
- [ ] 3.1.1: Add necessary capabilities to Xcode project:
  - Family Controls
  - Managed Settings
- [ ] 3.1.2: Request Screen Time authorization
- [ ] 3.1.3: Create native module bridge (Swift → React Native)
- [ ] 3.1.4: Implement app selection UI (list of installed apps)
- [ ] 3.1.5: Implement app blocking logic:
  ```swift
  let settings = ManagedSettings()
  settings.application.blockedApplications = blockedApps
  ```
- [ ] 3.1.6: Implement app unblocking logic
- [ ] 3.1.7: Test on physical iOS device (doesn't work on simulator)
- [ ] 3.1.8: Handle permissions denied gracefully

**Acceptance Criteria:**
- [ ] User can grant Screen Time permissions
- [ ] Selected apps are blocked during sessions
- [ ] Blocked apps show iOS system block screen
- [ ] Apps unblock when session ends

---

### 3.2 Android App Blocking (AccessibilityService)
**Priority**: P0  
**Estimated Time**: 4 days

**Tasks:**
- [ ] 3.2.1: Create AccessibilityService class (`BlockingAccessibilityService.kt`)
- [ ] 3.2.2: Declare service in AndroidManifest.xml
- [ ] 3.2.3: Request accessibility permissions (guide user to settings)
- [ ] 3.2.4: Implement app launch detection:
  ```kotlin
  override fun onAccessibilityEvent(event: AccessibilityEvent) {
    if (event.eventType == TYPE_WINDOW_STATE_CHANGED) {
      val packageName = event.packageName.toString()
      if (isBlocked(packageName)) {
        showBlockingOverlay()
      }
    }
  }
  ```
- [ ] 3.2.5: Create blocking overlay Activity:
  - Full-screen overlay
  - Shows "App Blocked" message
  - Session timer
  - Friction challenge button
- [ ] 3.2.6: Implement foreground service (persistent notification)
- [ ] 3.2.7: Handle device-specific quirks (Xiaomi, Huawei)
- [ ] 3.2.8: Create native module bridge (Kotlin → React Native)

**Acceptance Criteria:**
- [ ] User can grant Accessibility permissions
- [ ] Blocked apps show custom blocking overlay
- [ ] Foreground service keeps blocking active
- [ ] Works across app restarts

---

### 3.3 Blocklist Management UI
**Priority**: P0  
**Estimated Time**: 2 days

**Tasks:**
- [ ] 3.3.1: Create Blocklist screen UI
- [ ] 3.3.2: Display 6 pre-defined categories:
  - Social Media (with app count badge)
  - Entertainment
  - News & Media
  - Shopping
  - Adult Content
  - Games
- [ ] 3.3.3: Implement category toggle (on/off switch)
- [ ] 3.3.4: Implement "View Apps" button → Shows apps in category
- [ ] 3.3.5: Allow individual app toggle within category
- [ ] 3.3.6: Add "Custom Apps" section
- [ ] 3.3.7: Implement "Add Custom App" button → Opens app picker
- [ ] 3.3.8: Display blocked apps count (e.g., "42 apps blocked")
- [ ] 3.3.9: Create Redux slice for blocklist state
- [ ] 3.3.10: Sync blocklist to backend API

**Acceptance Criteria:**
- [ ] All 6 categories display with correct app counts
- [ ] Toggling category on/off works
- [ ] Can view and toggle individual apps
- [ ] Can add custom apps to blocklist
- [ ] Blocklist persists across app restarts

---

### 3.4 Blocklist Data Integration
**Priority**: P0  
**Estimated Time**: 1 day

**Tasks:**
- [ ] 3.4.1: Convert Chrome extension blocklist JSONs to app identifiers:
  - `social_blocklist.json` → Instagram (com.instagram.android), TikTok, etc.
  - `entertainment_blocklist.json` → YouTube, Netflix, etc.
  - `news_blocklist.json` → CNN, BBC, etc.
  - `shopping_blocklist.json` → Amazon, eBay, etc.
  - `porn_blocklist.json` → (Carefully handled for app store approval)
  - `games.json` → Popular mobile games
- [ ] 3.4.2: Create JSON files with app metadata:
  ```json
  {
    "category": "social",
    "apps": [
      {
        "name": "Instagram",
        "ios_bundle_id": "com.burbn.instagram",
        "android_package": "com.instagram.android",
        "icon_url": "https://..."
      }
    ]
  }
  ```
- [ ] 3.4.3: Load blocklist data on app launch
- [ ] 3.4.4: Match installed apps with blocklist (iOS/Android APIs)
- [ ] 3.4.5: Handle apps not in database (allow user to add manually)

**Acceptance Criteria:**
- [ ] All major apps are in blocklist database
- [ ] App icons display correctly
- [ ] Matching works for both iOS and Android

---

## PHASE 4: DEEP WORK SESSIONS (Weeks 5-6)

### 4.1 Session Start/Stop Logic
**Priority**: P0  
**Estimated Time**: 2 days

**Tasks:**
- [ ] 4.1.1: Create session Redux slice (state management)
- [ ] 4.1.2: Implement session data model:
  ```typescript
  interface Session {
    id: string;
    userId: string;
    startTime: Date;
    endTime?: Date;
    plannedDuration: number; // seconds
    actualDuration: number;
    goal?: string;
    status: 'active' | 'paused' | 'completed' | 'aborted';
    blockedAttempts: number;
    overrides: number;
    wasPaused: boolean;
    pauseTime: number;
  }
  ```
- [ ] 4.1.3: Implement `startSession()` action:
  - Create session record
  - Activate app blocking
  - Start timer
  - Show persistent notification
- [ ] 4.1.4: Implement `stopSession()` action:
  - Calculate actual duration
  - Deactivate app blocking
  - Save session to database
  - Trigger gamification calculations
- [ ] 4.1.5: Handle app backgrounding/foregrounding during session
- [ ] 4.1.6: Persist active session across app restarts

**Acceptance Criteria:**
- [ ] Can start a session with custom duration
- [ ] Timer counts down correctly
- [ ] Stopping session saves data correctly
- [ ] Session persists if app is closed/restarted

---

### 4.2 Session UI (Home Screen)
**Priority**: P0  
**Estimated Time**: 2 days

**Tasks:**
- [ ] 4.2.1: Design home screen layout:
  - Large timer display (if session active)
  - "Start Session" button (if no active session)
  - Duration selector (25 min, 50 min, custom)
  - Goal input (optional)
  - Today's stats card (focus time, points, streak)
- [ ] 4.2.2: Implement timer component:
  - Countdown display (MM:SS)
  - Progress ring animation
  - Color changes based on time remaining
- [ ] 4.2.3: Implement session controls:
  - Pause button
  - Resume button (after pause)
  - Stop button (with confirmation)
- [ ] 4.2.4: Add session goal input (optional text field)
- [ ] 4.2.5: Show session stats during session:
  - Time elapsed
  - Blocked attempts count
  - Session points (real-time)
- [ ] 4.2.6: Implement session completion screen:
  - Celebration animation (confetti, particles)
  - "Session Complete!" message
  - Points earned display
  - "Start Another Session" button

**Acceptance Criteria:**
- [ ] Home screen displays correctly (active vs inactive states)
- [ ] Timer animates smoothly
- [ ] Session controls work as expected
- [ ] Completion screen celebrates success

---

### 4.3 Pause/Resume Functionality
**Priority**: P1  
**Estimated Time**: 1 day

**Tasks:**
- [ ] 4.3.1: Implement `pauseSession()` action:
  - Pause timer
  - Deactivate blocking temporarily
  - Record pause start time
  - Show "Session Paused" notification
- [ ] 4.3.2: Create pause options UI:
  - 5-minute break (+2 points)
  - 10-minute break (+3 points)
- [ ] 4.3.3: Implement auto-resume after break time:
  - Countdown timer for break
  - Notification: "Break over, resuming session"
  - Re-activate blocking
  - Resume countdown
- [ ] 4.3.4: Implement manual resume:
  - "Resume Now" button
  - Resume before break ends
- [ ] 4.3.5: Apply pause penalty at session end (-5 if paused)

**Acceptance Criteria:**
- [ ] Pausing session works correctly
- [ ] Break timer counts down
- [ ] Session auto-resumes after break
- [ ] Pause bonus/penalty calculated correctly

---

### 4.4 Friction Override Implementation
**Priority**: P0  
**Estimated Time**: 3 days

**Tasks:**
- [ ] 4.4.1: Create Friction Overlay screen:
  - Full-screen takeover
  - Session timer prominently displayed
  - Motivational message
  - Goal reminder
  - Friction challenge UI
- [ ] 4.4.2: Implement Typing Challenge:
  - Text input (large, easy to type on mobile)
  - Challenge text: "I choose distraction over my goals"
  - Character count indicator
  - No copy-paste (disable context menu)
  - "Submit" button (enabled when typed correctly)
- [ ] 4.4.3: Implement Mindful Pause:
  - Breathing exercise animation (circle expanding/contracting)
  - "Breathe in (4s), hold (4s), breathe out (6s)"
  - 10-30 second duration
  - "Skip" button after 10 seconds (with penalty warning)
- [ ] 4.4.4: Implement Reflection Prompts:
  - Random question from pool
  - Multiple choice answers
  - No "wrong" answer, just reflection
- [ ] 4.4.5: Implement Temporary Access:
  - Duration selector (5 min, 15 min, 30 min)
  - Point cost display (-10, -15, -20)
  - Countdown notification during access
  - Auto-block when time expires
- [ ] 4.4.6: Log all friction events to gamification system
- [ ] 4.4.7: Track override rates for AI recommendations (future)

**Acceptance Criteria:**
- [ ] Attempting blocked app shows friction screen
- [ ] All 3 friction types work correctly
- [ ] Completing challenge grants temporary access
- [ ] Temporary access expires and re-blocks app
- [ ] All events logged for gamification

---

### 4.5 Notifications
**Priority**: P1  
**Estimated Time**: 1 day

**Tasks:**
- [ ] 4.5.1: Set up Firebase Cloud Messaging (FCM)
- [ ] 4.5.2: Request notification permissions (iOS/Android)
- [ ] 4.5.3: Implement persistent notification during session:
  - Show timer
  - Action buttons (Pause, Stop)
  - App icon and branding
- [ ] 4.5.4: Implement milestone notifications:
  - "10 minutes down!"
  - "Halfway there!"
  - "5 minutes left!"
- [ ] 4.5.5: Implement break reminders:
  - "Time for a 5-minute break"
  - "Take a walk, stretch, drink water"
- [ ] 4.5.6: Implement session complete notification:
  - "Session Complete! +23 points"
  - Action buttons: "Start Another", "View Report"
- [ ] 4.5.7: Handle notification taps (deep linking)

**Acceptance Criteria:**
- [ ] Persistent notification shows during session
- [ ] Milestone notifications appear at correct times
- [ ] Tapping notification opens relevant screen
- [ ] Notifications respect user's DND/quiet hours

---

## PHASE 5: GAMIFICATION SYSTEM (Week 7)

### 5.1 Points Calculation Engine
**Priority**: P0  
**Estimated Time**: 2 days

**Tasks:**
- [ ] 5.1.1: Implement scoring logic (exact from Chrome extension):
  ```typescript
  function calculateSessionScore(session: Session): number {
    let score = 0;
    
    // Base points for valid completion
    if (isValidCompletion(session)) {
      score += 20;
      
      // Streak bonus
      const streakBonus = Math.min(dailyStreak, 7);
      score += streakBonus;
    }
    
    // Penalties
    score -= session.blockedAttempts * 5;
    score -= session.overrides * 10;
    if (session.wasPaused) score -= 5;
    
    // Cap at 25
    return Math.min(score, 25);
  }
  
  function isValidCompletion(session: Session): boolean {
    return session.actualDuration >= 25 * 60 &&
           session.blockedAttempts === 0 &&
           session.overrides === 0 &&
           session.status === 'completed';
  }
  ```
- [ ] 5.1.2: Implement event tracking:
  - `blocked_attempt`: -5 points (logged immediately, added at session end)
  - `override`: -10 points (logged immediately, added at session end)
  - `session_complete`: Base +20, penalties, bonuses, cap
  - `session_abort`: Running score + -15
  - `pause_chosen`: +2 or +3 (applied immediately)
- [ ] 5.1.3: Create gamification Redux slice
- [ ] 5.1.4: Integrate with session lifecycle (call scoring on session end)
- [ ] 5.1.5: Store gamification data locally (AsyncStorage)
- [ ] 5.1.6: Sync gamification data to backend API

**Acceptance Criteria:**
- [ ] Points calculated correctly for all scenarios
- [ ] Matches Chrome extension scoring exactly
- [ ] Points display updates in real-time
- [ ] Points persist across app restarts

---

### 5.2 Levels & Streaks
**Priority**: P0  
**Estimated Time**: 1 day

**Tasks:**
- [ ] 5.2.1: Define 20 levels with point thresholds (from PRD)
- [ ] 5.2.2: Implement level calculation:
  ```typescript
  function getCurrentLevel(totalPoints: number): Level {
    return levels.find(level => 
      totalPoints >= level.min && totalPoints <= level.max
    );
  }
  ```
- [ ] 5.2.3: Implement daily streak logic:
  - Check if last session date is yesterday
  - If yes, increment streak
  - If no, reset to 1 (for today's first valid session)
  - Apply streak bonus to session scores
- [ ] 5.2.4: Implement weekly streak logic (motivation only):
  - Track valid sessions each day (Mon-Sun)
  - Increment weekly streak if all 7 days have valid sessions
  - Reset if any day missed
- [ ] 5.2.5: Create streak calendar UI (visual display of session days)
- [ ] 5.2.6: Implement level-up animation and notification
- [ ] 5.2.7: Implement streak reminder notifications

**Acceptance Criteria:**
- [ ] Level displays correctly based on total points
- [ ] Daily streak increments/resets correctly
- [ ] Weekly streak tracks properly
- [ ] Level-up celebration triggers

---

### 5.3 Achievements & Badges
**Priority**: P1  
**Estimated Time**: 2 days

**Tasks:**
- [ ] 5.3.1: Define all achievement types (30+ achievements):
  - Session-based (First Steps, Marathon Master, etc.)
  - Streak-based (Week Warrior, Month Master, etc.)
  - Points-based (Century Club, Thousand Triumphs, etc.)
  - Resistance-based (Distraction Dodger, Override Avoider, etc.)
  - Social-based (Influencer, Leaderboard Legend, etc.)
- [ ] 5.3.2: Create achievement data model:
  ```typescript
  interface Achievement {
    id: string;
    code: string;
    name: string;
    description: string;
    iconUrl: string;
    category: string;
    progress?: number; // e.g., 7/10 morning sessions
    unlocked: boolean;
    unlockedAt?: Date;
  }
  ```
- [ ] 5.3.3: Implement achievement check logic (after each session)
- [ ] 5.3.4: Create Badge Gallery UI:
  - Grid of all badges
  - Locked (grayscale) vs unlocked (full color)
  - Progress indicators
  - Tap badge → See details
- [ ] 5.3.5: Implement badge unlock notification and animation
- [ ] 5.3.6: Allow user to showcase top 3 badges on profile

**Acceptance Criteria:**
- [ ] All achievements defined and working
- [ ] Badge gallery displays correctly
- [ ] Unlocking badge shows celebration
- [ ] Progress indicators update correctly

---

### 5.4 Leaderboards
**Priority**: P1  
**Estimated Time**: 2 days

**Tasks:**
- [ ] 5.4.1: Create backend API endpoints:
  - `GET /gamification/leaderboard/global?limit=100`
  - `GET /gamification/leaderboard/weekly?limit=100`
  - `GET /gamification/leaderboard/friends`
- [ ] 5.4.2: Implement global leaderboard (top 100 by total points)
- [ ] 5.4.3: Implement weekly leaderboard (top 100 by weekly points)
- [ ] 5.4.4: Implement friends leaderboard (requires friend connections)
- [ ] 5.4.5: Create Leaderboard screen UI:
  - Tab switcher (Global, Weekly, Friends)
  - List of ranked users
  - User's rank highlighted
  - Rank change indicator (↑ 47, ↓ 12)
  - Avatar, username, points
- [ ] 5.4.6: Implement opt-in/opt-out privacy setting
- [ ] 5.4.7: Implement anonymous mode (display username instead of real name)
- [ ] 5.4.8: Refresh leaderboard data (pull to refresh)

**Acceptance Criteria:**
- [ ] Leaderboard displays top 100 users
- [ ] User can see their rank
- [ ] Privacy settings respected
- [ ] Data refreshes correctly

---

### 5.5 Social Sharing
**Priority**: P1  
**Estimated Time**: 1 day

**Tasks:**
- [ ] 5.5.1: Install React Native Share library
- [ ] 5.5.2: Implement share triggers (after level-up, streak milestone, achievement)
- [ ] 5.5.3: Generate share cards (images with stats):
  - Use React Native ViewShot or similar
  - Include level badge, stat, branding
  - Add "Join me at focusedroom.com" CTA
- [ ] 5.5.4: Implement share destinations:
  - Twitter/X
  - LinkedIn
  - Instagram Stories
  - Facebook
  - WhatsApp
  - Copy Link
- [ ] 5.5.5: Add share buttons to profile and reports
- [ ] 5.5.6: Track shares (analytics event)

**Acceptance Criteria:**
- [ ] Share sheet opens with pre-filled message
- [ ] Share cards generate correctly
- [ ] Shares work for all platforms
- [ ] Share links include tracking params

---

## PHASE 6: REPORTS & ANALYTICS (Week 8)

### 6.1 Daily Report
**Priority**: P0  
**Estimated Time**: 2 days

**Tasks:**
- [ ] 6.1.1: Create Reports screen (accessible from bottom tab bar)
- [ ] 6.1.2: Implement date picker (default: today)
- [ ] 6.1.3: Fetch daily data from backend API:
  - Total focus time
  - Sessions completed (valid vs invalid)
  - Points earned
  - Current streak
  - Distraction attempts
  - Override count
  - Most productive hour
- [ ] 6.1.4: Create visualizations:
  - Bar chart: Focus time by hour
  - Pie chart: Valid vs invalid sessions
  - Bar chart: Most attempted apps
- [ ] 6.1.5: Implement comparisons:
  - vs Yesterday
  - vs Last Week
  - vs Your Average
- [ ] 6.1.6: Style report cards (match design system)
- [ ] 6.1.7: Add "Share Report" button

**Acceptance Criteria:**
- [ ] Daily report displays all key metrics
- [ ] Charts render correctly
- [ ] Can view past days by changing date
- [ ] Report is shareable

---

### 6.2 Weekly & Monthly Reports
**Priority**: P1  
**Estimated Time**: 2 days

**Tasks:**
- [ ] 6.2.1: Add week/month selector to Reports screen
- [ ] 6.2.2: Fetch weekly data from backend API:
  - Total focus time this week
  - Total sessions (valid vs invalid)
  - Points earned this week
  - Streak progress (7/7 days)
  - Total distractions blocked
  - Top distraction apps
  - Best day
  - Leaderboard rank
- [ ] 6.2.3: Create weekly visualizations:
  - Line chart: Daily focus time
  - Heatmap calendar: Session days
  - Donut chart: Time by app category
  - Waterfall chart: Points flow
- [ ] 6.2.4: Implement monthly report (similar structure)
- [ ] 6.2.5: Add AI-generated insights (Gemini API):
  - Pattern recognition
  - Predictions
  - Recommendations
- [ ] 6.2.6: Implement weekly email report (opt-in)

**Acceptance Criteria:**
- [ ] Weekly report shows all metrics
- [ ] Monthly report shows all metrics
- [ ] AI insights are relevant and helpful
- [ ] Email reports send correctly

---

### 6.3 Data Export
**Priority**: P2  
**Estimated Time**: 1 day

**Tasks:**
- [ ] 6.3.1: Implement CSV export:
  - Generate CSV from session data
  - Include all fields (date, duration, goal, points, attempts, etc.)
  - Save to device or share via email
- [ ] 6.3.2: Implement PDF export:
  - Generate formatted PDF report
  - Include charts and insights
  - Add branding and styling
- [ ] 6.3.3: Add "Export Data" button in Reports screen
- [ ] 6.3.4: Handle large datasets (pagination, streaming)

**Acceptance Criteria:**
- [ ] CSV export works for all time ranges
- [ ] PDF export generates correctly
- [ ] Files can be saved or shared

---

## PHASE 7: CROSS-PLATFORM SYNC (Week 9)

### 7.1 Backend Sync Infrastructure
**Priority**: P0  
**Estimated Time**: 2 days

**Tasks:**
- [ ] 7.1.1: Set up WebSocket server (Socket.io)
- [ ] 7.1.2: Implement sync API endpoints:
  - `POST /sync/push` (upload local changes)
  - `GET /sync/pull` (download remote changes)
  - `WebSocket wss://api.focusedroom.com/sync` (real-time)
- [ ] 7.1.3: Implement sync queue (store offline changes)
- [ ] 7.1.4: Implement conflict resolution (last-write-wins)
- [ ] 7.1.5: Add sync status indicators (synced, syncing, offline)
- [ ] 7.1.6: Set up Redis for caching real-time data

**Acceptance Criteria:**
- [ ] WebSocket connection establishes successfully
- [ ] Sync endpoints work correctly
- [ ] Offline changes queue and sync when online

---

### 7.2 Real-Time Session Sync
**Priority**: P0  
**Estimated Time**: 2 days

**Tasks:**
- [ ] 7.2.1: Implement session sync on start:
  - Mobile starts session → Push to backend → Notify desktop
  - Desktop receives notification → Activate blocks
- [ ] 7.2.2: Implement session sync on pause:
  - Any device pauses → All devices pause
- [ ] 7.2.3: Implement session sync on stop:
  - Any device stops → All devices stop
- [ ] 7.2.4: Implement session sync on resume:
  - Any device resumes → All devices resume
- [ ] 7.2.5: Handle connection loss during session:
  - Session continues locally
  - Re-sync when connection restored
- [ ] 7.2.6: Display sync status on home screen

**Acceptance Criteria:**
- [ ] Sessions sync in real-time across devices
- [ ] All session actions (start, pause, stop) sync
- [ ] Offline sessions sync when reconnected
- [ ] Sync indicators display correctly

---

### 7.3 Settings & Blocklist Sync
**Priority**: P1  
**Estimated Time**: 1 day

**Tasks:**
- [ ] 7.3.1: Sync user settings:
  - Category toggles
  - Custom blocklists
  - Friction settings
  - Theme preference
  - Notification preferences
- [ ] 7.3.2: Sync Big Five results from website
- [ ] 7.3.3: Implement periodic sync (every 30 seconds when app active)
- [ ] 7.3.4: Implement manual sync (pull to refresh)

**Acceptance Criteria:**
- [ ] Settings sync across all devices
- [ ] Big Five results sync from website
- [ ] Manual sync works correctly

---

## PHASE 8: SETTINGS & CUSTOMIZATION (Week 10)

### 8.1 Settings Screen
**Priority**: P1  
**Estimated Time**: 2 days

**Tasks:**
- [ ] 8.1.1: Create Settings screen UI (accessible from Profile tab)
- [ ] 8.1.2: Organize settings into sections:
  - Account (email, password, linked accounts)
  - Blocking (categories, custom apps, whitelist)
  - Sessions (default duration, breaks, goals)
  - Friction (difficulty, types)
  - Notifications (toggles for each type, quiet hours)
  - Theme (light/dark/auto, font size)
  - Privacy (analytics, data export, delete account)
  - Advanced (developer mode, experimental features)
- [ ] 8.1.3: Implement each setting toggle/selector
- [ ] 8.1.4: Save settings to AsyncStorage and backend
- [ ] 8.1.5: Apply settings changes immediately (e.g., theme change)

**Acceptance Criteria:**
- [ ] All settings display correctly
- [ ] Changing settings works and persists
- [ ] Settings sync across devices

---

### 8.2 Theme & Accessibility
**Priority**: P1  
**Estimated Time**: 1 day

**Tasks:**
- [ ] 8.2.1: Implement theme toggle (light/dark/auto)
- [ ] 8.2.2: Ensure all screens respect theme setting
- [ ] 8.2.3: Implement font size scaling (small, medium, large, XL)
- [ ] 8.2.4: Implement animation toggle (reduced motion)
- [ ] 8.2.5: Test color contrast (WCAG 2.1 AA compliance)
- [ ] 8.2.6: Add screen reader support (accessibility labels)
- [ ] 8.2.7: Test with iOS VoiceOver and Android TalkBack

**Acceptance Criteria:**
- [ ] Theme changes apply immediately
- [ ] Dark mode looks good on all screens
- [ ] Font scaling works correctly
- [ ] App is accessible to screen reader users

---

## PHASE 9: TESTING & QA (Week 11)

### 9.1 Unit Testing
**Priority**: P1  
**Estimated Time**: 2 days

**Tasks:**
- [ ] 9.1.1: Set up Jest for React Native
- [ ] 9.1.2: Write unit tests for:
  - Gamification scoring logic
  - Session calculations
  - Level/streak calculations
  - Form validation
  - API utilities
- [ ] 9.1.3: Aim for >80% code coverage
- [ ] 9.1.4: Set up CI to run tests on every PR

**Acceptance Criteria:**
- [ ] All critical functions have unit tests
- [ ] Tests pass consistently
- [ ] Code coverage >80%

---

### 9.2 Integration Testing
**Priority**: P1  
**Estimated Time**: 2 days

**Tasks:**
- [ ] 9.2.1: Set up Detox for E2E testing
- [ ] 9.2.2: Write E2E tests for:
  - Onboarding flow
  - Login/signup
  - Start/stop session
  - View reports
  - Change settings
- [ ] 9.2.3: Test on multiple devices (iPhone, iPad, various Android devices)
- [ ] 9.2.4: Test offline scenarios
- [ ] 9.2.5: Test cross-device sync

**Acceptance Criteria:**
- [ ] All critical user flows covered by E2E tests
- [ ] Tests pass on iOS and Android
- [ ] Offline tests pass

---

### 9.3 Manual QA & Bug Fixes
**Priority**: P0  
**Estimated Time**: 3 days

**Tasks:**
- [ ] 9.3.1: Create QA test plan (checklist of all features)
- [ ] 9.3.2: Manually test all features on iOS and Android
- [ ] 9.3.3: Test on multiple devices and OS versions
- [ ] 9.3.4: Test edge cases (poor network, battery saver, etc.)
- [ ] 9.3.5: Fix all P0/P1 bugs
- [ ] 9.3.6: Document P2/P3 bugs for future sprints
- [ ] 9.3.7: Get beta tester feedback (100 users)
- [ ] 9.3.8: Iterate based on feedback

**Acceptance Criteria:**
- [ ] All P0 bugs fixed
- [ ] All P1 bugs fixed or documented
- [ ] Beta testers report 4.0+ satisfaction

---

## PHASE 10: LAUNCH PREPARATION (Week 12)

### 10.1 App Store Preparation
**Priority**: P0  
**Estimated Time**: 2 days

**Tasks:**
- [ ] 10.1.1: Create iOS App Store assets:
  - App icon (1024x1024)
  - Screenshots (6.5", 5.5", 12.9" iPad)
  - App preview video (optional but recommended)
  - App description (4000 chars max)
  - Keywords (100 chars)
  - Privacy policy URL
  - Support URL
- [ ] 10.1.2: Create Google Play Store assets:
  - App icon (512x512)
  - Feature graphic (1024x500)
  - Screenshots (phone, tablet, 7" tablet)
  - Promo video (optional)
  - Short description (80 chars)
  - Full description (4000 chars)
  - Privacy policy URL
- [ ] 10.1.3: Set up TestFlight for iOS beta testing
- [ ] 10.1.4: Set up Google Play Internal Testing track
- [ ] 10.1.5: Prepare app submission forms and questionnaires

**Acceptance Criteria:**
- [ ] All store assets created and reviewed
- [ ] Descriptions are compelling and SEO-optimized
- [ ] Screenshots showcase best features
- [ ] Beta testing tracks set up

---

### 10.2 Backend Production Setup
**Priority**: P0  
**Estimated Time**: 1 day

**Tasks:**
- [ ] 10.2.1: Deploy backend to production (Railway/Render/AWS)
- [ ] 10.2.2: Set up production PostgreSQL database
- [ ] 10.2.3: Set up Redis cache
- [ ] 10.2.4: Configure production environment variables
- [ ] 10.2.5: Set up SSL certificates (HTTPS)
- [ ] 10.2.6: Set up monitoring (Sentry, Datadog)
- [ ] 10.2.7: Set up logging (Papertrail, CloudWatch)
- [ ] 10.2.8: Configure auto-scaling and load balancing
- [ ] 10.2.9: Set up database backups (daily)
- [ ] 10.2.10: Perform load testing (simulate 10K concurrent users)

**Acceptance Criteria:**
- [ ] Backend is accessible at production URL
- [ ] Database is backed up automatically
- [ ] Monitoring and logging work
- [ ] Load tests pass

---

### 10.3 Analytics & Monitoring Setup
**Priority**: P0  
**Estimated Time**: 1 day

**Tasks:**
- [ ] 10.3.1: Set up Mixpanel or Amplitude
- [ ] 10.3.2: Implement analytics events:
  - App open
  - Sign up
  - Login
  - Session start/complete/abort
  - Feature usage (reports, leaderboards, etc.)
  - In-app purchases
- [ ] 10.3.3: Set up Firebase Crashlytics (crash reporting)
- [ ] 10.3.4: Set up Firebase Performance Monitoring
- [ ] 10.3.5: Create analytics dashboard
- [ ] 10.3.6: Set up alerts for critical errors

**Acceptance Criteria:**
- [ ] All key events tracked
- [ ] Analytics dashboard accessible
- [ ] Crash reports working
- [ ] Alerts configured

---

### 10.4 App Submission
**Priority**: P0  
**Estimated Time**: 1 day (+ review time: 1-7 days)

**Tasks:**
- [ ] 10.4.1: Final QA pass (all features, all devices)
- [ ] 10.4.2: Create production builds:
  - iOS: Archive and upload to App Store Connect
  - Android: Generate signed APK/AAB and upload to Play Console
- [ ] 10.4.3: Fill out App Store Connect questionnaire:
  - Export compliance
  - Advertising identifier usage
  - Privacy details
- [ ] 10.4.4: Fill out Google Play Console questionnaire:
  - Content rating
  - Privacy policy
  - Permissions justification
- [ ] 10.4.5: Submit for review (iOS & Android)
- [ ] 10.4.6: Monitor review status
- [ ] 10.4.7: Address any rejection reasons (if rejected)
- [ ] 10.4.8: Resubmit if necessary

**Acceptance Criteria:**
- [ ] Both apps submitted for review
- [ ] No critical issues found during final QA
- [ ] All store requirements met

---

## ONGOING TASKS (Post-Launch)

### Content & Community
- [ ] Write 2 blog posts per week for "The Focus Formula"
- [ ] Respond to user reviews (iOS & Android)
- [ ] Monitor and respond to support emails
- [ ] Engage with users on social media
- [ ] Run community challenges

### Product Iteration
- [ ] Weekly analytics review (track KPIs)
- [ ] A/B testing for onboarding, pricing, features
- [ ] Monthly feature releases
- [ ] Quarterly roadmap updates

### Marketing
- [ ] Content marketing (blog, SEO)
- [ ] Social media marketing (Twitter, LinkedIn, Instagram)
- [ ] Paid ads (Facebook, Google, App Store Search Ads)
- [ ] Influencer partnerships
- [ ] PR outreach (ProductHunt, TechCrunch, etc.)

---

## TASK PRIORITIES LEGEND

- **P0 (Critical)**: Must-have for MVP launch
- **P1 (High)**: Important for great user experience
- **P2 (Medium)**: Nice-to-have, can be post-launch
- **P3 (Low)**: Future enhancements

---

## ESTIMATED TIMELINE SUMMARY

| Phase | Duration | Cumulative |
|-------|----------|-----------|
| Phase 1: Setup | 1 week | 1 week |
| Phase 2: Auth | 1 week | 2 weeks |
| Phase 3: Blocking | 2 weeks | 4 weeks |
| Phase 4: Sessions | 2 weeks | 6 weeks |
| Phase 5: Gamification | 1 week | 7 weeks |
| Phase 6: Reports | 1 week | 8 weeks |
| Phase 7: Sync | 1 week | 9 weeks |
| Phase 8: Settings | 1 week | 10 weeks |
| Phase 9: Testing | 1 week | 11 weeks |
| Phase 10: Launch Prep | 1 week | 12 weeks |
| **TOTAL MVP** | **12 weeks** | **3 months** |
| Buffer (unexpected) | +4 weeks | **16 weeks** |
| **REALISTIC TOTAL** | **16 weeks** | **4 months** |

---

## NEXT STEPS

1. ✅ Review and approve this task breakdown
2. ✅ Create project in project management tool (Jira, Linear, Trello)
3. ✅ Assign tasks to team members (or yourself if solo)
4. ✅ Set up development environment (Phase 1.1)
5. ✅ Start Sprint 1 (Phase 1: Project Setup)

---

**Ready to build the best fucking productivity app in the world!** 🚀

