import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { db } from './firebase'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { formatDateForDb } from './dateUtils'

export const useStudyTimer = () => {
  const [todayStudyTime, setTodayStudyTime] = useState(0)
  const [isTracking, setIsTracking] = useState(true)
  const auth = getAuth()

  useEffect(() => {
    if (!auth.currentUser) return

    const userId = auth.currentUser.uid
    const today = formatDateForDb()
    let sessionStartTime = Date.now()
    let timerInterval = null
    let baseTime = 0 // Time accumulated from previous session

    // Initialize study session
    const initializeSession = async () => {
      try {
        // Get today's study time from Firestore
        const sessionRef = doc(db, `users/${userId}/studySessions/${today}`)
        const snapshot = await getDoc(sessionRef)
        
        if (snapshot.exists()) {
          // Session exists, load accumulated time
          const sessionData = snapshot.data()
          baseTime = sessionData.duration || 0
          setTodayStudyTime(baseTime)
        } else {
          // Create new session
          await setDoc(sessionRef, {
            date: today,
            startTime: new Date().toISOString(),
            duration: 0,
            userId: userId
          })
          baseTime = 0
        }

        sessionStartTime = Date.now()
        setIsTracking(true)

        // Start timer - update every second
        timerInterval = setInterval(async () => {
          const elapsedSeconds = Math.floor((Date.now() - sessionStartTime) / 1000)
          const totalDuration = baseTime + elapsedSeconds

          setTodayStudyTime(totalDuration)

          // Update Firestore every 10 seconds
          if (elapsedSeconds % 10 === 0 && elapsedSeconds > 0) {
            try {
              await updateDoc(doc(db, `users/${userId}/studySessions/${today}`), {
                duration: totalDuration,
                lastUpdated: new Date().toISOString()
              })
            } catch (error) {
              console.error('Error updating study session:', error)
            }
          }
        }, 1000)
      } catch (error) {
        console.error('Error initializing study session:', error)
      }
    }

    initializeSession()

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTracking(false)
        // Save time before pausing
        const finalDuration = Math.floor((Date.now() - sessionStartTime) / 1000) + baseTime
        baseTime = finalDuration
      } else {
        setIsTracking(true)
        sessionStartTime = Date.now()
      }
    }

    // Handle unload
    const handleUnload = async () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
      // Save final time
      const finalDuration = Math.floor((Date.now() - sessionStartTime) / 1000) + baseTime
      try {
        await update(ref(firestore, `users/${userId}/studySessions/${today}`), {
          duration: finalDuration,
          lastUpdated: new Date().toISOString()
        })
      } catch (error) {
        console.error('Error saving study time:', error)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleUnload)
      if (timerInterval) clearInterval(timerInterval)
      handleUnload()
    }
  }, [auth.currentUser])

  return { todayStudyTime, isTracking }
}

// Helper function to format seconds to readable time
export const formatStudyTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}
