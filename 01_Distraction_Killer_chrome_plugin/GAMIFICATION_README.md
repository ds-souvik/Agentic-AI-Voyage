# DistractionKiller Gamification System

## Overview

The DistractionKiller gamification system rewards sustained, uninterrupted deep work while providing gentle recovery options and discouraging distraction attempts. It's designed to be friendly, non-punitive, and hard to game.

## Core Philosophy

- **Reward Focus:** Uninterrupted sessions earn the most points
- **Gentle Recovery:** Pause options help users get back on track
- **Visible Accountability:** Blocked attempts and overrides are logged and penalized
- **Anti-Gaming:** Multiple safeguards prevent point farming
- **Non-Punitive:** Language is encouraging, not shaming

## Point System

### Completion Points
- **+20 points** for uninterrupted session completion
- **Requirements:**
  - Session duration ≥ 25 minutes
  - No blocked attempts
  - No overrides
  - No pauses

### Pause System
- **Immediate Rewards:**
  - Pause 5 minutes: +2 points
  - Pause 10 minutes: +3 points
  - Only first pause per session gets points
- **Completion Penalty:**
  - If session was paused and completed: -5 points
  - **Net Examples:**
    - Pause 5 + Complete: +2 + 20 - 5 = +17 points
    - Pause 10 + Complete: +3 + 20 - 5 = +18 points

### Penalty System
- **Blocked Attempt:** -5 points (immediate)
- **Override:** -10 points (immediate)
- **Early Stop:** -15 points (after friction)

### Streak Bonuses
- **Daily Streak:** +1 point per consecutive day (max +7)
- **Weekly Streak:** Tracks 5+ sessions per week
- Applied when first valid session completes each day

### Session Cap
- **Hard Cap:** +25 points maximum per session
- Prevents point inflation from exceptional sessions

## Level System

### 20 Levels (Exact Thresholds)
1. **Seedling Focus** — 0 – 49
2. **Attention Apprentice** — 50 – 149
3. **Ritual Novice** — 150 – 299
4. **Task Tamer** — 300 – 499
5. **Flow Initiate** — 500 – 749
6. **Focus Artisan** — 750 – 999
7. **Rhythm Keeper** — 1000 – 1299
8. **Clarity Crafter** — 1300 – 1599
9. **Momentum Maker** — 1600 – 1999
10. **Deep Diver** — 2000 – 2499
11. **Time Alchemist** — 2500 – 2999
12. **Discipline Architect** — 3000 – 3599
13. **Zen Practitioner** — 3600 – 4199
14. **Flow Architect** — 4200 – 4999
15. **Habit Vanguard** — 5000 – 5999
16. **Cognitive Commander** — 6000 – 7499
17. **Habit Sage** — 7500 – 8999
18. **Master of Momentum** — 9000 – 10999
19. **Deep Work Luminary** — 11000 – 12999
20. **Legend of Mastery** — 13000+

## Badge System

### Available Badges
- **First Steps:** Complete first session
- **Week Warrior:** 7-day completion streak
- **Month Master:** 30-day completion streak
- **Point Pioneer:** Earn 1,000 total points
- **Focus Five:** Earn 5,000 total points
- **Decade Dedication:** Earn 10,000 total points

## Event Tracking

### Core Events
- `blocked_attempt`: User tries to access blocked site
- `override`: User completes friction and proceeds
- `pause_chosen`: User selects pause option
- `session_complete`: Session finishes successfully
- `session_abort`: User stops session early

### Event Data
Each event includes:
- Event type
- Session ID
- Timestamp
- Additional data (URL, category, duration, etc.)

## Anti-Gaming Safeguards

### 1. Minimum Session Duration
- Completion credit requires ≥ 25 minutes
- Prevents farming with many short sessions

### 2. Pause Limitations
- Only first pause per session gets immediate points
- Pause completion penalty ensures uninterrupted > paused

### 3. Session Point Cap
- Hard cap of +25 points per session
- Prevents unrealistic point accumulation

### 4. Event Logging
- All events timestamped and logged
- Suspicious patterns can be detected
- Overrides count as both attempt and override

### 5. Streak Requirements
- Daily streak requires actual completion
- Missing a day resets streak
- Prevents fake streak building

## User Experience

### Toast Notifications
- **Success:** `+20 — session complete! Great work.`
- **Pause:** `+2 — pause chosen. Good call, try again!`
- **Attempt:** `-5 — blocked site attempt logged.`
- **Override:** `-10 — override used and logged.`
- **Stop:** `-15 — session stopped early; reflections saved.`

