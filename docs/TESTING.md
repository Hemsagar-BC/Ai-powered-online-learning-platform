# 🧪 Testing Guide

Complete testing procedures and guidelines for CodeFlux.

## Table of Contents
1. [Testing Overview](#testing-overview)
2. [Local Testing](#local-testing)
3. [Firebase Testing](#firebase-testing)
4. [Quiz Testing](#quiz-testing)
5. [API Testing](#api-testing)

---

## Testing Overview

### Test Categories

| Category | Type | Tools |
|----------|------|-------|
| Unit Tests | Individual functions | Jest |
| Integration Tests | Component interaction | React Testing Library |
| E2E Tests | Full user flow | Cypress/Playwright |
| API Tests | Backend endpoints | Postman/cURL |
| Manual Tests | User experience | Browser |

---

## Local Testing

### Setup Test Environment

```bash
# Install test dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Create test configuration
touch jest.config.js
```

### Running Local Tests

```bash
# Start dev server
npm run dev

# In another terminal, run tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### Test Checklist

- [ ] Landing page loads correctly
- [ ] Google Sign-in works
- [ ] Dashboard displays after login
- [ ] Can create new course
- [ ] Can view My Learning page
- [ ] Can enroll in courses from Explore
- [ ] Quiz system works
- [ ] Results display correctly
- [ ] Dark/Light theme toggles
- [ ] Settings save properly

---

## Firebase Testing

### Test Data Setup

**Step 1: Create Test User**

Use Firebase Console to add test data:

```javascript
// Add test user manually in Firebase Console
User: test@example.com
UID: test_user_123
```

**Step 2: Add Test Course Data**

```javascript
// Navigate to Realtime Database
users/test_user_123/courses/course_001
{
  id: "course_001",
  title: "Test Course",
  description: "A test course",
  chapters: [...],
  createdAt: "2025-11-21",
  progress: 0
}
```

### Firebase Rules Testing

Test security rules in Firebase Console:

```javascript
// Test 1: User can read own data
✅ users/{uid}/* - Should allow if authenticated

// Test 2: User cannot read others' data
❌ users/{other_uid}/* - Should deny

// Test 3: Public courses readable by all
✅ courses/* - Should allow for all authenticated users
```

### Firebase Connectivity Tests

```javascript
// In browser console
import { db } from './src/lib/firebase';
import { ref, get } from 'firebase/database';

// Test connection
const testRef = ref(db, 'users');
get(testRef).then(snapshot => {
  console.log('Firebase connection OK', snapshot.val());
}).catch(err => {
  console.error('Firebase error:', err);
});
```

---

## Quiz Testing

### Quiz Generation Testing

**Test 1: Course exists**
- ✅ Create a course
- ✅ Verify it appears in Quiz Center
- ✅ Start quiz

**Test 2: Question generation**
- ✅ Questions should be 12 total
- ✅ Each question should have 4 options
- ✅ Questions should relate to course content
- ✅ Explanations should appear

**Test 3: Answer submission**
- ✅ Can select all answers
- ✅ Cannot submit with unanswered questions
- ✅ Selected answers highlight correctly
- ✅ Can navigate between questions

**Test 4: Results display**
- ✅ Score calculates correctly
- ✅ Pie chart displays score breakdown
- ✅ Bar chart shows performance by question
- ✅ Explanations appear for wrong answers

### Quiz Test Cases

```javascript
// Test Case 1: Start Quiz
1. Navigate to Quiz Center
2. Select a course
3. Click "Start Quiz"
Expected: Quiz interface loads with Q1/12 displayed

// Test Case 2: Answer Questions
1. Select answer for Q1
2. Click "Next"
3. Select answer for Q2
Expected: Answers persist, navigation works

// Test Case 3: Submit Quiz
1. Answer all 12 questions
2. Click "Submit"
Expected: Results page appears with score

// Test Case 4: View Results
1. Quiz completed
2. Review results page
Expected: All charts and stats display correctly
```

---

## API Testing

### Test Gemini Integration

**Test Prompt:**
```javascript
const testPrompt = 'Generate a course about React basics';
// Expected: JSON with chapters, lessons, concepts
```

**cURL Test:**
```bash
curl -X POST https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: YOUR_API_KEY" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

### Test Firebase Endpoints

**Create User:**
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"uid":"test_123","email":"test@example.com"}'
```

**Get Courses:**
```bash
curl http://localhost:5000/api/courses?uid=test_123 \
  -H "Authorization: Bearer TOKEN"
```

### Postman Collection

Import to Postman for API testing:

```json
{
  "info": {
    "name": "CodeFlux API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Courses",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/courses",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ]
      }
    }
  ]
}
```

---

## Manual Testing Scenarios

### Scenario 1: New User Flow

1. ✅ Visit landing page
2. ✅ Click "Get Started"
3. ✅ Sign in with Google
4. ✅ See Dashboard
5. ✅ Create first course
6. ✅ View in My Learning
7. ✅ Complete quiz

### Scenario 2: Existing User Flow

1. ✅ Sign in
2. ✅ Dashboard shows previous courses
3. ✅ Progress bars display correctly
4. ✅ Create new course
5. ✅ Update settings
6. ✅ View community

### Scenario 3: Quiz Flow

1. ✅ Navigate to Quiz Center
2. ✅ Select course
3. ✅ Answer 12 questions
4. ✅ Submit answers
5. ✅ View results with charts
6. ✅ Retake quiz

### Scenario 4: Error Handling

1. ✅ Try course creation without title → Shows error
2. ✅ Disconnect internet → Graceful error
3. ✅ Invalid API key → Shows error message
4. ✅ Firebase unavailable → Shows fallback

---

## Performance Testing

### Metrics to Monitor

- Page load time: < 2 seconds
- Quiz generation: < 5 seconds
- Course creation: < 10 seconds
- Response time: < 500ms

### Browser DevTools

1. Open DevTools (F12)
2. Go to "Network" tab
3. Reload page
4. Check:
   - Total size
   - Load time
   - Resource breakdown

### Lighthouse Audit

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:5176
```

---

## Continuous Integration (CI)

### GitHub Actions Setup

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run build
```

---

## Test Report Template

```
Date: 2025-11-21
Tester: [Your Name]
Version: 1.0.0

PASSED: 95/100
FAILED: 5/100

Issues Found:
1. Quiz generation takes 8s (expected <5s)
2. Dark theme not persisting on refresh

Recommendations:
- Optimize Gemini API calls
- Fix localStorage for theme preference
```

---

See [Troubleshooting](./TROUBLESHOOTING.md) for common testing issues.
