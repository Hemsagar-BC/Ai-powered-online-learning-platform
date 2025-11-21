# 🤖 Gemini API Setup Guide

## Current Status
- ✅ **Gemini API Key**: Configured in `.env` file
- ⚠️ **Generative Language API**: Needs to be enabled in Google Cloud Console
- 🔄 **Fallback Mode**: App works with contextual mock data when Gemini is unavailable

## Enable Gemini API (Real Course Generation)

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com
2. Make sure you're logged in with the same Google account that created the API key

### Step 2: Enable the Generative Language API
1. In the search box at the top, search for: **"Generative Language API"**
2. Click on **"Generative Language API"** from the results
3. Click the **"ENABLE"** button
4. Wait for the API to be enabled (usually 1-2 minutes)

### Step 3: Verify Setup
1. Go back to: https://aistudio.google.com/apikey
2. Click on your API key
3. Check if the API is enabled in "Restricted APIs"

### Step 4: Test in CodeFlux
1. Restart the backend server:
   ```bash
   cd c:\Users\n\DevRepos\Code-flux-\server
   npm start
   ```

2. Generate a course in the app
3. Open browser DevTools (F12) → Console
4. Look for: `✅ Course generated successfully from Gemini`
5. Course will now be AI-generated based on your input!

## What Happens Without Gemini API

**Current Behavior (Fallback Mode):**
- ✅ App still works perfectly
- ✅ Generates contextual course content based on user input
- ✅ Chapters are dynamically created with the topic name
- ✅ All course data is customized to user's course title and description
- ⚠️ Without AI enhancement (simpler content)

**With Gemini API Enabled:**
- ✅ Everything above PLUS:
- ✅ AI-generated, comprehensive course content
- ✅ Real-world examples specific to the topic
- ✅ Best practices and advanced techniques
- ✅ Professional course structure and flow

## Debugging

### Check Backend Logs
1. Look at the backend terminal (http://localhost:5000)
2. When you generate a course, you'll see:
   - `🤖 Attempting to use Gemini API...` → Trying Gemini
   - `✅ Course generated successfully from Gemini` → Success with Gemini
   - `⚠️ Gemini API error:` → Gemini unavailable, using fallback
   - `✅ Using contextual fallback course data` → Using fallback mode

### Check Frontend Logs
1. Open browser DevTools (F12)
2. Go to Console tab
3. Filter for logs containing "Course" or "Gemini"
4. Look for error messages or status updates

### If Gemini API is Still Not Working
1. **Check Project ID**: In `.env`, verify `VITE_FIREBASE_PROJECT_ID` matches your Google Cloud project
2. **Check Quota**: Some APIs have rate limits. Wait a few minutes and try again
3. **Restart Backend**: Kill and restart the backend server
4. **Clear Cache**: Restart your browser and clear cache

## API Response Examples

### Gemini Success Response
```json
{
  "success": true,
  "course": {
    "id": "course-1234567890",
    "title": "Advanced Python Data Science",
    "description": "Master data science with Python...",
    "objectives": [...],
    "chapters": [...],
    "source": "gemini",
    "createdAt": "2025-11-20T11:47:00Z"
  }
}
```

### Fallback Success Response
```json
{
  "success": true,
  "course": {
    "id": "course-1234567890",
    "title": "Advanced Python Data Science",
    "description": "Master the concepts and techniques...",
    "objectives": [...],
    "chapters": [...],
    "source": "fallback",
    "createdAt": "2025-11-20T11:47:00Z",
    "note": "Course generated using contextual template. Enable Gemini API for AI-powered content."
  }
}
```

## Features

### With Real Gemini API:
- 🎯 Custom course content based on user input
- 📚 Comprehensive chapters with real examples
- 💡 Practical applications and use cases
- 🚀 Advanced techniques and best practices
- 🔍 Smart learning progressions

### With Fallback Mode:
- ✅ Still custom course names and descriptions
- ✅ Dynamic chapter generation (not hardcoded)
- ✅ Contextual titles based on topic
- ✅ Professional structure
- ✅ All UI features work normally

## Common Issues

| Issue | Solution |
|-------|----------|
| Gemini API not enabled | Visit Google Cloud Console and enable "Generative Language API" |
| 403 Forbidden error | API is disabled - click "ENABLE" in Google Cloud Console |
| Still using fallback after enabling | Restart backend server with `npm start` |
| Rate limited | Wait 1-2 hours before trying again |
| Wrong project ID | Verify VITE_FIREBASE_PROJECT_ID in .env matches Google Cloud |

## Notes

- The fallback mode automatically customizes content based on course title and description
- Backend tries Gemini first, falls back gracefully if unavailable
- No manual action needed to switch between modes
- Course quality improves significantly once Gemini API is enabled
- All generated courses are saved to localStorage for offline access

---

**Need help?** Check the browser console (F12) for detailed logs and error messages.
