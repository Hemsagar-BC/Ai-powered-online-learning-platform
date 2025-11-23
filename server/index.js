const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const fs = require('fs');
const { OAuth2Client } = require('google-auth-library');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5174', 
    'http://localhost:5173', 
    'http://localhost:5175', 
    'http://localhost:5176', 
    'http://localhost:4173',
    'https://ai-powered-online-learning-platform-p5izl0o82.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// Google OAuth Setup
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

// Gemini API Setup
const genAI = process.env.VITE_GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY) : null;

// YouTube API Setup
const YOUTUBE_API_KEY = process.env.VITE_YOUTUBE_API_KEY || 'AIzaSyCofp7gg86IRvUAG2sz4KaSnjo-8Jtp47w';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

// Helper function to extract search query from chapter content
// Incorporates: chapter title, main topic, description, and keypoints
const extractSearchQuery = (chapter, mainTopic, chapterIndex, totalChapters, userDescription = '') => {
  // CRITICAL: Use chapter title as primary source for search query
  // This ensures YouTube searches match the specific chapter content
  
  let searchTerms = mainTopic;
  
  // PRIMARY: Use chapter title if available - it's most specific
  if (chapter.title && chapter.title.length > 5) {
    const chapterTitle = chapter.title.toLowerCase();
    
    // Check if chapter title already includes the main topic
    if (chapterTitle.includes(mainTopic.toLowerCase())) {
      // Use chapter title as-is for search
      searchTerms = chapter.title;
    } else {
      // Combine main topic with chapter title for better results
      searchTerms = `${mainTopic} ${chapter.title}`;
    }
  } 
  // SECONDARY: Use chapter keyPoints if title is not available
  else if (chapter.keyPoints && chapter.keyPoints.length > 0) {
    const firstKeyPoint = chapter.keyPoints[0];
    if (firstKeyPoint && firstKeyPoint.length > 5) {
      searchTerms = `${mainTopic} ${firstKeyPoint} tutorial`;
    } else {
      searchTerms = `${mainTopic} tutorial`;
    }
  }
  // TERTIARY: Use position-based fallback
  else if (chapterIndex === 0) {
    searchTerms = `${mainTopic} introduction basics`;
  } else if (chapterIndex === totalChapters - 1) {
    searchTerms = `${mainTopic} advanced techniques`;
  } else {
    searchTerms = `${mainTopic} tutorial`;
  }
  
  // ENHANCEMENT: Add user description context if available
  // This helps YouTube find videos more aligned with user intent
  if (userDescription && userDescription.length > 5) {
    const descKeywords = userDescription
      .split(' ')
      .filter(word => word.length > 4 && !['course', 'learn', 'about'].includes(word.toLowerCase()))
      .slice(0, 2)
      .join(' ');
    
    if (descKeywords && !searchTerms.toLowerCase().includes(descKeywords.toLowerCase())) {
      searchTerms = `${searchTerms} ${descKeywords}`;
    }
  }
  
  console.log(`  🔍 Search query for chapter "${chapter.title}": "${searchTerms}"`);
  return searchTerms;
};

