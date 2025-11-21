import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useStreak } from '../contexts/StreakContext'
import { useTimer } from '../hooks/useTimer'
import { formatTime } from '../lib/dateUtils'
import { db as firestore } from '../lib/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { formatDateForDb } from '../lib/dateUtils'

const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
  'Geography',
  'Economics',
  'Computer Science',
  'Programming',
  'Data Science',
  'Web Development',
  'UI/UX Design',
  'Business',
  'Psychology',
  'Philosophy',
  'Art',
  'Music'
]

export default function StudyTimer() {
  const navigate = useNavigate()
  const { user, showNotification } = useAuth()
  const { updateStreak } = useStreak()
  const [subject, setSubject] = useState('')
  const [sessionName, setSessionName] = useState('')
  const [showSessionEnd, setShowSessionEnd] = useState(false)
  const [sessionDuration, setSessionDuration] = useState(0)
  const [isSavingSession, setIsSavingSession] = useState(false)

  const {
    timeLeft,
    isRunning,
    mode,
    progress,
    switchMode,
    toggleTimer,
    stopTimer,
    resetTimer,
    elapsedSeconds,
    initialTime
  } = useTimer('pomodoro', 25)

  // Play notification sound when timer ends
  useEffect(() => {
    if (timeLeft === 0 && initialTime > 0) {
      playNotification()
      setShowSessionEnd(true)
    }
  }, [timeLeft, initialTime])

  const playNotification = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const handleStopSession = async () => {
    const elapsed = stopTimer()
    const durationMinutes = Math.floor(elapsed / 60)
    setSessionDuration(durationMinutes)
    setShowSessionEnd(true)
  }

  const saveSession = async () => {
    if (!user?.uid) {
      showNotification('User not found', 'error')
      return
    }

    if (sessionDuration === 0) {
      showNotification('Session duration too short', 'error')
      return
    }

    try {
      setIsSavingSession(true)

      // Save session to Firestore
      const sessionRef = await addDoc(collection(firestore, 'studySessions'), {
        userId: user.uid,
        subject: subject || 'Unnamed',
        sessionName: sessionName || `${subject} Session`,
        duration: sessionDuration,
        date: formatDateForDb(),
        startTime: Timestamp.fromMillis(Date.now() - sessionDuration * 60000),
        endTime: Timestamp.now(),
        type: 'solo',
        roomId: null
      })

      // Update streak
      await updateStreak(sessionDuration)

      showNotification(
        `✅ Session saved! 🔥 +${Math.floor(sessionDuration / 25)} Pomodoro(s)`,
        'success'
      )

      // Reset form
      setSubject('')
      setSessionName('')
      setShowSessionEnd(false)
      resetTimer()

      // Return to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (err) {
      console.error('Error saving session:', err)
      showNotification('Failed to save session. Please try again.', 'error')
    } finally {
      setIsSavingSession(false)
    }
  }

  const discardSession = () => {
    setShowSessionEnd(false)
    setSessionDuration(0)
    resetTimer()
    setSubject('')
    setSessionName('')
  }

  if (showSessionEnd) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Session Complete Card */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Great job!</h2>
              <p className="text-gray-600">You completed a study session</p>
            </div>

            {/* Session Stats */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Subject</p>
                  <p className="text-lg font-semibold text-gray-900">{subject || 'General'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">{sessionDuration} min</p>
                </div>
              </div>
            </div>

            {/* Save Options */}
            <div className="space-y-3">
              <button
                onClick={saveSession}
                disabled={isSavingSession}
                className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {isSavingSession ? 'Saving...' : '✅ Save Session'}
              </button>
              <button
                onClick={discardSession}
                disabled={isSavingSession}
                className="w-full px-6 py-4 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-white mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 hover:opacity-80 transition-all mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold">Study Timer</h1>
          <p className="text-white/80">Focus. Study. Track.</p>
        </div>

        {/* Main Timer Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 backdrop-blur-sm bg-white/95">
          {/* Mode Selector */}
          <div className="flex gap-3 mb-8">
            {[
              { mode: 'pomodoro', label: '25/5', desc: 'Pomodoro' },
              { mode: 'extended', label: '50/10', desc: 'Extended' }
            ].map(({ mode: m, label, desc }) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                disabled={isRunning}
                className={`flex-1 p-4 rounded-lg transition-all font-semibold ${
                  mode === m
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-sm opacity-75">{label}</div>
                <div className="text-lg">{desc}</div>
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="text-center mb-8">
            <div className="relative w-48 h-48 mx-auto mb-4">
              {/* Circular Progress */}
              <svg className="absolute inset-0" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeDasharray={`${(progress / 100) * 282.6} 282.6`}
                  strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Time Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-gray-900">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {progress.toFixed(0)}% Complete
                </div>
              </div>
            </div>
          </div>

          {/* Subject & Session Name */}
          {!isRunning && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="">Select a subject...</option>
                  {SUBJECTS.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Name (optional)
                </label>
                <input
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="e.g., Chapter 5 Review"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </>
          )}

          {/* Controls */}
          <div className="flex gap-3">
            <button
              onClick={toggleTimer}
              className="flex-1 px-6 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg transition-all"
            >
              {isRunning ? '⏸ Pause' : '▶ Start'}
            </button>
            <button
              onClick={handleStopSession}
              className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            >
              ⏹ Stop
            </button>
            <button
              onClick={resetTimer}
              disabled={isRunning}
              className="flex-1 px-6 py-4 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 disabled:opacity-50 transition-all"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
          <h3 className="font-semibold mb-3">💡 Pro Tips</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>• Minimum 10 minutes to count towards your streak</li>
            <li>• Complete onboarding to unlock all features</li>
            <li>• Use study sessions to build consistency</li>
            <li>• Earn freezes every 7-day streak</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
