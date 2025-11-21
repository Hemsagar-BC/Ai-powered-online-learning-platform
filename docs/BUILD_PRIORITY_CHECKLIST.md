# BUILD THIS FIRST - Priority Action Items

## Status: Current App vs PRD Requirements

### ✅ WHAT'S WORKING (15 features)
```
✅ Google OAuth authentication
✅ Firebase integration
✅ Gemini AI course generation
✅ Dashboard page with stats
✅ Navigation (Sidebar + Navbar)
✅ User profiles
✅ Settings (theme, notifications)
✅ Course overview
✅ Chapter detail with video
✅ Quiz modal
✅ Community discussions
✅ AI Study Buddy chat
✅ Session persistence (localStorage)
✅ Dark/Light theme
✅ Course creation modal
```

### ❌ WHAT'S MISSING (65 features) - NEED TO BUILD

---

## TOP 5 PRIORITY BUILDS (Next 2 Weeks)

### 1. ONBOARDING FLOW (Highest Priority)
**Why**: Required before users can use advanced features  
**Impact**: High (gate for feature access)  
**Time**: 4-6 hours

**Must Include:**
- [ ] Step 1: What are you studying for? (dropdown: School/College/Competitive Exams/etc)
- [ ] Step 2: Subject selection (multi-select)
- [ ] Step 3: Daily goal hours (slider 1-8) + exam date picker
- [ ] Step 4: Preferred study times (checkboxes: Morning/Afternoon/Evening/Night)
- [ ] Step 5: Avatar selection (20 options or upload)
- [ ] Progress indicator (Step X of 5)
- [ ] Save to Firestore `users/{userId}/preferences`
- [ ] Redirect to Dashboard on complete

**File**: Create `src/pages/Onboarding.jsx`

```jsx
export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    studyingFor: '',
    subjects: [],
    dailyHours: 4,
    examDate: '',
    studyTimes: [],
    avatar: ''
  })

  const handleNext = async () => {
    if (step === 5) {
      // Save to Firestore and redirect
      await savePreferences()
      navigate('/dashboard')
    } else {
      setStep(step + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br...">
      {/* Step indicator */}
      {/* Form based on step */}
      {/* Next/Previous buttons */}
    </div>
  )
}
```

---

### 2. POMODORO TIMER (Very High Priority)
**Why**: Core study feature, enables session tracking  
**Impact**: High (primary study tool)  
**Time**: 6-8 hours

**Must Include:**
- [ ] Large circular timer display (MM:SS)
- [ ] Three modes: Pomodoro (25/5), Extended (50/10), Custom
- [ ] Subject selector ("What am I studying?")
- [ ] Start/Pause/Stop buttons
- [ ] Session logging to Firestore
- [ ] Desktop notifications
- [ ] Progress bar for current session

**File**: Create `src/pages/StudyTimer.jsx` or `src/components/TimerDisplay.jsx`

```jsx
export default function StudyTimer() {
  const [mode, setMode] = useState('pomodoro') // or 'extended' or 'custom'
  const [timeLeft, setTimeLeft] = useState(25 * 60) // in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [subject, setSubject] = useState('')

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Session complete - save to DB
          saveSession()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  const saveSession = async () => {
    await addDoc(collection(firestore, 'studySessions'), {
      userId: user.uid,
      subject,
      duration: mode === 'pomodoro' ? 25 : 50,
      date: format(new Date(), 'yyyy-MM-dd'),
      timestamp: Timestamp.now()
    })
    updateStreak(user.uid)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-6xl font-bold mb-8">
        {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
        {String(timeLeft % 60).padStart(2, '0')}
      </div>
      <div className="mb-8 space-x-4">
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => { setIsRunning(false); saveSession() }}>Stop</button>
      </div>
    </div>
  )
}
```

---

### 3. STREAK SYSTEM (Very High Priority)
**Why**: Motivates consistency, core gamification  
**Impact**: High (motivation driver)  
**Time**: 6-8 hours

**Must Include:**
- [ ] Daily calculation (min 10 min session required)
- [ ] Current + Longest streak tracking
- [ ] Visual streak display (🔥 12 days)
- [ ] Freeze feature (1 free skip per 7-day streak)
- [ ] Calendar showing study days
- [ ] Reset on missed day (unless freeze used)
- [ ] Store in Firestore `streaks/{userId}`

