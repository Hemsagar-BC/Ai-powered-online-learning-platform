# 🧪 Phase 1 Testing & Deployment Guide

**Last Updated**: November 20, 2025  
**Status**: Ready for Testing

---

## ✅ Pre-Testing Checklist

### 1. Firebase Setup
- [ ] Go to Firebase Console
- [ ] Create new collections:
  - [ ] `studySessions` (no specific schema needed, Firestore is flexible)
  - [ ] `streaks` (no specific schema needed)
- [ ] Enable Firestore Composite Indexes (if prompted):
  - [ ] `studySessions` with fields: userId, date
  - [ ] `studySessions` with fields: userId, timestamp
- [ ] Verify Firebase credentials in `.env`

### 2. Backend Setup
- [ ] Backend running: `npm run dev` in `/server`
- [ ] Verify: `http://localhost:5000/api/health` returns `OK`
- [ ] Check terminal: Should see "🚀 CodeFlux Backend running..."
- [ ] CORS includes: `http://localhost:5175`

### 3. Frontend Setup
- [ ] Frontend running: `npm run dev` in root
- [ ] Verify: `http://localhost:5175` loads
- [ ] Check browser console: No red errors
- [ ] Check that pages load without 404s

---

## 🧪 Testing Scenarios

### Scenario 1: Complete Onboarding Flow

**Test**: User signs in and completes onboarding

```
1. Open http://localhost:5175
2. Sign in with Google
3. Should redirect to /onboarding
4. Step 1: Select "School/College"
5. Click Next
6. Step 2: Select 3+ subjects (e.g., Mathematics, Physics, Chemistry)
7. Click Next
8. Step 3: Set daily goal to 6 hours
9. Set exam date (any future date)
10. Click Next
11. Step 4: Select "Morning" and "Evening"
12. Click Next
13. Step 5: Select any avatar
14. Click "Complete"

Expected Results:
✅ Progress indicator updates at each step
✅ Form validation prevents skipping selections
✅ Data appears in Firestore `users/{userId}`
✅ Streak document created in Firestore `streaks/{userId}`
✅ Auto-redirect to Dashboard after completion
✅ Onboarding not re-shown on next login
```

**Verify in Firestore**:
```javascript
// Check users collection
users/{userId} {
  onboardingCompleted: true,
  studyingFor: "School/College",
  subjects: ["Mathematics", "Physics", "Chemistry"],
  dailyGoalHours: 6,
  // ... other fields
}

// Check streaks collection
streaks/{userId} {
  current: 0,
  longest: 0,
  totalStudyDays: 0,
  freezesAvailable: 0
}
```

---

### Scenario 2: Study Timer and Session Creation

**Test**: User starts a study session and saves it

```
1. From Dashboard, click "Start Studying Now"
2. Should navigate to /study-timer
3. Select subject: "Mathematics"
4. Enter session name: "Chapter 5 Review"
5. Select timer mode: "25/5" (Pomodoro)
6. Click "▶ Start" button
7. Wait 5 seconds (or test with shorter duration)
8. Click "⏹ Stop" button
9. Review session stats in popup
10. Click "✅ Save Session"

Expected Results:
✅ Timer counts down (25:00 → 0:00)
✅ Progress bar animates
✅ Session end popup appears
✅ Shows duration in minutes
✅ Session saved to Firestore
✅ Notification: "✅ Session saved!"
✅ Auto-redirect to Dashboard after 2 seconds
✅ Dashboard stats update
```

**Verify in Firestore**:
```javascript
// Check studySessions collection
studySessions/{sessionId} {
  userId: "...",
  subject: "Mathematics",
  sessionName: "Chapter 5 Review",
  duration: 5, // minutes (or however long you waited)
  date: "2025-11-20", // today's date
  startTime: Timestamp,
  endTime: Timestamp,
  type: "solo"
}

// Check streaks collection (should be updated)
streaks/{userId} {
  current: 0 or 1, // depends on duration >= 10 min
  lastStudyDate: "2025-11-20" // if >= 10 min
}
```

---

### Scenario 3: Streak Building

**Test**: User completes 3 daily sessions to build streak

