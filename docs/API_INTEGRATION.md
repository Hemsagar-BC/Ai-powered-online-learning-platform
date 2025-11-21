# 🔗 API Integration Guide

Complete setup guide for all external APIs used in CodeFlux.

## Table of Contents
1. [Firebase Setup](#firebase-setup)
2. [Gemini API Setup](#gemini-api-setup)
3. [Google OAuth Setup](#google-oauth-setup)
4. [YouTube API Setup](#youtube-api-setup)

---

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "CodeFlux")
4. Accept terms and create

### Step 2: Enable Realtime Database

1. In Firebase console, go to "Build" → "Realtime Database"
2. Click "Create Database"
3. Choose region (closest to your users)
4. Start in "test mode" (later configure security rules)

### Step 3: Enable Authentication

1. Go to "Build" → "Authentication"
2. Click "Get started"
3. Enable "Google" sign-in method
4. Add project support email

### Step 4: Get Credentials

1. Go to "Project Settings" (gear icon)
2. Click "Service Accounts"
3. Copy credentials
4. Also copy "Web SDK" configuration

### Step 5: Add to Environment

**`.env.local` (Frontend):**
```env
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=codeflux-abc.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=codeflux-abc
VITE_FIREBASE_STORAGE_BUCKET=codeflux-abc.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...
VITE_FIREBASE_DATABASE_URL=https://codeflux-abc.firebaseio.com
```

**`server/.env` (Backend):**
```env
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
FIREBASE_PROJECT_ID=codeflux-abc
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@codeflux-abc.iam.gserviceaccount.com
```

### Firebase Security Rules

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "courses": {
      ".read": "auth != null",
      ".write": false
    }
  }
}
```

---

## Gemini API Setup

### Step 1: Get API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create new API key

### Step 2: Configure in Environment

**`.env.local`:**
```env
VITE_GEMINI_API_KEY=AIzaSyD...
```

### Step 3: Usage in Code

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const result = await model.generateContent(prompt);
const text = result.response.text();
```

### Step 4: Enable APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Google Generative AI API"

### Best Practices

- ✅ Keep API key in `.env.local` (never commit!)
- ✅ Add rate limiting to prevent abuse
- ✅ Cache API responses when possible
- ✅ Monitor quota usage in Google Cloud Console

---

## Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Name it (e.g., "CodeFlux")

### Step 2: Enable Google+ API

1. Search for "Google+ API"
2. Click "Enable"

### Step 3: Create OAuth Credentials

1. Go to "Credentials"
2. Click "Create Credentials" → "OAuth Client ID"
3. Choose "Web application"
4. Add authorized origins:
   ```
   http://localhost:5176
   http://localhost:5000
   https://your-domain.com
   ```
5. Add authorized redirect URIs:
   ```
   http://localhost:5176/
   http://localhost:5000/auth/callback
   https://your-domain.com/
   ```

### Step 4: Add to Environment

**`server/.env`:**
```env
GOOGLE_OAUTH_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=GOCSPX-xxx
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:5000/auth/callback
```

### Step 5: Configure Firebase

In Firebase Console:
1. Go to "Authentication" → "Sign-in method"
2. Enable "Google"
3. Add OAuth credentials from Google Cloud Console

---

## YouTube API Setup (Optional)

### Step 1: Enable YouTube Data API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Search for "YouTube Data API v3"
3. Click "Enable"

### Step 2: Create API Key

1. Go to "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the key

### Step 3: Add to Environment

**`.env.local`:**
```env
VITE_YOUTUBE_API_KEY=AIzaSyD...
```

### Step 4: Configure Quota

1. Go to "Quotas"
2. Set daily quota (default: 10,000 requests/day)

### Usage

```javascript
const response = await fetch(
  `https://www.googleapis.com/youtube/v3/search?key=${VITE_YOUTUBE_API_KEY}&q=javascript`
);
```

---

## API Rate Limits

| API | Rate Limit |
|-----|-----------|
| Gemini | 60 req/min (free tier) |
| Firebase | 100 concurrent connections (free tier) |
| Google OAuth | No hard limit |
| YouTube | 10,000 units/day (free tier) |

---

## Environment Variables Checklist

- [ ] Firebase API Key
- [ ] Firebase Auth Domain
- [ ] Firebase Project ID
- [ ] Firebase Database URL
- [ ] Gemini API Key
- [ ] Google OAuth Client ID
- [ ] Google OAuth Client Secret
- [ ] Backend API URL

---

## Troubleshooting

### Gemini API errors
- Check API key in `.env.local`
- Verify API is enabled in Google Cloud
- Check quota usage

### Firebase connection fails
- Verify database URL in `.env.local`
- Check Firebase security rules
- Ensure internet connection

### Google OAuth fails
- Check OAuth credentials
- Verify redirect URIs match
- Clear browser cache

### YouTube API errors
- Check API is enabled
- Verify API key
- Check quota limits

---

See [Troubleshooting Guide](./TROUBLESHOOTING.md) for more issues.
