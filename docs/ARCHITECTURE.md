# 🏗️ Architecture & System Design

Complete overview of CodeFlux system architecture, database schema, and component structure.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE (React)                     │
├─────────────────────────────────────────────────────────────────┤
│  Landing → Dashboard → Create Course → My Learning → Quiz       │
│           (with Google OAuth Authentication)                     │
└────────────────────────────┬──────────────────────────────────────┘
                             │ HTTP/REST
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                         │
├─────────────────────────────────────────────────────────────────┤
│  Routes: /auth, /courses, /quiz, /sessions                      │
│  Middleware: Auth verification, CORS                            │
└────────────────────────────┬──────────────────────────────────────┘
                             │ API Calls
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                           │
├─────────────────────────────────────────────────────────────────┤
│  • Firebase (Database, Auth)                                     │
│  • Gemini API (Course & Quiz Generation)                        │
│  • Google OAuth (Authentication)                                │
└─────────────────────────────────────────────────────────────────┘
```

## Database Structure (Firebase Realtime Database)

```
Firebase/
├── users/
│   └── {uid}/
│       ├── profile/
│       │   ├── displayName
│       │   ├── email
│       │   ├── photoURL
│       │   └── createdAt
│       ├── courses/
│       │   └── {courseId}/
│       │       ├── id
│       │       ├── title
│       │       ├── description
│       │       ├── chapters: [...]
│       │       ├── createdAt
│       │       └── progress
│       ├── quizzes/
│       │   └── {courseId}/
│       │       └── {attemptId}/
│       │           ├── questions: [...]
│       │           ├── answers: {}
│       │           ├── score
│       │           └── timestamp
│       └── stats/
│           ├── totalCoursesEnrolled
│           ├── currentStreak
│           └── longestStreak
└── courses/
    └── {courseId}/
        ├── title
        ├── description
        └── chapters: [...]
```

## Component Structure

### Pages
```
pages/
├── Landing.jsx          - Home page with features
├── Dashboard.jsx        - Main dashboard with stats
├── MyLearning.jsx       - View enrolled courses
├── CourseDetail.jsx     - Single course view
├── ChapterDetail.jsx    - Chapter content
├── Quiz.jsx             - Quiz center
├── Profile.jsx          - User profile
├── Settings.jsx         - User settings
├── Community.jsx        - Community features
└── Explore.jsx          - Browse courses
```

### Components
```
components/
├── Navbar.jsx
├── Sidebar.jsx
├── CreateCourseModal.jsx
├── Quiz/
│   ├── QuizInterface.jsx
│   └── QuizResults.jsx
├── StreakWidget.jsx
└── ... other components
```

### Contexts (State Management)
```
contexts/
├── AuthContext.jsx      - User authentication state
├── StreakContext.jsx    - Streak tracking
└── ThemeContext.jsx     - Dark/Light theme
```

### Libraries
```
lib/
├── firebase.js          - Firebase initialization
├── firebaseCoursesService.js  - Course CRUD operations
├── quizService.js       - Quiz generation & scoring
├── dateUtils.js         - Date utilities
└── api.js               - Backend API calls
```

## Authentication Flow

```
1. User clicks "Sign in with Google"
    ↓
2. Firebase opens Google OAuth dialog
    ↓
3. User authenticates with Google
    ↓
4. Firebase creates user account
    ↓
5. AuthContext updates with user data
    ↓
6. Protected routes become accessible
```

## Course Generation Flow

```
1. User fills course creation form
    ↓
2. Form validates input
    ↓
3. Gemini API generates course content
    ↓
4. Course saved to Firebase
    ↓
5. Course appears in My Learning
    ↓
6. User can view chapters and lessons
```

## Quiz Generation Flow

```
1. User starts quiz for a course
    ↓
2. Quiz questions generated from course content using Gemini
    ↓
3. User answers 12 MCQ questions
    ↓
4. Answers submitted and scored
    ↓
5. Results page shows:
       - Score breakdown (Pie chart)
       - Performance by question (Bar chart)
       - Explanations for each question
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18.2.0, Vite 5.4.21, Tailwind CSS 3.4.2 |
| Backend | Express 4.18.2, Node.js |
| Database | Firebase Realtime Database |
| Authentication | Firebase Auth + Google OAuth 2.0 |
| AI/ML | Google Generative AI (Gemini 2.0-flash) |
| Visualization | Recharts |
| Icons | Lucide React |
| State Management | React Context API |

## Key Features Implementation

### 🤖 AI Course Generation
- Uses Gemini 2.0-flash to generate course content
- Supports any topic
- Generates chapters, lessons, and concepts

### 🔒 Security
- Firebase security rules protect data
- Google OAuth for authentication
- UID-based data isolation
- Protected API routes

### 📊 Quiz System
- AI-generated MCQ questions from course content
- 12 questions per quiz
- Detailed explanations
- Score tracking
- Visual results (Pie + Bar charts)

### 🔥 Streak System
- Tracks consecutive learning days
- Tracks longest streak
- Stores freeze tokens
- Displays in dashboard

### 💾 Data Persistence
- All courses saved to Firebase
- Quiz attempts tracked
- User progress maintained
- LocalStorage fallback

## Deployment Architecture

For production deployment, the system can run on:
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, AWS Lambda, Google Cloud Run
- **Database**: Firebase (cloud-hosted)
- **CDN**: CloudFlare for static assets

---

See [API Integration](./API_INTEGRATION.md) for external service details.
