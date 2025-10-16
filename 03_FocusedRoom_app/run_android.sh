#!/bin/bash

# Set environment variables
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$JAVA_HOME/bin:$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools
export LANG=en_US.UTF-8

# Navigate to project
cd /Users/souvikganguly/Developer/AI/FocusedRoom_app

# Kill any process on port 8081
lsof -ti:8081 | xargs kill -9 2>/dev/null

# Run Android
npx react-native run-android

