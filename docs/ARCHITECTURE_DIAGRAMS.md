# 🏗️ CodeFlux Architecture Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CodeFlux Platform                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐      ┌──────────────────────────────┐
│  Browser (User Device)       │      │  Developer Machine          │
├──────────────────────────────┤      ├──────────────────────────────┤
│ React Frontend App           │      │ Backend Server               │
│ http://localhost:5174        │◄────►│ http://localhost:5000        │
│                              │      │                              │
│ ├─ Landing Page             │      │ ├─ Express.js               │
│ ├─ Dashboard                │      │ ├─ Google OAuth             │
│ ├─ Settings (Theme)         │      │ ├─ Session Manager          │
│ ├─ Profile                  │      │ ├─ API Routes               │
│ └─ CreateCourseModal        │      │ └─ CORS Middleware          │
│                              │      │                              │
│ Authentication:              │      │ Protected:                   │
│ ├─ AuthContext              │      │ ├─ /api/user/profile        │
│ ├─ Firebase Client          │      │ └─ /api/courses/generate    │
│ └─ API Service              │      │                              │
└──────────────────────────────┘      └──────────────────────────────┘
          │                                      │
          │                                      │
          └──────────────────────────────────────┘
                        (HTTP)
                    API Requests &
                  JSON Responses
```

---

## Authentication Flow

```
User Interface
     │
     ▼
[Click "Sign in with Google"]
     │
     ▼
Frontend: getGoogleAuthUrl()
     │
     ├─ API Call → Backend GET /api/auth/google
     │
     ▼
Backend: Generate Google Auth URL
     │
     ├─ Returns auth URL to frontend
     │
     ▼
Frontend: Redirect to Google OAuth
     │
     ├─ User enters credentials
     ├─ Google validates
     ├─ Returns authorization code
     │
     ▼
Frontend: Exchange code for session
     │
     ├─ API Call → Backend POST /api/auth/google/callback
     ├─ Send: { code: "auth_code" }
     │
     ▼
Backend: Token Exchange
     │
     ├─ OAuth2Client.getToken(code)
     ├─ Verify with Google
     ├─ Extract user info
     ├─ Create session in memory
     ├─ Return: { sessionToken, user }
     │
     ▼
Frontend: Store Session
     │
     ├─ localStorage.setItem('sessionToken', token)
     ├─ Update AuthContext
     ├─ Redirect to Dashboard
     │
     ▼
Authenticated Session Active ✅
```

---

## API Communication Pattern

```
┌─────────────┐                     ┌─────────────┐
│  Frontend   │                     │   Backend   │
└─────────────┘                     └─────────────┘
      │                                    │
      │  GET /api/auth/google              │
      ├───────────────────────────────────►│
      │                                    │
      │         { authUrl: "..." }         │
      │◄───────────────────────────────────┤
      │                                    │
      │  [User logs in with Google]        │
      │                                    │
      │  POST /api/auth/google/callback    │
      ├───────────────────────────────────►│
      │  { code: "auth_code" }             │
      │                                    │
      │    [Backend exchanges token]       │
      │    [Creates session]               │
      │                                    │
      │  { sessionToken: "token" }         │
      │◄───────────────────────────────────┤
      │                                    │
      │  [Store token in localStorage]     │
      │                                    │
      │  GET /api/user/profile             │
      ├───────────────────────────────────►│
      │  Authorization: Bearer token       │
      │                                    │
      │         { user: {...} }            │
      │◄───────────────────────────────────┤
      │                                    │
      │  POST /api/courses/generate        │
      ├───────────────────────────────────►│
      │  Authorization: Bearer token       │
      │  { title: "...", chapters: 7 }    │
      │                                    │
      │   { success: true, course: {...} } │
      │◄───────────────────────────────────┤
      │                                    │
```

---

## Session Management Flow

```
┌──────────────────────────────────────────────────────────────┐
│              Backend Session Store (In-Memory)               │
└──────────────────────────────────────────────────────────────┘

User logs in
     │
     ▼
Session Created:
┌─────────────────────────────────────┐
│ sessionToken: "base64_encoded_key"  │
│ userId: "google_user_id"            │
│ email: "user@gmail.com"             │
│ name: "User Name"                   │
│ picture: "https://..."              │
│ accessToken: "google_token"         │
│ refreshToken: "google_refresh"      │
│ expiresAt: 1700000000               │
└─────────────────────────────────────┘
     │
     ▼
Session stored in Map:
userSessions.set(sessionToken, userData)
     │
     ▼
Token sent to frontend
     │
     ▼
Frontend stores in localStorage:
localStorage.setItem('sessionToken', token)
     │
     ▼
Request with Bearer Token:
Authorization: Bearer sessionToken
     │
     ▼
Backend verifies:
1. Extract token from header
2. Look up in userSessions Map
3. Check if not expired
4. Return user data or 401 error
     │
     ▼
