# StudySync Implementation Roadmap

## Current Status: ~19% Complete (MVP Phase)

### What's Working ✅
1. Google OAuth Authentication
2. Firebase Integration
3. Gemini AI Course Generation
4. Basic Dashboard & Navigation
5. Course viewing with quizzes
6. Dark/Light theme
7. User profiles

---

## Phase 1: MVP Essentials (Next Priority)

### 1. ONBOARDING FLOW (High Priority)
**Location**: `src/pages/Onboarding.jsx` + route in `App.jsx`

**What to build:**
```
Step 1: What are you preparing for?
  - School Exams (Class 10/12)
  - College/University
  - Competitive Exams (JEE, NEET, UPSC)
  - Professional Certifications
  - Other

Step 2: Select Subjects
  - Multi-select from predefined list
  - Custom subject option

Step 3: Set Goals
  - Daily study hours (slider: 1-8)
  - Target exam date (date picker)

Step 4: Study Preferences
  - Preferred study times (Morning/Afternoon/Evening/Night)

Step 5: Avatar Selection
  - 20+ preset avatars OR upload photo

Storage: Save to Firestore users/{userId}/preferences
```

**Database Schema:**
```javascript
users/{userId} {
  onboardingCompleted: boolean,
  onboardingCompletedAt: timestamp,
  studyingFor: "Competitive Exams",
  subjects: ["Mathematics", "Physics", "Chemistry"],
  dailyGoalHours: 4,
  examDate: "2025-05-15",
  preferredStudyTimes: ["Morning", "Evening"],
  avatar: "avatar_03.png"
}
```

---

### 2. POMODORO TIMER (High Priority)
**Location**: `src/pages/StudyTimer.jsx` or `src/components/StudyTimer.jsx`

**Features:**
- 3 modes: Pomodoro (25/5), Extended (50/10), Custom
- Large countdown display
- Start/Pause/Stop buttons
- Subject selector (What am I studying?)
- Session duration tracking
- Save session to Firestore after completion

**Database Schema:**
```javascript
studySessions/{sessionId} {
  userId: "user123",
  subject: "Mathematics",
  duration: 25, // minutes
  startTime: timestamp,
  endTime: timestamp,
  date: "2025-01-16",
  type: "solo_session"
}
```

---

### 3. STREAK SYSTEM (High Priority)
**Location**: `src/contexts/StreakContext.jsx` or add to AuthContext

**Features:**
- Track daily study sessions (min 10 min)
- Calculate consecutive days
- Reset if day missed (with freeze option)
- Display current streak, longest streak
- Earn 1 freeze per 7-day streak
- Show calendar of study days

**Database Schema:**
```javascript
streaks/{userId} {
  current: 12,
  longest: 28,
  lastStudyDate: "2025-01-16",
  totalStudyDays: 87,
  freezesAvailable: 2,
  history: {
    "2025-01-16": true,
    "2025-01-15": true
  }
}
```

**Calculation Logic:**
```javascript
const updateStreak = async (userId) => {
  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
  
  const streakDoc = await getDoc(doc(firestore, 'streaks', userId))
  const streakData = streakDoc.data()
  
  if (streakData.lastStudyDate === yesterday) {
    // Continue streak
    await updateDoc(doc(firestore, 'streaks', userId), {
      current: increment(1),
      lastStudyDate: today,
      longest: Math.max(streakData.current + 1, streakData.longest)
    })
  } else if (streakData.freezesAvailable > 0) {
    // Use freeze
    await updateDoc(doc(firestore, 'streaks', userId), {
      freezesAvailable: increment(-1),
      lastStudyDate: today
    })
  } else {
    // Reset streak
    await updateDoc(doc(firestore, 'streaks', userId), {
      current: 1,
      lastStudyDate: today
    })
  }
}
```

---

### 4. AI STUDY PLANNER (Medium Priority)
**Location**: `src/pages/StudyPlanner.jsx`

**Features:**
- Input: Exam name, days remaining, daily hours, subjects
- AI generates 60-day study plan using OpenAI/Gemini
- Return structured plan with daily breakdowns
- Show calendar view with progress
- Allow regenerate if not satisfied

**API Endpoint Needed:**
```javascript
POST /api/study-plans/generate
{
  examName: "JEE Mains",
  examDate: "2025-05-15",
  dailyHours: 4,
  subjects: ["Mathematics", "Physics", "Chemistry"],
  currentLevel: "50% syllabus covered",
  weakTopics: ["Calculus", "Mechanics"]
}
```

