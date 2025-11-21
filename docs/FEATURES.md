# 🎯 Features Guide

Complete documentation of all CodeFlux features and how to use them.

## Table of Contents
1. [User Authentication](#user-authentication)
2. [Course Generation](#course-generation)
3. [Course Management](#course-management)
4. [Quiz System](#quiz-system)
5. [Dashboard](#dashboard)
6. [Community Features](#community-features)

---

## User Authentication

### Sign In with Google

**How it works:**
1. Click "Sign In" or "Get Started" button
2. Google authentication dialog appears
3. Select your Google account
4. CodeFlux creates your user profile

**What happens:**
- Your profile is stored in Firebase
- Your courses are linked to your account
- You can access CodeFlux from any device

**Features:**
- ✅ One-click sign in
- ✅ Secure with Google
- ✅ Profile picture & name auto-filled
- ✅ No password to remember

---

## Course Generation

### Create Your First Course

**Step 1: Access Course Creation**
- Navigate to Dashboard
- Click "+ Create Course" button

**Step 2: Fill Course Details**
```
Course Title:     e.g., "React Advanced Patterns"
Description:      What the course is about
Difficulty Level: Beginner / Intermediate / Advanced
```

**Step 3: AI Generation**
- CodeFlux uses Gemini AI to generate:
  - Chapter structure
  - Lesson content
  - Key concepts
  - Learning objectives

**Step 4: Review & Save**
- Review generated content
- Make edits if needed
- Click "Save Course"
- Course appears in "My Learning"

### Generated Course Structure

Each course includes:

```
Course
├── Chapter 1
│   ├── Lesson 1
│   │   ├── Content
│   │   ├── Key Points
│   │   └── Resources
│   ├── Lesson 2
│   └── ...
├── Chapter 2
└── ...
```

### Course Topics You Can Generate

✅ Programming (Python, JavaScript, Java, etc.)
✅ Web Development (React, Vue, Angular)
✅ Data Science & ML
✅ Design (UI/UX, Graphic Design)
✅ Business (Marketing, Product Management)
✅ Soft Skills (Communication, Leadership)
✅ Languages
✅ And many more!

---

## Course Management

### My Learning Page

View all your courses:
- ✅ Courses you created
- ✅ Courses you enrolled in
- ✅ Your progress on each course
- ✅ Continue button to resume

### Course Progress

- **Progress Bar** - Visual indicator of completion
- **Continue Button** - Resume where you left off
- **Delete Button** - Remove course from your list

### Explore Page

Browse pre-generated courses:
- React Fundamentals
- Python for Beginners
- Web Design Essentials
- *More coming soon!*

Click "Enroll" to add to your learning journey.

---

## Quiz System

### Quiz Center

Access quizzes:
1. Navigate to "Quiz Center" in sidebar
2. Select a course you're enrolled in
3. Click "Start Quiz"

### How Quizzes Work

**Features:**
- 12 multiple-choice questions
- AI-generated from course content
- Explanations for each answer
- Visual progress tracking
- Detailed results

**Question Types:**
```
Q1: [A] [ ] [ ] [ ]
Q2: [ ] [B] [ ] [ ]
...
```

### Quiz Interface

**Navigation:**
- Question grid for quick navigation
- Previous/Next buttons
- Submit button (validates all answered)
- Progress percentage

**Display:**
- Current question number
- Total questions (Q3/12)
- Question content
- 4 answer options

### Quiz Results

After completing quiz:

**Score Breakdown:**
- Correct answers (Pie chart)
- Incorrect answers
- Percentage score
- Visual feedback

**Detailed Analysis:**
- Performance by question
- Bar chart showing difficulty
- Explanations for wrong answers
- Correct answer indicators

**Actions:**
- Retake Quiz
- Back to My Learning

---

## Dashboard

### Dashboard Overview

**Welcome Section:**
- Personalized greeting
- Your learning streak (🔥)
- Quick access to create course

**Stats Cards:**
- Active Courses
- Learning Streak
- Daily Goal

### Learning Progress

**Today's Goal:**
- Visual progress bar
- Minutes learned / Target
- Motivational message

**Continue Learning:**
- Your top 5 active courses
- Progress percentage for each
- Next chapter to complete

### Streak System

**Current Streak:**
- Number of consecutive days learning
- Fire emoji 🔥
- Motivational messages

**Freeze Feature:**
- Maintain streaks even if you miss a day
- Limited freezes available
- Use wisely!

---

## Community Features

### Community Page

Connect with learners:
- ✅ View community posts
- ✅ Share your learning journey
- ✅ Ask questions
- ✅ Help others
- ✅ Find study buddies

### Sharing Progress

- Share completed courses
- Post learning tips
- Ask for help
- Celebrate milestones

---

## Profile & Settings

### Profile Page

View & edit:
- Profile picture
- Display name
- Email
- Learning statistics
- Joined date

### Settings Page

Customize experience:
- **Theme:** Dark mode / Light mode
- **Notifications:** On / Off
- **Language:** English / More coming
- **Privacy:** Control data visibility

### Account Management

- ✅ Update profile information
- ✅ Change theme preference
- ✅ Manage notifications
- ✅ View learning history
- ✅ Sign out

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Open command palette |
| `Esc` | Close modal |
| `→` | Next question in quiz |
| `←` | Previous question in quiz |

---

## Tips & Tricks

### Maximize Learning

1. **Set a daily goal** - Aim for 30+ minutes daily
2. **Maintain your streak** - Consistency is key
3. **Complete quizzes** - Test your knowledge
4. **Review mistakes** - Learn from errors
5. **Share progress** - Stay motivated with community

### Use AI Wisely

- ✅ Generate courses on topics you're curious about
- ✅ Use generated content as starting point
- ✅ Supplement with external resources
- ✅ Take quizzes regularly

---

See [Troubleshooting](./TROUBLESHOOTING.md) if features aren't working as expected.
