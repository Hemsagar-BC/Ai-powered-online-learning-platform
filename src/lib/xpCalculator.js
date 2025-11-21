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
    study_session: 10 // per minute
  }

  let xp = xpTable[action] || 0

  // Bonus multipliers
  if (metadata.streak && metadata.streak > 7) {
    xp *= 1.5 // 50% bonus for week+ streaks
  }

  if (metadata.difficulty === 'hard') {
    xp *= 1.25 // 25% bonus for hard content
  }

  return Math.round(xp)
}

// Level Calculation
export const calculateLevel = (totalXP) => {
  const xpPerLevel = 1000
  return Math.floor(totalXP / xpPerLevel) + 1
}

export const getXPForNextLevel = (totalXP) => {
  const currentLevel = calculateLevel(totalXP)
  const xpForCurrentLevel = (currentLevel - 1) * 1000
  const xpForNextLevel = currentLevel * 1000
  return xpForNextLevel - totalXP + xpForCurrentLevel
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
