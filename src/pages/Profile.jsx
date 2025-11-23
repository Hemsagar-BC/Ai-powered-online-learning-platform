import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getAllUserProgress } from '../lib/progressService'
import { calculateLevel, checkAchievements, getAchievementDetails, calculateSessionXP, calculateStreakBonus, XP_REWARDS } from '../lib/xpCalculator'
import { useStreak } from '../contexts/StreakContext'

export default function Profile(){
  const { user } = useAuth()
  const { streak } = useStreak()
  const [stats, setStats] = useState({
    totalCourses: 0,
    completed: 0,
    inProgress: 0,
    streak: 0,
    xp: 0,
    level: 1,
    levelTitle: 'Novice',
    progress: 0,
    achievements: []
  })
  const [allCourses, setAllCourses] = useState([])
  const [userProgress, setUserProgress] = useState({})

  useEffect(() => {
    // Load courses and calculate real stats from progress
    const loadStats = async () => {
      try {
        // Load all courses
        let courses = JSON.parse(localStorage.getItem('generatedCourses') || '[]')
        if (courses.length === 0) {
          courses = JSON.parse(localStorage.getItem('codeflux_courses') || '[]')
        }
        setAllCourses(courses)

        // Load real progress data
        const progressData = await getAllUserProgress()
        setUserProgress(progressData)

        // Calculate stats from real data
        const totalCourses = courses.length
        const totalChapters = courses.reduce((sum, c) => sum + (c.chapters?.length || 0), 0)
        const completedChapters = Object.values(progressData).reduce((sum, p) => sum + (p.completedChapters?.length || 0), 0)
        
        // Calculate XP
        let totalXP = 0
        let lessonsCompleted = 0
        let coursesCompleted = 0
        
        Object.values(progressData).forEach(course => {
          if (course.completedChapters?.length > 0) {
            lessonsCompleted += course.completedChapters.length
            totalXP += course.completedChapters.length * XP_REWARDS.LESSON_COMPLETED
          }
          if (course.completed) {
            totalXP += XP_REWARDS.COURSE_COMPLETED
            coursesCompleted++
          }
        })
        
        // Add streak bonus
        if (streak?.current > 0) {
          totalXP += calculateStreakBonus(streak.current)
        }
        
        // Calculate level
        const levelInfo = calculateLevel(totalXP)
        
        // Check achievements
        const userStats = {
          lessonsCompleted,
          coursesCompleted,
          coursesCreated: courses.length,
          streakDays: streak?.current || 0,
          totalStudyTime: 0,
          achievements: []
        }
        
        const unlockedIds = checkAchievements(userStats)
        const unlockedAchievements = unlockedIds
          .map(id => getAchievementDetails(id))
          .filter(Boolean)
        
        setStats({
          totalCourses: totalCourses,
          completed: completedChapters,
          inProgress: Math.max(0, totalCourses - 0),
          streak: streak?.current || 0,
          xp: totalXP,
          level: levelInfo.level,
          levelTitle: levelInfo.title,
          progress: levelInfo.progressToNextLevel,
          achievements: unlockedAchievements
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }

    loadStats()

    // Poll for updates every 1 second to match Progress page
    const interval = setInterval(loadStats, 1000)
    return () => clearInterval(interval)
  }, [user, streak])

  // Get initials for large avatar
  const getInitials = () => {
    if (!user) return '?'
    const names = (user.displayName || user.email).split(' ')
    return names.map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Get avatar color
  const getAvatarColor = () => {
    if (!user) return 'bg-slate-300'
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-cyan-500']
    const hash = (user.email || 'user').charCodeAt(0) + (user.email || 'user').charCodeAt((user.email || 'user').length - 1)
    return colors[hash % colors.length]
  }

  const memberSinceDate = new Date(localStorage.getItem('codeflux_last_login') || new Date())
  const formattedDate = memberSinceDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })

  return (
    <div className="min-h-screen bg-white pt-16 md:pt-20 pb-16 md:pb-20">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 mb-6 md:mb-8 p-4 md:p-6 lg:p-8 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all">
          <div className={`w-24 md:w-32 h-24 md:h-32 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-2xl md:text-4xl ${getAvatarColor()} shadow-lg ring-2 ring-gray-200`}>
            {getInitials()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{user?.displayName || 'CodeFlux User'}</h2>
            <div className="text-xs md:text-sm text-gray-600 mt-1">
              📧 {user?.email || 'user@codeflux.dev'}
            </div>
            <div className="text-xs md:text-sm text-gray-500 mt-2">
              ✅ Member since {formattedDate}
            </div>
            <div className="flex gap-2 md:gap-4 mt-3 md:mt-4 flex-wrap justify-center sm:justify-start">
              <span className="px-2 md:px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs md:text-sm font-semibold border border-green-200">
                ✓ Verified User
              </span>
              <span className="px-2 md:px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs md:text-sm font-semibold border border-blue-200">
                🔗 Google Sign-In
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 lg:gap-4 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-3 md:p-4 border border-purple-500/20 hover:border-purple-400/40 transition-all">
            <div className="text-xs md:text-sm text-slate-400">Total Courses</div>
            <div className="mt-2 text-2xl md:text-3xl font-bold text-purple-400">{stats.totalCourses}</div>
            <div className="text-xs text-slate-500 mt-1">📚 Created & Enrolled</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-3 md:p-4 border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
            <div className="text-xs md:text-sm text-slate-400">Completed</div>
            <div className="mt-2 text-2xl md:text-3xl font-bold text-cyan-400">{stats.completed}</div>
            <div className="text-xs text-slate-500 mt-1">✅ Finished</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-3 md:p-4 border border-pink-500/20 hover:border-pink-400/40 transition-all">
            <div className="text-xs md:text-sm text-slate-400">In Progress</div>
            <div className="mt-2 text-2xl md:text-3xl font-bold text-pink-400">{stats.inProgress}</div>
            <div className="text-xs text-slate-500 mt-1">🔄 Learning</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-3 md:p-4 border border-orange-500/20 hover:border-orange-400/40 transition-all">
            <div className="text-xs md:text-sm text-slate-400">Streak</div>
            <div className="mt-2 text-2xl md:text-3xl font-bold text-orange-400">{stats.streak}</div>
            <div className="text-xs text-slate-500 mt-1">🔥 Days</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-3 md:p-4 border border-indigo-500/20 hover:border-indigo-400/40 transition-all">
            <div className="text-xs md:text-sm text-slate-400">Level {stats.level}</div>
            <div className="mt-2 text-2xl md:text-3xl font-bold text-indigo-400">{stats.xp}</div>
            <div className="text-xs text-slate-500 mt-1">⭐ XP Points</div>
          </div>
        </div>

        {/* Level and Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Level Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Current Level</h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-4xl font-bold text-indigo-600">{stats.level}</p>
                <p className="text-sm text-indigo-600 font-semibold">{stats.levelTitle}</p>
              </div>
              <div className="text-6xl">
                {stats.level === 1 ? '🌱' : stats.level === 2 ? '📚' : stats.level === 3 ? '🎓' : stats.level === 4 ? '🧠' : stats.level === 5 ? '🔥' : stats.level === 6 ? '⭐' : stats.level === 7 ? '👑' : '🏆'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress to Next Level</span>
                <span className="font-semibold text-indigo-600">{Math.round(stats.progress)}%</span>
              </div>
              <div className="w-full bg-indigo-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* XP Info Card */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Experience Points</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total XP Earned</span>
                <span className="text-3xl font-bold text-purple-600">{stats.xp}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Achievements Unlocked</span>
                <span className="font-semibold text-purple-600">{stats.achievements.length}</span>
              </div>
              <div className="pt-2 border-t border-purple-200">
                <p className="text-xs text-purple-600 font-semibold mb-2">How to earn XP:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>💡 Complete lessons: 50 XP each</li>
                  <li>🎓 Complete courses: 500 XP</li>
                  <li>🔥 Maintain streaks: +5-500 XP bonus</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        {stats.achievements.length > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 mb-6 md:mb-8 border border-green-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🏆 Unlocked Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {stats.achievements.map((achievement, idx) => (
                <div 
                  key={idx}
                  className="flex flex-col items-center p-4 bg-white rounded-lg border-2 border-green-300 hover:shadow-lg transition-all group cursor-pointer"
                  title={achievement.description}
                >
                  <div className="text-3xl md:text-4xl mb-2 group-hover:scale-125 transition-transform">{achievement.emoji}</div>
                  <p className="text-xs font-semibold text-center text-green-900">{achievement.name}</p>
                  <p className="text-xs text-green-600 mt-1 font-bold">+{achievement.xpReward} XP</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 md:p-6 border border-slate-700">
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white flex items-center gap-2">
            <span>📊 Recent Activity</span>
          </h3>
          <div className="space-y-2 md:space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-slate-500 transition-all gap-2 md:gap-0">
              <span className="text-xs md:text-sm text-slate-300">🎓 Completed Python Basics Course</span>
              <span className="text-xs text-slate-500">Today</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-slate-500 transition-all gap-2 md:gap-0">
              <span className="text-xs md:text-sm text-slate-300">📚 Started Web Development Path</span>
              <span className="text-xs text-slate-500">Yesterday</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-slate-500 transition-all gap-2 md:gap-0">
              <span className="text-xs md:text-sm text-slate-300">🔥 7-Day Learning Streak</span>
              <span className="text-xs text-slate-500">This Week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

