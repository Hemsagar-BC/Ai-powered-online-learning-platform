import { useEffect, useRef, useState, useCallback } from 'react'

const TIMER_MODES = {
  pomodoro: 25 * 60,  // 25 minutes
  extended: 50 * 60,  // 50 minutes
  custom: null
}

/**
 * Custom hook for managing study timer state and logic
 */
export function useTimer(initialMode = 'pomodoro', customMinutes = 25) {
  const [mode, setMode] = useState(initialMode)
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES[initialMode])
  const [isRunning, setIsRunning] = useState(false)
  const [initialTime, setInitialTime] = useState(TIMER_MODES[initialMode])
  const intervalRef = useRef(null)

  // Switch timer mode
  const switchMode = useCallback((newMode) => {
    if (isRunning) return // Don't switch while running
    
    const newTime = newMode === 'custom' ? customMinutes * 60 : TIMER_MODES[newMode]
    setMode(newMode)
    setTimeLeft(newTime)
    setInitialTime(newTime)
  }, [isRunning, customMinutes])

  // Toggle timer
  const toggleTimer = useCallback(() => {
    setIsRunning(prev => !prev)
  }, [])

  // Stop timer and return elapsed time
  const stopTimer = useCallback(() => {
    setIsRunning(false)
    return initialTime - timeLeft // Return elapsed seconds
  }, [initialTime, timeLeft])

  // Reset timer
  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(initialTime)
  }, [initialTime])

  // Timer effect
  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timer finished
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  // Progress percentage
  const progress = ((initialTime - timeLeft) / initialTime) * 100

  return {
    timeLeft,
    isRunning,
    mode,
    progress,
    switchMode,
    toggleTimer,
    stopTimer,
    resetTimer,
    elapsedSeconds: initialTime - timeLeft,
    initialTime
  }
}

/**
 * Custom hook for managing study session history
 */
export function useStudySessions(userId, firestore, collection, query, getDocs, where) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) return

    const fetchSessions = async () => {
      try {
        setLoading(true)
        const q = query(
          collection(firestore, 'studySessions'),
          where('userId', '==', userId)
        )
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setSessions(data.sort((a, b) => b.timestamp - a.timestamp))
      } catch (err) {
        console.error('Error fetching sessions:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [userId, firestore, collection, getDocs, query, where])

  return { sessions, loading, error }
}
