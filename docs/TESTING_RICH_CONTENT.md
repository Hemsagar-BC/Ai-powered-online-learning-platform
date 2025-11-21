# Rich Content Testing Guide

## Quick Start

### Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5175`
- Both servers should show no errors

### Step-by-Step Testing

#### 1. Login to Application
```
1. Go to http://localhost:5175
2. Click "Sign in with Google" button
3. Complete Google OAuth flow
4. Should redirect to Dashboard
```

#### 2. Generate Course with Rich Content
```
1. On Dashboard, click "Create Course" button
2. Fill in form with:
   - Title: "Python Web Development" (or your choice)
   - Description: "Learn to build web apps with Python and Django"
   - Chapters: 5
   - Difficulty: "Intermediate"
   - Category: "Programming"
3. Click "Generate Course"
4. Wait 5-10 seconds for Gemini to generate content
5. Click "Start Learning" button
```

#### 3. View Course Overview
```
1. Course page shows:
   ✓ Course title and description
   ✓ Duration: "7.5 hours" (5 chapters × 1.5 hours)
   ✓ Chapter count: "5"
   ✓ Difficulty: "Intermediate"
   ✓ Category: "Programming"
   ✓ Learning objectives listed
   ✓ All 5 chapters displayed as cards
2. Chapters should be clickable (hover shows cursor pointer)
```

#### 4. Navigate to Chapter Detail Page
```
1. Click first chapter card on CourseOverview
2. Page should load (shows loading spinner briefly)
3. Verify you're on correct URL: http://localhost:5175/course/course-XXXX/chapter/1
```

#### 5. Test Chapter Detail Features

##### A. Header and Navigation
```
✓ Back button takes you to course overview
✓ Chapter title shows at top
✓ Course title shows below
✓ Metadata shows: Chapter number, difficulty, category
```

##### B. Detailed Content Section
```
1. "Detailed Content" section should be expanded by default
2. Contains 5-7 paragraphs of rich content about the topic
3. Click section header to collapse/expand (chevron rotates)
4. Content shows explanations, examples, and practical use cases
```

##### C. Key Points Section
```
1. Shows 3 key points with green checkmark icons
2. Each point is highlighted with semi-transparent background
3. Points are specific to the chapter topic
Example: 
  ✓ Understanding Python fundamentals and syntax
  ✓ Building scalable web applications with Django
  ✓ Deploying applications to production environments
```

##### D. Learning Roadmap Section
```
1. Shows expandable "Learning Roadmap" section
2. Displays course-level learning path:
  1. Start with: Foundational concepts
  2. Progress to: Intermediate applications
  3. Master: Advanced techniques and best practices
3. Shows step-by-step progression with numbered circles
4. Each step has connecting line visualization
```

##### E. Study Notes Section
```
1. "Study Notes" section shows three subsections:
   - Main Concepts: Listed with bullet points
   - Common Mistakes: What to avoid when learning this
   - Best Practices: Industry standards and tips
2. Each subsection has clear dividers
3. Content is specific to the chapter topic
```

##### F. Video Suggestions (Sidebar)

**Featured Video Area:**
```
1. Shows "Featured Video" section
2. Displays first video by default:
   - Video title
   - Channel name
   - Duration
   - Type badge (⭐ Best, 💎 Popular, or none for supplementary)
3. "Watch on YouTube" button
4. Clicking button opens YouTube search in new tab
```

**Video List:**
```
1. "Suggested Videos" section shows 3 videos
2. Each video has:
   - YouTube icon (red)
   - Video title (2-line truncated)
   - Channel name
   - Duration
   - Type badge (⭐ Best / 💎 Popular)
3. Video rows highlight when hovered
4. Current selected video has darker background
5. Clicking a video:
   - Highlights that video
   - Updates featured video preview
   - Keeps scroll position
```

##### G. Source Links
```
1. "Source Links" section shows 3 links
2. Each link has:
   - External link icon
   - Full URL (truncated on small screens)
   - Hover effect
3. Clicking opens in new tab
```

#### 6. Interactive Testing

##### Test Video Selection
```
1. Click different videos in the suggested list
2. Verify featured video updates each time
3. Watch YouTube button changes for each video
4. Check URL search query changes appropriately
```

##### Test Collapsible Sections
```
1. Collapse "Detailed Content" - should hide content
2. Expand "Detailed Content" - should show content again
3. Repeat for all sections (Roadmap, Notes, Videos, Sources)
4. Verify chevron rotates on toggle
```

##### Test Responsive Design
```
1. On desktop: Should see 2-column layout (main + sidebar)
2. On tablet: May compress to single column
3. On mobile: Definitely single column, sidebar appears below
4. All content should remain readable and functional
```