Session Valid ✅ or Token Expired ⏳
```

---

## Component Hierarchy & Data Flow

```
App.jsx
│
├─ BrowserRouter
│  │
│  └─ AuthProvider
│     │
│     ├─ Sidebar
│     │  ├─ useAuth() → { user, isAuthenticated }
│     │  └─ CreateCourseModal
│     │     ├─ generateCourse() from src/lib/api.js
│     │     └─ Calls: POST /api/courses/generate
│     │
│     ├─ Navbar
│     │  └─ useAuth() → checks authentication
│     │
│     └─ Routes:
│        ├─ /landing → Landing.jsx (public)
│        ├─ /dashboard → Dashboard.jsx (public, sign-in optional)
│        ├─ /profile → Profile.jsx (public)
│        ├─ /settings → Settings.jsx (public)
│        └─ /community → Community.jsx (public)

Data Flow:
────────

User Action (e.g., "Generate Course")
     │
     ▼
Component calls src/lib/api.js function
     │
     ├─ generateCourse(courseData)
     │
     ▼
Check localStorage for sessionToken
     │
     ▼
Make HTTP request with Bearer token
     │
     ├─ POST /api/courses/generate
     ├─ Authorization: Bearer <token>
     ├─ Body: courseData
     │
     ▼
Backend validates Bearer token
     │
     ├─ Extract from Authorization header
     ├─ Look up in userSessions Map
     ├─ Verify not expired
     │
     ▼
If valid: Process request
If invalid: Return 401 Unauthorized
     │
     ▼
Response returned to frontend
     │
     ▼
Component updates state
     │
     ▼
UI re-renders with new data
```

---

## Frontend API Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              src/lib/api.js                                 │
│         (API Service Layer)                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Configuration:                                             │
│  const API_BASE_URL = 'http://localhost:5000/api'          │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │ Public Functions (No auth required)              │      │
│  ├──────────────────────────────────────────────────┤      │
│  │ • getGoogleAuthUrl()                             │      │
│  │ • loginWithGoogleCode(code)                      │      │
│  │ • verifySession()                                │      │
│  │ • logout()                                       │      │
│  │ • checkBackendHealth()                           │      │
│  └──────────────────────────────────────────────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │ Protected Functions (Bearer token required)      │      │
│  ├──────────────────────────────────────────────────┤      │
│  │ • getUserProfile()                               │      │
│  │ • generateCourse(courseData)                     │      │
│  └──────────────────────────────────────────────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │ Utility Functions                                │      │
│  ├──────────────────────────────────────────────────┤      │
│  │ • getSessionToken()                              │      │
│  │ • isAuthenticated()                              │      │
│  └──────────────────────────────────────────────────┘      │
│                                                              │
│  localStorage Integration:                                  │
│  ├─ Write: sessionToken                                     │
│  ├─ Read: sessionToken                                      │
│  └─ Clear on logout                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend Route Structure

```
Express Server (port 5000)
│
├─ Middleware Stack
│  ├─ CORS (Allow localhost:5174, 5173, 4173)
│  ├─ express.json() (Parse JSON)
│  └─ Error Handlers
│
├─ Public Routes
│  │
│  ├─ GET /api/health
│  │  └─ Response: { status: "OK" }
│  │
│  ├─ GET /api/auth/google
│  │  └─ Response: { authUrl: "https://..." }
│  │
│  └─ POST /api/auth/google/callback
│     ├─ Body: { code: "auth_code" }
│     └─ Response: { sessionToken, user, success }
│
├─ Auth Routes
│  │
│  ├─ POST /api/auth/verify
│  │  ├─ Body: { sessionToken }
│  │  └─ Response: { success, user }
│  │
│  └─ POST /api/auth/logout
│     ├─ Body: { sessionToken }
│     └─ Response: { success, message }
│
└─ Protected Routes (Require Bearer Token)
   │
   ├─ GET /api/user/profile
   │  ├─ Header: Authorization: Bearer <token>
   │  └─ Response: { user }
   │
   └─ POST /api/courses/generate
      ├─ Header: Authorization: Bearer <token>
      ├─ Body: { title, chapters, ... }
      └─ Response: { success, course }
```

---

## Error Handling Flow

```
Request comes in
     │
     ▼
Check route
     │
     ├─ Route not found?
     │  └─ Return: 404 Not Found
     │
     ├─ Route requires Bearer token?
     │  │
     │  └─ Check Authorization header
     │     ├─ No header?
     │     │  └─ Return: 401 Unauthorized
     │     │
     │     ├─ Invalid format?
     │     │  └─ Return: 401 Unauthorized
     │     │
     │     ├─ Token not in sessions?
     │     │  └─ Return: 401 Unauthorized
     │     │
     │     └─ Token valid?
     │        └─ Proceed to route handler
     │
     ▼
Execute route handler
     │
     ├─ Try-catch block
     │  ├─ Success?
     │  │  └─ Return: 200 with data
     │  │
     │  └─ Error?
     │     └─ console.error(error)
     │        └─ Return: 500 Server Error
     │
     ▼