// Function to fetch YouTube videos for a topic
const fetchYouTubeVideos = async (topic, maxResults = 3) => {
  try {
    console.log(`🎬 Fetching YouTube videos for topic: "${topic}"`);
    
    // Search with exact topic first to get most relevant results
    const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
      params: {
        q: topic, // Use exact topic first
        part: 'snippet',
        type: 'video',
        maxResults: Math.min((maxResults + 5) * 3, 50), // Fetch more to filter by view count
        order: 'relevance', // Get most relevant videos first
        key: YOUTUBE_API_KEY
      }
    });

    if (!response.data.items || response.data.items.length === 0) {
      console.warn(`⚠️ No YouTube videos found for: ${topic}`);
      return [];
    }

    console.log(`   📌 Received ${response.data.items.length} results from YouTube API`);

    // Simple filter for topic relevance only
    let filteredItems = response.data.items;
    
    // Filter for topic relevance - check if topic is in title or description
    filteredItems = filteredItems.filter(item => {
      const title = item.snippet.title.toLowerCase();
      const description = (item.snippet.description || '').toLowerCase();
      const topicLower = topic.toLowerCase();
      
      // Video must be relevant to the topic (in title OR description)
      const isRelevant = title.includes(topicLower) || description.includes(topicLower);
      
      if (!isRelevant) {
        console.log(`   ❌ Filtered out: "${item.snippet.title}" (not relevant to ${topic})`);
      }
      
      return isRelevant;
    });

    console.log(`   ✅ After topic relevance filter: ${filteredItems.length} videos`);

    // If no results, return empty (don't fall back to unrelated videos)
    if (filteredItems.length === 0) {
      console.warn(`⚠️ No relevant videos found for: ${topic}`);
      return [];
    }

    // Get video details (duration, view count, likes) - get more than needed to sort
    const videoIds = filteredItems.slice(0, maxResults * 2).map(item => item.id.videoId).join(',');
    
    const detailsResponse = await axios.get(`${YOUTUBE_API_URL}/videos`, {
      params: {
        id: videoIds,
        part: 'contentDetails,statistics,snippet',
        key: YOUTUBE_API_KEY
      }
    });

    const videos = detailsResponse.data.items.map((item, index) => {
      const duration = item.contentDetails?.duration || 'PT15M';
      const viewCount = parseInt(item.statistics?.viewCount || 0);
      const likeCount = parseInt(item.statistics?.likeCount || 0);
      const title = item.snippet?.title || 'Untitled';
      const channelTitle = item.snippet?.channelTitle || 'Educational Channel';
      
      return {
        title: title,
        channel: channelTitle,
        duration: convertISO8601Duration(duration),
        videoId: item.id,
        url: `https://www.youtube.com/watch?v=${item.id}`,
        viewCount: viewCount || 0, // Ensure viewCount defaults to 0
        likeCount: likeCount || 0,
        thumbnail: item.snippet?.thumbnails?.medium?.url,
        quality: calculateVideoQuality(viewCount, likeCount)
      };
    });

    // CRITICAL: Sort by viewCount (most important) to ensure most viewed video is first
    // This is the PRIMARY sorting mechanism to get the BEST video
    videos.sort((a, b) => {
      // Primary: Sort by view count (most viewed first) - HIGHEST TO LOWEST
      const viewDiff = (b.viewCount || 0) - (a.viewCount || 0);
      if (viewDiff !== 0) {
        console.log(`   📊 Comparing: "${a.title}" (${(a.viewCount || 0).toLocaleString()} views) vs "${b.title}" (${(b.viewCount || 0).toLocaleString()} views)`);
        return viewDiff;
      }
      
      // Secondary: Sort by quality if view counts are similar
      const qualityDiff = (b.quality || 0) - (a.quality || 0);
      if (qualityDiff !== 0) {
        console.log(`   ⭐ Same view count, sorting by quality: "${a.title}" (${a.quality || 0}) vs "${b.title}" (${b.quality || 0})`);
        return qualityDiff;
      }
      
      // Tertiary: Sort by like count if still tied
      return (b.likeCount || 0) - (a.likeCount || 0);
    });
    
    // Take top N results after sorting by view count
    const topVideos = videos.slice(0, maxResults);
    
    // Update type based on sorted position (best = most viewed)
    topVideos.forEach((video, index) => {
      video.type = index === 0 ? 'best' : index === 1 ? 'preferred' : 'supplementary';
    });

    console.log(`✅ Found ${topVideos.length} videos for: "${topic}"`);
    console.log(`   📊 Top video (BEST): "${topVideos[0]?.title}"`);
    console.log(`   📊 View count: ${(topVideos[0]?.viewCount || 0).toLocaleString()} views`);
    console.log(`   📊 Channel: ${topVideos[0]?.channel || 'Unknown'}`);
    console.log(`   📊 Duration: ${topVideos[0]?.duration || 'Unknown'}`);
    console.log(`   📊 Quality Score: ${topVideos[0]?.quality || 0}/100`);
    
    return topVideos;
  } catch (error) {
    console.error('❌ Error fetching YouTube videos:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', JSON.stringify(error.response.data, null, 2));
    }
    return [];
  }
};

