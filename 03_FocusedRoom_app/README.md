# 🎯 Focused Room Mobile App

**Production-quality React Native app for deep work and focus.**

---

## 🚀 Quick Start

### Prerequisites Check
```bash
node --version    # Should be v18+
java -version     # For Android (install if missing)
pod --version     # For iOS (install if missing)
```

### Install Dependencies
```bash
npm install
```

### Run App

**iOS:**
```bash
cd ios && pod install && cd ..
npm run ios
```

**Android:**
```bash
npm run android
```

---

## ⚠️ First Time Setup?

**Read:** [SETUP.md](./SETUP.md) for complete environment setup.

**Missing:**
- Java? See SETUP.md → Path B
- CocoaPods? See SETUP.md → Path A
- Android SDK? See SETUP.md → Path B

---

## 📁 Project Structure

```
src/
├── theme/              # Design system (colors, typography, spacing)
├── components/         # Reusable components (Button, Card, Input, Badge)
├── navigation/         # React Navigation (5 bottom tabs)
├── screens/            # 5 screens (Home, Sessions, Reports, Learn, Profile)
├── services/           # API, storage, notifications
├── store/              # Redux state management
└── utils/              # Helper functions
```

---

## 🎨 What's Built

### Phase 1 Complete (3,500+ lines)
- ✅ Design system (630+ lines)
- ✅ 4 core components (Button, Card, Input, Badge)
- ✅ Full navigation (5 tabs)
- ✅ 5 screens (Home, Sessions, Reports, Learn, Profile)
- ✅ 100% TypeScript
- ✅ Production-ready code

### Coming in Phase 2
- Authentication (Sign up, Login)
- Deep work timer
- App blocking (iOS/Android)
- Points & levels
- Streak tracking

---

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Environment setup (Java, CocoaPods, Android SDK)
- **[PRD.md](./PRD.md)** - Product requirements
- **README.md** - This file (quick reference)

---

## 🛠️ Scripts

```bash
npm start              # Start Metro bundler
npm run ios            # Run on iOS
npm run android        # Run on Android
npm run lint           # Run linter
npm run type-check     # TypeScript check
npm test               # Run tests
```

---

## 🐛 Troubleshooting

### "iOS project folder not found"
```bash
cd ios && pod install && cd ..
```

### "Unable to locate a Java Runtime"
```bash
brew install --cask zulu@17
```

### "Port 8081 already in use"
```bash
lsof -ti:8081 | xargs kill -9
```

### More help
See [SETUP.md](./SETUP.md)

---

## 💎 Tech Stack

- React Native 0.72
- TypeScript 5.3
- React Navigation 6
- Redux Toolkit
- React Native Reanimated

---

## 🎯 Next Steps

1. **Install prerequisites** (see SETUP.md)
2. **Run the app** (npm run ios or npm run android)
3. **Test all 5 screens**
4. **Tell me to build Phase 2!**

---

**Version:** 1.0.0 (Phase 1 Complete)  
**Status:** ✅ Ready for Testing