#### 7. Navigation Testing
```
1. Click back button → Returns to CourseOverview
2. Click different chapters → ChapterDetail loads for each
3. URL changes correctly for each chapter
4. Browser back button works
5. Page loads instantly (from localStorage)
```

#### 8. Error Handling Testing

##### Test with Missing Data
```
1. Try accessing chapter with invalid course ID in URL
2. Should show "Chapter Not Found" message
3. "Back to Dashboard" button works
```

##### Test Video Search
```
1. Click "Watch on YouTube" for each video
2. Should search for "{title} {channel}"
3. Results page shows related videos
```

## Expected Results Summary

### Content Accuracy
- ✅ All content is relevant to the course topic
- ✅ No generic placeholder text
- ✅ Gemini personalization evident in content
- ✅ Chapter progression makes sense (basic → advanced)

### Functionality
- ✅ All sections load and display correctly
- ✅ Toggle functionality works smoothly
- ✅ Video selection responsive and instant
- ✅ Links open in new tabs
- ✅ No console errors

### UI/UX
- ✅ Dark theme consistent throughout
- ✅ Color coding helps identify section types
- ✅ Icons clear and intuitive
- ✅ Badges help identify video types
- ✅ Responsive and adapts to screen size

### Performance
- ✅ Chapter loads in <1 second
- ✅ All interactions instant
- ✅ No lag or stuttering
- ✅ Smooth transitions and animations

## Debugging Tips

### If Chapter Doesn't Load
1. Check browser console (F12 → Console)
2. Verify course exists in localStorage:
   ```javascript
   console.log(JSON.parse(localStorage.getItem('generatedCourses')))
   ```
3. Check network tab - no 404 errors
4. Verify courseId and chapterId in URL match

### If Gemini Content Missing
1. Check `server/index.js` logs for API response
2. Look for "fallback" message - indicates Gemini failed
3. Verify GEMINI_API_KEY is set in backend
4. Check Generative Language API is enabled in Google Cloud

### If Videos Don't Show
1. Verify Gemini returned `youtubeVideos` array
2. Check browser console for any parsing errors
3. Ensure YouTube link search works (try manually)

### If Styling Looks Off
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh page (Ctrl+Shift+R)
3. Verify lucide-react installed: `npm list lucide-react`
4. Check Tailwind CSS loaded in index.html

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Chapter shows "Not Found" | Course not in localStorage | Generate course again |
| Content is generic placeholder | Gemini API failed | Check GEMINI_API_KEY, check API enabled |
| Videos don't appear | Missing youtubeVideos in response | Check Gemini prompt response structure |
| YouTube links don't work | Search query issue | Test with simpler video title |
| Styling broken | Tailwind not loaded | npm install, rebuild |
| Videos sidebar empty | Chapter has no youtubeVideos | Regenerate course |
| Section won't collapse | State issue | Refresh page |

## Test Scenarios

### Scenario 1: First-time User
```
1. Login → Dashboard → Create Course
2. Fill course form
3. Wait for generation
4. View course overview
5. Click first chapter
6. Explore all features
Expected: Smooth flow, all content loads correctly
```

### Scenario 2: Video Exploration
```
1. Open chapter detail
2. Click each video suggestion
3. Click "Watch on YouTube"
4. Go back from YouTube
Expected: All videos clickable, YouTube opens correctly
```

### Scenario 3: Multi-Chapter Review
```
1. Open chapter 1, review content
2. Go back to course
3. Open chapter 3, review content
4. Go back, open chapter 5
Expected: Each chapter loads fresh, no data mixing
```

### Scenario 4: Mobile Experience
```
1. Open on mobile device or mobile view
2. Scroll through all sections
3. Click videos, expand sections
4. Try videos and links
Expected: Responsive, readable, fully functional
```

## Verification Checklist

- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 5175)
- [ ] Can login with Google
- [ ] Can generate course with all fields
- [ ] Course overview shows all metadata
- [ ] Can click chapters to load detail
- [ ] Detailed content displays (5+ paragraphs)
- [ ] Key points show with correct styling
- [ ] Learning roadmap shows visual steps
- [ ] Study notes have 3 subsections
- [ ] Videos appear in sidebar
- [ ] Featured video updates when clicked
- [ ] YouTube links work correctly
- [ ] Source links open in new tab
- [ ] All sections toggle on/off
- [ ] Back button works
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] No broken images
- [ ] Fast load times

## Success Metrics

✅ **All tests pass** = Complete rich content implementation success!

## What to Try Next

1. Generate multiple courses with different topics
2. Test with various difficulties and categories
3. Try on different devices/browsers
4. Share with team for feedback
5. Document any issues for refinement
6. Plan for video playback API integration
7. Consider adding user notes/annotations

---

**Happy Testing!** 🚀
