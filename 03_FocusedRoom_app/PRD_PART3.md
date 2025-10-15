# FOCUSED ROOM MOBILE APP - PRD (PART 3)

## 4.I BLOG & NEWSLETTER INTEGRATION

### 4.I.1 In-App Blog Reader

**"The Focus Formula" Blog Access:**

**Home Screen Integration:**
- **Section**: "Recommended Reading" card on home screen
- **Featured Article**: Most recent article with cover image
- **Tap to Read**: Opens in-app web view

**Dedicated Blog Tab:**
- **Bottom Navigation**: "Learn" tab with book icon
- **Blog List View**: Scrollable list of all articles
- **Sorting**: Latest first, Most popular, Recommended for you
- **Categories**: Filter by Attention Science, Deep Work, Behavior Change, Digital Wellness

**Article UI:**
- **Web View**: Clean, mobile-optimized reading experience
- **Reading Progress**: Progress bar at top showing scroll position
- **Estimated Time**: "8 min read" badge
- **Engagement**: Helpful/Not Helpful buttons (synced with website)
- **Share**: Native share sheet for social sharing
- **Bookmark**: Save articles for later reading

**Offline Reading:**
- **Download**: Tap download icon to save article for offline
- **My Library**: View all downloaded articles
- **Auto-Sync**: Download latest articles when on Wi-Fi

### 4.I.2 Personalized Content Delivery

**Personality-Based Recommendations:**

**High Openness (70-100):**
- **Articles**: "The Curiosity Trap", "Deep Dive vs Rabbit Hole"
- **Rationale**: Openness = curiosity-driven distraction

**High Conscientiousness (70-100):**
- **Articles**: "Perfect Morning Routine", "Systems for Success"
- **Rationale**: Conscientiousness = appreciation for structure

**High Neuroticism (70-100):**
- **Articles**: "Anxiety-Free Productivity", "Self-Compassion in Deep Work"
- **Rationale**: Neuroticism = need for stress management

**High Extraversion (70-100):**
- **Articles**: "Social Accountability", "Productive Collaboration"
- **Rationale**: Extraversion = social motivation

**Low Conscientiousness (0-39):**
- **Articles**: "Tiny Habits for Focus", "The 2-Minute Rule"
- **Rationale**: Low conscientiousness = need for easy wins

**Behavior-Based Recommendations:**
- **High Override Rate**: "Breaking the Override Habit"
- **Streak Break**: "Bouncing Back After Setbacks"
- **Plateau**: "Breaking Through Productivity Plateaus"

**AI-Powered (Gemini):**
- **Prompt**: "Given this user's personality scores and recent behavior, recommend 3 blog articles that will help them most"
- **Response**: Top 3 articles with personalized reasoning

### 4.I.3 Push Notifications for New Content

**Notification Strategy:**

**New Article Published:**
- **Timing**: Thursday 8am user's local time (when "Focus Formula" publishes)
- **Message**: "New article: [Title] - Perfect for your personality 🎯"
- **Personalization**: Only notify if article matches user's personality
- **Frequency**: Max 1 per week (not spammy)

**Recommended Read:**
- **Timing**: Monday morning (start of week)
- **Message**: "Start your week with: [Article Title]"
- **Smart Scheduling**: Send when user typically opens app

**Achievement-Based:**
- **After Milestone**: Complete 10 sessions → "You earned this read: [Article]"
- **After Streak**: 7-day streak → "Celebrate with: [Article]"

**Deep Linking:**
- Tap notification → Opens article directly in app
- "Read Later" action button in notification

### 4.I.4 Newsletter Signup

**In-App Newsletter Signup:**

**Entry Points:**
- **Onboarding**: "Get weekly focus tips via email?" (optional step)
- **After Reading Article**: "Enjoyed this? Get articles in your inbox"
- **Settings**: "Newsletter" toggle in account settings
- **Home Screen**: Dismissible banner (show once per week)

