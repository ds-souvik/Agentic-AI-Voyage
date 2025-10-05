# Big Five Test Debugging Guide

## Issue: "Get My Results" button not working

### Root Cause Analysis:

The issue is likely one of the following:

1. **Submit button not appearing** - Not all 44 questions answered
2. **Email modal not showing** - JavaScript error
3. **API call failing** - Backend error
4. **Results not displaying** - Frontend rendering issue

### Step-by-Step Debugging:

#### 1. Check Browser Console (CRITICAL)
Open browser DevTools (F12 or Cmd+Option+I) and check:
- **Console tab**: Look for JavaScript errors
- **Network tab**: Check if `/big-five` POST request is sent

#### 2. Verify All Questions Answered
In browser console, run:
```javascript
// Check how many questions are answered
const answers = JSON.parse(localStorage.getItem('bigfive_answers') || '[]');
console.log(`Answered: ${answers.filter(a => a !== null).length} / 44`);
console.log('Answers:', answers);
```

#### 3. Test Email Modal Manually
In browser console, run:
```javascript
// Force show email modal
document.getElementById('email-modal').style.display = 'flex';
```

#### 4. Test API Endpoint Directly
```bash
curl -X POST http://127.0.0.1:5000/big-five \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "answers": [3,4,2,5,1,3,4,2,5,1,3,4,2,5,1,3,4,2,5,1,3,4,2,5,1,3,4,2,5,1,3,4,2,5,1,3,4,2,5,1,3,4,2,5]
  }'
```

Expected response:
```json
{
  "success": true,
  "result_id": 1,
  "scores": {...},
  "percentiles": {...},
  "suggestions": "...",
  "email_captured": true,
  "subscriber_id": 1
}
```

#### 5. Check Flask Logs
Look at terminal where `python run.py` is running for errors.

### Common Fixes:

#### Fix 1: Clear localStorage and restart
```javascript
localStorage.clear();
location.reload();
```

#### Fix 2: Check if submit button event listener is attached
```javascript
const submitBtn = document.getElementById('submit-btn');
console.log('Submit button:', submitBtn);
console.log('Event listeners:', getEventListeners(submitBtn));
```

#### Fix 3: Manually trigger email modal
```javascript
// Get the showEmailModal function from the Big Five module
// This is in the IIFE, so we need to expose it for debugging
```

### Expected Behavior:

1. User completes all 44 questions
2. "Complete Assessment" button appears
3. User clicks button → Preview results shown → Email modal appears after 500ms
4. User enters email → Clicks "Get My Results"
5. Modal closes → API call to `/big-five` → Full results displayed

### Quick Test Script:

Save this as `test_bigfive_flow.html` and open in browser:

```html
<!DOCTYPE html>
<html>
<head><title>Big Five Test</title></head>
<body>
<script>
async function testBigFive() {
  const testData = {
    email: "test@example.com",
    answers: Array(44).fill(3) // All neutral answers
  };

  try {
    const response = await fetch('http://127.0.0.1:5000/big-five', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(testData)
    });

    const data = await response.json();
    console.log('✅ Success:', data);
    document.body.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (error) {
    console.error('❌ Error:', error);
    document.body.innerHTML = `<pre>Error: ${error.message}</pre>`;
  }
}

testBigFive();
</script>
</body>
</html>
```

### Database Verification:

```python
from app import create_app
from app.models import db, Subscriber, BigFiveResult

app = create_app()
with app.app_context():
    # Check if any data exists
    sub_count = Subscriber.query.count()
    result_count = BigFiveResult.query.count()

    print(f"Subscribers: {sub_count}")
    print(f"Results: {result_count}")

    if sub_count > 0:
        s = Subscriber.query.first()
        print(f"\nFirst subscriber: {s.email}")
        print(f"Their results: {s.big_five_results.count()}")

        if s.big_five_results.count() > 0:
            r = s.big_five_results.first()
            print(f"Result ID: {r.id}")
            print(f"Scores: {r.scores}")
```
