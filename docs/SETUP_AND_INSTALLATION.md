# 🚀 Setup & Installation Guide

Complete guide to install and run CodeFlux locally.

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/pushkarrd/Code-flux-.git
cd Code-flux-
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 4. Environment Variables

Create `.env.local` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_DATABASE_URL=your_firebase_database_url

# Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key

# Backend URL
VITE_API_URL=http://localhost:5000
```

Create `.env` file in the `server/` directory:

```env
GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_oauth_client_secret
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

## Getting API Keys

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Realtime Database** and **Authentication**
4. Copy your configuration credentials to `.env.local`

See [API Integration Guide](./API_INTEGRATION.md#firebase) for detailed steps.

### Gemini API
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add to `.env.local` as `VITE_GEMINI_API_KEY`

See [API Integration Guide](./API_INTEGRATION.md#gemini) for detailed steps.

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add to `server/.env`

See [API Integration Guide](./API_INTEGRATION.md#google-oauth) for detailed steps.

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on `http://localhost:5176`

### Production Build

```bash
npm run build
```
Creates optimized build in `dist/` folder.

## Verify Installation

1. Open `http://localhost:5176` in your browser
2. You should see the CodeFlux landing page
3. Try signing in with Google
4. Navigate to Dashboard and create a test course

## Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Change port in config or kill process |
| Firebase not connecting | Check `.env.local` credentials |
| Google OAuth fails | Verify OAuth credentials in `server/.env` |
| Gemini API errors | Check API key and quota |

For more issues, see [Troubleshooting Guide](./TROUBLESHOOTING.md).

## Next Steps

- Read [Quick Start](./QUICK_START.md) for basic usage
- Check [Architecture](./ARCHITECTURE.md) to understand the system
- Review [API Integration](./API_INTEGRATION.md) for detailed setup

---

**Need Help?** See [Troubleshooting](./TROUBLESHOOTING.md) or check existing [GitHub Issues](https://github.com/pushkarrd/Code-flux-/issues)
