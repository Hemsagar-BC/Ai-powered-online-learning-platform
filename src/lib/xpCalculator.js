// XP Rewards Constants
export const XP_REWARDS = {
  // Learning Activities
  LESSON_COMPLETED: 50,
  CHAPTER_COMPLETED: 100,
  COURSE_COMPLETED: 500,
  QUIZ_PASSED: 75,
  QUIZ_PERFECT_SCORE: 150,
  VIDEO_WATCHED: 25,
  COURSE_CREATED: 200,
  
  // Engagement
  DAILY_LOGIN: 10,
  DAILY_STREAK_BONUS: 5,
  ACHIEVEMENT_UNLOCKED: 100,
  
  // Study Time Bonus (per minute)
  STUDY_SESSION_BASE: 1,
  STUDY_30_MIN_BONUS: 30,
  STUDY_60_MIN_BONUS: 50,
  STUDY_120_MIN_BONUS: 100
}

// XP Calculation
export const calculateXP = (action, metadata = {}) => {
  const xpTable = {
    course_enrollment: 50,
    chapter_completion: 100,
    quiz_submission: 75,
    quiz_perfect_score: 150,
    achievement_unlock: 200,
    first_week_streak: 500,
    course_completion: 1000,
    discussion_post: 25,
    discussion_helpful_answer: 50,
    study_session: 10, // per minute
    lesson_completed: 50,
    course_created: 200,
    daily_login: 10
  }

  let xp = xpTable[action] || 0

  // Bonus multipliers
  if (metadata.streak && metadata.streak > 7) {
    xp *= 1.5 // 50% bonus for week+ streaks
  }

  if (metadata.difficulty === 'hard') {
    xp *= 1.25 // 25% bonus for hard content
  }

  // Study time bonus
  if (action === 'study_session' && metadata.minutes) {
    xp = calculateSessionXP(metadata.minutes)
  }

  return Math.round(xp)
}

// Level Calculation with Thresholds
export const LEVEL_THRESHOLDS = [
  { level: 1, minXP: 0, title: 'Novice', color: 'gray' },
  { level: 2, minXP: 100, title: 'Learner', color: 'blue' },
  { level: 3, minXP: 300, title: 'Scholar', color: 'purple' },
  { level: 4, minXP: 600, title: 'Master', color: 'indigo' },
  { level: 5, minXP: 1200, title: 'Expert', color: 'red' },
  { level: 6, minXP: 2000, title: 'Sage', color: 'yellow' },
  { level: 7, minXP: 3000, title: 'Legend', color: 'pink' },
  { level: 8, minXP: 4500, title: 'Virtuoso', color: 'green' }
]

export const calculateLevel = (totalXP) => {
  let levelInfo = LEVEL_THRESHOLDS[0]
  
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i].minXP) {
      levelInfo = LEVEL_THRESHOLDS[i]
      break
    }
  }
  
  // Get next level
  const currentLevelIndex = LEVEL_THRESHOLDS.findIndex(l => l.level === levelInfo.level)
  const nextLevelXP = currentLevelIndex < LEVEL_THRESHOLDS.length - 1 
    ? LEVEL_THRESHOLDS[currentLevelIndex + 1].minXP 
    : LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].minXP + 1000
  
  return {
    ...levelInfo,
    nextLevelXP,
    xpToNextLevel: Math.max(0, nextLevelXP - totalXP),
    progressToNextLevel: Math.min(100, ((totalXP - levelInfo.minXP) / (nextLevelXP - levelInfo.minXP)) * 100)
  }
}

export const getXPForNextLevel = (totalXP) => {
  const levelInfo = calculateLevel(totalXP)
  return levelInfo.xpToNextLevel
}

// Calculate XP for study session
export const calculateSessionXP = (minutesStudied) => {
  let xp = minutesStudied * XP_REWARDS.STUDY_SESSION_BASE
  
  if (minutesStudied >= 30) xp += XP_REWARDS.STUDY_30_MIN_BONUS
  if (minutesStudied >= 60) xp += XP_REWARDS.STUDY_60_MIN_BONUS
  if (minutesStudied >= 120) xp += XP_REWARDS.STUDY_120_MIN_BONUS
  
  return xp
}

