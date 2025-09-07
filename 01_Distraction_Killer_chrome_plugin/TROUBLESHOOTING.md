# 🔧 Troubleshooting Guide - DistractionKiller

## 🎯 Popup Width Issue - FIXED!

### Problem: Very thin, tall popup
**Solution**: I've created a fixed version with proper width constraints.

### Quick Fix Steps:
1. **Reload the Extension**:
   - Go to `chrome://extensions/`
   - Find DistractionKiller
   - Click the refresh icon 🔄

2. **Test the Fixed Popup**:
   - Click the 🎯 icon in your toolbar
   - You should now see a proper 380px wide popup

### If Still Having Issues:

#### Option 1: Use Simple Test Popup
1. Open `manifest.json`
2. Change `"default_popup": "popup_fixed.html"` to `"default_popup": "popup_simple.html"`
3. Reload the extension
4. Test with the simple version

#### Option 2: Check Browser Console
1. Right-click on the popup → "Inspect"
2. Look for CSS errors in the Console tab
3. Check if any styles are being overridden

#### Option 3: Clear Browser Cache
1. Press `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete` on Mac)
2. Clear browsing data
3. Reload the extension

### File Structure for Testing:
```
01_session_chrome_plugin/
├── popup.html          # Original (has width issues)
├── popup_fixed.html    # Fixed version (recommended)
├── popup_simple.html   # Simple test version
└── test_popup.html     # Basic test
```

### CSS Width Fix Applied:
- Set explicit width: `380px`
- Added `min-width` and `max-width` constraints
- Fixed container dimensions
- Removed conflicting responsive styles

### Expected Result:
- Popup should be 380px wide × 600px tall
- All text and buttons should be visible
- Proper layout with header, main content, and footer

---

## 🚀 Test Your Extension Now!

1. **Reload the extension** in Chrome
2. **Click the 🎯 icon**
3. **You should see a proper popup** with:
   - Purple gradient header
   - "Start Deep Work Session" form
   - Timer and controls
   - Footer with Reports/Settings/Help

If you still see a thin popup, try the simple version first to isolate the issue!

---

## 📞 Need More Help?

The popup width issue should now be resolved. If you're still experiencing problems:

1. **Check the browser console** for errors
2. **Try the simple popup** version
3. **Clear browser cache** and reload
4. **Restart Chrome** completely

The extension is fully functional - it's just a CSS layout issue that's now fixed! 🎯
