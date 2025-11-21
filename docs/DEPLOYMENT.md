# 🚀 Deployment Guide

Complete guide to deploy CodeFlux to production.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Frontend Deployment](#frontend-deployment)
3. [Backend Deployment](#backend-deployment)
4. [Database Migration](#database-migration)
5. [Production Optimization](#production-optimization)

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All code reviewed
- [ ] No console.log() in production code
- [ ] Error handling implemented
- [ ] No hardcoded credentials
- [ ] Security rules configured

### Testing
- [ ] All tests passing
- [ ] Manual testing completed
- [ ] Performance tested
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsive tested

### Security
- [ ] All API keys in environment variables
- [ ] CORS properly configured
- [ ] Firebase security rules enabled
- [ ] HTTPS enabled
- [ ] Rate limiting configured

### Performance
- [ ] Bundle size optimized (< 500KB)
- [ ] Images compressed
- [ ] Minification enabled
- [ ] Caching configured
- [ ] Lighthouse score > 80

### Documentation
- [ ] README.md complete
- [ ] API documentation updated
- [ ] Environment variables documented
- [ ] Deployment steps clear

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

**Step 1: Setup Vercel**

```bash
npm install -g vercel
vercel login
```

**Step 2: Deploy**

```bash
vercel
# Follow prompts
```

**Step 3: Configure Environment**

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add all variables from `.env.local`:
   ```
   VITE_FIREBASE_API_KEY=xxx
   VITE_GEMINI_API_KEY=xxx
   VITE_API_URL=https://api.codeflux.com
   ```

### Option 2: Netlify

**Step 1: Connect Repository**

1. Go to https://netlify.com
2. Click "New site from Git"
3. Choose GitHub repository

**Step 2: Configure Build**

Build settings:
- Build command: `npm run build`
- Publish directory: `dist/`

**Step 3: Environment Variables**

In Netlify dashboard:
1. Site settings → Build & deploy → Environment
2. Add all environment variables

### Option 3: GitHub Pages

```bash
# Build for GitHub Pages
npm run build

# Deploy
git add dist/
git commit -m "Deploy to production"
git push origin main
```

Update `vite.config.js`:
```javascript
export default {
  base: '/Code-flux-/'
  // ...
}
```

### Build Optimization

Before deploying:

```bash
# Build for production
npm run build

# Check bundle size
npm run analyze

# Test production build locally
npm install -g serve
serve -s dist
```

---

## Backend Deployment

### Option 1: Heroku

**Step 1: Install Heroku CLI**

```bash
# https://devcenter.heroku.com/articles/heroku-cli
heroku login
```

**Step 2: Create App**

```bash
heroku create your-app-name
```

**Step 3: Set Environment Variables**

```bash
heroku config:set GOOGLE_OAUTH_CLIENT_ID=xxx
heroku config:set GOOGLE_OAUTH_CLIENT_SECRET=xxx
heroku config:set FIREBASE_PRIVATE_KEY=xxx
```

**Step 4: Deploy**

```bash
git push heroku main
```

### Option 2: AWS Lambda (Serverless)

**Step 1: Install Serverless Framework**

```bash
npm install -g serverless
serverless login
```

**Step 2: Configure serverless.yml**

```yaml
service: codeflux-api

provider:
  name: aws
  runtime: nodejs18.x
  stage: prod
  region: us-east-1

functions:
  api:
    handler: server/handler.main
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
```

**Step 3: Deploy**

```bash
serverless deploy
```

### Option 3: Google Cloud Run

**Step 1: Setup Cloud SDK**

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

**Step 2: Create Dockerfile**

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY server/ ./server/
EXPOSE 5000

CMD ["node", "server/index.js"]
```

**Step 3: Build & Deploy**

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT/codeflux-api
gcloud run deploy codeflux-api --image gcr.io/YOUR_PROJECT/codeflux-api
```

---

## Database Migration

### Firebase Production Setup

**Step 1: Create Production Database**

1. Go to Firebase Console
2. Create new Realtime Database instance
3. Choose production mode (strict security)

**Step 2: Configure Security Rules**

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "courses": {
          ".indexOn": ["createdAt"]
        }
      }
    },
    "courses": {
      ".read": "auth != null",
      ".write": false
    }
  }
}
```

**Step 3: Backup Development Data**

```bash
# Export data from development database
firebase database:get / --instance dev-database

# Import to production
firebase database:set / data.json --instance prod-database
```

---

## Production Optimization

### Frontend Optimization

**1. Code Splitting**

```javascript
// Use dynamic imports
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Quiz = lazy(() => import('./pages/Quiz'));

// Wrap in Suspense
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

**2. Image Optimization**

```javascript
// Use Next Image or similar
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={200}
/>
```

**3. Lazy Loading**

```javascript
// Lazy load components
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

**4. Caching**

```javascript
// Vite config
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth']
        }
      }
    }
  }
}
```

### Backend Optimization

**1. Rate Limiting**

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests'
});

app.use(limiter);
```

**2. Database Indexing**

```json
{
  "rules": {
    "users": {
      "$uid": {
        "courses": {
          ".indexOn": ["createdAt", "progress"]
        }
      }
    }
  }
}
```

**3. Caching**

```javascript
app.use(cache('5 minutes'));
```

**4. Compression**

```javascript
const compression = require('compression');
app.use(compression());
```

---

## Monitoring & Logging

### Setup Error Tracking

**Sentry.io:**

```bash
npm install @sentry/react
```

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://xxx@xxx.ingest.sentry.io/xxx",
  environment: "production"
});
```

### Analytics

**Google Analytics:**

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Health Checks

```bash
# Monitor backend health
curl https://api.codeflux.com/health

# Should return
{ "status": "ok" }
```

---

## Rollback Plan

**If deployment fails:**

1. Identify issue
2. Revert to previous version:
   ```bash
   git revert <commit-hash>
   git push
   ```

3. Redeploy:
   ```bash
   vercel deploy --prod
   ```

---

## Post-Deployment

After successful deployment:

- [ ] Verify site loads
- [ ] Test Google Sign-in
- [ ] Create test course
- [ ] Take test quiz
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Announce release

---

## Domain Configuration

**Setup Custom Domain:**

1. In deployment platform, add custom domain
2. Update DNS records (CNAME)
3. Wait for DNS propagation (24-48 hours)
4. Enable SSL/HTTPS

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Page Load Time | < 2 seconds |
| First Contentful Paint | < 1 second |
| Time to Interactive | < 3 seconds |
| Lighthouse Score | > 80 |
| Bundle Size | < 500KB |

---

See [Troubleshooting](./TROUBLESHOOTING.md) for deployment issues.