**Signup Flow:**
1. User taps "Subscribe to Newsletter"
2. Pre-filled with account email
3. Tap "Subscribe" button
4. Confirmation: "You're subscribed! Check your email for welcome message"
5. Welcome email sent immediately (via SendGrid)

**Personalized Newsletter:**
- **Content**: Articles matched to user's personality
- **Frequency**: Weekly (Sunday morning, prep for the week)
- **Format**: 
  - Hero image
  - Main article (personality-matched)
  - Quick tip
  - User's weekly stats (if opted in)
  - Motivational message

**Unsubscribe:**
- **Easy Opt-Out**: "Manage subscription" link in every email
- **In-App**: Toggle off in settings
- **No Shaming**: Graceful unsubscribe confirmation

### 4.I.5 Content Gamification

**Reading Achievements:**
- **Bookworm**: Read 10 articles
- **Scholar**: Read 50 articles
- **Philosopher**: Read all articles in a category

**Reading Streaks:**
- **Weekly Reader**: Read 1 article per week for 4 weeks
- **Daily Learner**: Read 1 article per day for 7 days

**Points for Reading:**
- **Read Article**: +5 points
- **Share Article**: +3 points
- **Mark as Helpful**: +1 point

**Progress Tracking:**
- **Articles Read**: Counter in profile
- **Reading Time**: Total time spent reading
- **Favorite Category**: Category with most reads

---

## 5. USER EXPERIENCE (UX) & USER INTERFACE (UI)

### 5.1 Design Principles

**Core Aesthetic:**
- **Modern-Minimal**: Clean, uncluttered, focused
- **Calming/Zen**: Soothing colors, gentle animations
- **Professional**: Not childish, suitable for professionals
- **Motivating**: Gamification elements without being overwhelming

**Inspiration Sources:**
- **Apple**: Minimalism, attention to detail, polish
- **Notion**: Clean interface, intuitive navigation
- **Calm.com**: Zen aesthetic, relaxing design
- **Duolingo**: Gamification done right
- **Linear.app**: Professional, modern UI
- **Figma**: Design system consistency

**User-Centric Design:**
- **Clarity**: Every element has a clear purpose
- **Feedback**: Immediate response to every action
- **Consistency**: Same patterns across all screens
- **Accessibility**: WCAG 2.1 AA compliance

### 5.2 Brand Consistency (From Existing Design System)

**Color Palette:**

**Primary Colors:**
```css
--color-primary-500: #7A9E9F;   /* Teal - Main brand */
--color-primary-600: #6B8B8C;   /* Teal - Darker (hover) */
```

**Accent Colors:**
```css
--color-accent: #38a169;        /* Green - Success, streaks */
--color-cta-accent: #667eea;    /* Purple - Badges, special */
--color-danger: #e53e3e;        /* Red - Warnings, friction */
```

**Neutral Palette:**
```css
--color-neutral-100: #FAF9F5;   /* Card backgrounds */
--color-neutral-200: #F7FAFC;   /* Alternate surfaces */
--color-border: #E2E8F0;        /* Borders, dividers */
```

**Text Colors:**
```css
--color-text-900: #2d3748;      /* Primary text (headings) */
--color-text-700: #4a5568;      /* Secondary text (body) */
--color-muted: #718096;         /* Tertiary text (captions) */
```

**Backgrounds:**
```css
--bg-light: #ffffff;
--bg-dark: #0f1724;
```

**Dark Mode:**
```css
--bg-dark: #0f1724;
--color-surface-dark: #111827;
--color-text-dark: #e6eef6;
--color-muted-dark: #9aa6b2;
--color-border-dark: #2b3942;
```

**Effects:**
```css
--gradient-primary: linear-gradient(135deg, #7A9E9F 0%, #6B8B8C 100%);
--radius: 12px;
--shadow-soft: 0 8px 30px rgba(15, 23, 36, 0.08);
```

### 5.3 Typography

**Font Stack:**
```css
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Helvetica Neue', Arial, sans-serif;
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 
             'Courier New', monospace;
```

