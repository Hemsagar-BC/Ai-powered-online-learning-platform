import { useState, useEffect, useCallback } from 'react'
import GamificationService from '@/lib/gamification.service'

export const useGamification = () => {
  const [streak, setStreak] = useState(null)
  const [xp, setXP] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [rank, setRank] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    try {
      const [streakData, xpData, achievementsData, rankData] = await Promise.all([
        GamificationService.getStreakInfo(),
        GamificationService.getXPInfo(),
        GamificationService.getAchievements(),
        GamificationService.getUserRank()
      ])
      setStreak(streakData)
      setXP(xpData)
      setAchievements(achievementsData)
      setRank(rankData)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addXP = useCallback(async (amount, reason) => {
    try {
      const result = await GamificationService.addXP(amount, reason)
      await fetchAll()
      return result
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [fetchAll])

  const unlockAchievement = useCallback(async (achievementId) => {
    try {
      const result = await GamificationService.unlockAchievement(achievementId)
      await fetchAll()
      return result
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [fetchAll])

  return {
    streak,
    xp,
    achievements,
    rank,
    isLoading,
    error,
    fetchAll,
    addXP,
    unlockAchievement
  }
}

export default useGamification
