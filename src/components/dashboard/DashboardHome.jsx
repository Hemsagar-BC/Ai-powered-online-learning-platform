import React from 'react'
import PropTypes from 'prop-types'
import { Clock, BookOpen, Trophy, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getContinueLearningCourses } from '../../lib/firebaseCoursesService'

export const DashboardHome = ({
  userName = 'Learner',
  todayTarget = 30,
  todayProgress = 0,
  streakDays = 0,
  totalCoursesEnrolled = 0,
  currentGoal = '',
  onStartLearning,
  onViewStats,
  className = ''
}) => {
  const completionPercentage = Math.min((todayProgress / todayTarget) * 100, 100)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Welcome Banner */}
      <WelcomeSection 
        userName={userName} 
        streakDays={streakDays}
        onStartLearning={onStartLearning}
      />

      {/* Quick Stats */}
      <QuickStatsCards
        totalCourses={totalCoursesEnrolled}
        streakDays={streakDays}
        currentGoal={currentGoal}
      />

      {/* Today's Progress */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Today's Learning Goal</h3>
          <span className="text-sm font-semibold text-blue-600">{todayProgress}/{todayTarget} min</span>
        </div>
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-600">
            {todayProgress < todayTarget 
              ? `${todayTarget - todayProgress} minutes left to reach your goal`
              : '✅ Goal completed for today!'
            }
          </p>
        </div>
      </div>

      {/* Continue Learning */}
      <ContinueLearning onViewStats={onViewStats} />
    </div>
  )
}

export const WelcomeSection = ({ 
  userName, 
  streakDays = 0,
  onStartLearning 
}) => {
  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{getTimeGreeting()}, {userName}! 👋</h1>
          <p className="text-blue-100 text-lg">Let's continue your learning journey</p>
        </div>
        {streakDays > 0 && (
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-xs text-blue-100 mb-1">Current Streak</p>
            <p className="text-2xl font-bold">{streakDays}🔥</p>
          </div>
        )}
      </div>
      <button
        onClick={onStartLearning}
        className="mt-4 bg-white hover:bg-gray-100 text-blue-600 font-semibold px-6 py-2 rounded-lg transition-colors"
      >
        Start Learning
      </button>
    </div>
  )
}

export const QuickStatsCards = ({ 
  totalCourses = 0, 
  streakDays = 0, 
  currentGoal = '',
  className = ''
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-xs font-medium mb-1">Active Courses</p>
          <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
        </div>
        <BookOpen size={32} className="text-blue-600 opacity-20" />
      </div>
    </div>

    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-xs font-medium mb-1">Learning Streak</p>
          <p className="text-2xl font-bold text-gray-900">{streakDays} days</p>
        </div>
        <Trophy size={32} className="text-yellow-500 opacity-20" />
      </div>
    </div>

    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-xs font-medium mb-1">Daily Goal</p>
          <p className="text-2xl font-bold text-gray-900">{currentGoal || '—'}</p>
        </div>
        <Target size={32} className="text-green-600 opacity-20" />
      </div>
    </div>
  </div>
)

export const ContinueLearning = ({ onViewStats }) => {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        if (!user?.email) {
          setLoading(false)
          return
        }

        // Load courses from Firebase
        const firebaseCourses = await getContinueLearningCourses(user.email, 5)
        
        // Fallback to localStorage if Firebase is empty
        if (firebaseCourses.length === 0) {
          const localCourses = JSON.parse(localStorage.getItem('codeflux_courses') || '[]')
          setCourses(localCourses.slice(0, 5))
        } else {
          setCourses(firebaseCourses)
        }
      } catch (error) {
        console.error('Error loading courses:', error)
        // Fallback to localStorage on error
        const localCourses = JSON.parse(localStorage.getItem('codeflux_courses') || '[]')
        setCourses(localCourses.slice(0, 5))
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [user?.email])

  // Fallback courses if none are loaded
  const displayCourses = courses.length > 0 ? courses : [
    { id: 1, title: 'React Advanced Patterns', progress: 65, nextChapter: 'Chapter 5' },
    { id: 2, title: 'JavaScript Fundamentals', progress: 40, nextChapter: 'Chapter 3' },
    { id: 3, title: 'Web Design Basics', progress: 80, nextChapter: 'Final Project' }
  ]

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Continue Learning</h3>
        <button
          onClick={onViewStats}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View All →
        </button>
      </div>

      <div className="space-y-3">
        {displayCourses.map(course => (
          <div key={course.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{course.title}</p>
                <p className="text-xs text-gray-600 mt-1">{course.nextChapter || 'Chapter 1'}</p>
              </div>
              <span className="text-sm font-semibold text-blue-600">{course.progress || 0}%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-1">
              <div 
                className="bg-blue-600 h-1 rounded-full"
                style={{ width: `${course.progress || 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

DashboardHome.propTypes = {
  userName: PropTypes.string,
  todayTarget: PropTypes.number,
  todayProgress: PropTypes.number,
  streakDays: PropTypes.number,
  totalCoursesEnrolled: PropTypes.number,
  currentGoal: PropTypes.string,
  onStartLearning: PropTypes.func,
  onViewStats: PropTypes.func,
  className: PropTypes.string
}

WelcomeSection.propTypes = {
  userName: PropTypes.string,
  streakDays: PropTypes.number,
  onStartLearning: PropTypes.func
}

QuickStatsCards.propTypes = {
  totalCourses: PropTypes.number,
  streakDays: PropTypes.number,
  currentGoal: PropTypes.string,
  className: PropTypes.string
}

ContinueLearning.propTypes = {
  onViewStats: PropTypes.func
}

export default DashboardHome