**File**: Create `src/contexts/StreakContext.jsx` or add to `AuthContext.jsx`

```javascript
// Firestore schema:
streaks/{userId} {
  current: 12,
  longest: 28,
  lastStudyDate: "2025-01-16",
  totalStudyDays: 87,
  freezesAvailable: 2,
  freezeUsedDate: null,
  studyDays: {
    "2025-01-16": true,
    "2025-01-15": true
  }
}

// Calculation logic:
const updateStreak = async (userId, sessionDuration) => {
  // Check if session is long enough (min 10 min)
  if (sessionDuration < 10) return

  const today = format(new Date(), 'yyyy-MM-dd')
  const streakRef = doc(firestore, 'streaks', userId)
  const streakDoc = await getDoc(streakRef)
  
  if (!streakDoc.exists()) {
    await setDoc(streakRef, {
      current: 1,
      longest: 1,
      lastStudyDate: today,
      totalStudyDays: 1,
      freezesAvailable: 0,
      studyDays: { [today]: true }
    })
    return
  }

  const data = streakDoc.data()
  const lastDate = data.lastStudyDate
  const daysSinceLastStudy = differenceInDays(new Date(), parseISO(lastDate))

  if (daysSinceLastStudy === 0) {
    // Already studied today
    return
  } else if (daysSinceLastStudy === 1) {
    // Continue streak
    await updateDoc(streakRef, {
      current: increment(1),
      longest: Math.max(data.current + 1, data.longest),
      lastStudyDate: today,
      totalStudyDays: increment(1),
      [`studyDays.${today}`]: true
    })
    
    // Earn freeze every 7 days
    if ((data.current + 1) % 7 === 0) {
      await updateDoc(streakRef, {
        freezesAvailable: increment(1)
      })
    }
  } else {
    // Days missed - check for freeze
    if (data.freezesAvailable > 0) {
      await updateDoc(streakRef, {
        freezesAvailable: increment(-1),
        lastStudyDate: today,
        freezeUsedDate: today,
        [`studyDays.${today}`]: true
      })
    } else {
      // Streak broken
      await updateDoc(streakRef, {
        current: 1,
        lastStudyDate: today,
        totalStudyDays: increment(1),
        [`studyDays.${today}`]: true
      })
    }
  }
}
```

---

### 4. STUDY DASHBOARD IMPROVEMENT (High Priority)
**Why**: Shows real-time stats, motivates users  
**Impact**: Medium (engagement)  
**Time**: 4-6 hours

**Must Include:**
- [ ] Real-time streak display (from Firestore, not hardcoded)
- [ ] Today's plan (from study plan or sessions)
- [ ] Weekly hours tracker
- [ ] Total XP calculation
- [ ] Recent courses
- [ ] Study statistics
- [ ] Loading states

**Modify**: `src/pages/Dashboard.jsx`

```jsx
export default function Dashboard() {
  const [streak, setStreak] = useState(null)
  const [stats, setStats] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    // Fetch streak
    getDoc(doc(firestore, 'streaks', user.uid)).then(snap => {
      if (snap.exists()) {
        setStreak(snap.data())
      }
    })

    // Fetch today's sessions
    const today = format(new Date(), 'yyyy-MM-dd')
    getDocs(query(
      collection(firestore, 'studySessions'),
      where('userId', '==', user.uid),
      where('date', '==', today)
    )).then(snap => {
      const totalMins = snap.docs.reduce((sum, doc) => sum + doc.data().duration, 0)
      setStats(prev => ({ ...prev, todayMinutes: totalMins }))
    })
  }, [user.uid])

  return (
    <div className="max-w-7xl mx-auto">
      {/* Streak widget */}
      {streak && (
        <div className="card">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-2xl font-bold">{streak.current}-Day Streak</div>
          <div className="text-sm text-slate-600">Longest: {streak.longest} days</div>
        </div>
      )}
      
      {/* Today's hours */}
      {stats && (
        <div className="card">
          <div className="text-sm text-slate-500">Today's Study Time</div>
          <div className="text-2xl font-bold mt-2">
            {Math.floor(stats.todayMinutes / 60)}h {stats.todayMinutes % 60}m
          </div>
        </div>
      )}

      {/* Quick start timer */}
      <button onClick={() => navigate('/study-timer')} className="btn btn-primary">
        Start Studying Now
      </button>
    </div>
  )
}
```