Response sent to frontend
     │
     ├─ Success (2xx)?
     │  └─ Frontend processes data
     │
     └─ Error (4xx, 5xx)?
        └─ Frontend shows error message
```

---

## Authentication State Lifecycle

```
App Load
   │
   ▼
AuthContext Initialization
   │
   ├─ Check Firebase auth
   ├─ Check localStorage for sessionToken
   ├─ Call verifySession() if token exists
   │
   ▼
[isAuthenticated state set]
   │
   ├─ false: User is logged out
   │  ├─ Show: Sign-in button
   │  ├─ Show: "Continue as Guest"
   │  └─ Block: Protected actions
   │
   └─ true: User is logged in
      ├─ Show: User profile
      ├─ Show: "Generate Course" enabled
      └─ Allow: Protected actions
```

---

## Database (Future Implementation)

```
Current (In-Memory):
┌────────────────────────────────────┐
│ Backend Session Store (Map)        │
│ - Only while server running        │
│ - Lost on restart                  │
│ - No persistence                   │
└────────────────────────────────────┘

Future (Recommended):
┌─────────────┐    ┌─────────────────────────────┐
│  Backend    │───►│ Database (MongoDB/Firebase) │
│             │    ├─────────────────────────────┤
│             │    │ Collections:                │
│             │    │ • Users                     │
│             │    │ • Sessions                  │
│             │    │ • Courses                   │
│             │    │ • Enrollments               │
│             │    └─────────────────────────────┘
└─────────────┘
```

---

## Deployment Architecture

```
Development:
┌────────────────────────────────────────────────────┐
│ Developer Machine                                  │
├────────────────────────────────────────────────────┤
│ Frontend Dev Server          Backend Dev Server   │
│ npm run dev (Vite)           npm run dev (Nodemon)│
│ http://localhost:5174        http://localhost:5000
│ (Hot reload)                 (Auto restart)       │
└────────────────────────────────────────────────────┘

Production:
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Deployed)     │   Backend (Deployed)             │
├─────────────────────────────────────────────────────────────┤
│ Vercel / Netlify        │   Heroku / Railway / AWS          │
│ codeflux.app            │   api.codeflux.app               │
│ Optimized Build         │   Environment Variables:         │
│ CDN + Caching           │   • GOOGLE_CLIENT_ID             │
│ Production ENV          │   • GOOGLE_CLIENT_SECRET         │
│ (VITE_API_URL=...)      │   • DATABASE_URL                 │
│                         │   • PORT=3000                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Layers

```
┌──────────────────────────────────────────────────────────┐
│                    Security Implementation               │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ Layer 1: OAuth Authentication                           │
│  • Google OAuth 2.0                                     │
│  • Token validation by Google                           │
│  • Secure token exchange                                │
│                                                           │
│ Layer 2: Session Management                             │
│  • Unique session tokens                                │
│  • Server-side session storage                          │
│  • Token expiration support                             │
│                                                           │
│ Layer 3: Bearer Token Protection                        │
│  • Authorization header validation                      │
│  • Protected route verification                         │
│  • 401 Unauthorized on invalid token                    │
│                                                           │
│ Layer 4: CORS Protection                                │
│  • Whitelist allowed origins                            │
│  • Prevent unauthorized cross-origin access             │
│  • Configured for localhost development                 │
│                                                           │
│ Layer 5: Error Handling                                 │
│  • No sensitive data in error messages                  │
│  • Server-side error logging                            │
│  • Generic error responses to clients                   │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## Request/Response Examples

### Example 1: Login Flow
```
Request:
POST /api/auth/google/callback
Content-Type: application/json
{
  "code": "4/0AY0e-g7..."
}

Response:
200 OK
{
  "success": true,
  "sessionToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "118247..." ,
    "email": "user@gmail.com",
    "name": "User Name",
    "picture": "https://..."
  }
}
```

### Example 2: Protected Request
```
Request:
GET /api/user/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

Response:
200 OK
{
  "user": {
    "id": "118247...",
    "email": "user@gmail.com",
    "name": "User Name",
    "picture": "https://..."
  }
}
```

### Example 3: Course Generation
```
Request:
POST /api/courses/generate
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
{
  "title": "React Basics",
  "chapters": 7,
  "difficulty": "Beginner",
  "description": "Learn React from scratch"
}

Response:
200 OK
{
  "success": true,
  "course": {
    "id": "course_123",
    "title": "React Basics",
    "chapters": 7,
    "difficulty": "Beginner",
    "generatedAt": "2024-11-20T12:00:00Z"
  }
}
```

---

## Summary

This architecture provides:
- ✅ **Secure authentication** via OAuth 2.0
- ✅ **Protected endpoints** with Bearer tokens
- ✅ **Session management** on server
- ✅ **CORS security** for browsers
- ✅ **Error handling** throughout
- ✅ **Scalable design** ready for database integration

---

**Version**: 1.0  
**Last Updated**: November 20, 2024  
**Status**: ✅ Complete and Documented
