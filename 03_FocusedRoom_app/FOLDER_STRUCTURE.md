# 📁 FOCUSED ROOM MOBILE APP - FOLDER STRUCTURE

**Industry-Standard React Native Project Structure**

This structure follows best practices for scalability, maintainability, and team collaboration.

```
03_FocusedRoom_app/
│
├── .cursorrules                 # Cursor AI agent rules and guidelines
├── PRD.md                       # Product Requirements Document (Part 1)
├── PRD_PART2.md                # Product Requirements Document (Part 2)
├── PRD_PART3.md                # Product Requirements Document (Part 3)
├── PRD_PART4.md                # Product Requirements Document (Part 4)
├── TASKS.md                    # Detailed task breakdown for development
├── FOLDER_STRUCTURE.md          # This file
├── README.md                    # Project overview and setup instructions
│
├── android/                     # Android native code
│   ├── app/
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── java/com/focusedroom/
│   │   │       │   ├── MainActivity.java
│   │   │       │   ├── MainApplication.java
│   │   │       │   └── blocking/
│   │   │       │       ├── BlockingAccessibilityService.kt
│   │   │       │       ├── BlockingOverlayActivity.kt
│   │   │       │       └── NativeBlockingModule.kt
│   │   │       ├── res/                # Android resources
│   │   │       └── AndroidManifest.xml
│   │   └── build.gradle
│   ├── gradle/
│   └── build.gradle
│
├── ios/                         # iOS native code
│   ├── FocusedRoom/
│   │   ├── AppDelegate.h
│   │   ├── AppDelegate.mm
│   │   ├── Info.plist
│   │   ├── Images.xcassets/     # iOS assets
│   │   └── Blocking/
│   │       ├── BlockingManager.swift
│   │       ├── ScreenTimeManager.swift
│   │       └── NativeBlockingBridge.m
│   ├── FocusedRoom.xcodeproj/
│   └── Podfile
│
├── src/                         # Application source code
│   │
│   ├── api/                     # API client and endpoints
│   │   ├── client.ts            # Axios instance, interceptors
│   │   ├── endpoints/
│   │   │   ├── auth.ts          # Authentication APIs
│   │   │   ├── sessions.ts      # Session APIs
│   │   │   ├── gamification.ts  # Gamification APIs
│   │   │   ├── reports.ts       # Reports APIs
│   │   │   ├── blocklist.ts     # Blocklist APIs
│   │   │   ├── blog.ts          # Blog APIs
│   │   │   └── sync.ts          # Sync APIs
│   │   ├── types.ts             # API type definitions
│   │   └── index.ts
│   │
│   ├── assets/                  # Static assets
│   │   ├── images/
│   │   │   ├── logo.png
│   │   │   ├── onboarding/      # Onboarding images
│   │   │   ├── achievements/    # Achievement badge images
│   │   │   └── levels/          # Level badge images
│   │   ├── fonts/               # Custom fonts (if any)
│   │   └── animations/          # Lottie animations (if any)
│   │
│   ├── components/              # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button.tsx       # Primary, secondary, ghost buttons
│   │   │   ├── Card.tsx         # Card component
│   │   │   ├── Input.tsx        # Text input
│   │   │   ├── Badge.tsx        # Badge component (streaks, counts)
│   │   │   ├── Avatar.tsx       # User avatar
│   │   │   ├── Loading.tsx      # Loading spinner
│   │   │   ├── EmptyState.tsx   # Empty state component
│   │   │   └── ErrorBoundary.tsx # Error boundary
│   │   ├── session/
│   │   │   ├── Timer.tsx        # Session timer component
│   │   │   ├── SessionControls.tsx # Pause, stop, resume buttons
│   │   │   ├── ProgressRing.tsx # Circular progress indicator
│   │   │   └── SessionCard.tsx  # Session history card
│   │   ├── gamification/
│   │   │   ├── LevelBadge.tsx   # User level badge
│   │   │   ├── StreakDisplay.tsx # Streak flame icon + count
│   │   │   ├── PointsDisplay.tsx # Points display
│   │   │   ├── AchievementCard.tsx # Achievement card
│   │   │   └── LeaderboardRow.tsx # Leaderboard entry
│   │   ├── blocking/
│   │   │   ├── AppItem.tsx      # App list item
│   │   │   ├── CategoryCard.tsx # Blocklist category card
│   │   │   └── FrictionOverlay.tsx # Full-screen friction challenge
│   │   ├── reports/
│   │   │   ├── BarChart.tsx     # Bar chart component
│   │   │   ├── LineChart.tsx    # Line chart component
│   │   │   ├── PieChart.tsx     # Pie chart component
│   │   │   └── StatCard.tsx     # Stat card component
│   │   └── index.ts
│   │
│   ├── config/                  # App configuration
│   │   ├── constants.ts         # App constants
│   │   ├── env.ts               # Environment variables
│   │   └── navigation.ts        # Navigation configuration
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts           # Auth hook
│   │   ├── useSession.ts        # Session management hook
│   │   ├── useGamification.ts   # Gamification hook
│   │   ├── useBlocklist.ts      # Blocklist hook
│   │   ├── useTheme.ts          # Theme hook
│   │   ├── useSync.ts           # Sync hook
│   │   └── index.ts
│   │
│   ├── navigation/              # React Navigation setup
│   │   ├── RootNavigator.tsx    # Root navigation stack
│   │   ├── AuthNavigator.tsx    # Auth screens (login, signup)
│   │   ├── MainNavigator.tsx    # Main app screens (bottom tabs)
│   │   ├── types.ts             # Navigation type definitions
│   │   └── linking.ts           # Deep linking configuration
│   │
│   ├── screens/                 # App screens
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignupScreen.tsx
│   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   └── OnboardingScreen.tsx
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx   # Main home screen
│   │   │   ├── SessionStartScreen.tsx # Session configuration
│   │   │   └── SessionActiveScreen.tsx # During session
│   │   ├── sessions/
│   │   │   ├── SessionsListScreen.tsx # Session history
│   │   │   └── SessionDetailScreen.tsx # Individual session details
│   │   ├── reports/
│   │   │   ├── ReportsScreen.tsx # Main reports screen
│   │   │   ├── DailyReportScreen.tsx
│   │   │   ├── WeeklyReportScreen.tsx
│   │   │   └── MonthlyReportScreen.tsx
│   │   ├── learn/
│   │   │   ├── BlogListScreen.tsx # Blog article list
│   │   │   └── BlogDetailScreen.tsx # Article reader
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx # User profile
│   │   │   ├── EditProfileScreen.tsx
│   │   │   ├── AchievementsScreen.tsx # Badge gallery
│   │   │   ├── LeaderboardScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   ├── blocking/
│   │   │   ├── BlocklistScreen.tsx # Manage blocklists
│   │   │   ├── CategoryAppsScreen.tsx # Apps in category
│   │   │   ├── CustomAppsScreen.tsx # Custom app selection
│   │   │   └── FrictionChallengeScreen.tsx # Friction overlay
│   │   └── index.ts
│   │
│   ├── services/                # Business logic services
│   │   ├── authService.ts       # Authentication logic
│   │   ├── sessionService.ts    # Session management logic
│   │   ├── gamificationService.ts # Gamification calculations
│   │   ├── blockingService.ts   # App blocking logic
│   │   ├── reportService.ts     # Report generation logic
│   │   ├── syncService.ts       # Cross-platform sync logic
│   │   ├── notificationService.ts # Push notifications
│   │   ├── analyticsService.ts  # Analytics tracking
│   │   ├── storageService.ts    # Local storage (AsyncStorage)
│   │   ├── aiService.ts         # Gemini AI integration
│   │   └── index.ts
│   │
│   ├── store/                   # Redux store
│   │   ├── index.ts             # Store configuration
│   │   ├── slices/
│   │   │   ├── authSlice.ts     # Auth state
│   │   │   ├── userSlice.ts     # User profile state
│   │   │   ├── sessionSlice.ts  # Active session state
│   │   │   ├── gamificationSlice.ts # Points, levels, streaks
│   │   │   ├── blocklistSlice.ts # Blocklist state
│   │   │   ├── reportsSlice.ts  # Reports state
│   │   │   ├── settingsSlice.ts # User settings
│   │   │   └── index.ts
│   │   └── types.ts             # Redux type definitions
│   │
│   ├── theme/                   # Design system & styling
│   │   ├── index.ts             # Theme configuration
│   │   ├── colors.ts            # Color tokens
│   │   ├── typography.ts        # Typography scale
│   │   ├── spacing.ts           # Spacing scale
│   │   ├── shadows.ts           # Shadow styles
│   │   └── animations.ts        # Animation configurations
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── session.ts
│   │   ├── gamification.ts
│   │   ├── blocklist.ts
│   │   ├── report.ts
│   │   ├── user.ts
│   │   └── index.ts
│   │
│   ├── utils/                   # Utility functions
│   │   ├── date.ts              # Date formatting, calculations
│   │   ├── validation.ts        # Form validation
│   │   ├── formatting.ts        # Number, text formatting
│   │   ├── storage.ts           # AsyncStorage helpers
│   │   ├── permissions.ts       # Permission helpers
│   │   ├── device.ts            # Device info helpers
│   │   └── index.ts
│   │
│   ├── App.tsx                  # Root app component
│   └── index.ts                 # Entry point
│
├── __tests__/                   # Test files
│   ├── unit/
│   │   ├── services/
│   │   │   ├── gamificationService.test.ts
│   │   │   └── sessionService.test.ts
│   │   └── utils/
│   │       └── validation.test.ts
│   ├── integration/
│   │   └── auth.test.ts
│   └── e2e/
│       ├── onboarding.e2e.ts
│       ├── session.e2e.ts
│       └── reports.e2e.ts
│
├── assets/                      # Root-level assets
│   └── blocklists/              # Pre-defined blocklists (JSON)
│       ├── social.json
│       ├── entertainment.json
│       ├── news.json
│       ├── shopping.json
│       ├── adult.json
│       └── games.json
│
├── docs/                        # Additional documentation
│   ├── API.md                   # API documentation
│   ├── ARCHITECTURE.md          # Architecture overview
│   ├── CONTRIBUTING.md          # Contribution guidelines
│   ├── DEPLOYMENT.md            # Deployment instructions
│   └── TROUBLESHOOTING.md       # Common issues and solutions
│
├── scripts/                     # Build and deployment scripts
│   ├── postinstall.sh           # Post-install setup
│   ├── prebuild.sh              # Pre-build checks
│   └── deploy.sh                # Deployment script
│
├── .env.example                 # Example environment variables
├── .env.development             # Development environment variables
├── .env.production              # Production environment variables
├── .gitignore                   # Git ignore rules
├── .prettierrc                  # Prettier configuration
├── .eslintrc.js                 # ESLint configuration
├── tsconfig.json                # TypeScript configuration
├── babel.config.js              # Babel configuration
├── metro.config.js              # Metro bundler configuration
├── package.json                 # NPM dependencies
├── yarn.lock / package-lock.json # Dependency lock file
├── app.json                     # Expo/React Native app configuration
└── README.md                    # Project README

```

