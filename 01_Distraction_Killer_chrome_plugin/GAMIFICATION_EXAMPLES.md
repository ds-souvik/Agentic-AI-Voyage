# DistractionKiller Gamification - Example Session Scenarios

This document provides concrete examples of how the gamification system works in practice, showing event sequences and final computed session points.

## Example Session Scenarios

### Scenario 1: Perfect Uninterrupted Session
**User Journey:** User starts a 60-minute session, completes it without any distractions.

**Events:**
1. Session starts (60 minutes planned)
2. User works for 60 minutes without any blocked attempts
3. Session completes naturally

**Point Calculation:**
- Session duration: 60 minutes (≥ 25 minutes ✓)
- Blocked attempts: 0
- Overrides: 0
- Paused: No
- **Result: +20 points** (uninterrupted completion)

**Toast Notifications:**
- `+20 — session complete! Great work.`

**Session Summary:**
- Outcome: Completed
- Session points: +20
- Total points: 1,234 — Flow Architect (420/500 to next level)
- Streak: 4 days

---

### Scenario 2: Pause and Complete
**User Journey:** User starts a 45-minute session, pauses for 5 minutes, then completes the session.

**Events:**
1. Session starts (45 minutes planned)
2. User pauses session after 20 minutes (+2 points immediately)
3. User resumes after 5 minutes
4. User completes the remaining 20 minutes

**Point Calculation:**
- Pause chosen: +2 points (immediate)
- Session completion: +20 points
- Pause penalty: -5 points (for pausing)
- **Net result: +17 points** (20 - 5 + 2)

**Toast Notifications:**
- `+2 — pause chosen. Good call, try again!`
- `+20 — session complete! Great work.`

**Session Summary:**
- Outcome: Paused & Completed
- Session points: +17
- Total points: 1,251 — Flow Architect (409/500 to next level)
- Streak: 4 days

---

### Scenario 3: Blocked Attempts but No Override
**User Journey:** User starts a 30-minute session, tries to access Facebook twice, gets blocked, but doesn't override.

**Events:**
1. Session starts (30 minutes planned)
2. User tries to access facebook.com (-5 points)
3. User tries to access facebook.com again (-5 points)
4. User continues working
5. Session completes

**Point Calculation:**
- Blocked attempts: 2 × (-5) = -10 points
- Session completion: +20 points (30 minutes ≥ 25 minutes)
- **Net result: +10 points**

**Toast Notifications:**
- `-5 — blocked site attempt logged.`
- `-5 — blocked site attempt logged.`
- `+20 — session complete! Great work.`

**Session Summary:**
- Outcome: Completed
- Session points: +10
- Total points: 1,261 — Flow Architect (399/500 to next level)
- Streak: 4 days
- Blocked attempts: 2

---

### Scenario 4: Override Used
**User Journey:** User starts a 40-minute session, tries to access Twitter, gets blocked, types the friction paragraph, and proceeds.

**Events:**
1. Session starts (40 minutes planned)
2. User tries to access twitter.com (-5 points for attempt)
3. User types friction paragraph and proceeds (-10 points for override)
4. User continues working
5. Session completes

**Point Calculation:**
- Blocked attempt: -5 points
- Override: -10 points
- Session completion: +20 points
- **Net result: +5 points**

**Toast Notifications:**
- `-5 — blocked site attempt logged.`
- `-10 — override used and logged.`
- `+20 — session complete! Great work.`

**Session Summary:**
- Outcome: Completed
- Session points: +5
- Total points: 1,266 — Flow Architect (394/500 to next level)
- Streak: 4 days
- Blocked attempts: 1
- Overrides used: 1

---

### Scenario 5: Early Stop with Friction
**User Journey:** User starts a 60-minute session, works for 20 minutes, then decides to stop early.

**Events:**
1. Session starts (60 minutes planned)
2. User works for 20 minutes
3. User clicks stop button
4. User answers stop questionnaire and writes micro-commit
5. Session aborts (-15 points)

**Point Calculation:**
- Session abort: -15 points
- **Net result: -15 points**

**Toast Notifications:**
- `-15 — session stopped early; reflections saved.`

**Session Summary:**
- Outcome: Aborted
- Session points: -15
- Total points: 1,251 — Flow Architect (409/500 to next level)
- Streak: 4 days (unchanged - no completion)

---

### Scenario 6: Multiple Pauses (Only First Gets Points)
**User Journey:** User starts a 90-minute session, pauses twice, then completes.

