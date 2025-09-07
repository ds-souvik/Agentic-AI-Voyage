# 🚀 DistractionKiller Installation Guide

## Quick Start (5 minutes)

### Step 1: Download the Extension
1. Download or clone this repository to your computer
2. Extract the files to a folder (e.g., `distraction-killer`)

### Step 2: Enable Developer Mode in Chrome
1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Toggle "Developer mode" ON in the top-right corner

### Step 3: Load the Extension
1. Click "Load unpacked" button
2. Select the `distraction-killer` folder
3. Click "Select Folder"

### Step 4: Pin the Extension
1. Click the puzzle piece icon in Chrome toolbar
2. Find "DistractionKiller" and click the pin icon
3. The 🎯 icon should now appear in your toolbar

## 🎯 First Use

### Start Your First Deep Work Session
1. Click the DistractionKiller icon (🎯) in your toolbar
2. Select a duration (start with 25 minutes)
3. Enter a goal like "Complete project proposal"
4. Click "Start Deep Work"

### Test the Blocking
1. Try visiting Facebook, Instagram, or Amazon
2. You should be redirected to the blocked page
3. See your remaining time and the friction mechanism

### View Your Progress
1. Click the DistractionKiller icon
2. Click "📊 Reports" to see your analytics
3. Export your data anytime

## 🔧 Troubleshooting

### Extension Not Appearing
- **Check Developer Mode**: Ensure it's enabled in `chrome://extensions/`
- **Reload Extension**: Click the refresh icon on the extension card
- **Check Console**: Press F12 and look for errors

### Sites Not Being Blocked
- **Verify Session**: Ensure a deep work session is active
- **Check URL**: Some sites might use different domains
- **Refresh Page**: Try refreshing the blocked site

### Timer Issues
- **System Clock**: Ensure your computer's time is correct
- **Browser Restart**: Try closing and reopening Chrome
- **Extension Reload**: Disable and re-enable the extension

### Permission Issues
- **Check Permissions**: Go to `chrome://extensions/` → DistractionKiller → Details
- **Site Access**: Ensure "Allow in incognito" if needed
- **Storage**: Check if Chrome storage is working

## 📱 Browser Compatibility

- ✅ **Chrome 88+** (Recommended)
- ✅ **Edge 88+** (Chromium-based)
- ❌ **Firefox** (Not supported - different extension format)
- ❌ **Safari** (Not supported - different extension format)

## 🎨 Customization

### Adding Custom Blocked Sites
1. Open `background.js`
2. Find the `blockedSites` object
3. Add your sites to the appropriate category
4. Reload the extension

### Changing the Friction Text
1. Open `blocked.js`
2. Find the `challengeParagraph` variable
3. Replace with your own motivational text
4. Reload the extension

### Modifying Colors
1. Open any CSS file (`popup.css`, `blocked.css`, `reports.css`)
2. Look for color variables at the top
3. Change the hex values
4. Reload the extension

## 🔒 Privacy & Security

### Data Storage
- All data is stored locally on your device
- No data is sent to external servers
- You can export and delete your data anytime

### Permissions Explained
- **Storage**: Save your session data and settings
- **Tabs**: Monitor and redirect blocked websites
- **ActiveTab**: Access current tab information
- **WebNavigation**: Detect navigation events
- **DeclarativeNetRequest**: Block websites (future feature)

## 🆘 Getting Help

### Common Issues
1. **Extension crashes**: Reload the extension
2. **Sites not blocked**: Check if session is active
3. **Timer not working**: Check system time
4. **Data not saving**: Check Chrome storage permissions

### Debug Mode
1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Look for DistractionKiller messages
4. Check for any error messages

### Reset Extension
1. Go to `chrome://extensions/`
2. Find DistractionKiller
3. Click "Remove"
4. Reload the extension
5. Start fresh

## 📈 Performance Tips

### For Better Performance
- Close unused tabs before starting sessions
- Avoid running too many extensions simultaneously
- Keep your browser updated
- Clear browser cache regularly

### For Better Focus
- Start with shorter sessions (25 minutes)
- Gradually increase duration
- Set specific, achievable goals
- Use the reports to track progress

## 🎓 Learning Resources

### Chrome Extension Development
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

### Deep Work Concepts
- "Deep Work" by Cal Newport
- Pomodoro Technique
- Focus and productivity methodologies

---

## 🎉 You're Ready!

Your DistractionKiller extension is now installed and ready to help you achieve deep focus. Start with a 25-minute session and gradually build your focus muscles!

**Remember**: The goal isn't to never access these sites, but to be intentional about when and why you do.

Happy focusing! 🎯
