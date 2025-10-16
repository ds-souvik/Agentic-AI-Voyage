#!/bin/bash

# Set environment variables
export LANG=en_US.UTF-8

# Navigate to project
cd /Users/souvikganguly/Developer/AI/FocusedRoom_app

# Kill any process on port 8081
lsof -ti:8081 | xargs kill -9 2>/dev/null

# Install pods if needed
if [ ! -d "ios/Pods" ]; then
    echo "Installing iOS dependencies..."
    cd ios
    pod install
    cd ..
fi

# Run iOS
npx react-native run-ios