**Events:**
1. Session starts (90 minutes planned)
2. User pauses after 30 minutes (+2 points for first pause)
3. User resumes after 5 minutes
4. User pauses again after 20 more minutes (no points - already paused once)
5. User resumes after 5 minutes
6. User completes remaining 30 minutes

**Point Calculation:**
- First pause: +2 points
- Second pause: 0 points (only first pause in session gets points)
- Session completion: +20 points
- Pause penalty: -5 points (session was paused)
- **Net result: +17 points** (same as single pause)

**Toast Notifications:**
- `+2 — pause chosen. Good call, try again!`
- `+20 — session complete! Great work.`

---

### Scenario 7: Short Session (No Completion Points)
**User Journey:** User starts a 15-minute session and completes it.

**Events:**
1. Session starts (15 minutes planned)
2. User completes in 15 minutes

**Point Calculation:**
- Session duration: 15 minutes (< 25 minutes required)
- **Result: 0 points** (no completion credit for short sessions)

**Toast Notifications:**
- None (session too short for completion credit)

**Session Summary:**
- Outcome: Completed
- Session points: 0
- Total points: 1,251 — Flow Architect (409/500 to next level)
- Streak: 4 days (unchanged - no qualifying completion)

---

### Scenario 8: Session Point Cap
**User Journey:** User has an exceptional session with many positive events.

**Events:**
1. Session starts (120 minutes planned)
2. User completes without any distractions
3. User has 7-day streak bonus (+7 points)
4. Session completes (+20 points)

**Point Calculation:**
- Session completion: +20 points
- Streak bonus: +7 points
- Total: +27 points
- **Capped to: +25 points** (SESSION_POINT_CAP)

**Toast Notifications:**
- `+20 — session complete! Great work.`

---

## Level Progression Examples

### New User Journey
1. **First Session (Perfect):** +20 points → Seedling Focus (20/49)
2. **Second Session (Perfect):** +20 points → Seedling Focus (40/49)
3. **Third Session (Perfect):** +20 points → Attention Apprentice (60/149)
4. **Week of Perfect Sessions:** +140 points → Attention Apprentice (200/149) → Ritual Novice (200/299)

### Streak Bonus Examples
- **Day 1:** +20 points (no streak bonus)
- **Day 2:** +20 + 1 = +21 points (1-day streak)
- **Day 3:** +20 + 2 = +22 points (2-day streak)
- **Day 7:** +20 + 7 = +27 points (7-day streak, capped at +25)
- **Day 8:** +20 + 7 = +27 points (7-day streak, capped at +25)

## Badge Earning Examples

### First Steps Badge
- **Trigger:** Complete first session
- **Points Required:** 1+ completion
- **Notification:** `🏆 Badge earned: First Steps!`

### Week Warrior Badge
- **Trigger:** 7-day completion streak
- **Points Required:** 7 consecutive days
- **Notification:** `🏆 Badge earned: Week Warrior!`

### Point Pioneer Badge
- **Trigger:** Reach 1,000 total points
- **Points Required:** 1,000 total points
- **Notification:** `🏆 Badge earned: Point Pioneer!`

## Anti-Gaming Safeguards in Action

### Short Session Farming Prevention
- **Attempt:** User tries to complete many 10-minute sessions
- **Result:** No completion points awarded (minimum 25 minutes required)
- **Effect:** Encourages longer, more meaningful sessions

### Pause Abuse Prevention
- **Attempt:** User pauses and resumes repeatedly to get multiple pause rewards
- **Result:** Only first pause in session gets points
- **Effect:** Pause is a recovery tool, not a point farming mechanism

### Session Point Cap
- **Attempt:** User tries to accumulate massive points in single session
- **Result:** Points capped at +25 per session
- **Effect:** Prevents unrealistic point inflation

## Integration Notes

### Event Tracking
All events are timestamped and logged for analysis:
- `blocked_attempt` events include URL, category, and domain/keyword
- `override` events include URL and duration
- `pause_chosen` events include pause duration
- `session_complete` events include duration, attempts, overrides, pause status
- `session_abort` events include reason and micro-commit text

### Data Persistence
- Gamification data stored in `chrome.storage.local`
- Session history includes gamification events
- Reports append gamification section (non-destructive)
- All data remains local (no external calls)

### UI Integration
- Toast notifications appear for immediate feedback
- Session summary modal shows after completion
- Reports page includes dedicated gamification section
- Popup shows current level and progress