**Type Scale:**
```css
--text-5xl: 3rem;       /* 48px - Hero titles */
--text-4xl: 2.25rem;    /* 36px - Page titles */
--text-3xl: 1.875rem;   /* 30px - Section headers */
--text-2xl: 1.5rem;     /* 24px - Card headers */
--text-xl: 1.25rem;     /* 20px - Subheaders */
--text-lg: 1.125rem;    /* 18px - Emphasized body */
--text-base: 1rem;      /* 16px - Body text */
--text-sm: 0.875rem;    /* 14px - Small text */
--text-xs: 0.75rem;     /* 12px - Captions */
```

**Line Heights:**
```css
--leading-tight: 1.25;    /* Headlines */
--leading-snug: 1.375;    /* Subheadings */
--leading-normal: 1.5;    /* UI text */
--leading-relaxed: 1.625; /* Body text */
--leading-loose: 2;       /* Spacious text */
```

**Usage Guidelines:**
- **H1 (Screen Titles)**: `text-4xl`, bold (700), `leading-tight`
- **H2 (Section Headers)**: `text-3xl`, semibold (600), `leading-snug`
- **H3 (Card Headers)**: `text-2xl`, semibold (600), `leading-snug`
- **Body Text**: `text-base`, regular (400), `leading-relaxed`
- **Captions**: `text-sm`, regular (400), `leading-normal`
- **Tiny Labels**: `text-xs`, medium (500), `leading-normal`

### 5.4 Component Styling

**Buttons:**

**Primary Button (CTA):**
```css
background: var(--color-primary-500);
color: white;
padding: 12px 24px;
border-radius: 9999px; /* Pill shape */
font-weight: 600;
font-size: 1rem;
transition: all 0.2s ease;
box-shadow: 0 4px 12px rgba(122, 158, 159, 0.2);

/* Hover/Press */
background: var(--color-primary-600);
transform: translateY(-2px);
box-shadow: 0 6px 16px rgba(122, 158, 159, 0.3);
```

**Secondary Button (Ghost):**
```css
background: transparent;
color: var(--color-primary-500);
padding: 12px 24px;
border-radius: 9999px;
border: 2px solid var(--color-primary-500);
font-weight: 600;
font-size: 1rem;

/* Hover/Press */
background: var(--color-primary-500);
color: white;
```

**Button Sizes:**
- **Small**: `padding: 8px 16px`, `font-size: 0.875rem`
- **Medium** (default): `padding: 12px 24px`, `font-size: 1rem`
- **Large**: `padding: 16px 32px`, `font-size: 1.125rem`

**Cards:**
```css
background: var(--color-neutral-100);
border-radius: var(--radius); /* 12px */
padding: 20px;
box-shadow: var(--shadow-soft);
transition: transform 0.2s ease, box-shadow 0.2s ease;

/* Hover (if interactive) */
transform: translateY(-4px);
box-shadow: 0 12px 40px rgba(15, 23, 36, 0.12);
```

**Form Inputs:**
```css
background: var(--bg-light);
border: 2px solid var(--color-border);
border-radius: var(--radius);
padding: 12px 16px;
font-size: 1rem;
color: var(--color-text-900);
transition: border-color 0.2s ease;

/* Focus */
border-color: var(--color-primary-500);
box-shadow: 0 0 0 3px rgba(122, 158, 159, 0.1);
outline: none;

/* Error */
border-color: var(--color-danger);
```

**Badges (for streaks, counts):**
```css
background: var(--color-accent);
color: white;
padding: 4px 8px;
border-radius: 12px; /* Rounded pill */
font-size: 0.75rem;
font-weight: 600;
```

### 5.5 Animations

**Timing Functions:**
```css
--ease-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

**Durations:**
```css
--duration-fast: 150ms;   /* Micro-interactions */
--duration-base: 200ms;   /* Standard transitions */
--duration-slow: 300ms;   /* Deliberate animations */
```

**Common Animations:**

**Fade In:**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
animation: fadeIn 200ms ease-out;
```

