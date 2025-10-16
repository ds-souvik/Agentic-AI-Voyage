# 🚀 React Native Environment Setup - Industry Standard

## Current Status
- ✅ Node.js: v18.20.8 (installed)
- ✅ npm: Working
- ✅ Xcode Command Line Tools: Installed
- ❌ Java JDK: **NOT INSTALLED** (required for Android)
- ❌ Android SDK: **NOT CONFIGURED** (required for Android)
- ❌ CocoaPods: **NOT INSTALLED** (required for iOS)

---

## 🎯 CHOOSE YOUR PATH

### Path A: iOS Only (Faster - 5 minutes)
Best if you have a Mac and just want to see it working quickly.

### Path B: Android Only (10 minutes)
Best if you prefer Android or don't want to use Xcode.

### Path C: Both iOS & Android (15 minutes)
Full setup for both platforms.

---

## 📱 PATH A: iOS SETUP (Recommended for Mac)

### Step 1: Install CocoaPods
```bash
sudo gem install cocoapods
```
*Enter your password when prompted*

### Step 2: Install iOS Dependencies
```bash
cd "/Users/souvikganguly/Developer/AI/Extensive Agentic AI/03_FocusedRoom_app/ios"
pod install
cd ..
```

### Step 3: Run the App
```bash
npm run ios
```

**Time:** 5 minutes total  
**Done!** ✅

---

## 🤖 PATH B: ANDROID SETUP

### Step 1: Install Java JDK 17 (LTS)
```bash
brew install --cask zulu@17
```

### Step 2: Set JAVA_HOME
Add to `~/.zshrc`:
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH
```

Apply changes:
```bash
source ~/.zshrc
```

Verify:
```bash
java -version
```

### Step 3: Install Android Studio
1. Download from: https://developer.android.com/studio
2. Install Android Studio
3. Open Android Studio
4. Go to: Settings → Appearance & Behavior → System Settings → Android SDK
5. Install:
   - Android SDK Platform 33 (Android 13)
   - Android SDK Build-Tools 33.0.0
   - Android SDK Command-line Tools

### Step 4: Set Android Environment Variables
Add to `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

Apply changes:
```bash
source ~/.zshrc
```

Verify:
```bash
adb version
```

### Step 5: Create Android Emulator
1. Open Android Studio
2. Tools → Device Manager
3. Create Virtual Device
4. Select: Pixel 6 (or any recent device)
5. Select: Android 13 (API 33)
6. Finish
7. Click Play to start emulator

### Step 6: Run the App
```bash
cd "/Users/souvikganguly/Developer/AI/Extensive Agentic AI/03_FocusedRoom_app"
npm run android
```

**Time:** 10 minutes total  
**Done!** ✅

---

## 🔥 PATH C: BOTH iOS & ANDROID

Follow Path A (iOS), then Path B (Android).

**Time:** 15 minutes total

---

## 🐛 FIX: Metro Port Permission Error

If you see: `Error: listen EPERM: operation not permitted 0.0.0.0:8081`

### Solution:
```bash
# Kill any process using port 8081
lsof -ti:8081 | xargs kill -9

# Or use a different port
npm start -- --port 8082
```

---

## ✅ VERIFY SETUP

### iOS:
```bash
# Should show "pod version X.X.X"
pod --version

# Should open Xcode
xcodebuild -version
```

### Android:
```bash
# Should show Java version
java -version

# Should show adb version
adb version

# Should list your emulator
emulator -list-avds
```

---

## 🚀 RECOMMENDED: START WITH iOS

**Why?**
- Faster (5 minutes vs 10 minutes)
- Fewer dependencies
- Better developer experience on Mac

**Steps:**
1. Run: `sudo gem install cocoapods`
2. Run: `cd ios && pod install && cd ..`
3. Run: `npm run ios`
4. Wait 2-3 minutes
5. **See your app!** 🎉

---

## 📞 NEXT STEPS AFTER INSTALL

Once you install prerequisites:

**For iOS:**
```bash
cd "/Users/souvikganguly/Developer/AI/Extensive Agentic AI/03_FocusedRoom_app"
cd ios && pod install && cd ..
npm run ios
```

**For Android:**
```bash
cd "/Users/souvikganguly/Developer/AI/Extensive Agentic AI/03_FocusedRoom_app"
npm run android
```

---

## 💎 INDUSTRY STANDARDS FOLLOWED

- ✅ React Native CLI (not Expo) - Full native access
- ✅ TypeScript - Type safety
- ✅ CocoaPods - iOS dependency management
- ✅ Gradle - Android build system
- ✅ Java 17 LTS - Long-term support
- ✅ Latest Android SDK - API 33
- ✅ Proper environment variables
- ✅ Standard project structure

---

**Choose iOS (faster) or Android, install prerequisites, then tell me to continue!**

