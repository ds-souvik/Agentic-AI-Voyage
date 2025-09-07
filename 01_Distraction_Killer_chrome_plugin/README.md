# Distraction Killer - Deep Focus Assistant

A sophisticated Chrome extension designed to help you maintain deep focus during work sessions by blocking distracting websites and providing intelligent friction mechanisms.

## 🎯 Features

### Core Functionality
- **Smart Deep Work Scheduling** - Schedule focus sessions from 25 minutes to 2+ hours
- **Intelligent Website Blocking** - Blocks 200+ distracting sites across 4 categories:
  - Social Media (Facebook, Instagram, Twitter, TikTok, etc.)
  - E-commerce (Amazon, Flipkart, eBay, etc.)
  - News Sites (CNN, BBC, NY Times, etc.)
  - Adult Content (Porn sites with keyword detection)
- **Friction-Based Access Control** - Type a motivational paragraph to access blocked sites
- **Real-time Session Timer** - Visual countdown with progress circle
- **Professional Reports** - Daily, weekly, and comprehensive analytics
- **Focus Insights** - Personalized recommendations based on your data

### Advanced Features
- **Temporary Access** - Grant 5, 15, or 30-minute access to blocked sites
- **Session Pause/Resume** - Flexible session management
- **Focus Score Tracking** - Monitor your distraction resistance
- **Data Export** - Download reports in JSON format
- **Responsive Design** - Works on all screen sizes
- **Sophisticated UI/UX** - Modern, clean, and motivating interface

## 🚀 Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The Distraction Killer icon should appear in your browser toolbar

## 📖 How to Use

### Starting a Deep Work Session
1. Click the Distraction Killer icon in your browser toolbar
2. Select your desired focus duration (25 min to custom)
3. Optionally enter a focus goal
4. Click "Start Deep Work"

### When You Try to Access Blocked Sites
1. You'll be redirected to a beautiful blocked page
2. See your remaining focus time
3. Choose to either:
   - Go back and continue working
   - Request temporary access (requires typing challenge)
   - Stop the session entirely

### Viewing Your Progress
1. Click the Distraction Killer icon
2. Click "📊 Reports" to view detailed analytics
3. Export your data for external analysis

## 🛠️ Technical Details

### Architecture
- **Manifest V3** - Latest Chrome extension standard
- **Service Worker** - Background script for continuous monitoring
- **Content Scripts** - Page-level blocking and redirection
- **Chrome Storage API** - Persistent data storage
- **Modern JavaScript** - ES6+ with classes and async/await

### File Structure
```
distraction-killer/
├── manifest.json          # Extension configuration
├── popup.html             # Main extension popup
├── popup.js               # Popup functionality
├── popup.css              # Popup styling
├── background.js          # Service worker
├── content.js             # Content script
├── blocked.html           # Blocked page
├── blocked.js             # Blocked page logic
├── blocked.css            # Blocked page styling
├── reports.html           # Reports page
├── reports.js             # Reports functionality
├── reports.css            # Reports styling
├── icons/                 # Extension icons
└── README.md              # This file
```

### Blocked Websites
The extension maintains comprehensive lists of distracting websites:
- **67 Adult Content Sites** - Major pornographic websites
- **26 Social Media Platforms** - Facebook, Instagram, Twitter, etc.
- **30 E-commerce Sites** - Amazon, Flipkart, eBay, etc.
- **33 News Websites** - CNN, BBC, NY Times, etc.
- **Keyword Detection** - Additional blocking based on URL content

## 🎨 Design Philosophy

### User Experience
- **Motivational Design** - Encouraging rather than punitive
- **Friction, Not Blocking** - Allows access with thoughtful barriers
- **Progress Visualization** - Clear feedback on focus achievements
- **Professional Aesthetics** - Clean, modern interface

### Psychology
- **Self-Awareness** - Makes you think about your choices
- **Goal Alignment** - Reminds you of your focus objectives
- **Habit Building** - Encourages consistent deep work practice
- **Data-Driven Insights** - Helps you understand your patterns

## 🔧 Customization

### Adding Custom Blocked Sites
Edit the `blockedSites` object in `background.js` to add your own distracting websites.

### Modifying Friction Text
Change the motivational paragraph in `blocked.js` to customize the typing challenge.

### Styling
All CSS files use CSS custom properties for easy theming. Modify the color variables to match your preferences.

## 📊 Privacy & Data

- **Local Storage Only** - All data stays on your device
- **No External Servers** - No data is sent to external services
- **Export Control** - You own and control your data
- **Transparent Code** - Open source for full transparency

## 🐛 Troubleshooting

### Extension Not Working
1. Ensure you're using Chrome (not Chromium)
2. Check that Developer Mode is enabled
3. Reload the extension after making changes
4. Check the browser console for errors

### Sites Not Being Blocked
1. Verify the site is in the blocked list
2. Check if the URL contains blocked keywords
3. Ensure the session is active
4. Try refreshing the page

### Timer Issues
1. Check your system clock
2. Ensure the extension has proper permissions
3. Try restarting the browser

## 🤝 Contributing

This is a learning project for the Extensive Agentic AI V2 course. Feel free to:
- Report bugs or issues
- Suggest new features
- Improve the code
- Enhance the design

## 📝 License

This project is created for educational purposes as part of The School of AI's Extensive Agentic AI V2 program.

## 🙏 Acknowledgments

- **The School of AI** - For the excellent course and guidance
- **Chrome Extension Documentation** - For comprehensive API reference
- **Modern Web Standards** - For making this possible

---

**Built with ❤️ for productivity and focus**

*DistractionKiller - Because your goals matter more than your distractions.*