**Slide Up:**
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
animation: slideUp 300ms ease-out;
```

**Scale Bounce (for celebrations):**
```css
@keyframes scaleBounce {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}
animation: scaleBounce 400ms ease-out;
```

**Shake (for errors):**
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}
animation: shake 400ms ease-in-out;
```

**Respect User Preferences:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5.6 Accessibility (WCAG 2.1 AA Compliance)

**Color Contrast:**
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text** (18px+ or 14px+ bold): Minimum 3:1
- **UI Components**: Minimum 3:1
- **Testing Tool**: Use Stark or similar for validation

**Focus States:**
```css
*:focus-visible {
  outline: 3px solid var(--color-primary-500);
  outline-offset: 3px;
  border-radius: 4px;
}
```

**Touch Targets:**
- **Minimum Size**: 44px × 44px (iOS guideline)
- **Spacing**: 8px minimum between targets
- **Easy Thumb Reach**: Critical actions in lower 2/3 of screen

**Screen Reader Support:**
- **Semantic HTML**: Use proper elements (`<button>`, `<nav>`, `<header>`)
- **ARIA Labels**: For icon-only buttons
- **ARIA Live Regions**: For dynamic content updates
- **Alt Text**: Descriptive alt text for all images

**Keyboard Navigation:**
- **Tab Order**: Logical tab sequence
- **Focus Trapping**: In modals, don't let focus escape
- **Keyboard Shortcuts**: Optional (e.g., `Cmd+N` for new session)

**Text Scaling:**
- Support iOS/Android system font size settings
- Test at 200% zoom (accessibility requirement)
- Use relative units (`rem`, `em`) not fixed (`px`)

### 5.7 Navigation Structure

**Bottom Tab Bar** (5 tabs):
1. **Home** 🏠
   - Current session status
   - Quick start button
   - Today's stats
   - Recommended article

2. **Sessions** 📊
   - All past sessions
   - Session history
   - Filters (today, week, month)

3. **Reports** 📈
   - Daily/Weekly/Monthly reports
   - Charts and graphs
   - Export options

4. **Learn** 📚
   - Blog articles
   - Recommended reads
   - Bookmarked articles

5. **Profile** 👤
   - User stats (level, streak, points)
   - Settings
   - Achievements
   - Account management

**Top Navigation:**
- **Screen Title**: Current screen name
- **Action Button**: Context-specific (e.g., "Export" on Reports)
- **Notification Icon**: Badge with unread count

**Gesture Navigation:**
- **Swipe Right**: Go back (iOS standard)
- **Pull to Refresh**: Refresh data
- **Swipe on List Items**: Quick actions (delete, archive)

### 5.8 Onboarding Flow

**Goal**: Get user to first successful session ASAP.

**Step 1: Welcome (Splash)**
- **Duration**: 2 seconds
- **Content**: Logo, tagline
- **Auto-advance**: No interaction required

**Step 2: Value Proposition (3 slides)**
- **Slide 1**: "Block distractions. Build focus."
  - Visual: Phone with blocked apps
- **Slide 2**: "Gamify your productivity"
  - Visual: Level-up animation
- **Slide 3**: "Sync across all devices"
  - Visual: Phone + laptop syncing
- **Skip Button**: "Skip" in top-right
- **Next Button**: Swipe or tap "Next"

**Step 3: Sign In / Sign Up**
- **Options**:
  - "Sign in with Google"
  - "Sign in with Apple"
  - "Continue with Email"
- **Skip**: "Skip for now" (limited features)

**Step 4: Permissions**
- **iOS Screen Time**:
  - "To block apps, we need Screen Time access"
  - "Grant Access" button → Opens Settings
- **Android Accessibility**:
  - "To block apps, we need Accessibility access"
  - "Grant Access" button → Opens Settings
- **Notifications**:
  - "Get reminders for your focus sessions"
  - "Allow Notifications" / "Skip"