// Helper function to convert ISO 8601 duration to readable format
const convertISO8601Duration = (duration) => {
  try {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '15-20 min';
    
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}-${minutes + 5} min`;
    } else {
      return `${seconds} sec`;
    }
  } catch (e) {
    return '15-20 min';
  }
};

// Helper function to calculate video quality score based on engagement
const calculateVideoQuality = (viewCount, likeCount = 0) => {
  let score = 0;
  
  // View count score (0-60 points)
  if (viewCount > 10000000) score += 60;
  else if (viewCount > 1000000) score += 50;
  else if (viewCount > 100000) score += 40;
  else if (viewCount > 10000) score += 30;
  else if (viewCount > 1000) score += 20;
  else score += 10;
  
  // Like ratio score (0-40 points)
  const likeRatio = viewCount > 0 ? (likeCount / viewCount) * 100 : 0;
  if (likeRatio > 5) score += 40;
  else if (likeRatio > 3) score += 30;
  else if (likeRatio > 1) score += 20;
  else if (likeRatio > 0.5) score += 10;
  
  return Math.min(score, 100);
};

// Persistent Session Storage using JSON file
const sessionsFilePath = './sessions.json';
let userSessions = new Map();

// Load sessions from file on startup
const loadSessions = () => {
  try {
    if (fs.existsSync(sessionsFilePath)) {
      const data = fs.readFileSync(sessionsFilePath, 'utf8');
      const sessions = JSON.parse(data);
      userSessions = new Map(sessions);
      console.log(`✅ Loaded ${sessions.length} persisted sessions from file`);
    } else {
      console.log('📝 No persisted sessions file, starting fresh');
    }
  } catch (error) {
    console.warn('⚠️ Error loading sessions:', error.message);
    userSessions = new Map();
  }
};

// Save sessions to file
const saveSessions = () => {
  try {
    const sessions = Array.from(userSessions.entries());
    fs.writeFileSync(sessionsFilePath, JSON.stringify(sessions, null, 2));
    console.log(`💾 Persisted ${sessions.length} sessions to file`);
  } catch (error) {
    console.warn('⚠️ Error saving sessions:', error.message);
  }
};

// Clean up expired sessions
const cleanExpiredSessions = () => {
  const now = Date.now();
  let expired = 0;
  for (const [token, session] of userSessions.entries()) {
    if (session.expiresAt < now) {
      userSessions.delete(token);
      expired++;
    }
  }
  if (expired > 0) {
    console.log(`🧹 Cleaned up ${expired} expired sessions`);
    saveSessions();
  }
};

// Load sessions on startup
loadSessions();

// Clean up expired sessions every 5 minutes
setInterval(cleanExpiredSessions, 5 * 60 * 1000);

// Middleware to verify Bearer token (with fallback)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const sessionToken = authHeader?.replace('Bearer ', '');

  console.log('\n🔐 Token verification:');
  console.log('   Auth header:', authHeader ? 'Present' : 'Missing');
  console.log('   Sessions in storage:', userSessions.size);

  if (!sessionToken) {
    console.log('   ⚠️ No token provided - allowing development mode');
    req.session = { userId: 'dev-user', email: 'dev@codeflux.dev', isDev: true };
    return next();
  }

  if (!userSessions.has(sessionToken)) {
    console.log('   ⚠️ Token not found in session storage');
    console.log('   Token (first 30 chars):', sessionToken.substring(0, 30) + '...');
    console.log('   Available sessions:', Array.from(userSessions.keys()).slice(0, 3).map(t => t.substring(0, 20) + '...'));
    req.session = { userId: 'dev-user', email: 'dev@codeflux.dev', isDev: true, attemptedToken: sessionToken };
    return next();
  }

  console.log('   ✅ Token verified successfully');
  const session = userSessions.get(sessionToken);
  req.session = session;
  next();
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CodeFlux Backend is running' });
});

// YouTube Video Search - Get videos for a specific topic
app.get('/api/youtube/search', async (req, res) => {
  try {
    const { topic } = req.query;
    
    if (!topic) {
      return res.status(400).json({ 
        success: false, 
        error: 'Topic is required' 
      });
    }
    
    console.log(`🎬 YouTube API request for topic: "${topic}"`);
    
    const videos = await fetchYouTubeVideos(topic, 5);
    
    res.json({
      success: true,
      topic,
      videos,
      count: videos.length
    });
  } catch (error) {
    console.error('❌ Error in YouTube search endpoint:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to search YouTube videos' 
    });
  }
});

// Google OAuth Login - Generate Auth URL
app.get('/api/auth/google', (req, res) => {
  try {
    const authUrl = googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ]
    });
    res.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

// Google OAuth Callback - Exchange code for token
app.post('/api/auth/google/callback', async (req, res) => {
  try {
    const { code, user } = req.body;

    console.log('=== GOOGLE CALLBACK ===');
    console.log('User provided:', user ? 'YES' : 'NO');
    console.log('Code provided:', code ? 'YES' : 'NO');

    // Handle Firebase token (user provided)
    if (user && user.uid) {
      const userId = user.uid;
      const userEmail = user.email;
      const userName = user.displayName || 'User';
      const userPicture = user.photoURL || '';

      // Create user session with 24-hour expiration
      const sessionToken = Buffer.from(`${userId}:${Date.now()}:${Math.random()}`).toString('base64');
      const sessionData = {
        userId,
        email: userEmail,
        name: userName,
        picture: userPicture,
        accessToken: code, // Store Firebase token as accessToken
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      };
      
      userSessions.set(sessionToken, sessionData);
      
      // Save to file immediately
      saveSessions();

      console.log('✅ Session created with token:', sessionToken.substring(0, 20) + '...');
      console.log('   Email:', userEmail);
      console.log('   Expires at:', new Date(sessionData.expiresAt).toISOString());
      console.log('   Total sessions now:', userSessions.size);
      console.log('======================');

      return res.json({
        success: true,
        sessionToken,
        user: {
          id: userId,
          email: userEmail,
          name: userName,
          picture: userPicture
        }
      });
    }

    // Handle OAuth code (Google redirect)
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Exchange authorization code for tokens (if using Google redirect flow)
    const { tokens } = await googleClient.getToken(code);

    // Get user info
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const userId = payload.sub;
    const userEmail = payload.email;
    const userName = payload.name;
    const userPicture = payload.picture;

    // Create user session
    const sessionToken = Buffer.from(`${userId}:${Date.now()}`).toString('base64');
    userSessions.set(sessionToken, {
      userId,
      email: userEmail,
      name: userName,
      picture: userPicture,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expiry_date
    });

    res.json({
      success: true,
      sessionToken,
      user: {
        id: userId,
        email: userEmail,
        name: userName,
        picture: userPicture
      }
    });
  } catch (error) {
    console.error('Error during callback:', error);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

// Verify Session
app.post('/api/auth/verify', (req, res) => {
  try {
    const { sessionToken } = req.body;

    if (!sessionToken || !userSessions.has(sessionToken)) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    const session = userSessions.get(sessionToken);
    
    // Check if token is expired
    if (session.expiresAt && new Date().getTime() > session.expiresAt) {
      userSessions.delete(sessionToken);
      return res.status(401).json({ error: 'Session expired' });
    }

    res.json({
      success: true,
      user: {
        id: session.userId,
        email: session.email,
        name: session.name,
        picture: session.picture
      }
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  try {
    const { sessionToken } = req.body;
    const authHeader = req.headers.authorization;
    const tokenToDelete = sessionToken || (authHeader ? authHeader.replace('Bearer ', '') : null);

    console.log('🔓 Logout requested');
    
    if (tokenToDelete) {
      if (userSessions.has(tokenToDelete)) {
        const session = userSessions.get(tokenToDelete);
        userSessions.delete(tokenToDelete);
        saveSessions();
        console.log('   ✅ Session deleted:', session.email);
      } else {
        console.log('   ℹ️ Token not found in sessions');
      }
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Get current user
app.get('/api/user/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const sessionToken = authHeader?.replace('Bearer ', '');

    if (!sessionToken || !userSessions.has(sessionToken)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const session = userSessions.get(sessionToken);
    res.json({
      user: {
        id: session.userId,
        email: session.email,
        name: session.name,
        picture: session.picture
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Course Generation Endpoint (Protected) - Uses Gemini API
app.post('/api/courses/generate', verifyToken, async (req, res) => {
  try {
    console.log('\n📝 === GENERATING COURSE ===');
    console.log('   User:', req.session?.email);
    console.log('   Course title:', req.body.title);

    const { title, chapters = 7, description, difficulty = 'Beginner', category = 'Technology' } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Course title is required' });
    }

    // Check if Gemini API is configured
    if (!genAI) {
      console.warn('Gemini API not configured, using fallback data');
      // Fallback to mock data
      const courseData = {
        id: `course-${Date.now()}`,
        title,
        description: description || `Learn ${title}`,
        category,
        difficulty,
        objectives: ['Learn fundamentals', 'Apply knowledge', 'Master skills'],
        chapters: Array.from({ length: chapters }, (_, i) => ({
          id: i + 1,
          title: `Chapter ${i + 1}: ${title} Fundamentals`,
          description: `Learn the fundamentals of chapter ${i + 1}`,
          keyPoints: ['Core concept 1', 'Core concept 2', 'Core concept 3'],
          // NEW: Add structured lesson data
          lessons: [
            {
              id: '1.1',
              topic: 'Introduction to Basics',
              learningGoal: 'Understand the fundamentals',
              youtubeVideo: `${title} basics introduction`,
              resources: 'Overview Guide'
            },
            {
              id: '1.2',
              topic: 'Core Concepts',
              learningGoal: 'Master the essential concepts',
              youtubeVideo: `${title} core concepts`,
              resources: 'Study Guide'
            }
          ],
          keyConcepts: ['Foundation', 'Core Principles', 'Best Practices'],
          learningOutcomes: ['Understand fundamentals', 'Apply knowledge', 'Master skills'],
          youtubeVideos: [],
          sourceLinks: ['https://example.com']
        }))
      };
      return res.json({ success: true, course: courseData });
    }

    try {
      // Use Gemini API to generate course
      console.log('🤖 Attempting to use Gemini API for course generation...');
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      const prompt = `You are an expert course curriculum designer. Create a comprehensive course outline based on the following specifications:

COURSE DETAILS:
- Title: "${title}"
- Description: ${description || 'Create a comprehensive course on the topic'}
- Number of Chapters: ${chapters}
- Difficulty Level: ${difficulty}
- Category: ${category}

REQUIREMENTS:
1. Create exactly ${chapters} chapters with DETAILED content
2. Each chapter should be relevant to "${title}" - NOT generic examples
3. Make chapters progressive (basic → intermediate → advanced)
4. Focus on: "${description || title}"
5. Include practical applications and real-world use cases

RESPONSE FORMAT (Return ONLY valid JSON, no markdown):
{
  "title": "Appropriate title for ${title}",
  "description": "2-3 sentence description focusing on ${description || title}",
  "objectives": [
    "First learning objective specific to ${title}",
    "Second learning objective specific to ${title}",
    "Third learning objective specific to ${title}"
  ],
  "learningPath": [
    "Start with: Foundational concepts",
    "Progress to: Intermediate applications",
    "Master: Advanced techniques and best practices"
  ],
  "chapters": [
    {
      "title": "Chapter title specific to ${title}",
      "description": "Description relevant to ${title}",
      "keyPoints": [
        "Specific concept for ${title}",
        "Practical application for ${title}",
        "Advanced technique for ${title}"
      ],
      "detailedContent": "5-7 detailed paragraphs explaining this chapter's concepts, examples, code snippets if applicable, and practical use cases",
      "notes": {
        "mainConcepts": ["Concept 1", "Concept 2", "Concept 3"],
        "commonMistakes": "List of common mistakes to avoid",
        "bestPractices": "Industry best practices and tips for this topic"
      },
      "roadmap": "Step-by-step learning path for this specific chapter",
      "youtubeVideos": [
        {
          "title": "Best video title for this chapter topic",
          "channel": "Creator name",
          "duration": "15-20 min estimated",
          "type": "best"
        },
        {
          "title": "Most popular/preferred video for this topic",
          "channel": "Creator name",
          "duration": "20-30 min estimated",
          "type": "preferred"
        },
        {
          "title": "Supplementary video for deeper understanding",
          "channel": "Creator name",
          "duration": "10-15 min estimated",
          "type": "supplementary"
        }
      ],
      "sourceLinks": [
        "Link to official documentation",
        "Link to tutorial",
        "Link to best practices guide"
      ]
    }
  ]
}

Create the course now. Remember: Make it about "${title}", not generic content.`;

      console.log('📝 Sending prompt to Gemini...');
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      console.log('✅ Gemini response received');
      
      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('Could not parse JSON from Gemini response');
        throw new Error('Invalid response format from Gemini');
      }

      const courseData = JSON.parse(jsonMatch[0]);
      
      // Validate and enhance course data with real YouTube videos
      console.log('📺 Fetching YouTube videos for each chapter...');
      const fullCourse = {
        id: `course-${Date.now()}`,
        title: courseData.title || title,
        description: courseData.description || description,
        category: category,
        difficulty: difficulty,
        objectives: courseData.objectives || ['Learn fundamentals', 'Apply knowledge', 'Master advanced concepts'],
        learningPath: courseData.learningPath || ['Start with basics', 'Progress to intermediate', 'Master advanced concepts'],
        chapters: await Promise.all((courseData.chapters || []).map(async (ch, i) => {
          // Extract best search query from chapter content with chapter position context and user description
          const searchQuery = extractSearchQuery(ch, title, i, courseData.chapters.length, description);
          
          // Fetch real YouTube videos for each chapter using extracted search query
          console.log(`📺 Chapter ${i + 1}: Searching YouTube for "${searchQuery}"`);
          const youtubeVideos = await fetchYouTubeVideos(searchQuery, 3);
          
          return {
            id: i + 1,
            title: ch.title || `Chapter ${i + 1}: ${title}`,
            description: ch.description || `Learn about ${title}`,
            keyPoints: ch.keyPoints || ['Key concept 1', 'Key concept 2', 'Key concept 3'],
            detailedContent: ch.detailedContent || `Comprehensive content for ${ch.title || title}. This section covers the main concepts, practical applications, and best practices.`,
            notes: ch.notes || {
              mainConcepts: ['Concept 1', 'Concept 2', 'Concept 3'],
              commonMistakes: 'Common mistakes to avoid when working with this topic',
              bestPractices: 'Best practices for optimal results'
            },
            roadmap: ch.roadmap || `Learning roadmap for ${ch.title || title}`,
            youtubeVideos: youtubeVideos.length > 0 ? youtubeVideos : [],
            sourceLinks: ch.sourceLinks || ['https://docs.example.com', 'https://tutorial.example.com']
          };
        })),
        createdAt: new Date().toISOString(),
        source: 'gemini'
      };

      console.log('✅ Course generated successfully from Gemini');
      console.log('   Title:', fullCourse.title);
      console.log('   Chapters:', fullCourse.chapters.length);

      res.json({
        success: true,
        course: fullCourse
      });
    } catch (geminiError) {
      console.warn('⚠️ Gemini API error:', geminiError.message);
      console.log('📊 Error details:', geminiError.status || 'Unknown');
      console.log('Falling back to enhanced mock data...');
      
      // Fallback to contextual mock data based on user input
      const courseData = {
        id: `course-${Date.now()}`,
        title: title,
        description: description || `Master the concepts and techniques of ${title}`,
        category: category,
        difficulty: difficulty,
        objectives: [
          `Understand core principles and fundamentals of ${title}`,
          `Apply ${title} knowledge to real-world scenarios and projects`,
          `Master advanced techniques and best practices in ${title}`
        ],
        chapters: await Promise.all(Array.from({ length: chapters }, async (_, i) => {
          // Create contextual chapter search queries based on progression
          // Include user description for better video matching
          let searchQuery = title;
          
          // Create chapter title based on position
          const chapterTitle = i === 0 
            ? `Introduction to ${title}` 
            : i === chapters - 1 
            ? `Advanced ${title} and Future Trends`
            : `${title}: Intermediate Concepts - Part ${i}`;
          
          // Build search query with description context
          if (i === 0) {
            searchQuery = `${title} introduction basics`;
          } else if (i === chapters - 1) {
            searchQuery = `${title} advanced techniques best practices`;
          } else if (i === Math.floor(chapters / 2)) {
            searchQuery = `${title} intermediate concepts applications`;
          } else {
            searchQuery = `${title} tutorial step by step`;
          }
          
          // Add description keywords if available
          if (description && description.length > 5) {
            const descKeywords = description
              .split(' ')
              .filter(word => word.length > 4 && !['course', 'learn', 'about'].includes(word.toLowerCase()))
              .slice(0, 2)
              .join(' ');
            
            if (descKeywords && !searchQuery.toLowerCase().includes(descKeywords.toLowerCase())) {
              searchQuery = `${searchQuery} ${descKeywords}`;
            }
          }
          
          // Fetch real YouTube videos for each chapter using enhanced search query
          console.log(`📺 Fallback Chapter ${i + 1}: Searching YouTube for "${searchQuery}"`);
          const youtubeVideos = await fetchYouTubeVideos(searchQuery, 3);
          
          return {
            id: i + 1,
            title: chapterTitle,
            description: i === 0
              ? `Learn the basics and fundamentals of ${title}`
              : i === chapters - 1
              ? `Explore advanced topics and emerging trends in ${title}`
              : `Deep dive into intermediate ${title} concepts and applications`,
            keyPoints: [
              `Fundamental concepts of ${title}`,
              `Practical applications and use cases in ${title}`,
              `Best practices and optimization techniques for ${title}`
            ],
            // NEW: Add structured lesson data for ChapterDetail component
            lessons: [
              {
                id: '1.1',
                topic: `Introduction to ${title}`,
                learningGoal: `Understand the fundamentals of ${title}`,
                youtubeVideo: `${title} introduction basics`,
                resources: `Overview: ${title} Guide`
              },
              {
                id: '1.2',
                topic: `Core Concepts of ${title}`,
                learningGoal: `Master the essential concepts`,
                youtubeVideo: `${title} core concepts explained`,
                resources: `Study Guide: Key Terms & Definitions`
              },
              {
                id: '1.3',
                topic: `Practical Application of ${title}`,
                learningGoal: `Apply concepts to real-world scenarios`,
                youtubeVideo: `${title} real-world examples and applications`,
                resources: `Project Template & Code Examples`
              }
            ],
            keyConcepts: [
              `Foundation of ${title}`,
              `Core Principles and Theory`,
              `Practical Implementation`,
              `Best Practices in ${title}`,
              `Advanced Techniques`
            ],
            learningOutcomes: [
              `Understand the fundamentals and history of ${title}`,
              `Apply practical techniques and methods`,
              `Troubleshoot common issues in ${title}`,
              `Implement best practices and optimization`
            ],
            practicalExercises: [
              {
                title: 'Beginner Exercise',
                description: `Start with basic ${title} concepts`,
                difficulty: 'beginner'
              },
              {
                title: 'Intermediate Project',
                description: `Apply ${title} techniques in a practical project`,
                difficulty: 'intermediate'
              }
            ],
            youtubeVideos: youtubeVideos.length > 0 ? youtubeVideos : [],
            sourceLinks: [
              'https://official-documentation.com',
              'https://tutorial-guide.com',
              'https://community-resources.com'
            ],
            detailedContent: `This chapter covers the essential concepts and practical applications of ${title}. You will learn fundamental principles, explore real-world use cases, and discover best practices for working with ${title}. By the end of this chapter, you will have a solid foundation to build upon and the ability to apply these concepts to your own projects.`,
            notes: {
              mainConcepts: [
                `Core principle of ${title}`,
                `Essential frameworks and tools`,
                `Key methodologies`
              ],
              commonMistakes: `Common mistakes include overlooking best practices, not considering scalability, and failing to test thoroughly before deployment. Always validate your understanding with peers and document your approach.`,
              bestPractices: `Follow industry standards, use version control, write clean code, test thoroughly, and maintain documentation. Stay updated with the latest developments in ${title} and participate in community discussions.`
            },
            roadmap: `Learning roadmap for ${title}:\n1. Start with fundamentals\n2. Explore practical applications\n3. Study best practices\n4. Complete hands-on projects\n5. Review advanced techniques\n6. Contribute to real-world work`
          };
        })),
        createdAt: new Date().toISOString(),
        source: 'fallback'
      };
      
      console.log('✅ Using contextual fallback course data');
      console.log('   Topic:', title);
      console.log('   Chapters:', chapters);
      res.json({
        success: true,
        course: courseData,
        note: 'Course generated using contextual template. Enable Gemini API for AI-powered content.'
      });
    }
  } catch (error) {
    console.error('Error generating course:', error);
    res.status(500).json({ error: error.message || 'Failed to generate course' });
  }
});

// Study Sessions Endpoints

// Get user's study sessions
app.post('/api/sessions/list', (req, res) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    const token = authorization.replace('Bearer ', '');
    if (!userSessions.has(token)) {
      return res.status(401).json({ error: 'Invalid session token' });
    }

    const sessionData = userSessions.get(token);
    
    // In a real app, fetch from database
    // For now, return empty array
    res.json({
      success: true,
      sessions: [],
      userId: sessionData.userId
    });
  } catch (error) {
    console.error('Error listing sessions:', error);
    res.status(500).json({ error: 'Failed to list sessions' });
  }
});

// Get session stats
app.post('/api/sessions/stats', (req, res) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    const token = authorization.replace('Bearer ', '');
    if (!userSessions.has(token)) {
      return res.status(401).json({ error: 'Invalid session token' });
    }

    const sessionData = userSessions.get(token);
    
    // Return basic stats
    res.json({
      success: true,
      stats: {
        userId: sessionData.userId,
        todayMinutes: 0,
        weekMinutes: 0,
        totalSessions: 0,
        avgSessionDuration: 0,
        currentStreak: 0,
        longestStreak: 0
      }
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Get streak info
app.post('/api/streak/info', (req, res) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    const token = authorization.replace('Bearer ', '');
    if (!userSessions.has(token)) {
      return res.status(401).json({ error: 'Invalid session token' });
    }

    const sessionData = userSessions.get(token);
    
    // Return basic streak info
    res.json({
      success: true,
      streak: {
        userId: sessionData.userId,
        current: 0,
        longest: 0,
        freezesAvailable: 0
      }
    });
  } catch (error) {
    console.error('Error getting streak:', error);
    res.status(500).json({ error: 'Failed to get streak' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Chapter Details Endpoint - Fetch structured chapter content from Gemini
app.post('/api/chapters/details', async (req, res) => {
  const { chapterTitle, courseTitle, courseTopic, difficulty } = req.body;

  if (!chapterTitle || !courseTitle) {
    return res.status(400).json({ error: 'Chapter title and course title are required' });
  }

  try {
    console.log(`📚 Fetching chapter details for: "${chapterTitle}"`);

    // Check if Gemini API is configured
    if (!genAI) {
      console.warn('⚠️ Gemini API not configured, returning fallback structure');
      return res.json(generateFallbackChapterContent(chapterTitle, courseTitle));
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert course curriculum designer. Generate detailed structured content for a specific chapter.

CHAPTER DETAILS:
- Chapter Title: "${chapterTitle}"
- Course: "${courseTitle}"
- Topic: "${courseTopic || chapterTitle}"
- Difficulty Level: ${difficulty || 'intermediate'}

REQUIREMENTS:
Create a comprehensive, tabular lesson structure with the following sections:

1. LESSONS TABLE (4-6 lessons per chapter):
Each lesson should have:
- Lesson ID (e.g., "1.1", "1.2")
- Lesson/Topic Name
- Learning Goal (what they'll learn)
- YouTube Video Recommendation (specific video title/topic)
- Resources/Notes (downloadable resource suggestion)

2. KEY CONCEPTS:
- List 5-7 fundamental concepts specific to this chapter

3. LEARNING OUTCOMES:
- List 4-5 specific skills/knowledge they'll gain

4. PRACTICAL EXERCISES:
- Suggest 2-3 hands-on exercises or projects

5. RESOURCES:
- Recommend 3-4 books, websites, or tools

RESPONSE FORMAT (Return ONLY valid JSON, no markdown):
{
  "chapterTitle": "Full chapter title",
  "lessons": [
    {
      "id": "1.1",
      "topic": "Lesson topic name",
      "learningGoal": "Clear learning objective",
      "youtubeVideo": "Specific video title/topic to search",
      "resources": "Resource/PDF/Tool recommendation"
    }
  ],
  "keyConcepts": ["Concept 1", "Concept 2", ...],
  "learningOutcomes": ["Outcome 1", "Outcome 2", ...],
  "practicalExercises": [
    {
      "title": "Exercise title",
      "description": "Brief description",
      "difficulty": "beginner|intermediate|advanced"
    }
  ],
  "resources": [
    {
      "title": "Resource title",
      "type": "book|website|tool|article",
      "description": "Short description"
    }
  ]
}`;

    console.log('📤 Sending request to Gemini for chapter details...');
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log('✅ Gemini response received');

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('Could not parse JSON from Gemini response');
      return res.json(generateFallbackChapterContent(chapterTitle, courseTitle));
    }

    const chapterContent = JSON.parse(jsonMatch[0]);
    
    // Ensure all required fields exist
    const validatedContent = {
      chapterTitle: chapterContent.chapterTitle || chapterTitle,
      lessons: (chapterContent.lessons || []).map(lesson => ({
        id: lesson.id || '',
        topic: lesson.topic || '',
        learningGoal: lesson.learningGoal || '',
        youtubeVideo: lesson.youtubeVideo || '',
        resources: lesson.resources || ''
      })),
      keyConcepts: chapterContent.keyConcepts || [],
      learningOutcomes: chapterContent.learningOutcomes || [],
      practicalExercises: chapterContent.practicalExercises || [],
      resources: chapterContent.resources || [],
      source: 'gemini'
    };

    console.log('✅ Chapter details generated successfully from Gemini');
    res.json(validatedContent);

  } catch (error) {
    console.error('Error generating chapter details:', error);
    // Return fallback on error
    res.json(generateFallbackChapterContent(chapterTitle, courseTitle));
  }
});

