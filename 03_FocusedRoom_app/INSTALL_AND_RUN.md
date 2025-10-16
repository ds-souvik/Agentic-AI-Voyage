# 🚀 INSTALL & RUN - Exact Commands

## ✅ Status: Native projects ready!
- iOS folder: ✅ Created
- Android folder: ✅ Created
- Code: ✅ 3,500+ lines ready

---

## 🎯 CHOOSE ONE:

### Option 1: iOS (Faster - 5 mins)

**Install CocoaPods:**
```bash
sudo gem install cocoapods
```

**Install iOS dependencies:**
```bash
cd "/Users/souvikganguly/Developer/AI/Extensive Agentic AI/03_FocusedRoom_app/ios"
pod install
cd ..
```

**Run:**
```bash
npm run ios
```

---

### Option 2: Android (10 mins setup)

**Install Java 17:**
```bash
brew install --cask zulu@17
```

**Set environment variables** (add to `~/.zshrc`):
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$JAVA_HOME/bin:$PATH
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Apply changes:**
```bash
source ~/.zshrc
```

**Install Android Studio:**
1. Download from https://developer.android.com/studio
2. Install it
3. Open Android Studio → Settings → SDK Manager
4. Install: Android SDK Platform 33, Build-Tools 33.0.0
5. Create emulator: Tools → Device Manager → Create Device

**Run:**
```bash
npm run android
```

---

## 🔥 RECOMMENDED: START WITH iOS

Faster setup, just need CocoaPods!

**3 commands:**
```bash
sudo gem install cocoapods
cd ios && pod install && cd ..
npm run ios
```

**Done in 5 minutes!** ✅

---

## 💬 Tell me when ready!

After you run ONE of the above options, tell me:
- "iOS is running!" or
- "Android is running!" or
- "I see an error: [paste error]"

Then I'll help you test or continue with Phase 2!