**Step 5: Choose Apps to Block**
- **Quick Setup**: "Block all distracting apps" (recommended)
- **Custom**: Choose categories
- **Visual**: Icons of apps to be blocked
- **Continue Button**: Enabled after selection

**Step 6: First Session Setup**
- **Duration Selector**: Default 25 min (Pomodoro)
- **Goal Input**: "What will you focus on?" (optional)
- **Start Button**: "Start My First Session"

**Step 7: Session In Progress**
- **Skip Rest of Onboarding**: User is now in session
- **Mini-Tutorial**: Tooltips during first session
  - "This is your timer"
  - "Blocked apps will show this screen"
  - "Tap here to pause if needed"

**Step 8: First Session Complete! 🎉**
- **Celebration Screen**:
  - Confetti animation
  - "Amazing! You completed your first session"
  - Points earned: "+20 pts"
  - "You're now a Seedling Focus"
- **Next Steps**:
  - "Start Another Session"
  - "Explore Reports"
  - "Set Up Big Five" (link to website)

**Onboarding Analytics:**
- Track completion rate for each step
- Optimize based on drop-off points
- A/B test different flows

---

## 6. TECHNICAL REQUIREMENTS

### 6.1 Platform & Technology Stack

**Mobile Platform:**
- **Framework**: React Native (v0.73+)
- **Rationale**: Single codebase for iOS & Android, faster development, easier maintenance
- **Language**: TypeScript (for type safety)
- **State Management**: Redux Toolkit + React Query
- **Navigation**: React Navigation v6

**Backend:**
- **Server**: Node.js (Express.js)
- **Database**: PostgreSQL (relational data: users, sessions, scores)
- **Cache**: Redis (session caching, real-time data)
- **File Storage**: AWS S3 (avatars, reports, assets)
- **Real-Time**: Socket.io or Firebase Cloud Messaging
- **API**: RESTful API + GraphQL (for complex queries)

**Authentication:**
- **JWT**: JSON Web Tokens for session management
- **OAuth**: Google, Apple Sign-In
- **Biometric**: React Native Biometrics (Face ID, Touch ID)

**AI Integration:**
- **LLM**: Google Gemini 1.5 Pro API
- **Use Cases**: 
  - Personality insights generation
  - Personalized recommendations
  - Adaptive friction adjustments
  - Article recommendations
- **Fallback**: Rule-based recommendations if API fails

**Analytics:**
- **Platform**: Mixpanel or Amplitude
- **Metrics**: User behavior, feature adoption, retention
- **Crash Reporting**: Sentry
- **Performance**: Firebase Performance Monitoring

**Push Notifications:**
- **iOS**: APNs (Apple Push Notification service)
- **Android**: FCM (Firebase Cloud Messaging)
- **Service**: Firebase Cloud Messaging (unified)

**Payment Processing (Future):**
- **iOS**: In-App Purchases (StoreKit)
- **Android**: Google Play Billing
- **Subscription Management**: RevenueCat

### 6.2 iOS-Specific Requirements

**Minimum Version:**
- **iOS 15.0+** (for Screen Time API)

**Key APIs:**

**Screen Time API:**
```swift
import FamilyControls
import ManagedSettings

// Request authorization
let center = AuthorizationCenter.shared
try await center.requestAuthorization(for: .individual)

// Block apps
let settings = ManagedSettings()
settings.application.blockedApplications = blockedApps
```

**Focus Mode Integration:**
```swift
import Intents

// Detect Focus Mode changes
NotificationCenter.default.addObserver(
  forName: UIApplication.didBecomeActiveNotification,
  object: nil,
  queue: .main
) { _ in
  // Check Focus Mode status
}
```

**Capabilities:**
- **Background Fetch**: Periodic sync every 15 minutes
- **Background Processing**: Long-running tasks
- **Push Notifications**: Remote notifications
- **App Groups**: Share data with widget