---

## Phase 2: Social & Gamification (After MVP)

### 5. STUDY ROOMS (Medium Priority)
**Location**: `src/pages/StudyRooms.jsx` + real-time features

**Features:**
- Browse public/private rooms
- Join room with live timer sync
- See who's studying what
- Chat with room members
- Save session data

**Real-time Technology**: Firebase Realtime Database

---

### 6. CHALLENGES & LEADERBOARDS (Medium Priority)
**Location**: `src/pages/Challenges.jsx`

**Features:**
- Browse challenges (Personal/Public/Friend/Team)
- Join challenges
- Track progress in real-time
- Leaderboard display
- Earn badges on completion

---

## Required Backend Changes

### Add Firebase Collections

```javascript
// In Firebase Console or using admin SDK

// Study Sessions
studies/{userId}/sessions/{sessionId} {
  subject, duration, date, type
}

// Streaks
streaks/{userId} {
  current, longest, lastStudyDate, freezesAvailable
}

// Study Plans
studyPlans/{planId} {
  userId, examName, days, subjects, createdAt
}

// Challenges
challenges/{challengeId} {
  title, type, goal, startDate, endDate
}

// Challenge Progress
challengeProgress/{challengeId}/{userId} {
  progress, rank, sessions
}
```

### Add Backend Endpoints

```javascript
// Backend additions needed:
POST /api/study-plans/generate    // AI generate plan
POST /api/study-sessions/start    // Log session start
POST /api/study-sessions/end      // Log session end (save to DB)
GET  /api/user/streak             // Get streak info
POST /api/user/streak/update      // Update streak
GET  /api/challenges              // Get all challenges
POST /api/challenges/join         // Join challenge
GET  /api/leaderboard/{challengeId} // Get rankings
```

---

## Implementation Checklist

### Week 1: Core Gamification
- [ ] Create Onboarding flow (5 steps)
- [ ] Build Pomodoro Timer component
- [ ] Implement Streak calculation logic
- [ ] Add Firestore collections

### Week 2: Study Planning
- [ ] Create AI Study Planner page
- [ ] Integrate OpenAI/Gemini for plan generation
- [ ] Build calendar view for plans
- [ ] Add plan editing features

### Week 3: Social Features
- [ ] Build Study Rooms UI
- [ ] Implement real-time features (Firebase Realtime DB)
- [ ] Add room chat functionality
- [ ] Session persistence

### Week 4: Gamification
- [ ] Create Challenges page
- [ ] Build Leaderboard component
- [ ] Implement challenge scoring
- [ ] Add badge system

---

## File Structure to Create

```
src/
├── pages/
│   ├── Onboarding.jsx           (NEW)
│   ├── StudyTimer.jsx           (NEW)
│   ├── StudyPlanner.jsx         (NEW)
│   ├── StudyRooms.jsx           (NEW)
│   ├── Challenges.jsx           (NEW)
│   └── Leaderboard.jsx          (NEW)
├── components/
│   ├── OnboardingStep.jsx       (NEW)
│   ├── TimerDisplay.jsx         (NEW)
│   ├── StreakWidget.jsx         (NEW)
│   ├── RoomCard.jsx             (NEW)
│   ├── ChallengeCard.jsx        (NEW)
│   └── LeaderboardItem.jsx      (NEW)
├── contexts/
│   ├── StreakContext.jsx        (NEW)
│   └── ChallengeContext.jsx     (NEW)
├── hooks/
│   ├── useTimer.js              (NEW)
│   ├── useStreak.js             (NEW)
│   └── useStudyPlan.js          (NEW)
└── lib/
    ├── studyPlanner.js          (NEW)
    └── firestore.js             (NEW - Firestore utilities)
```

---

## Quick Start: Build Onboarding First

**Steps:**
1. Create `src/pages/Onboarding.jsx`
2. Add route to `App.jsx`
3. Create 5-step component with state management
4. Integrate with Firestore to save preferences
5. Redirect to Dashboard after completion
6. Add onboarding check in AuthContext

**Estimated Time**: 4-6 hours
**Dependencies**: None (all libraries already installed)

---

*This roadmap prioritizes MVP completion followed by engagement features.*
