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
import { useStudyTimer, formatStudyTime } from '../lib/studyTimerService'
import { getAllUserProgress } from '../lib/progressService'

export default function Dashboard(){
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const { streak } = useStreak()
  const { todayStudyTime, isTracking } = useStudyTimer()
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
  const [userProgress, setUserProgress] = useState({})
  const [allCourses, setAllCourses] = useState([])

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

  // Load progress data
  useEffect(() => {
    const loadProgress = async () => {
      try {
        let allCoursesData = JSON.parse(localStorage.getItem('generatedCourses') || '[]')
        if (allCoursesData.length === 0) {
          allCoursesData = JSON.parse(localStorage.getItem('codeflux_courses') || '[]')
        }
        setAllCourses(allCoursesData)
        
        const progressData = await getAllUserProgress()
        setUserProgress(progressData)
      } catch (error) {
        console.error('Error loading progress:', error)
        setUserProgress({})
      }
    }

    const interval = setInterval(loadProgress, 1000)
    loadProgress()
    
    return () => clearInterval(interval)
  }, [])

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

      {/* Your Progress */}
      <section className="mb-8">
        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-purple-900">Your Progress</h3>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-200">
              <span className="text-xs font-semibold text-purple-700">Completion</span>
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-700 font-medium">Chapters Completed</span>
                <span className="font-semibold text-purple-900">
                  {Object.values(userProgress).reduce((sum, p) => sum + (p.completedChapters?.length || 0), 0)}/{allCourses.reduce((sum, c) => sum + (c.chapters?.length || 0), 0)}
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500" 
                  style={{ 
                    width: allCourses.reduce((sum, c) => sum + (c.chapters?.length || 0), 0) > 0 
                      ? `${Math.round((Object.values(userProgress).reduce((sum, p) => sum + (p.completedChapters?.length || 0), 0) / allCourses.reduce((sum, c) => sum + (c.chapters?.length || 0), 0)) * 100)}%`
                      : '0%'
                  }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center bg-white rounded-lg p-3 border border-purple-200">
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {Object.keys(userProgress).length}
                </p>
                <p className="text-xs text-purple-700 font-medium">Courses</p>
              </div>
              <div className="text-center bg-white rounded-lg p-3 border border-purple-200">
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {Object.values(userProgress).reduce((sum, p) => sum + (p.completedChapters?.length || 0), 0)}
                </p>
                <p className="text-xs text-purple-700 font-medium">Chapters Done</p>
              </div>
              <div className="text-center bg-white rounded-lg p-3 border border-purple-200">
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {allCourses.reduce((sum, c) => sum + (c.chapters?.length || 0), 0) > 0 
                    ? Math.round((Object.values(userProgress).reduce((sum, p) => sum + (p.completedChapters?.length || 0), 0) / allCourses.reduce((sum, c) => sum + (c.chapters?.length || 0), 0)) * 100)
                    : 0
                  }%
                </p>
                <p className="text-xs text-purple-700 font-medium">Complete</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-6">
          <button 
            onClick={handleCreateCourse}
            className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 hover:border-purple-400"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📚</div>
            <h3 className="font-semibold text-purple-900 mb-2">Learn New Course</h3>
            <p className="text-sm text-purple-700">Start a new learning journey</p>
          </button>

          <button 
            onClick={() => navigate('/quiz')}
            className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 hover:border-purple-400"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">✏️</div>
            <h3 className="font-semibold text-purple-900 mb-2">Take a Quiz</h3>
            <p className="text-sm text-purple-700">Test your knowledge</p>
          </button>

          <button 
            onClick={() => navigate('/community')}
            className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 hover:border-purple-400"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">👥</div>
            <h3 className="font-semibold text-purple-900 mb-2">Join Community</h3>
            <p className="text-sm text-purple-700">Connect with other learners</p>
          </button>
        </div>
      </section>

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
