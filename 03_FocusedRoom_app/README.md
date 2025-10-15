# 🎯 Focused Room Mobile App

**The world's best productivity app for building focus, discipline, and deep work habits.**

[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue)]()
[![React Native](https://img.shields.io/badge/React%20Native-0.73-61DAFB?logo=react)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)]()
[![License](https://img.shields.io/badge/license-Proprietary-red)]()

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

Focused Room Mobile App is the mobile-first expansion of the Focused Room ecosystem, designed to help individuals develop focus, discipline, and deep work habits. It combines intelligent app blocking, gamification, personality-driven personalization, and cross-platform synchronization to create sustainable behavior change.

**Part of the Focused Room Ecosystem:**
- 🌐 Website: focusedroom.com (Big Five personality test, blog)
- 🖥️ Chrome Extension: Distraction Killer (desktop website blocking)
- 📱 Mobile App: **This project** (mobile app blocking + full ecosystem features)

**The Problem We Solve:**
- Average person checks phone **96 times per day**
- **3+ hours** spent on social media daily
- **2.5 hours** lost daily to digital distractions
- 70% of internet time is on mobile devices

**Our Solution:**
Adaptive friction + Personality-driven personalization + Gamification + Cross-platform sync = Sustainable behavior change.

---

## ✨ Features

### Core Features (MVP)

#### 🚫 App-Level Blocking
- Block 100+ distracting apps across 6 categories
- Custom app blocklists
- Scheduled blocking during focus sessions
- Whitelisting for work apps
- Integration with iOS Focus Modes and Android Do Not Disturb

#### 🔥 Friction Override Mechanism
- **Typing Challenges**: Type a "shaming paragraph" to access blocked apps
- **Mindful Pauses**: 10-30 second breathing exercises
- **Reflection Prompts**: Answer questions before accessing distractions
- **Temporary Access**: 5, 15, or 30 minutes with point penalties

#### ⏱️ Deep Work Sessions
- Customizable durations (5 min to 8+ hours)
- Pomodoro timer integration
- Start, pause, resume, stop controls
- Break reminders (short and long breaks)
- Cross-device sync (start on mobile, continue on desktop)

#### 🎮 Advanced Gamification
- **20 Achievement Levels**: "Seedling Focus" to "Legend of Mastery"
- **Daily & Weekly Streaks**: Build consistency, earn bonuses
- **Points System**: Earn points for sessions, lose points for distractions
- **30+ Achievements**: Unlock badges for milestones
- **Global Leaderboards**: Compete with users worldwide
- **Social Sharing**: Share progress on social media

#### 🧠 Personality-Driven Personalization
- Integrates Big Five personality test results
- Custom session duration recommendations
- Personalized app blocking suggestions
- Tailored stress management tips (high Neuroticism)
- Social accountability features (high Extraversion)
- Content personalization

#### 📊 Comprehensive Analytics
- Daily, weekly, and monthly reports
- Beautiful charts and visualizations
- AI-generated insights (powered by Google Gemini)
- Trend analysis and predictions
- Data export (CSV, PDF)

#### 🔄 Cross-Platform Sync
- Real-time session sync across devices
- Unified account system
- Settings sync (blocklists, preferences)
- Big Five results integration from website
- Multi-device blocking (can't cheat by switching devices)

#### 📚 Blog Integration
- In-app blog reader ("The Focus Formula")
- Personality-based article recommendations
- Personalized content delivery
- Newsletter signup

---

## 🛠️ Tech Stack

### Mobile
- **Framework**: React Native 0.73+
- **Language**: TypeScript 5.0+
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation v6
- **UI Components**: Custom (design system)
- **Animations**: React Native Reanimated

### Backend
- **Server**: Node.js + Express
- **Database**: PostgreSQL
- **Cache**: Redis
- **Real-Time**: Socket.io / Firebase Cloud Messaging
- **Storage**: AWS S3
- **API**: RESTful + WebSocket

### AI
- **LLM**: Google Gemini 1.5 Pro
- **Use Cases**: Personality insights, recommendations, adaptive friction

### Native Features
- **iOS**: Screen Time API (FamilyControls, ManagedSettings)
- **Android**: UsageStatsManager, AccessibilityService

### Analytics & Monitoring
- **Analytics**: Mixpanel / Amplitude
- **Crash Reporting**: Sentry
- **Performance**: Firebase Performance Monitoring

### Authentication
- **JWT**: Token-based auth
- **OAuth**: Google Sign-In, Apple Sign-In
- **Biometric**: Face ID, Touch ID

---

## 📁 Project Structure

```
03_FocusedRoom_app/
├── android/                # Android native code
├── ios/                    # iOS native code
├── src/
│   ├── api/                # API client and endpoints
│   ├── assets/             # Images, fonts, animations
│   ├── components/         # Reusable UI components
│   ├── config/             # App configuration
│   ├── hooks/              # Custom React hooks
│   ├── navigation/         # React Navigation setup
│   ├── screens/            # App screens
│   ├── services/           # Business logic
│   ├── store/              # Redux store (slices)
│   ├── theme/              # Design system (colors, typography)
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   └── App.tsx             # Root component
├── __tests__/              # Test files
├── assets/                 # Blocklists (JSON)
├── docs/                   # Documentation
├── .cursorrules            # Cursor AI agent rules
├── PRD.md                  # Product Requirements Document
├── TASKS.md                # Task breakdown
├── FOLDER_STRUCTURE.md     # Detailed folder structure
└── README.md               # This file
```

See [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) for detailed explanation.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+ (LTS recommended)
- **npm** or **yarn**
- **React Native CLI**: `npm install -g react-native-cli`
- **Xcode**: 14+ (macOS only, for iOS development)
- **Android Studio**: Latest version (for Android development)
- **CocoaPods**: `sudo gem install cocoapods` (for iOS dependencies)

### Installation

1. **Clone the repository**
   ```bash
   cd 03_FocusedRoom_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.development
   # Edit .env.development with your API keys
   ```

5. **Start Metro bundler**
   ```bash
   npm start
   # or
   yarn start
   ```

6. **Run on iOS**
   ```bash
   npm run ios
   # or
   yarn ios
   ```

7. **Run on Android**
   ```bash
   npm run android
   # or
   yarn android
   ```

---

## 💻 Development

### Code Style

This project uses:
- **TypeScript** for type safety
- **ESLint** for linting
- **Prettier** for code formatting
- **Husky** for git hooks (pre-commit)

Run linters:
```bash
npm run lint
npm run format
```

### Design System

All UI components follow the Focused Room design system:
- **Colors**: Primary Teal (#7A9E9F), Accent Green (#38a169), Danger Red (#e53e3e)
- **Typography**: System font stack, defined type scale
- **Spacing**: 4px increments (4, 8, 12, 16, 24, 32, 48)
- **Border Radius**: 12px default, 9999px for buttons

See `.cursorrules` for complete design system specifications.

### Development Workflow

1. **Pick a task** from [TASKS.md](./TASKS.md)
2. **Create a branch**: `git checkout -b feature/task-name`
3. **Implement the feature**:
   - Write code following `.cursorrules`
   - Add tests
   - Test on iOS and Android
4. **Commit**: `git commit -m "feat: descriptive message"`
5. **Push**: `git push origin feature/task-name`
6. **Test thoroughly** before marking complete

---

## 🧪 Testing

### Unit Tests

```bash
npm test
# or
yarn test
```

Run with coverage:
```bash
npm test -- --coverage
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests (Detox)

```bash
# iOS
npm run test:e2e:ios

# Android
npm run test:e2e:android
```

### Manual Testing Checklist

- [ ] Test on iOS simulator (latest iOS version)
- [ ] Test on Android emulator (API 30+)
- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Test with poor network (airplane mode)
- [ ] Test with permissions denied
- [ ] Test with large datasets (1000+ sessions)

---

## 📦 Deployment

### iOS (App Store)

1. **Prepare assets**:
   - App icon (1024x1024)
   - Screenshots (multiple sizes)
   - App Store description

2. **Build**:
   ```bash
   cd ios
   xcodebuild archive -workspace FocusedRoom.xcworkspace -scheme FocusedRoom
   ```

3. **Upload to App Store Connect**:
   - Use Xcode Organizer
   - Or use Fastlane: `bundle exec fastlane ios release`

4. **Submit for review**

### Android (Google Play)

1. **Prepare assets**:
   - App icon (512x512)
   - Screenshots (phone, tablet)
   - Play Store description

2. **Build signed APK**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

3. **Upload to Google Play Console**:
   - Or use Fastlane: `bundle exec fastlane android release`

4. **Submit for review**

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

---

## 📚 Documentation

- **[PRD.md](./PRD.md)**: Complete Product Requirements Document
- **[TASKS.md](./TASKS.md)**: Detailed task breakdown (16 weeks, 10 phases)
- **[FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)**: Project organization explained
- **[.cursorrules](./.cursorrules)**: Comprehensive development rules for AI agent
- **[docs/API.md](./docs/API.md)**: Backend API documentation
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)**: System architecture overview

---

## 🤝 Contributing

This is a private project, but we welcome contributions from team members.

### Guidelines

1. **Follow `.cursorrules`** for code quality, design system, and best practices
2. **Write tests** for all business logic (>80% coverage)
3. **Test thoroughly** on both iOS and Android before submitting
4. **Use conventional commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
5. **Create detailed PRs** with description, screenshots, and testing notes

### Code Review Checklist

- [ ] Code follows `.cursorrules`
- [ ] Design system compliance (colors, typography, spacing)
- [ ] TypeScript types are proper (no `any`)
- [ ] Error handling is comprehensive
- [ ] Tests are included and passing
- [ ] Tested on iOS and Android
- [ ] Performance profiled (no jank)
- [ ] Accessibility tested (VoiceOver, TalkBack)

---

## 📄 License

**Proprietary License**  
© 2025 Focused Room. All rights reserved.

This software and associated documentation files are proprietary and confidential. Unauthorized copying, distribution, or use of this software is strictly prohibited.

For licensing inquiries: souvik.ganguly.ds@gmail.com

---

## 👤 Contact

**Product Owner**: Souvik Ganguly  
**Email**: souvik.ganguly.ds@gmail.com  
**LinkedIn**: [Souvik Ganguly](https://www.linkedin.com/in/souvik-ganguly-4a9924105/)

---

## 🎯 Mission

> "Build an ecosystem that helps people develop focus, discipline, and deep work—one intentional step at a time."

**Let's make Focused Room the global standard for attention management.** 🚀

---

**Version**: 1.0.0 (MVP)  
**Status**: In Development  
**Target Launch**: Q2 2026  
**Last Updated**: October 15, 2025

