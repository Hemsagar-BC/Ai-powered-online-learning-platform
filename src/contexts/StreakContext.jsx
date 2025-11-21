import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  doc,
  increment,
  Timestamp,
  onSnapshot
} from 'firebase/firestore'
import { db as firestore } from '../lib/firebase'
import {
  formatDateForDb,
  daysSinceLastStudy,
  isStudyToday,
  isStudyYesterday
} from '../lib/dateUtils'

const StreakContext = createContext()

export function StreakProvider({ children }) {
  const { user } = useAuth()
  const [streak, setStreak] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Listen to streak changes
  useEffect(() => {
    if (!user?.uid) {
      setStreak(null)
      setLoading(false)
      return
    }

    const streakRef = doc(firestore, 'streaks', user.uid)
    const unsubscribe = onSnapshot(
      streakRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setStreak(snapshot.data())
        } else {
          setStreak(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error('Streak listener error:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [user?.uid])

  // Update streak after study session
  const updateStreak = useCallback(
    async (sessionDurationMinutes) => {
      if (!user?.uid) return

      try {
        // Minimum 10 minutes to count
        if (sessionDurationMinutes < 10) {
          console.log('Session too short to update streak')
          return
        }

        const today = formatDateForDb()
        const streakRef = doc(firestore, 'streaks', user.uid)
        const streakSnap = await getDoc(streakRef)

        if (!streakSnap.exists()) {
          // First session - create streak
          await setDoc(streakRef, {
            current: 1,
            longest: 1,
            lastStudyDate: today,
            totalStudyDays: 1,
            freezesAvailable: 0,
            freezeUsedDate: null,
            studyDays: { [today]: true },
            createdAt: Timestamp.now()
          })
          console.log('Streak created for first time')
          return
        }

        const streakData = streakSnap.data()
        const lastDate = streakData.lastStudyDate
        const daysSince = daysSinceLastStudy(lastDate)

        if (daysSince === 0) {
          // Already studied today - no change
          console.log('Already studied today')
          return
        }

        if (daysSince === 1) {
          // Continue streak
          const newCurrent = streakData.current + 1
          const newLongest = Math.max(newCurrent, streakData.longest)
          const freezeEarned = newCurrent > 0 && newCurrent % 7 === 0

          await updateDoc(streakRef, {
            current: newCurrent,
            longest: newLongest,
            lastStudyDate: today,
            totalStudyDays: increment(1),
            freezesAvailable: freezeEarned ? increment(1) : streakData.freezesAvailable,
            [`studyDays.${today}`]: true
          })
          console.log(`Streak continued: ${newCurrent} days`)

          // Show milestone notification
          if (freezeEarned) {
            console.log(`🎉 Milestone! Earned a freeze at ${newCurrent} days`)
          }
        } else {
          // Days missed - check for freeze
          if (streakData.freezesAvailable > 0) {
            // Use freeze
            await updateDoc(streakRef, {
              freezesAvailable: increment(-1),
              freezeUsedDate: today,
              lastStudyDate: today,
              totalStudyDays: increment(1),
              [`studyDays.${today}`]: true
            })
            console.log('Freeze used to maintain streak')
          } else {
            // Streak broken - reset to 1
            await updateDoc(streakRef, {
              current: 1,
              lastStudyDate: today,
              totalStudyDays: increment(1),
              freezeUsedDate: null,
              [`studyDays.${today}`]: true
            })
            console.log('Streak broken and reset to 1')
          }
        }
      } catch (err) {
        console.error('Error updating streak:', err)
        throw err
      }
    },
    [user?.uid]
  )

  // Use freeze manually
  const useFreeze = useCallback(async () => {
    if (!user?.uid || !streak || streak.freezesAvailable <= 0) return

    try {
      const today = formatDateForDb()
      const streakRef = doc(firestore, 'streaks', user.uid)

      await updateDoc(streakRef, {
        freezesAvailable: increment(-1),
        freezeUsedDate: today,
        lastStudyDate: today
      })
      console.log('Freeze used manually')
    } catch (err) {
      console.error('Error using freeze:', err)
      throw err
    }
  }, [user?.uid, streak])

  // Get streak info
  const getStreakInfo = useCallback(() => {
    if (!streak) {
      return {
        current: 0,
        longest: 0,
        total: 0,
        freezes: 0,
        lastStudy: null,
        streakActive: false
      }
    }

    return {
      current: streak.current || 0,
      longest: streak.longest || 0,
      total: streak.totalStudyDays || 0,
      freezes: streak.freezesAvailable || 0,
      lastStudy: streak.lastStudyDate || null,
      streakActive: !isStudyToday(streak.lastStudyDate) ? false : true
    }
  }, [streak])

  const value = {
    streak,
    loading,
    error,
    updateStreak,
    useFreeze,
    getStreakInfo
  }

  return (
    <StreakContext.Provider value={value}>{children}</StreakContext.Provider>
  )
}

export function useStreak() {
  const context = useContext(StreakContext)
  if (!context) {
    throw new Error('useStreak must be used within StreakProvider')
  }
  return context
}