**Widgets (iOS 14+):**
- **Today Widget**: Show current session timer
- **Focus Stats Widget**: Daily focus time, streak
- **Implementation**: SwiftUI + WidgetKit

### 6.3 Android-Specific Requirements

**Minimum Version:**
- **Android 8.0 (API 26+)**
- **Target**: Android 14 (API 34)

**Key APIs:**

**UsageStatsManager:**
```kotlin
val usageStatsManager = getSystemService(Context.USAGE_STATS_SERVICE) 
                        as UsageStatsManager
val stats = usageStatsManager.queryUsageStats(
  UsageStatsManager.INTERVAL_DAILY,
  startTime,
  endTime
)
```

**AccessibilityService:**
```kotlin
class BlockingAccessibilityService : AccessibilityService() {
  override fun onAccessibilityEvent(event: AccessibilityEvent) {
    if (event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
      val packageName = event.packageName.toString()
      if (isBlocked(packageName)) {
        // Show blocking overlay
      }
    }
  }
}
```

**Foreground Service:**
- **Persistent Notification**: "Focused Room is blocking distractions"
- **Auto-Start**: Start service on boot (if session was active)

**Permissions:**
```xml
<uses-permission android:name="android.permission.PACKAGE_USAGE_STATS"/>
<uses-permission android:name="android.permission.BIND_ACCESSIBILITY_SERVICE"/>
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
```

**Widgets (Android 12+):**
- **Home Screen Widget**: Session timer
- **Stats Widget**: Daily focus time
- **Implementation**: Jetpack Compose (native) or React Native Widget

### 6.4 Backend API Specification

**Base URL:** `https://api.focusedroom.com/v1`

**Authentication:**
- **Header**: `Authorization: Bearer <JWT_TOKEN>`
- **Refresh**: `/auth/refresh` endpoint

**Core Endpoints:**

**Auth:**
```
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
POST /auth/google
POST /auth/apple
```

**User:**
```
GET /user/profile
PUT /user/profile
GET /user/personality (Big Five scores)
DELETE /user/account
```

**Sessions:**
```
POST /sessions (create new session)
GET /sessions (list all sessions)
GET /sessions/:id (get specific session)
PUT /sessions/:id (update session)
DELETE /sessions/:id
GET /sessions/active (get current active session)
```

**Gamification:**
```
GET /gamification/summary
GET /gamification/leaderboard
GET /gamification/achievements
POST /gamification/event (track event: blocked_attempt, override, etc.)
```

**Blocklists:**
```
GET /blocklists/categories
GET /blocklists/:category/apps
POST /user/blocklists (update user's custom blocklist)
GET /user/blocklists
```

**Reports:**
```
GET /reports/daily?date=2025-10-15
GET /reports/weekly?week=2025-W42
GET /reports/monthly?month=2025-10
GET /reports/export?format=csv|pdf
```

**Blog:**
```
GET /blog/articles
GET /blog/articles/:slug
GET /blog/recommendations (personality-based)
POST /blog/:slug/engagement (like, helpful vote)
```

**Sync:**
```
POST /sync/push (push local changes)
GET /sync/pull (pull remote changes)
WebSocket: wss://api.focusedroom.com/sync
```

### 6.5 Database Schema (PostgreSQL)

**users:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  oauth_provider VARCHAR(50), -- 'google', 'apple', null
  oauth_id VARCHAR(255)
);
```

**personality_scores:**
```sql
CREATE TABLE personality_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  openness DECIMAL(5,2),
  conscientiousness DECIMAL(5,2),
  extraversion DECIMAL(5,2),
  agreeableness DECIMAL(5,2),
  neuroticism DECIMAL(5,2),
  test_date TIMESTAMP DEFAULT NOW(),
  report_url TEXT
);
```

**sessions:**
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  planned_duration INTEGER, -- seconds
  actual_duration INTEGER, -- seconds
  goal TEXT,
  status VARCHAR(20), -- 'active', 'completed', 'aborted'
  valid_completion BOOLEAN DEFAULT FALSE,
  blocked_attempts INTEGER DEFAULT 0,
  overrides INTEGER DEFAULT 0,
  was_paused BOOLEAN DEFAULT FALSE,
  pause_time INTEGER DEFAULT 0, -- seconds paused
  device_type VARCHAR(20), -- 'mobile', 'desktop'
  created_at TIMESTAMP DEFAULT NOW()
);
```

