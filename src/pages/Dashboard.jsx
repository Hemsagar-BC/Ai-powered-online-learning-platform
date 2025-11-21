import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useStreak } from '../contexts/StreakContext'
import { signInWithGoogle } from '../lib/firebase'
import { db as firestore } from '../lib/firebase'
import { collection, query, where, getDocs, Timestamp, getDoc, doc } from 'firebase/firestore'
import { formatDateForDb, getRelativeDate } from '../lib/dateUtils'
import CreateCourseModal from '../components/CreateCourseModal'
import StreakWidget from '../components/StreakWidget'
import { getContinueLearningCourses } from '../lib/firebaseCoursesService'

export default function Dashboard(){
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const { streak } = useStreak()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)
  const [isGuestMode, setIsGuestMode] = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const [todaysSessions, setTodaysSessions] = useState(0)
  const [weekSessions, setWeekSessions] = useState(0)
  const [recentSessions, setRecentSessions] = useState([])
  const [loadingStats, setLoadingStats] = useState(false)
  const [courses, setCourses] = useState([])
  const [loadingCourses, setLoadingCourses] = useState(false)

  // Fetch user stats
  useEffect(() => {
    if (!user?.uid) return

    const fetchStats = async () => {
      try {
        setLoadingStats(true)
        const today = formatDateForDb()
        
        // Today's sessions
        const todayQuery = query(
          collection(firestore, 'studySessions'),
          where('userId', '==', user.uid),
          where('date', '==', today)
        )
        const todaySnap = await getDocs(todayQuery)
        const todayMins = todaySnap.docs.reduce((sum, doc) => sum + (doc.data().duration || 0), 0)
        setTodaysSessions(todayMins)

        // Recent sessions (last 5)
        const recentQuery = query(
          collection(firestore, 'studySessions'),
          where('userId', '==', user.uid)
        )
        const recentSnap = await getDocs(recentQuery)
        const sessions = recentSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 5)
        setRecentSessions(sessions)

        // Week sessions
        const weekMins = sessions.reduce((sum, session) => sum + (session.duration || 0), 0)
        setWeekSessions(weekMins)
      } catch (err) {
        console.error('Error fetching stats:', err)
      } finally {
        setLoadingStats(false)
      }
    }

    fetchStats()
  }, [user?.uid])

  // Load courses from Firebase
  useEffect(() => {
    const loadCourses = async () => {
      try {
        if (!user?.email) {
          setLoadingCourses(false)
          return
        }

        setLoadingCourses(true)
        const firebaseCourses = await getContinueLearningCourses(user.email, 5)
        
        if (firebaseCourses.length === 0) {
          const localCourses = JSON.parse(localStorage.getItem('codeflux_courses') || '[]')
          setCourses(localCourses.slice(0, 5))
        } else {
          setCourses(firebaseCourses)
        }
      } catch (error) {
        console.error('Error loading courses:', error)
        const localCourses = JSON.parse(localStorage.getItem('codeflux_courses') || '[]')
        setCourses(localCourses.slice(0, 5))
      } finally {
        setLoadingCourses(false)
      }
    }

    loadCourses()
  }, [user?.email])

  const handleCreateCourse = () => {
    if (!user || user.email === 'demo@codeflux.dev') {
      setShowSignInPrompt(true)
    } else {
      setShowCreateModal(true)
    }
  }

  const handleGoogleSignIn = async () => {
    setSigningIn(true)
    try {
      await signInWithGoogle()
      setShowSignInPrompt(false)
      setShowCreateModal(true)
      setIsGuestMode(false)
    } catch (error) {
      console.error('Sign-in error:', error)
      alert('Sign-in failed. Please try again.')
    } finally {
      setSigningIn(false)
    }
  }

  const handleGuestContinue = () => {
    setIsGuestMode(true)
    setShowSignInPrompt(false)
    setShowCreateModal(true)
  }

  // Check if onboarding is completed
  useEffect(() => {
    if (user?.uid && !loading) {
      const checkOnboarding = async () => {
        try {
          // Add retry logic for offline handling
          let retries = 0
          const maxRetries = 3
          let lastError
          
          while (retries < maxRetries) {
            try {
              const userDoc = await (async () => {
                const { getDoc, doc } = await import('firebase/firestore')
                return getDoc(doc(firestore, 'users', user.uid))
              })()
              
              const userData = userDoc.data?.()
              if (!userData?.onboardingCompleted) {
                navigate('/onboarding')
              }
              return // Success, exit retry loop
            } catch (err) {
              lastError = err
              retries++
              if (retries < maxRetries) {
                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * retries))
              }
            }
          }
          
          if (lastError) {
            console.error('Error checking onboarding after retries:', lastError)
            // Still try to proceed, user will be redirected if needed
          }
        } catch (err) {
          console.error('Error checking onboarding:', err)
          // Don't block the dashboard if Firebase is unavailable
        }
      }
      checkOnboarding()
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Welcome back 👋</h1>
          <p className="text-slate-500">{user?.displayName || 'Learner'}, continue your learning journey</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
            <span className="text-2xl">🔥</span>
            <span className="font-bold text-lg text-orange-600">9</span>
          </div>
          <button 
            onClick={handleCreateCourse}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            + Create Course
          </button>
        </div>
      </div>

      {/* Sign In Prompt Modal */}
      {showSignInPrompt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 relative">
            <button 
              onClick={() => setShowSignInPrompt(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition text-2xl"
            >
              ✕
            </button>
            
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Login or Sign Up</h2>
              <p className="text-slate-600">Get started with CodeFlux today</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <p className="text-sm text-slate-600 text-center">
                Sign in to unlock course creation, save your progress, and join the learning community!
              </p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>🔵</span> {signingIn ? 'Signing In...' : 'Login'}
              </button>

              <button 
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 transition font-semibold text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>➕</span> {signingIn ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <section className="grid grid-cols-5 gap-6 mb-8">
        <StreakWidget />
        <div className="card">
          <h3 className="text-sm text-slate-500">Today's Study</h3>
          <div className="mt-3 text-2xl font-semibold flex items-center gap-2">
            <span>⏱️</span>
            <span>{Math.floor(todaysSessions / 60)}h {todaysSessions % 60}m</span>
          </div>
        </div>
        <div className="card">
          <h3 className="text-sm text-slate-500">This Week</h3>
          <div className="mt-3 text-2xl font-semibold flex items-center gap-2">
            <span>📅</span>
            <span>{weekSessions} min</span>
          </div>
        </div>
        <div className="card">
          <h3 className="text-sm text-slate-500">Total Sessions</h3>
          <div className="mt-3 text-2xl font-semibold flex items-center gap-2">
            <span>📊</span>
            <span>{recentSessions.length}</span>
          </div>
        </div>
      </section>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Study Sessions</h2>
          <div className="card">
            <div className="space-y-2">
              {recentSessions.map(session => (
                <div key={session.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{session.subject || 'General'}</p>
                    <p className="text-sm text-gray-500">{getRelativeDate(session.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{session.duration} min</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Continue Learning */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
        {loadingCourses ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-64 card shrink-0 animate-pulse">
                <div className="h-32 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {courses.map(course => (
              <div 
                key={course.id} 
                className="w-64 card shrink-0 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600 rounded-md mb-4"></div>
                <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                <div className="mt-2 text-sm text-slate-500">
                  Chapter {course.currentChapter || 1} of {course.totalChapters || 0}
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${course.progress || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-slate-500 mb-4">No courses yet. Create your first course to get started!</p>
          </div>
        )}
      </section>

      {/* Create Course Modal */}
      {showCreateModal && <CreateCourseModal onClose={() => setShowCreateModal(false)} isGuest={isGuestMode} />}
    </div>
  )
}