// Calculate streak bonus
export const calculateStreakBonus = (streakDays) => {
  if (streakDays >= 100) return 500
  if (streakDays >= 30) return 250
  if (streakDays >= 14) return 100
  if (streakDays >= 7) return 50
  return 0
}

// Streak Calculation
export const calculateStreak = (lastActiveDate) => {
  const today = new Date()
  const lastDate = new Date(lastActiveDate)
  const diffTime = today - lastDate
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays === 0 || diffDays === 1 ? 1 : 0
}

// Course Progress
export const calculateCourseProgress = (completedChapters, totalChapters) => {
  if (totalChapters === 0) return 0
  return Math.round((completedChapters / totalChapters) * 100)
}

// Quiz Score Calculation
export const calculateQuizScore = (correctAnswers, totalQuestions, timeBonus = false) => {
  let score = (correctAnswers / totalQuestions) * 100
  if (timeBonus) score *= 1.1 // 10% bonus if completed quickly
  return Math.round(score)
}

// Average Score
export const calculateAverageScore = (scores) => {
  if (scores.length === 0) return 0
  const sum = scores.reduce((a, b) => a + b, 0)
  return Math.round(sum / scores.length)
}

// Completion Rate
export const calculateCompletionRate = (completed, total) => {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

// Achievements
export const ACHIEVEMENTS = {
  FIRST_STEP: { id: 'first_step', name: 'First Step', emoji: '👣', description: 'Complete your first lesson', xpReward: 25 },
  STREAK_MASTER: { id: 'streak_master', name: 'Streak Master', emoji: '🔥', description: 'Maintain a 7-day streak', xpReward: 100 },
  QUIZ_CHAMPION: { id: 'quiz_champion', name: 'Quiz Champion', emoji: '🏆', description: 'Score 100% on a quiz', xpReward: 150 },
  COURSE_CONQUEROR: { id: 'course_conqueror', name: 'Course Conqueror', emoji: '👑', description: 'Complete your first full course', xpReward: 200 },
  DEDICATED_LEARNER: { id: 'dedicated_learner', name: 'Dedicated Learner', emoji: '📚', description: 'Study 10 hours in a week', xpReward: 250 },
  CONTENT_CREATOR: { id: 'content_creator', name: 'Content Creator', emoji: '✨', description: 'Create 5 courses', xpReward: 500 }
}

// Check and unlock achievements
export const checkAchievements = (userStats) => {
  const unlockedAchievements = []
  
  const {
    lessonsCompleted = 0,
    coursesCompleted = 0,
    coursesCreated = 0,
    streakDays = 0,
    totalStudyTime = 0,
    perfectQuizzes = 0,
    achievements = []
  } = userStats
  
  if (lessonsCompleted >= 1 && !achievements.includes('first_step')) {
    unlockedAchievements.push('first_step')
  }
  
  if (streakDays >= 7 && !achievements.includes('streak_master')) {
    unlockedAchievements.push('streak_master')
  }
  
  if (perfectQuizzes >= 1 && !achievements.includes('quiz_champion')) {
    unlockedAchievements.push('quiz_champion')
  }
  
  if (coursesCompleted >= 1 && !achievements.includes('course_conqueror')) {
    unlockedAchievements.push('course_conqueror')
  }
  
  if (totalStudyTime >= 600 && !achievements.includes('dedicated_learner')) { // 10 hours
    unlockedAchievements.push('dedicated_learner')
  }
  
  if (coursesCreated >= 5 && !achievements.includes('content_creator')) {
    unlockedAchievements.push('content_creator')
  }
  
  return unlockedAchievements
}

export const getAchievementDetails = (achievementId) => {
  return ACHIEVEMENTS[achievementId.toUpperCase()] || null
}

export const getAllAchievements = () => {
  return Object.values(ACHIEVEMENTS)
}