### Session Summary Modal
- **Title:** Session Summary
- **Content:**
  - Outcome: Completed/Paused & Completed/Aborted/Distracted
  - Session points: +17
  - Total points: 1,234 — Flow Architect (420/500 to next level)
  - Streak: 4 days
  - Detailed breakdown of attempts, overrides, pauses

### Popup Integration
- Shows current level and progress
- Displays recent badges
- Real-time point updates

## Reporting Integration

### Gamification Section
Appended to existing reports (non-destructive):
- **Summary Stats:**
  - Total points, current level, progress to next level
  - Daily/weekly streaks
  - Points today/this week
- **Session Details:**
  - Per-session gamification data
  - Attempts, overrides, pauses, early stops
  - Event timestamps
- **Achievements:**
  - Earned badges
  - Level progression

### Export Compatibility
- CSV/JSON/PDF exports include gamification data
- Maintains existing report structure
- Adds gamification section after original content

## Technical Implementation

### File Structure
```
gamification.js          # Core gamification logic
gamification-ui.js       # UI components and display
background.js            # Event tracking integration
popup.js                 # Session summary integration
reports.js               # Reporting integration
```

### Data Storage
- **Storage Key:** `gamificationData`
- **Location:** `chrome.storage.local`
- **Structure:**
  ```javascript
  {
    totalPoints: number,
    dailyStreak: number,
    weeklyStreak: number,
    lastSessionDate: string,
    lastWeekStart: string,
    earnedBadges: string[],
    sessionHistory: Event[],
    dailyPoints: {[date]: number},
    weeklyPoints: {[week]: number}
  }
  ```

### Event Processing
1. Event triggered in UI/background
2. `trackGamificationEvent()` called
3. Event added to session history
4. Points calculated and applied
5. Streaks updated
6. Badges checked
7. UI updated
8. Data persisted

## Configuration

### Constants
```javascript
MIN_SESSION_MINUTES = 25      // Minimum for completion credit
SESSION_POINT_CAP = 25        // Maximum points per session
MAX_STREAK_BONUS = 7          // Maximum streak bonus points
```

### Level Thresholds
Defined in `levels` array with exact min/max values for each level.

### Badge Thresholds
Defined in `badges` array with trigger conditions.

## Testing Scenarios

### Acceptance Tests
1. **Uninterrupted Success:** 25+ min, no attempts → +20 points
2. **Pause Then Finish:** Pause 5 + complete → +17 points
3. **Blocked Attempt:** Try blocked site → -5 points
4. **Override:** Complete friction → -10 points
5. **Early Stop:** Stop with friction → -15 points
6. **Anti-Gaming:** Short sessions → 0 completion points

### Edge Cases
- Multiple pauses in same session
- Session point cap enforcement
- Streak calculation accuracy
- Badge earning conditions
- Data persistence across sessions

## Future Enhancements

### Potential Additions
- **Weekly Challenges:** Special point multipliers
- **Focus Streaks:** Consecutive days without overrides
- **Recovery Rewards:** Bonus points for getting back on track
- **Social Features:** Share achievements (optional)
- **Custom Goals:** User-defined point targets

### Considerations
- Maintain non-punitive tone
- Keep anti-gaming safeguards
- Preserve data privacy (local storage)
- Ensure performance with large datasets

## Integration Notes

### Existing Codebase
- **Non-Destructive:** No changes to existing functionality
- **Additive:** Gamification data appended to reports
- **Optional:** System works without gamification enabled
- **Modular:** Can be easily disabled or modified

### Performance
- Events processed asynchronously
- UI updates batched for efficiency
- Data persisted only when necessary
- Minimal impact on existing functionality

### Privacy
- All data stored locally
- No external API calls
- No user tracking
- Data remains on user's device

## Support

### Debugging
- Check browser console for gamification events
- Verify data in `chrome.storage.local`
- Check event timestamps and session IDs
- Validate point calculations

### Common Issues
- **Points not updating:** Check event tracking integration
- **UI not showing:** Verify script loading order
- **Data not persisting:** Check storage permissions
- **Streaks incorrect:** Verify date calculations

This gamification system enhances the DistractionKiller extension by providing positive reinforcement for focus while maintaining accountability for distractions, all while being friendly and encouraging to users.