---

### 5. FIRESTORE DATABASE SETUP (Critical)
**Why**: Required for all data persistence  
**Impact**: Critical (no data without this)  
**Time**: 2-4 hours

**Collections to Create in Firebase Console:**

```javascript
// 1. studySessions - Log every study session
studySessions/{sessionId} {
  userId: "user123",
  subject: "Mathematics",
  duration: 25, // minutes
  date: "2025-01-16",
  startTime: timestamp,
  endTime: timestamp,
  roomId: null, // if in a room
  type: "solo" or "room"
}

// 2. streaks - Track daily streaks
streaks/{userId} {
  current: 12,
  longest: 28,
  lastStudyDate: "2025-01-16",
  totalStudyDays: 87,
  freezesAvailable: 2,
  freezeUsedDate: null,
  studyDays: {
    "2025-01-16": true,
    "2025-01-15": true
  }
}

// 3. preferences - User onboarding data
users/{userId} {
  ...existing fields...,
  onboardingCompleted: true,
  studyingFor: "Competitive Exams",
  subjects: ["Mathematics", "Physics"],
  dailyGoalHours: 4,
  examDate: "2025-05-15",
  preferredStudyTimes: ["Morning", "Evening"],
  avatar: "avatar_03.png"
}

// 4. studyPlans (for future AI planner)
studyPlans/{planId} {
  userId: "user123",
  examName: "JEE Mains",
  days: [...],
  createdAt: timestamp
}
```

**Setup Instructions:**
1. Go to Firebase Console → Firestore Database
2. Create new database (if not exists)
3. Create collections: `studySessions`, `streaks`
4. Update `users` collection schema
5. Create indexes for queries:
   - `studySessions`: userId + date (composite index)
   - `studySessions`: userId + timestamp

---

## Implementation Checklist

### Week 1
- [ ] Create Onboarding.jsx (4-6h)
- [ ] Setup Firestore collections (2-4h)
- [ ] Create TimerDisplay component (6-8h)
- [ ] Test authentication flow

### Week 2
- [ ] Implement Streak calculations (6-8h)
- [ ] Create StreakWidget component (3-4h)
- [ ] Update Dashboard with real data (4-6h)
- [ ] Add backend endpoints for sessions

### Testing
- [ ] Authentication flow works end-to-end
- [ ] Sessions save to Firestore correctly
- [ ] Streak calculation accurate (especially timezone)
- [ ] Dashboard updates in real-time
- [ ] Onboarding saves preferences

### Deploy
- [ ] Test on staging
- [ ] Performance check (Firestore queries)
- [ ] Error handling for all new features

---

## Code Example: Complete Session Flow

```javascript
// User completes a study session

// 1. Timer component saves session
const saveSession = async () => {
  const sessionRef = await addDoc(collection(firestore, 'studySessions'), {
    userId: user.uid,
    subject: 'Mathematics',
    duration: 25, // minutes
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: sessionStartTime,
    endTime: Date.now(),
    type: 'solo'
  })
  
  // 2. Update streak
  await updateStreak(user.uid, 25)
  
  // 3. Show notification
  showNotification('✅ Session saved! 🔥 Streak: +1', 'success')
  
  // 4. Dashboard reflects new stats
  // (via real-time listener)
}

// Dashboard listens for changes
useEffect(() => {
  const q = query(
    collection(firestore, 'studySessions'),
    where('userId', '==', user.uid),
    where('date', '==', today)
  )
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const total = snapshot.docs.reduce((sum, doc) => sum + doc.data().duration, 0)
    setTodayMinutes(total)
  })
  
  return unsubscribe
}, [user.uid])
```

---

## Success Criteria for Phase 1 Complete

✅ User can:
1. Complete onboarding after signup
2. Start a 25-minute study session
3. See timer counting down
4. View updated streak on dashboard
5. See all sessions saved in Firestore
6. Use freeze to maintain streak if they miss a day
7. Logout and login - data persists

✅ App metrics:
- Zero errors in browser console
- All Firestore queries complete in <500ms
- Dashboard updates <1s after session end
- 90%+ test coverage for streak logic

---

**Next Action**: Start building Onboarding.jsx - Highest ROI feature!

*Estimated completion with this roadmap: 2 weeks for full MVP+engagement*
