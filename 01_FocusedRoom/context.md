# 1. Context: 
I've come up with the below chrome plugin idea: Distraction Killer. 

## 1.(A) Basic Idea of the plugin: 
I want to make a chrome plugin that will help the user focus while the user is doing Deep Work(working or studying) by blocking all the distracting websites. 

    1. The user should be able to schedule a deep work focus time. When the session begins, the plugin should disable all: 
      - social media websites 
      - porn websites 
      - e-commerce websites 
      - news website 
      - entertainment and streaming websites  
      
      I've given the websites and keywords for each category in Block_list folder in the form of a json.
  
    2. While the session is on if the user tries to search a blocked keyword or access a block website, the user shouldn’t be allowed to access it and redirect the user to a page that asks the user to Stay Focused, Achieve more have an image depicting that, a timer showing how much time is left before the deep work session ends.

    3. Along with that the user should also be given a choice to access the page if the user still want to go ahead and access it but as a friction the user will have to type a paragraph that will shame them to do so- Like a Friction text. 

    4. The UI/ UX of the plugin and the redirected page once the user clicks on distracting website should be sophisticated. 

    5. It should have an option for the user to download the deep work report of the day, deep work report of the week and complete report of the user. 

The points mentioned above was the basic idea of the plugin. The product can have much more features than it.

# 2. Thinking & design and MVP of the chrome plugin. 

## Name of the plugin: Distraction Killer

## 2.(A) Exact user flow: 
    1. User sits to work on the desk.
    2. User schedules “Deep Work Time”
    3. As soon as the scheduled time starts, the Auto block activates.
    4. While working if user has the urge to access any blocked website in another tab, the Plugin blocks it. Then the user is redirected to a web page that has an image I’ve designed with a quote.
      - After getting blocked to use the blocked website and seeing the redirected webpage, the user will either close that website altogether or he might still want to access the blocked website. 
      - If the user wants to access the blocked website, there’ll be a friction. He will have to choose the time from drop down of 5, 15 or 30 minutes and then will have to read a paragraph on the screen and write it on a textbox on the screen. The user can’t copy/ paste that paragraph. This is the paragraph “I’m about to waste precious time on this site instead of working toward my goals. Every minute spent here is a minute I could’ve used to learn something new, finish a task, or make progress on what truly matters. I know I’m capable of better choices—why am I letting distractions win?” After writing this paragraph, the user will click on access website button to go to the blocked website.
    5. While working if user has the urge to unblock the blocker altogether, he will have to stop the “Deep Work Time”. 
      - If the user clicks on that button, user will be redirected to a page that shows the remaining time to finish the “Deep Work Time”. 
      - If the user still chooses to stop the “Deep Work Time”, he will have to read a paragraph on the screen and write it on a textbox on the screen. The user can’t copy/ paste that paragraph. This is the paragraph “I’m about to waste precious time on this site instead of working toward my goals. Every minute spent here is a minute I could’ve used to learn something new, finish a task, or make progress on what truly matters. I know I’m capable of better choices—why am I letting distractions win?”
    6. The user can also extract the daily Deep Work Report, Weekly Deep Work Report and complete report.

# 3. Blocked websites: The exhaustive list of distracting websites and keywords that needs to be blocked can be found in the below files as per the category:
    1. Porn websites: porn_blocklist.json
    2. Social Media websites: social_blocklist.json
    3. Shopping and e-commerce websites: shopping_blocklist.json
    4. News & Media websites: news_blocklist.json
    5. Entertainment websites: entertainment_blocklist.json


# 4. Scoring mechanism:
The Distraction Killer extension uses a **gamified scoring system** to encourage deep work and discourage distractions. Each action during a session adds or subtracts points, shaping both the **session score** and the user's **overall progress**.

## 4.(A) Core Rules
    1. **Minimum session length**: 25 minutes for a valid completion.
    2. **Maximum points per session**: +25 (hard cap).
    3. **Daily streak bonus**: up to +7 points based on how many days in a row you’ve completed at least one valid session.
    4. **Valid completion criteria**: 
   - Duration ≥ 25 minutes
   - No blocked attempts during session
   - No overrides (friction bypasses) used

## 4.(B) Events & Their Impact
    1. **Blocked Attempt** → *–5 points per attempt*  
    2. **Override (friction bypass)** → *–10 points each*  
    3. **Pause Chosen** → *+2 (5 min)* or *+3 (10 min)*  
    4. At any session end (complete/abort), *–5 penalty* if paused.  
    5. **Session Completion** → *+20 base points* (only for clean sessions)
   - Valid completion requires: ≥25 minutes, no blocked attempts, no overrides
   - streak bonus (up to +7, capped at 25 total)  
    6. Session Abort** → *–15 points*  
    7. **Invalid Completion** → *0 base points* 
   - Sessions with blocked attempts or overrides get no completion bonus
   - Only the individual event scores (-5, -10, etc.) apply

## 4.(C) How Streaks Work
    1. A **daily streak** increases by +1 for every consecutive day you complete at least **one valid session**.  
    2. If you miss a day, the streak resets to 0.  
    3. Streak bonuses are applied to **each valid session's score**:
    4. Streak:
      - Day 1 streak → +1
      - Day 2 streak → +2
      - …
      - Day 7+ streak → +7 (maximum)
    5. The streak bonus is applied **before the session cap**. If a streak would push the session score above 25, the score is capped at 25.
    6. A **weekly streak** increases by +1 for every consecutive week where you complete at least **one valid session daily for all 7 days** (Monday-Sunday).
    7. If you miss any single day in a week, the weekly streak resets to 0.
    8. **Weekly streaks are for motivation only** - they do not provide scoring bonuses like daily streaks.