```
Day 1:
1. Complete 25-min study session
2. Check Dashboard - Streak should show 🔥 1

Day 2:
1. Complete 25-min study session
2. Check Dashboard - Streak should show 🔥 2

Day 3:
1. Complete 25-min study session
2. Check Dashboard - Streak should show 🔥 3

Day 7:
1. Complete session #7
2. Dashboard should show: Streak = 🔥 7, Freezes ❄️ ×1

Expected Results:
✅ Streak increments daily
✅ Longest streak updates
✅ Total study days increments
✅ Freeze earned on Day 7
✅ Message updates: "🌟 Amazing consistency!"
✅ Real-time updates visible
```

**Verify in Firestore**:
```javascript
streaks/{userId} {
  current: 3,
  longest: 3,
  lastStudyDate: "2025-11-22",
  totalStudyDays: 3,
  freezesAvailable: 0, // becomes 1 on day 7
  studyDays: {
    "2025-11-20": true,
    "2025-11-21": true,
    "2025-11-22": true
  }
}
```

---

### Scenario 4: Dashboard Real-Time Updates

**Test**: Dashboard shows real data from Firestore

```
1. Login to application
2. Check Dashboard widgets:
   - Streak Widget: Should show current streak
   - Today's Study: Should show hours:minutes
   - This Week: Should show minutes
   - Total Sessions: Should show count

3. Open another browser tab
4. Complete a study session in first tab
5. Switch to second tab
6. Stats should update automatically (without refresh)

Expected Results:
✅ All widgets show real Firestore data
✅ Widget values match Firestore documents
✅ Real-time updates work (live sync)
✅ Loading states appear initially
✅ No hardcoded values
```

---

### Scenario 5: Minimum Duration Check

**Test**: Sessions under 10 minutes don't count

```
1. Start timer (25/5 mode)
2. Wait 5 seconds
3. Click Stop
4. Save session

Expected Results:
⚠️ Streak should NOT update (duration < 10 min)
✅ Session still saved to Firestore
✅ Duration shows 5 minutes
✅ Firestore documents created but streak not incremented
```

---

### Scenario 6: Real-Time Session Display

**Test**: Recent sessions appear on Dashboard

```
1. Complete a 25-minute study session
2. Save and return to Dashboard
3. Scroll down to "Recent Study Sessions" section
4. New session should appear in list
5. Shows subject, date, duration

Expected Results:
✅ Recent sessions appear without refresh
✅ List sorted by newest first
✅ Shows last 5 sessions
✅ Date format correct (Today, Yesterday, Jan 15)
✅ Duration displayed
```

---

## 🔍 Browser Console Checks

### Check Console Logs
Open DevTools (`F12`) → Console tab

**Expected logs**:
```
✅ "AuthContext Init - Session token exists: true"
✅ "Streak listener error: none" OR "streaks loaded"
✅ "generateCourse called with token: EXISTS"
✅ No red error messages
❌ No "Cannot read property" errors
❌ No "undefined is not a function" errors
```

### Check Network Tab
Open DevTools → Network tab

**When loading Dashboard**:
```
✅ GET /api/health → 200 OK
✅ GET .../studySessions?userId=... → 200 OK
✅ GET .../streaks/{userId} → 200 OK
✅ No 401 Unauthorized errors
✅ No 403 Forbidden errors
```

### Check Firestore Activity
Open Firebase Console → Firestore Database

**When you complete a session**:
```
✅ New document appears in studySessions
✅ Document in streaks updates (lastModified time changes)
✅ No permission errors
✅ No index warnings
```

---

## 🚀 Performance Testing

### Load Test
```
1. Complete 10 study sessions in succession
2. Dashboard should load in < 2 seconds
3. Stats should update smoothly
4. No lag or UI freezing
5. All transitions smooth
```

### Data Sync Test
```
1. Open Dashboard in 2 browser tabs
2. Complete session in Tab 1
3. Switch to Tab 2 (don't refresh)
4. Stats should update within 1-2 seconds
5. No need to refresh manually
```

---

## ❌ Common Issues & Fixes

### Issue: "Collections not found" error
**Fix**:
```
1. Go to Firebase Console
2. Click "Firestore Database"
3. Click "+ Create Collection"
4. Name: "studySessions" → Create
5. Repeat for "streaks"
6. Refresh your app
```

### Issue: "Streak not updating" after session
**Fix**:
```
1. Check session duration >= 10 minutes
2. Check Firestore has streaks/{userId} document
3. Check console for errors (F12)
4. Verify Firebase credentials in .env
5. Check StreakContext is in main.jsx
```

