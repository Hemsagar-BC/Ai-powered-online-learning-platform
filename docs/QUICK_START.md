# 🚀 Quick Start Guide - CodeFlux

Get CodeFlux running in 3 minutes!

## Prerequisites

- Node.js v14+ installed
- Google OAuth credentials (optional for demo)

## Quick Start

### Terminal 1: Start Backend

```bash
cd server
npm install     # First time only
npm run dev     # Start with auto-reload
```

✅ Backend running at: `http://localhost:5000`

### Terminal 2: Start Frontend

```bash
npm install     # First time only
npm run dev     # Start frontend dev server
```

✅ Frontend running at: `http://localhost:5174`

## 🎯 Next Steps

1. **Open Browser**: Go to http://localhost:5174
2. **Start Learning**: Click "Start Learning Free"
3. **Create Course**: Click "Create New Course"
4. **Sign In**: Use "Sign in with Google" (or "Continue as Guest")
5. **Generate**: Fill form and click "Generate Course"

## 📋 Environment Setup (First Time Only)

### Backend `.env` (server/.env)

```env
PORT=5000
NODE_ENV=development
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5174
```

### Frontend `.env.local` (.env.local)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🔑 Get Google OAuth Credentials (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials (Web application)
3. Add redirect URI: `http://localhost:5000/api/auth/google/callback`
4. Copy Client ID and Secret to `server/.env`

## ✨ Features

- ✅ Google OAuth Authentication
- ✅ AI Course Generation
- ✅ Dark/Light Theme
- ✅ Guest Mode
- ✅ Protected Routes
- ✅ Session Management

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000
# Kill the process if needed
taskkill /PID <PID> /F
```

### CORS Error
- Ensure backend is running on port 5000
- Check `.env.local` has correct `VITE_API_URL`

### Session issues
- Clear browser localStorage: Press F12 → Console
```javascript
localStorage.clear()
```

## 📂 Project Structure

```
Code-flux-/
├── src/              # React frontend
├── server/           # Express backend
├── SETUP_GUIDE.md    # Detailed setup
└── QUICK_START.md    # This file
```

## 🎓 Learn More

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for:
- Complete setup instructions
- API documentation
- Troubleshooting guide
- Deployment instructions

---

**Happy Learning! 🎉**
