# CodeFlux Setup Guide

Complete guide to set up and run the CodeFlux platform with backend authentication.

## Project Structure

```
Code-flux-/
├── src/                          # Frontend React application
│   ├── components/               # React components
│   ├── pages/                    # Page components
│   ├── contexts/                 # React contexts (AuthContext)
│   ├── lib/
│   │   ├── firebase.js          # Firebase client setup
│   │   ├── api.js               # Backend API service (NEW)
│   │   └── gemini.js            # Gemini AI integration
│   └── main.jsx                 # React entry point
├── server/                       # Backend Express server (NEW)
│   ├── index.js                 # Main server file with OAuth
│   ├── package.json             # Backend dependencies
│   ├── .env                     # Backend environment variables
│   └── README.md                # Backend documentation
├── .env.local                   # Frontend environment variables
├── package.json                 # Frontend dependencies
├── vite.config.js              # Vite configuration
└── SETUP_GUIDE.md              # This file
```

## Prerequisites

- **Node.js**: v14 or higher
- **npm**: Latest version
- **Google OAuth Credentials**: From Google Cloud Console
- **Text Editor**: VS Code or similar

## Step 1: Frontend Setup

### Install Frontend Dependencies

```bash
# Navigate to project root
cd Code-flux-

# Install frontend dependencies
npm install
```

### Configure Frontend Environment

Create or update `.env.local` in the project root:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Firebase configuration (optional for demo)
VITE_FIREBASE_API_KEY=AIzaSyDemoKeyForLocalDevelopment
VITE_FIREBASE_AUTH_DOMAIN=codeflux-demo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=codeflux-demo
```

## Step 2: Backend Setup

### Install Backend Dependencies

```bash
cd server
npm install
```

### Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable **Google+ API**
4. Create **OAuth 2.0 credentials** (Web application type)
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `http://localhost:5174`
6. Copy your **Client ID** and **Client Secret**

### Configure Backend Environment

Create `server/.env` with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Google OAuth Credentials (Replace with your actual credentials)
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here

# OAuth Callback URL
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:5174

# JWT Secret (for future implementation)
JWT_SECRET=your-super-secret-key-here

# Optional: Database configuration
# DATABASE_URL=your_database_url
```

## Step 3: Running the Application

### Start Backend Server

```bash
# From project root
cd server

# Development mode (with nodemon auto-reload)
npm run dev

# Or production mode
npm start
```

Backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
# Open a new terminal
# From project root

# Development mode
npm run dev
```

Frontend will run on `http://localhost:5174` (or similar)

### Verify Both Servers are Running

- **Frontend**: http://localhost:5174
- **Backend API Health**: http://localhost:5000/api/health

## Step 4: Test the OAuth Flow

### Manual Testing

1. Open frontend: http://localhost:5174
2. Click **"Start Learning Free"** or navigate to Dashboard
3. Click **"Create New Course"**
4. Click **"Sign in with Google"**
5. Authorize the application
6. You should be redirected back with a session token
7. Session token is stored in localStorage as `sessionToken`

### Backend Health Check

```bash
# Test backend is running
curl http://localhost:5000/api/health

# Expected response:
# {"status":"OK","message":"CodeFlux API is running"}
```

### Test Endpoints

```bash
# Get Google Auth URL
curl http://localhost:5000/api/auth/google

# Get user profile (requires Bearer token)
curl -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  http://localhost:5000/api/user/profile

# Generate course (requires Bearer token)
curl -X POST http://localhost:5000/api/courses/generate \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Basics",
    "chapters": 5,
    "difficulty": "Beginner"
  }'
```

## Frontend Components Updated

### `src/lib/api.js` (NEW)

Complete API service for backend communication:

```javascript
// Import and use these functions:
import {
  getGoogleAuthUrl,           // Get Google auth URL
  loginWithGoogleCode,        // Exchange code for session token
  verifySession,              // Check if session is valid
  getUserProfile,             // Get current user info
  generateCourse,             // Generate course (protected)
  logout,                     // Clear session
  isAuthenticated,            // Check if user is logged in
  checkBackendHealth          // Health check
} from '../lib/api'
```

### `src/contexts/AuthContext.jsx` (UPDATED)

Enhanced with backend session verification:

```javascript
// Now includes:
const { user, loading, isAuthenticated } = useAuth()
```

### `src/components/CreateCourseModal.jsx` (UPDATED)

Now calls backend API for course generation:

