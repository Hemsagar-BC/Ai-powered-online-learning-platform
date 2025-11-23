# 🚀 CodeFlux

> **AI-Powered Learning Platform with Real-time Gamification**

An intelligent educational platform that generates personalized AI courses, tracks learning progress in real-time, and motivates users through gamification. Built with modern technologies for a seamless, responsive learning experience.

<div align="center">

[![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-646cff?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.2-38b2ac?logo=tailwindcss)](https://tailwindcss.com)
[![Express](https://img.shields.io/badge/Express-4.18.2-000000?logo=express)](https://expressjs.com)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?logo=nodedotjs)](https://nodejs.org)

[**Live Demo**](#) • [**Documentation**](#-documentation) • [**Get Started**](#-quick-start) • [**Features**](#-key-features)

</div>

---

## 🎯 The Problem

### Why Traditional Learning Platforms Fail

**Today, online learning is everywhere — but it's not personalized.**

Most platforms give the same static courses to everyone, regardless of:
- 🧠 **Background & Experience** - Beginners struggle with advanced content; experts get bored
- ⏱️ **Learning Pace** - Fixed curriculums don't adapt to individual speeds
- 🎓 **Learning Style** - Different topics suit different formats (video, text, interactive, etc.)
- 😴 **Engagement** - Lack of motivation and reward systems lead to dropout

### The Reality
Students lose interest, skip chapters, or drop off completely. **60% of online learners abandon courses** within the first month because:
- Content isn't tailored to their needs
- No sense of progress or achievement
- No community or competitive motivation
- Overwhelming amount of generic material

### The Solution: CodeFlux

CodeFlux solves these problems by:
- ✅ **Generating personalized courses instantly** - AI creates content tailored to any topic
- ✅ **Adapting to learning pace** - Progress at your speed with flexible chapters
- ✅ **Gamifying the experience** - Earn XP, unlock achievements, compete on leaderboards
- ✅ **Tracking real-time progress** - See your growth with beautiful analytics
- ✅ **Keeping learners engaged** - 8-level progression system with real rewards
- ✅ **Making learning fun** - Turn studying into an exciting journey, not a chore

---

## ✨ Key Features

### 🤖 AI-Powered Learning
- **Intelligent Course Generation** - Gemini AI creates structured courses on any topic
- **Rich Multimedia Content** - YouTube videos, detailed lessons, and interactive quizzes
- **Smart Content Organization** - Auto-generated chapters with logical progression
- **Real-time Quiz Generation** - Adaptive quizzes based on lesson content

### 🎮 Gamification System
- **8 Progressive Levels** - Novice → Virtuoso with clear XP milestones
- **Dynamic XP Rewards** - 50-500 XP for various learning actions
- **6 Unlockable Achievements** - From First Step to Content Creator
- **Streak Tracking** - Daily streaks with exponential XP bonuses (7→50, 14→100, 30→250, 100→500)
- **Live Leaderboard** - Compete with other learners in real-time

### 📱 Fully Responsive Design
- **Mobile-First Approach** - Optimized for 375px+ screens
- **Adaptive Layouts** - Perfect on phones, tablets, and desktops
- **Touch-Optimized UI** - Large tap targets and smooth interactions
- **Zero Horizontal Scrolling** - Seamless experience across all breakpoints

### 📊 Real-time Progress Tracking
- **Live Dashboard** - See your progress update instantly
- **Chapter Analytics** - Track completion for each chapter
- **Study Time Tracking** - Monitor study sessions with bonus rewards
- **Visual Progress Bars** - Beautiful progress visualization

### 🔐 Secure & Modern
- **Google OAuth 2.0** - One-click secure authentication
- **Firebase Integration** - Real-time database and sync
- **Environment Security** - API keys in `.env.local` (not in Git)
- **Protected Routes** - Secure access to sensitive features

### 🌙 Dark/Light Theme
- **System Theme Detection** - Respects OS preferences
- **Manual Toggle** - Easy switch in Settings
- **Persistent Storage** - Theme preference saved locally
- **Smooth Transitions** - Beautiful theme switching

---

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React 18.2.0, Vite 5.4.21, React Router v6, Tailwind CSS 3.4.2 |
| **Backend** | Express.js, Node.js v16+ |
| **Storage** | Firebase (Auth + Database), localStorage |
| **APIs** | Google Gemini 2.0 Flash, YouTube Data API v3 |
| **Styling** | Tailwind CSS, PostCSS |
| **Icons** | Lucide React |
| **Build** | Vite with HMR (Hot Module Reload) |

---

## 📋 Prerequisites

- **Node.js** v16 or higher ([download](https://nodejs.org))
- **npm** v8 or higher
- **Google Account** (for Firebase setup)
- **Text Editor** - VS Code recommended

---

## 🚀 Quick Start

### Step 1: Clone Repository
```bash
git clone https://github.com/pushkarrd/Code-flux-.git
cd Code-flux-
```

### Step 2: Setup Environment
Create `.env.local` in the root directory:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=your_database_url

# API Keys
VITE_YOUTUBE_API_KEY=your_youtube_key
VITE_GEMINI_API_KEY=your_gemini_key
```

### Step 3: Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
```

### Step 4: Run Development Servers

**Terminal 1 - Frontend (http://localhost:5175):**
```bash
npm run dev
```

**Terminal 2 - Backend (http://localhost:5000):**
```bash
cd server
npm start
```

Open http://localhost:5175 in your browser! 🎉

---

## 📚 Core Features Explained

### 🎓 Learning Path
1. **Dashboard** - View all your courses and quick stats
2. **My Learning** - Browse enrolled courses
3. **Create Course** - Generate AI course with one click
4. **Learn** - Complete chapters with lessons and quizzes
5. **Earn XP** - Gain experience and unlock achievements
6. **Level Up** - Progress through 8 levels to Virtuoso

### 🏆 XP & Achievement System

| Achievement | Unlock Requirement | Reward |
|-------------|-------------------|--------|
| 👣 First Step | Complete first lesson | 50 XP |
| 🔥 Streak Master | 7-day learning streak | 100 XP bonus |
| 🏆 Quiz Champion | Score 100% on any quiz | 150 XP |
| 👑 Course Conqueror | Complete entire course | 500 XP |
| 📚 Dedicated Learner | Study 10 hours/week | 300 XP |
| ✨ Content Creator | Create 5 courses | 500 XP |

### Level Progression
```
Novice (0 XP) → Learner (100) → Scholar (300) → Master (600) → 
Expert (1200) → Sage (2000) → Legend (3000) → Virtuoso (4500+)
```

---

## 📂 Project Structure

```
Code-flux-/
├── src/
│   ├── components/                 # Reusable React components
│   │   ├── gamification/          # XP display components
│   │   ├── Navbar.jsx             # Navigation bar
│   │   ├── Sidebar.jsx            # Side navigation
│   │   └── CreateCourseModal.jsx  # Course creation modal
│   ├── contexts/                   # React Context state
│   │   ├── AuthContext.jsx        # Authentication
│   │   ├── ThemeContext.jsx       # Dark/Light theme
│   │   ├── StreakContext.jsx      # Streak tracking
│   │   └── GamificationContext.jsx # XP & achievements
│   ├── lib/
│   │   ├── firebase.js            # Firebase setup
│   │   ├── xpCalculator.js        # Core XP logic (✨ NEW)
│   │   ├── youtubeService.js      # YouTube API integration
│   │   ├── quizService.js         # Quiz generation
│   │   └── progressService.js     # Progress tracking
│   ├── pages/
│   │   ├── Landing.jsx            # Landing page
│   │   ├── Dashboard.jsx          # Main dashboard (with XP)
│   │   ├── MyLearning.jsx         # Courses list
│   │   ├── ChapterDetail.jsx      # Course content viewer
│   │   ├── Profile.jsx            # User profile with gamification
│   │   ├── Gamification.jsx       # Stats & leaderboard (✨ NEW)
│   │   ├── Quiz.jsx               # Interactive quizzes
│   │   └── Settings.jsx           # User preferences
│   └── main.jsx                   # React entry point
├── server/
│   ├── index.js                   # Express server
│   ├── routes/                    # API routes
│   └── package.json               # Backend dependencies
├── public/                        # Static assets
├── vite.config.js                 # Vite configuration
├── tailwind.config.cjs            # Tailwind setup
├── .env.local                     # Environment variables (in .gitignore)
├── .gitignore                     # Git ignore rules
├── package.json                   # Frontend dependencies
└── README.md                      # This file
```

---

## 📖 Page Overview

| Page | Route | Purpose |
|------|-------|---------|
| 🏠 Landing | `/` | Welcome & onboarding |
| 📊 Dashboard | `/dashboard` | Main hub with XP stats |
| 📚 My Learning | `/my-learning` | Enrolled courses |
| 📖 Chapter Detail | `/courses/:id` | Course content |
| 👤 Profile | `/profile` | User stats & achievements |
| 🎮 Gamification | `/gamification` | XP, levels, leaderboard |
| ❓ Quiz | `/quiz/:id` | Interactive assessment |
| ⚙️ Settings | `/settings` | Theme & preferences |

---

## 🎨 Responsive Breakpoints

```
Mobile:    < 640px  (xs, sm)       [Focus: Touch, single column]
Tablet:    640px - 1024px (md, lg) [Focus: Two column layouts]
Desktop:   > 1024px (xl, 2xl)      [Focus: Multi-column grids]
```

All components tested at:
- **iPhone 12** (390px)
- **iPad Pro** (1024px)
- **Desktop** (1440px+)

---

## 🔌 API Integration

### Backend Endpoints
```
GET  /api/health                    Health check
GET  /api/courses                   List courses
POST /api/courses                   Create course
GET  /api/courses/:id               Get course details
POST /api/progress                  Update progress
GET  /api/user/stats                User statistics
```

### Third-Party APIs
- **Gemini AI** - Course content generation
- **YouTube Data API** - Educational video search
- **Firebase** - Authentication & real-time database

---

## 🔐 Security

✅ **API Keys** - Stored in `.env.local` (not in Git)  
✅ **Authentication** - Firebase + Google OAuth 2.0  
✅ **Git Protection** - `.env.local`, `node_modules`, docs/ excluded  
✅ **Input Validation** - All forms validated  
✅ **HTTPS Ready** - For production deployment  

---

## 📊 Performance

- ⚡ **Vite** - Lightning-fast HMR (< 1s reload)
- 🎯 **Code Splitting** - Lazy-loaded routes
- 🖼️ **Image Optimization** - Efficient asset loading
- 💾 **Smart Caching** - localStorage strategy
- 🔄 **Real-time Sync** - Firebase optimization

---

## 🚢 Deployment

### Frontend → Vercel
```bash
# Push to GitHub and connect to Vercel
# Automatic deployment on every push
```

### Backend → Render.com
```bash
# Add GitHub repository
# Set environment variables
# Auto-deploy on push
```

[Full Deployment Guide](./docs/DEPLOYMENT.md)

---

## 🧪 Testing

### Manual Checklist
- [ ] Responsive on iPhone (375px+)
- [ ] Responsive on Tablet (768px)
- [ ] Responsive on Desktop (1440px)
- [ ] XP calculations accurate
- [ ] Achievements unlock correctly
- [ ] Dark/Light theme toggles
- [ ] All routes accessible
- [ ] API integrations working

---

## 🐛 Troubleshooting

### Port Already in Use?
```powershell
# Windows PowerShell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Then restart servers
npm run dev  # Frontend
npm start    # Backend
```

### Firebase Connection Failed?
- Verify `.env.local` has correct keys
- Check internet connection
- Ensure Firebase project is active

### Module Not Found?
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

MIT License - Free to use and modify. See [LICENSE](./LICENSE) file.

---

## 🙏 Credits

- **Google Gemini AI** - Intelligent course generation
- **Google OAuth** - Secure authentication
- **Firebase** - Real-time backend
- **React Community** - Amazing ecosystem
- **Tailwind Labs** - Beautiful CSS framework

---

## 📞 Support & Documentation

- 📚 [Setup Guide](./docs/SETUP_GUIDE.md)
- 🎓 [Gamification System](./docs/GAMIFICATION_INTEGRATION_COMPLETE.md)
- 📱 [Mobile Testing](./docs/MOBILE_TESTING_CHECKLIST.md)
- 🚀 [Deployment](./docs/DEPLOYMENT.md)
- 🐛 [Troubleshooting](./docs/SETUP_GUIDE.md#troubleshooting)

---

<div align="center">

### 🌟 Built with ❤️ for Learners Everywhere

⭐ **Star this repo if you find it helpful!**

[GitHub](https://github.com/pushkarrd/Code-flux-) • [Issues](https://github.com/pushkarrd/Code-flux-/issues) • [Discussions](https://github.com/pushkarrd/Code-flux-/discussions)

---

**Version** 2.0.0 | **Status** ✅ Production Ready | **Last Updated** November 23, 2025

</div>
- Track learning progress
- Save favorite courses

### 🔐 Authentication
- ✅ Google OAuth 2.0 integration
- ✅ One-click sign-in
- ✅ Guest mode (view courses without signing in)
- ✅ Session management
- ✅ Protected course generation

### 🎨 User Experience
- ✅ Dark and light theme modes
- ✅ Theme persistence across sessions
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Intuitive navigation

### 👥 Community
- ✅ Community discussion forum
- ✅ Share courses with others
- ✅ Rate and review courses
- ✅ Connect with learners

### 📊 Dashboard
- ✅ View your generated courses
- ✅ Track learning progress
- ✅ Manage your profile
- ✅ Customize settings

---

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - UI library
- **Vite 5.4.21** - Build tool
- **Tailwind CSS 3.4.2** - Styling
- **React Router 6.14.2** - Routing
- **Firebase 10.10.0** - Auth & database (optional)

### Backend
- **Node.js** - JavaScript runtime
- **Express 4.18.2** - Web framework
- **Google Auth Library 9.2.0** - OAuth handling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development
- **Vite Dev Server** - Hot module replacement
- **Nodemon** - Auto-restart on changes
- **Tailwind CSS** - Utility-first CSS

---

## 📚 Documentation

### Getting Started
- **[QUICK_START.md](./QUICK_START.md)** - 3-minute quick reference
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions
- **[README_APP.md](./README_APP.md)** - App features documentation

### Technical Documentation
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What's been implemented
- **[ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md)** - System architecture
- **[INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md)** - Progress tracking
- **[server/README.md](./server/README.md)** - Backend API documentation

---

## 🔐 Authentication

### Flow
1. User clicks "Sign in with Google"
2. Frontend redirects to Google OAuth
3. User authenticates with Google
4. Backend exchanges code for tokens
5. Session token stored in frontend
6. User can now generate courses

### Protected Endpoints
- `GET /api/user/profile` - Get user profile
- `POST /api/courses/generate` - Generate a course

### Guest Mode
Users can browse the form without signing in but cannot generate courses.

---

## 🚀 Running the Application

### Start Backend (Terminal 1)
```bash
cd server
npm run dev
```

### Start Frontend (Terminal 2)
```bash
npm run dev
```

### Verify Everything Works
- Backend: `http://localhost:5000/api/health`
- Frontend: `http://localhost:5174`

---

## 🎨 Theme Support

The platform supports dark and light themes with automatic persistence:

```javascript
// Light mode (default)
// Dark mode (toggle in Settings)

// Saved in localStorage as 'codeflux-theme'
```

### Theme Features
- 🎨 Automatically synced across pages
- 💾 Persists on page reload
- ⚡ No flashing on load
- 🌙 Easy toggle button

---

## 📋 Environment Configuration

### Frontend (`.env.local`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project
```

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5174
```

---

## 🧪 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/auth/google` - Get Google auth URL
- `POST /api/auth/google/callback` - OAuth callback
- `POST /api/auth/verify` - Verify session
- `POST /api/auth/logout` - Logout

### Protected Endpoints (Require Bearer Token)
- `GET /api/user/profile` - Get user profile
- `POST /api/courses/generate` - Generate course

See [server/README.md](./server/README.md) for complete API documentation.

---

## 🔧 Development

### Available Scripts

#### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### Backend
```bash
cd server
npm run dev      # Start with auto-reload (nodemon)
npm run start    # Start production server
```

---

## 📦 Dependencies

### Frontend (Main)
- react: ^18.2.0
- react-router-dom: ^6.14.2
- firebase: ^10.10.0
- tailwindcss: ^3.4.2
- axios: ^1.4.0 (optional)

### Backend (Main)
- express: ^4.18.2
- cors: ^2.8.5
- dotenv: ^16.0.3
- google-auth-library: ^9.2.0
- axios: ^1.4.0

---

## 🎯 Next Steps

### Immediate
1. Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)
2. Fill in `server/.env` with credentials
3. Test full OAuth flow

### Short Term
- [ ] Set up database (MongoDB, Firestore)
- [ ] Implement real Gemini API integration
- [ ] Add email verification

### Long Term
- [ ] Deploy to production
- [ ] Add mobile app
- [ ] Implement payments
- [ ] Add more OAuth providers

---

## 🐛 Troubleshooting

### Backend won't start?
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F

# Start again
cd server && npm run dev
```

### CORS Error?
- Check backend is running on port 5000
- Verify `.env.local` has correct `VITE_API_URL`
- Hard refresh browser: `Ctrl+Shift+R`

### Session not working?
```javascript
// Clear localStorage in browser console (F12)
localStorage.clear()
// Then login again
```

For more troubleshooting, see [SETUP_GUIDE.md](./SETUP_GUIDE.md).

---

## 👥 Team

**Developers:**
- **Pushkar R Deshpande** - Full-stack development
- **Hamsagar BC** - UI/UX design
- **N Shreeraksha** - Backend architecture

---

<div align="center">

### 🌟 Built with ❤️ for Learners Everywhere

⭐ **Star this repo if you find it helpful!**

[GitHub](https://github.com/pushkarrd/Code-flux-) • [Issues](https://github.com/pushkarrd/Code-flux-/issues) • [Discussions](https://github.com/pushkarrd/Code-flux-/discussions)

---

**Version** 2.0.0 | **Status** ✅ Production Ready | **Last Updated** November 23, 2025

</div>

</div>