### Issue: "CORS error" or "Network error"
**Fix**:
```
1. Verify backend running: http://localhost:5000/api/health
2. Check server/index.js has port 5175 in CORS
3. Verify .env GOOGLE_CLIENT_ID is correct
4. Check browser console for specific error
5. Restart backend: npm run dev
```

### Issue: "Onboarding not saving"
**Fix**:
```
1. Check user is signed in (should see user email)
2. Verify all form fields filled (validation should prevent save)
3. Check Firestore permissions allow write
4. Check users collection exists
5. Verify Firebase initialized in lib/firebase.js
```

### Issue: "Timer not counting down"
**Fix**:
```
1. Check useTimer hook is imported
2. Verify browser allows audio (for notification)
3. Check browser time is correct
4. Try different timer mode
5. Check console for JavaScript errors
```

---

## ✅ Final Sign-Off Checklist

Before declaring Phase 1 complete:

### Functionality
- [ ] Onboarding flow works end-to-end
- [ ] All 5 steps functional
- [ ] Data saves to Firestore
- [ ] Study timer starts, counts, and saves
- [ ] Streak increments daily
- [ ] Streak freezes work
- [ ] Dashboard shows real data
- [ ] All widgets update in real-time

### Data Integrity
- [ ] No data loss on page refresh
- [ ] No duplicate entries in Firestore
- [ ] Timestamps correct in all documents
- [ ] User IDs match across collections
- [ ] Minimum 10-min check working

### UI/UX
- [ ] All pages responsive
- [ ] Buttons clickable and functional
- [ ] Progress indicators update smoothly
- [ ] Notifications appear at right time
- [ ] No console errors

### Performance
- [ ] Pages load < 2 seconds
- [ ] Dashboard updates < 1 second after action
- [ ] Real-time sync working
- [ ] No memory leaks (check DevTools)
- [ ] Smooth animations/transitions

### Backend
- [ ] Health endpoint responds
- [ ] Session endpoints working
- [ ] Token validation works
- [ ] CORS configured correctly
- [ ] Error messages helpful

### Deployment Ready
- [ ] All environment variables set
- [ ] Firebase credentials correct
- [ ] No hardcoded values
- [ ] Error handling in place
- [ ] Logs clean (no warnings)

---

## 📊 Testing Report Template

```markdown
# Phase 1 Testing Report

## Test Date: [DATE]
## Tester: [NAME]
## Build Version: [VERSION]

### Onboarding Flow
- [x/x] Steps completed successfully
- Issues: [List any issues found]

### Study Timer
- [x] Timer functionality
- [x] Session saving
- Issues: [List any issues found]

### Streak System
- [x] Streak increments
- [x] Freeze working
- Issues: [List any issues found]

### Dashboard
- [x] Real-time updates
- [x] Stats accurate
- Issues: [List any issues found]

### Overall Status
- [ ] Ready for Production
- [ ] Needs Fixes (list below)

### Issues Found
1. [Issue 1]
2. [Issue 2]

### Recommendations
- [Recommendation 1]
- [Recommendation 2]

---
Report Generated: [DATE]
```

---

## 🎯 Success Criteria

✅ **Functional Success**:
- All 3 priority features working
- Dashboard shows real data
- Firestore integration complete
- Backend endpoints operational

✅ **Quality Success**:
- No console errors
- < 2 second load time
- Real-time sync working
- Data persists correctly

✅ **User Success**:
- Can complete onboarding
- Can track study sessions
- Can see streak progress
- Motivating experience

✅ **Technical Success**:
- Clean code architecture
- Proper error handling
- Efficient Firestore queries
- Scalable design

---

## 🚀 Next Steps After Testing

1. **If all tests pass**:
   - Merge to main branch
   - Deploy to Firebase Hosting
   - Announce Phase 1 complete
   - Plan Phase 2 (Study Rooms)

2. **If issues found**:
   - Document each issue
   - Assign priority (P0/P1/P2)
   - Fix and retest
   - Repeat until passing

3. **Performance optimization**:
   - Add caching if needed
   - Optimize Firestore queries
   - Add loading states
   - Implement error boundaries

---

*Testing Guide Complete*  
*Ready to execute test scenarios!*
