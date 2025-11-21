# CodeFlux Backend

Express.js backend server for CodeFlux AI Learning Platform with Google OAuth authentication.

## Features

- ✅ Google OAuth 2.0 Authentication
- ✅ User Session Management
- ✅ Protected API Endpoints
- ✅ Course Generation (Protected)
- ✅ User Profile Management
- ✅ CORS Enabled

## Prerequisites

- Node.js 14+ 
- npm or yarn
- Google OAuth Credentials

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Set authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `http://localhost:5174` (frontend URL)
6. Copy your Client ID and Client Secret

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=development

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URLs
FRONTEND_URL=http://localhost:5174

# JWT Secret
JWT_SECRET=your-secret-key-here
```

### 4. Start the Backend Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### Get Auth URL
```
GET /api/auth/google
Response: { authUrl: "..." }
```

#### Google OAuth Callback
```
POST /api/auth/google/callback
Body: { code: "authorization_code" }
Response: { 
  success: true, 
  sessionToken: "token",
  user: { id, email, name, picture }
}
```

#### Verify Session
```
POST /api/auth/verify
Body: { sessionToken: "token" }
Response: { success: true, user: {...} }
```

#### Logout
```
POST /api/auth/logout
Body: { sessionToken: "token" }
Response: { success: true, message: "Logged out successfully" }
```

### User

#### Get User Profile
```
GET /api/user/profile
Headers: { Authorization: "Bearer sessionToken" }
Response: { user: { id, email, name, picture } }
```

### Courses

#### Generate Course (Protected)
```
POST /api/courses/generate
Headers: { Authorization: "Bearer sessionToken" }
Body: { 
  title: "Course Title",
  chapters: 7,
  description: "Optional description",
  difficulty: "Beginner"
}
Response: { 
  success: true,
  course: { id, title, chapters, ... }
}
```

#### Health Check
```
GET /api/health
Response: { status: "OK", message: "..." }
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment (development/production) | No |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | **Yes** |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | **Yes** |
| `GOOGLE_CALLBACK_URL` | Google OAuth Callback URL | **Yes** |
| `FRONTEND_URL` | Frontend application URL | No |
| `JWT_SECRET` | Secret for JWT tokens | No |

## Frontend Integration

The frontend (`src/lib/firebase.js`) should be updated to call this backend:

```javascript
// Example: Call backend for Google OAuth
const response = await fetch('http://localhost:5000/api/auth/google/callback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code })
});
```

## Security Notes

⚠️ **Important:**
- Never commit `.env` file to git
- Use HTTPS in production
- Implement proper session storage (Redis, MongoDB) in production
- Add rate limiting and request validation
- Use secure cookies for session tokens
- Implement proper error handling and logging

## Project Structure

```
server/
├── index.js           # Main server file
├── package.json       # Dependencies
├── .env              # Environment variables
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## Troubleshooting

### "Invalid Client ID"
- Check that GOOGLE_CLIENT_ID is correct
- Verify it matches your Google Cloud Console credentials

### "CORS Error"
- Ensure frontend URL is in CORS whitelist in `index.js`
- Check that requests have proper headers

### "Invalid redirect URI"
- Ensure GOOGLE_CALLBACK_URL matches the one in Google Cloud Console
- HTTPS is required for production

## Future Enhancements

- [ ] Database integration (MongoDB, PostgreSQL)
- [ ] JWT tokens instead of sessions
- [ ] Email/Password authentication
- [ ] OAuth for GitHub, Microsoft
- [ ] Real Gemini API integration
- [ ] Rate limiting
- [ ] API documentation (Swagger)
- [ ] Unit & Integration tests
- [ ] Docker containerization

## License

MIT

## Author

**Pushkar R Deshpande**  
Email: pushkarrd@example.com  
GitHub: [@pushkarrd](https://github.com/pushkarrd)
