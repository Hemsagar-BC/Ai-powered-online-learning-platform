# Google Sign-In Setup Guide

## Problem: "Login failed" when clicking Sign In

This happens when Google Sign-In isn't properly configured. **You have 2 options:**

---

## Option 1: Use Demo Mode (Quickest - No Setup)
**Click "Try Demo" button** to explore the app without signing in. This works immediately!

---

## Option 2: Setup Real Google Sign-In (5 minutes)

### Step 1: Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click on your project: **ai-learning-platform-4770d**

### Step 2: Enable Google Sign-In
1. Left sidebar → **Authentication**
2. Click **Get Started** (if not already done)
3. In **Sign-in method** tab, find **Google**
4. Click Google → Toggle **Enabled** ON
5. Select **Project support email** from dropdown
6. Click **Save**

### Step 3: Add Authorized Origins (IMPORTANT)
1. Still in Authentication → **Settings** tab
2. Scroll to **Authorized domains**
3. Click **Add domain**
4. Add these:
   - `localhost`
   - `localhost:5173`
   - `localhost:5174`
5. Click **Add**

### Step 4: Configure OAuth Consent Screen
1. Google Cloud Console → **APIs & Services** → **OAuth consent screen**
2. Select **External** → Click **Create**
3. Fill form:
   - **App name**: CodeFlux
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Click **Save and Continue** → Skip scopes → Skip test users
5. Click **Back to Dashboard**

### Step 5: Create OAuth Credentials
1. **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth 2.0 Client IDs**
3. Select **Web application**
4. Under **Authorized JavaScript origins**, add:
   - `http://localhost`
   - `http://localhost:5173`
   - `http://localhost:5174`
5. Under **Authorized redirect URIs**, add:
   - `http://localhost:5173/`
   - `http://localhost:5174/`
6. Click **Create**
7. Copy the **Client ID** (you'll need it)

### Step 6: Update Your App
The Client ID is already in `.env`:
```
VITE_FIREBASE_API_KEY=AIzaSyDijo4LWfILX2FdmhAOe0dSvePMBbnMus8
VITE_FIREBASE_AUTH_DOMAIN=ai-learning-platform-4770d.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ai-learning-platform-4770d
```

✅ Your app is already configured!

### Step 7: Test It
1. **Refresh your browser** (Ctrl+R)
2. Click **Sign in with Google**
3. Should work now! ✅

---

## Troubleshooting

### Still getting "Login failed"?

**Check 1: Browser Console**
- Press F12 → Console tab
- Look for error messages
- Screenshot error → [Report Issue](https://github.com/pushkarrd/Code-flux-/issues)

**Check 2: Is backend running?**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

**Check 3: Clear browser cache**
- Press Ctrl+Shift+Delete
- Clear cookies and cache
- Refresh page

**Check 4: Verify Firebase Config**
- File: `.env`
- All values should be filled in
- No `undefined` values

### Pop-up Blocked?
- Click shield icon in address bar
- Allow pop-ups for this site
- Try signing in again

### Network Error?
- Check backend is running on `http://localhost:5000`
- Check internet connection
- Try hard refresh (Ctrl+Shift+R)

---

## For Production

When deploying:
1. Add your domain to **Authorized domains** in Firebase
2. Update redirect URIs in Google Cloud Console
3. Use production OAuth credentials

---

## Quick Workaround

While setting up, **use "Try Demo" button** to explore all features!

All app functionality works in demo mode:
- ✅ Create courses
- ✅ AI study buddy
- ✅ Course browser
- ✅ Settings

Only difference: Sign-in is not required.

---

**Need Help?**
- Check browser console (F12) for errors
- Verify `.env` file has all variables
- Restart frontend: `npm run dev`
