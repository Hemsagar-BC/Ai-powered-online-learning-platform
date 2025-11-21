import { differenceInDays, format, parseISO } from 'date-fns'

/**
 * Format date to YYYY-MM-DD for Firestore
 */
export const formatDateForDb = (date = new Date()) => {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Calculate days since last study
 */
export const daysSinceLastStudy = (lastStudyDate) => {
  if (!lastStudyDate) return null
  try {
    return differenceInDays(new Date(), parseISO(lastStudyDate))
  } catch {
    return null
  }
}

/**
 * Check if study happened today
 */
export const isStudyToday = (lastStudyDate) => {
  return daysSinceLastStudy(lastStudyDate) === 0
}

/**
 * Check if study happened yesterday
 */
export const isStudyYesterday = (lastStudyDate) => {
  return daysSinceLastStudy(lastStudyDate) === 1
}

/**
 * Format seconds to MM:SS
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

/**
 * Get date string (e.g., "Today", "Yesterday", "Jan 15")
 */
export const getRelativeDate = (date) => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const dateObj = parseISO(date)
  
  if (format(dateObj, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
    return 'Today'
  }
  if (format(dateObj, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
    return 'Yesterday'
  }
  
  return format(dateObj, 'MMM dd')
}

/**
 * Get week start date (Monday)
 */
export const getWeekStart = (date = new Date()) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return format(new Date(d.setDate(diff)), 'yyyy-MM-dd')
}

/**
 * Check if streak should be frozen on date
 */
export const shouldFreeze = (freezeUsedDate) => {
  if (!freezeUsedDate) return false
  const daysSinceFroze = daysSinceLastStudy(freezeUsedDate)
  return daysSinceFroze !== null && daysSinceFroze <= 1
}
