# CodeFlux - AI-Powered Learning Platform

<div align="center">

**Premium AI Learning Platform with Google OAuth Authentication**

[![Node.js](https://img.shields.io/badge/Node.js-v24.11.1-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.18.2-lightgray)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-purple)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.2-blue)](https://tailwindcss.com/)

[Quick Start](#-quick-start) • [Documentation](#-documentation) • [Architecture](#-architecture) • [Features](#-features)

</div>

---

## 🎯 What is CodeFlux?

CodeFlux is a **premium AI-powered learning platform** that leverages Google's Gemini AI to generate personalized courses on any topic. Built with modern web technologies, it provides a seamless learning experience with dark/light theme support, intelligent course generation, and secure authentication.

### Key Features

- 🤖 **AI-Powered Courses** - Generate custom courses using Gemini AI
- 🔐 **Google OAuth** - Secure authentication with one-click login
- 🎨 **Dark/Light Theme** - Beautiful dark and light modes with theme persistence
- 👥 **Community** - Connect with other learners
- 📊 **Dashboard** - Track your learning progress
- 🔒 **Protected Routes** - Secure access to course generation
- 🚀 **Modern Stack** - React, Vite, Express, Tailwind CSS

---

## 🏗️ Project Structure

```
Code-flux-/
├── src/                          # React Frontend Application
│   ├── components/               # Reusable React components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── CreateCourseModal.jsx
│   │   ├── Login.jsx
│   │   ├── QuizModal.jsx
│   │   └── StudyBuddy.jsx
│   ├── pages/                    # Page components
│   │   ├── Landing.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CourseOverview.jsx
│   │   ├── ChapterDetail.jsx
│   │   ├── Community.jsx
│   │   ├── Profile.jsx
│   │   └── Settings.jsx
│   ├── contexts/                 # React Context API
│   │   └── AuthContext.jsx       # Authentication state management
│   ├── lib/                      # Utility libraries
│   │   ├── firebase.js           # Firebase client setup
│   │   ├── api.js                # Backend API service (NEW)
│   │   └── gemini.js             # Gemini AI integration
│   ├── main.jsx                  # React entry point
│   ├── App.jsx                   # Main App component
│   └── index.css                 # Global styles
│
├── server/                       # Express Backend Server (NEW)
│   ├── index.js                  # Main server with OAuth endpoints
│   ├── package.json              # Backend dependencies
│   ├── .env                      # Environment variables
│   └── README.md                 # Backend documentation
│
├── public/                       # Static assets
├── .env.local                    # Frontend environment (NEW)
├── .gitignore                    # Git ignore rules
├── vite.config.js                # Vite configuration
├── tailwind.config.cjs           # Tailwind CSS configuration
├── postcss.config.cjs            # PostCSS configuration
├── package.json                  # Frontend dependencies
│
├── QUICK_START.md                # 3-minute quick start (NEW)
├── SETUP_GUIDE.md                # Complete setup guide (NEW)
├── IMPLEMENTATION_SUMMARY.md     # Implementation details (NEW)
├── ARCHITECTURE_DIAGRAMS.md      # Architecture documentation (NEW)
├── INTEGRATION_CHECKLIST.md      # Progress tracking (NEW)
└── README.md                     # This file
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** v14 or higher
- **npm** latest version
- **Google OAuth Credentials** (optional for demo)

### 1️⃣ Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5174`

### 2️⃣ Backend Setup

```bash
cd server

# Install dependencies
npm install

# Start development server
npm run dev
```

Backend runs at: `http://localhost:5000`

### 3️⃣ Open in Browser

Visit: `http://localhost:5174`

---

## 🚀 Features

### 🎓 Learning Platform
- Create custom AI courses on any topic
- Browse course chapters with rich content
- Quiz and assessment modules
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

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- Google Gemini AI for course generation
- Google OAuth for authentication
- React community for amazing tools
- Express.js for robust backend framework
- Tailwind CSS for beautiful styling

---

## 📞 Support

### Documentation
- **Quick Setup**: [QUICK_START.md](./QUICK_START.md)
- **Complete Setup**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Architecture**: [ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md)
- **API Reference**: [server/README.md](./server/README.md)

### Getting Help
1. Check the documentation files above
2. Review browser console for errors (F12)
3. Check backend terminal for server errors
4. Check network requests in DevTools

---

## 🚀 Deployment

### Frontend Options
- Vercel
- Netlify
- AWS Amplify
- GitHub Pages

### Backend Options
- Heroku
- Railway
- Render
- AWS Lambda/EC2

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for deployment instructions.

---

<div align="center">

### ⭐ If you find this project helpful, please give it a star!

[Created with ❤️ by the CodeFlux Team](https://github.com/pushkarrd)

**Version**: 1.0  
**Last Updated**: November 20, 2024

</div>