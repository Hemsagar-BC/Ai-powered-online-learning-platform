// App Constants
export const APP_NAME = 'CodeFlux'
export const APP_VERSION = '1.0.0'
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:id',
  CHAPTER: '/courses/:courseId/chapters/:chapterId',
  QUIZ: '/courses/:courseId/quizzes/:quizId',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  COMMUNITY: '/community',
  STUDY_ROOM: '/study-room'
}

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  STUDENT: 'student'
}

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
}

// Quiz Types
export const QUIZ_TYPES = {
  MULTIPLE_CHOICE: 'multiple-choice',
  TRUE_FALSE: 'true-false',
  SHORT_ANSWER: 'short-answer',
  ESSAY: 'essay'
}

// Achievement Types
export const ACHIEVEMENT_TYPES = {
  BADGE: 'badge',
  TROPHY: 'trophy',
  MILESTONE: 'milestone',
  STREAK: 'streak'
}

// Achievement Rarities
export const ACHIEVEMENT_RARITY = {
  COMMON: 'common',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
}

// Toast Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
}

// Learning Goals
export const LEARNING_GOALS = {
  DAILY_MINUTES: 30,
  WEEKLY_HOURS: 7,
  MONTHLY_COURSES: 1
}

// Colors
export const COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#6366f1',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#0ea5e9'
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE: 1
}