**gamification_scores:**
```sql
CREATE TABLE gamification_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  daily_streak INTEGER DEFAULT 0,
  weekly_streak INTEGER DEFAULT 0,
  current_level VARCHAR(50) DEFAULT 'Seedling Focus',
  last_session_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**gamification_events:**
```sql
CREATE TABLE gamification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(50), -- 'blocked_attempt', 'override', 'session_complete', etc.
  points INTEGER,
  timestamp TIMESTAMP DEFAULT NOW(),
  metadata JSONB -- Additional event-specific data
);
```

**achievements:**
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_url TEXT,
  points_reward INTEGER DEFAULT 0
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

**blocklists:**
```sql
CREATE TABLE user_blocklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  app_identifier VARCHAR(255), -- Package name (Android) or Bundle ID (iOS)
  app_name VARCHAR(255),
  category VARCHAR(50), -- 'social', 'entertainment', 'custom', etc.
  is_whitelisted BOOLEAN DEFAULT FALSE,
  added_at TIMESTAMP DEFAULT NOW()
);
```

**blog_engagement:**
```sql
CREATE TABLE blog_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  article_slug VARCHAR(255),
  engagement_type VARCHAR(20), -- 'like', 'helpful_yes', 'helpful_no', 'read'
  timestamp TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, article_slug, engagement_type)
);
```

### 6.6 Security & Privacy

**Data Encryption:**
- **In Transit**: TLS 1.3 for all API calls
- **At Rest**: PostgreSQL encryption, encrypted S3 buckets
- **Sensitive Data**: bcrypt for password hashing (cost factor 12)

**Privacy Principles:**
- **Data Minimization**: Collect only necessary data
- **No PII in Logs**: Scrub emails, names from logs
- **Anonymous Analytics**: Use hashed user IDs for analytics
- **Right to Deletion**: Full account deletion within 30 days
- **Data Export**: GDPR-compliant export in JSON format

**API Security:**
- **Rate Limiting**: 100 req/min per user, 1000 req/min per IP
- **JWT Expiry**: Access tokens 15 min, refresh tokens 30 days
- **CORS**: Whitelist only app domains
- **SQL Injection**: Use parameterized queries (ORM)
- **XSS Prevention**: Sanitize all user inputs

**App Security:**
- **Certificate Pinning**: Prevent MITM attacks
- **Jailbreak/Root Detection**: Warn users (don't block)
- **Code Obfuscation**: ProGuard (Android), bitcode (iOS)
- **Secure Storage**: iOS Keychain, Android EncryptedSharedPreferences

**Compliance:**
- **GDPR**: EU data protection regulation
- **CCPA**: California privacy law
- **COPPA**: Children's privacy (13+ age gate)

### 6.7 Performance Requirements

**App Performance:**
- **Launch Time**: <2 seconds cold start, <500ms warm start
- **Frame Rate**: 60 FPS for all animations
- **Memory Usage**: <150 MB RAM during active session
- **Battery Impact**: <5% per hour during session
- **APK Size**: <50 MB (Android), <100 MB (iOS)

**API Performance:**
- **Response Time**: p95 <200ms, p99 <500ms
- **Availability**: 99.9% uptime (43 min downtime/month max)
- **Concurrent Users**: Support 10,000 simultaneous sessions
- **Database Queries**: <50ms for simple reads, <200ms for complex joins

**Offline Support:**
- **Core Features**: Session start/stop works offline
- **Sync Queue**: Up to 1000 offline events queued
- **Conflict Resolution**: Automatic merge on reconnect

---

*[CONTINUED IN NEXT FILE: PRD_PART4.md]*