// Fallback function for chapter content
function generateFallbackChapterContent(chapterTitle, courseTitle) {
  return {
    chapterTitle: chapterTitle,
    lessons: [
      {
        id: '1.1',
        topic: `Introduction to ${chapterTitle}`,
        learningGoal: `Understand the fundamentals of ${chapterTitle}`,
        youtubeVideo: `${chapterTitle} Introduction`,
        resources: 'PDF: Chapter Overview & Glossary'
      },
      {
        id: '1.2',
        topic: `Core Concepts of ${chapterTitle}`,
        learningGoal: `Master the essential concepts`,
        youtubeVideo: `${chapterTitle} Explained in Depth`,
        resources: 'Study Guide: Key Terms & Definitions'
      },
      {
        id: '1.3',
        topic: 'Practical Application',
        learningGoal: `Apply concepts to real-world scenarios`,
        youtubeVideo: `${chapterTitle} Real-World Examples`,
        resources: 'Project Template & Code Examples'
      }
    ],
    keyConcepts: [
      `Foundation of ${chapterTitle}`,
      `Core Principles`,
      `Best Practices`,
      `Common Challenges`,
      `Advanced Techniques`
    ],
    learningOutcomes: [
      `Understand the fundamentals of ${chapterTitle}`,
      `Apply practical techniques`,
      `Troubleshoot common issues`,
      `Implement best practices`
    ],
    practicalExercises: [
      {
        title: 'Beginner Exercise',
        description: `Start with basic ${chapterTitle} concepts`,
        difficulty: 'beginner'
      },
      {
        title: 'Intermediate Project',
        description: `Build a ${chapterTitle} project combining multiple concepts`,
        difficulty: 'intermediate'
      }
    ],
    resources: [
      {
        title: `${courseTitle} Official Documentation`,
        type: 'website',
        description: 'Comprehensive reference guide'
      },
      {
        title: 'Community Resources',
        type: 'website',
        description: 'Forums and discussion boards'
      }
    ],
    source: 'fallback',
    note: 'Enable Gemini API for AI-powered detailed content'
  };
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CodeFlux Backend running on http://localhost:${PORT}`);
  console.log('✅ Google OAuth configured');
  console.log(`📧 Make sure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in .env`);
});
