# 🐛 Troubleshooting Guide

Common issues and their solutions.

## Table of Contents
1. [Installation Issues](#installation-issues)
2. [Authentication Issues](#authentication-issues)
3. [Course Generation Issues](#course-generation-issues)
4. [Quiz Issues](#quiz-issues)
5. [Firebase Issues](#firebase-issues)
6. [API Issues](#api-issues)
7. [Performance Issues](#performance-issues)

---

## Installation Issues

### Issue: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

Option 1 - Kill existing process:
```bash
# Windows
taskkill /F /IM node.exe

# Mac/Linux
killall node
```

Option 2 - Use different port:
```bash
# Change port in vite.config.js or server config
PORT=3000 npm run dev
```

### Issue: npm install fails

**Error:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

```bash
# Clear npm cache
npm cache clean --force

# Install with legacy dependency resolution
npm install --legacy-peer-deps

# Or use different Node version
nvm use 18
npm install
```

### Issue: Dependencies missing

**Error:**
```
Module not found: 'react-router-dom'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or install specific package
npm install react-router-dom
```

---

## Authentication Issues

### Issue: Google Sign-in not working

**Error:**
```
popup_failed_to_open or similar
```

**Solutions:**

1. **Check OAuth Configuration:**
   - Verify `GOOGLE_OAUTH_CLIENT_ID` in `.env.local`
   - Check redirect URIs in Google Cloud Console
   - Add `http://localhost:5176` to authorized origins

2. **Clear Browser Cache:**
   ```
   Ctrl+Shift+Delete → Clear browsing data
   ```

3. **Check Console for Details:**
   - Open DevTools (F12)
   - Check Console tab for error messages
   - Look for CORS errors

### Issue: "This app isn't verified" error

**Solution:**
- This is normal in development
- Click "Continue" or proceed anyway
- In production, verify your app with Google

### Issue: Firebase Auth not initialized

**Error:**
```
Firebase has not been initialized. Please call `initializeApp`
```

**Solution:**

Check `src/lib/firebase.js`:
```javascript
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // ... other config
};

export const app = initializeApp(firebaseConfig);
```

Verify `.env.local` has all Firebase keys.

---

## Course Generation Issues

### Issue: Gemini API error

**Error:**
```
INVALID_ARGUMENT: Request contains an invalid argument
```

**Solutions:**

1. **Check API Key:**
   ```bash
   # Verify in .env.local
   VITE_GEMINI_API_KEY=AIzaSyD...
   ```

2. **Check API is Enabled:**
   - Go to Google Cloud Console
   - Search "Google Generative AI API"
   - Verify it's enabled

3. **Check Quota:**
   - API might be rate limited
   - Free tier: 60 requests/minute
   - Wait a few minutes or upgrade

4. **Test Manually:**
   ```javascript
   // In browser console
   const { GoogleGenerativeAI } = window;
   const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
   const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
   await model.generateContent('Hello');
   ```

### Issue: Course generation takes too long

**Cause:** Gemini API latency or network issues

**Solutions:**

1. **Wait longer:** API can take 5-10 seconds
2. **Check network:** Open DevTools → Network tab
3. **Retry:** Sometimes transient errors occur
4. **Upgrade plan:** Free tier has rate limits

### Issue: Generated content is incomplete

**Solutions:**

1. **Refresh and try again**
2. **Try different topic** - Some topics generate better
3. **Use more specific prompt** - "JavaScript async/await tutorial" vs "JavaScript"

---

## Quiz Issues

### Issue: Quiz questions don't appear

**Error:**
```
Cannot read property 'length' of undefined
```

**Solutions:**

1. **Enroll in course first:**
   - Make sure you have a course
   - Go to My Learning
   - Click "Continue"

2. **Check Firebase connection:**
   - Verify `.env.local` has database URL
   - Check Firebase rules allow read access

3. **Check browser console:**
   - Open DevTools → Console
   - Look for error messages

### Issue: Quiz submission fails

**Error:**
```
Failed to save quiz attempt
```

**Solutions:**

1. **Check internet connection**
2. **Verify Firebase write permission:**
   ```json
   {
     "rules": {
       "users": {
         "$uid": {
           ".write": "$uid === auth.uid"
         }
       }
     }
   }
   ```

3. **Clear browser cache and retry**

### Issue: Results not showing

**Solutions:**

1. **Wait for quiz to fully process**
2. **Check browser console for errors**
3. **Verify Recharts is installed:**
   ```bash
   npm list recharts
   # Should show: recharts@2.x.x
   ```

4. **Try incognito window** to rule out cache issues

---

## Firebase Issues

### Issue: Cannot read from Firebase

**Error:**
```
Permission denied
```

**Solutions:**

1. **Check Security Rules:**
   ```json
   {
     "rules": {
       ".read": "auth != null",
       "users": {
         "$uid": {
           ".read": "$uid === auth.uid"
         }
       }
     }
   }
   ```

2. **Verify User is Authenticated:**
   ```javascript
   import { getAuth } from 'firebase/auth';
   const auth = getAuth();
   console.log('Current user:', auth.currentUser);
   ```

3. **Check UID matching:**
   - Ensure logged-in user UID matches database path

### Issue: Firebase Realtime Database connection refused

**Error:**
```
Failed to connect to database
```

**Solutions:**

1. **Verify Database URL:**
   - Check `.env.local` has correct URL
   - Format: `https://project.firebaseio.com`

2. **Check Firebase Project:**
   - Go to Firebase Console
   - Verify Realtime Database is enabled
   - Check it's in the right region

3. **Test Connection:**
   ```javascript
   import { db } from './src/lib/firebase';
   import { ref, get } from 'firebase/database';
   
   get(ref(db, 'test')).then(snapshot => {
     console.log('Connection OK:', snapshot.val());
   }).catch(err => {
     console.error('Connection failed:', err.message);
   });
   ```

### Issue: Data not persisting

**Solutions:**

1. **Verify write permission:**
   - Check security rules
   - Ensure user is authenticated

2. **Check offline mode:**
   - Firebase offline persistence might be enabled
   - Check browser storage

3. **Manually test:**
   ```javascript
   import { ref, set } from 'firebase/database';
   await set(ref(db, `test/${Date.now()}`), { test: true });
   ```

---

## API Issues

### Issue: Backend not responding

**Error:**
```
Failed to fetch from http://localhost:5000
```

**Solutions:**

1. **Check backend is running:**
   ```bash
   cd server
   npm run dev
   ```

2. **Check port:**
   - Verify backend running on port 5000
   - Check `VITE_API_URL=http://localhost:5000` in `.env.local`

3. **Check CORS:**
   - Verify backend has CORS enabled
   - Check browser console for CORS errors

### Issue: CORS errors

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**

In `server/index.js`:
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5176',
  credentials: true
}));
```

### Issue: 401 Unauthorized

**Error:**
```
Unauthorized - Invalid token
```

**Solutions:**

1. **Login again** - Token might be expired
2. **Check token is being sent:**
   ```javascript
   const token = localStorage.getItem('firebase_token');
   console.log('Token:', token);
   ```

3. **Verify backend token validation:**
   ```javascript
   app.get('/api/protected', verifyToken, (req, res) => {
     // Protected route
   });
   ```

---

## Performance Issues

### Issue: Slow page load

**Cause:** Large bundle size or slow API

**Solutions:**

1. **Check bundle size:**
   ```bash
   npm run build
   # Check dist/ folder size
   ```

2. **Use Lighthouse:**
   ```bash
   npm install -g lighthouse
   lighthouse http://localhost:5176
   ```

3. **Optimize images:**
   - Use smaller image formats (WebP)
   - Compress images

4. **Enable compression:**
   ```javascript
   // In Vite config
   build: {
     minify: 'terser',
     sourcemap: false
   }
   ```

### Issue: Quiz generation slow

**Cause:** Gemini API latency

**Solutions:**

1. **Cache responses:**
   ```javascript
   const cache = new Map();
   if (cache.has(courseId)) {
     return cache.get(courseId);
   }
   ```

2. **Show loading indicator**
3. **Try upgrading Gemini plan** for better performance

---

## Still Having Issues?

1. **Check GitHub Issues:** https://github.com/pushkarrd/Code-flux-/issues
2. **Check Browser Console:** DevTools → Console tab
3. **Enable Debug Mode:**
   ```javascript
   localStorage.setItem('debug', 'true');
   ```

4. **Create Detailed Bug Report:**
   - Error message
   - Steps to reproduce
   - Browser/OS
   - Console output

---

See [Features Guide](./FEATURES.md) or [Architecture](./ARCHITECTURE.md) for more information.