---

## 📝 FOLDER STRUCTURE EXPLAINED

### `/android` & `/ios`
**Native code directories.** Only modify these when adding native modules (e.g., Screen Time API, AccessibilityService).

### `/src/api`
**API layer.** All backend communication goes through here. Centralized error handling and request/response transformations.

### `/src/components`
**Reusable UI components.** Organized by feature area (common, session, gamification, etc.). Each component should be self-contained and reusable.

### `/src/screens`
**Screen-level components.** Each screen is a full-page view in the app. Organized by feature area.

### `/src/services`
**Business logic layer.** Pure functions and classes that handle complex logic. Separated from UI for testability.

### `/src/store`
**Redux store.** Centralized state management. Each slice manages a specific domain (auth, session, gamification, etc.).

### `/src/navigation`
**React Navigation configuration.** Defines all navigation stacks and tab navigators.

### `/src/theme`
**Design system.** All design tokens (colors, typography, spacing) in one place for consistency.

### `/src/hooks`
**Custom React hooks.** Reusable stateful logic. Hooks should be pure and testable.

### `/src/utils`
**Utility functions.** Pure helper functions for common tasks.

### `/__tests__`
**Test files.** Organized by test type (unit, integration, E2E).

---

## 🎯 KEY PRINCIPLES

1. **Separation of Concerns**: UI, business logic, and data are clearly separated.
2. **Reusability**: Components and hooks are designed for reuse across the app.
3. **Testability**: Business logic is isolated in services, making it easy to unit test.
4. **Type Safety**: TypeScript types for all data structures and API responses.
5. **Scalability**: Structure supports growth (100+ screens, 1000+ components).
6. **Maintainability**: Clear naming and organization makes code easy to find and modify.

---

## 📦 DEPENDENCIES (Key Libraries)

### Core
- `react-native`: 0.73+
- `typescript`: 5.0+
- `react`: 18+

### Navigation
- `@react-navigation/native`
- `@react-navigation/bottom-tabs`
- `@react-navigation/stack`

### State Management
- `@reduxjs/toolkit`
- `react-redux`
- `redux-persist` (for persisting state)

### UI Components
- `react-native-vector-icons`
- `react-native-svg`
- `react-native-reanimated` (for animations)
- `react-native-gesture-handler`

### Storage
- `@react-native-async-storage/async-storage`
- `react-native-keychain` (secure storage)

### API & Networking
- `axios`
- `socket.io-client` (for WebSocket)

### Authentication
- `@react-native-google-signin/google-signin`
- `@invertase/react-native-apple-authentication`

### Notifications
- `@react-native-firebase/messaging`
- `@react-native-firebase/analytics`

### Native Modules
- `react-native-device-info`
- `react-native-permissions`
- `react-native-app-usage` (Android)

### Development
- `jest`
- `@testing-library/react-native`
- `detox` (E2E testing)
- `eslint`
- `prettier`

---

**This structure is battle-tested and used by top React Native apps. It will scale from MVP to millions of users.** 🚀