```javascript
// Uses backend generateCourse function
const response = await generateCourseBackend({
  title, description, chapters, difficulty, includeVideo
})
```

## Frontend API Service Usage

### Example: Login with Google

```javascript
import { loginWithGoogleCode } from '../lib/api'

// After getting auth code from Google
const result = await loginWithGoogleCode(authCode)
// Session token automatically stored in localStorage
```

### Example: Generate Course

```javascript
import { generateCourse, isAuthenticated } from '../lib/api'

if (isAuthenticated()) {
  const result = await generateCourse({
    title: 'React Basics',
    chapters: 7,
    difficulty: 'Beginner'
  })
  console.log('Course generated:', result.course)
}
```

### Example: Check Authentication Status

```javascript
import { isAuthenticated, getSessionToken } from '../lib/api'

if (isAuthenticated()) {
  const token = getSessionToken()
  // Make authenticated requests
}
```

## Backend API Reference

### Authentication Endpoints

#### 1. Get Google Auth URL
```
GET /api/auth/google
Response: { authUrl: "https://accounts.google.com/o/oauth2/v2/auth..." }
```

#### 2. Google OAuth Callback
```
POST /api/auth/google/callback
Body: { code: "authorization_code" }
Response: {
  success: true,
  sessionToken: "base64_session_token",
  user: { id, email, name, picture }
}
```

#### 3. Verify Session
```
POST /api/auth/verify
Body: { sessionToken: "token" }
Response: { success: true, user: {...} }
```

#### 4. Logout
```
POST /api/auth/logout
Body: { sessionToken: "token" }
Response: { success: true, message: "Logged out" }
```

### Protected Endpoints

#### Get User Profile (Protected)
```
GET /api/user/profile
Headers: Authorization: Bearer sessionToken
Response: { user: { id, email, name, picture } }
```

#### Generate Course (Protected)
```
POST /api/courses/generate
Headers: Authorization: Bearer sessionToken
Body: {
  title: "Course Title",
  chapters: 7,
  description: "Optional",
  difficulty: "Beginner"
}
Response: { success: true, course: {...} }
```

## Troubleshooting

### Issue: "Cannot find module 'express'"

**Solution**: Ensure backend dependencies are installed

```bash
cd server
npm install
```

### Issue: CORS Error

**Solution**: Verify backend is running and CORS is configured

```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check CORS headers include your frontend URL
# Update CORS in server/index.js if needed
```

### Issue: "Invalid Client ID"

**Solution**: Verify Google OAuth credentials

1. Check `GOOGLE_CLIENT_ID` in `server/.env`
2. Verify it matches Google Cloud Console
3. Ensure callback URL is registered in Google Console

### Issue: "Session token not found"

**Solution**: Clear localStorage and login again

```javascript
localStorage.clear()
// Then login through UI
```

### Issue: Backend Not Starting

**Solution**: Check port availability

```bash
# Kill process on port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Then restart backend
npm run dev
```

## Git Setup

### Add Backend to Git

```bash
# From project root
git add server/
git commit -m "Add Express backend with Google OAuth"

# Or if you have .gitignore issues:
git add -f server/.env  # Only if you want to commit (not recommended for production)
```

### Recommended .gitignore

```
# Backend
server/node_modules/
server/.env.production
server/dist/

# Frontend
node_modules/
dist/
.env.production

# System files
.DS_Store
Thumbs.db
```

## Next Steps

1. **Database Integration**
   - Replace in-memory session store with MongoDB or Firebase
   - Store courses in database
   - Persist user data

2. **JWT Implementation**
   - Replace Base64 sessions with proper JWT tokens
   - Add token refresh mechanism
   - Implement expiration handling

3. **Real Gemini API**
   - Replace mock course generation
   - Add actual AI-powered course content
   - Stream responses for better UX

4. **Error Handling**
   - Add comprehensive error handling on frontend
   - Implement toast notifications
   - Add retry logic for failed requests

5. **Deployment**
   - Deploy backend (Heroku, Railway, Render, etc.)
   - Deploy frontend (Vercel, Netlify, etc.)
   - Set up environment variables on hosting platform
   - Enable HTTPS for production

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Google OAuth Documentation](https://developers.google.com/identity)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs: `console.error()` outputs in terminal
3. Check browser console for frontend errors (F12)
4. Check network requests in DevTools (F12 → Network tab)

---

**Created**: November 2024
**Version**: 1.0
**Authors**: Pushkar R Deshpande, Hamsagar BC, N Shreeraksha
