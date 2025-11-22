import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getAllUserProgress } from '../lib/progressService'

export default function Profile(){
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalCourses: 0,
    completed: 0,
    inProgress: 0,
    streak: 0,
    xp: 0
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
        
        setStats({
          totalCourses: totalCourses,
          completed: completedChapters,
          inProgress: Math.max(0, totalCourses - 0), // Shows active courses
          streak: 0, // Will be calculated if needed
          xp: 0 // Will be calculated if needed
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }

    loadStats()

    // Poll for updates every 1 second to match Progress page
    const interval = setInterval(loadStats, 1000)
    return () => clearInterval(interval)
  }, [user])

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
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8 p-8 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-4xl ${getAvatarColor()} shadow-lg ring-2 ring-gray-200`}>
            {getInitials()}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900">{user?.displayName || 'CodeFlux User'}</h2>
            <div className="text-gray-600 mt-1">
              📧 {user?.email || 'user@codeflux.dev'}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              ✅ Member since {formattedDate}
            </div>
            <div className="flex gap-4 mt-4 flex-wrap">
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-200">
                ✓ Verified User
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                🔗 Google Sign-In
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 border border-purple-500/20 hover:border-purple-400/40 transition-all">
            <div className="text-sm text-slate-400">Total Courses</div>
            <div className="mt-2 text-3xl font-bold text-purple-400">{stats.totalCourses}</div>
            <div className="text-xs text-slate-500 mt-1">📚 Created & Enrolled</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
            <div className="text-sm text-slate-400">Completed</div>
            <div className="mt-2 text-3xl font-bold text-cyan-400">{stats.completed}</div>
            <div className="text-xs text-slate-500 mt-1">✅ Finished</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 border border-pink-500/20 hover:border-pink-400/40 transition-all">
            <div className="text-sm text-slate-400">In Progress</div>
            <div className="mt-2 text-3xl font-bold text-pink-400">{stats.inProgress}</div>
            <div className="text-xs text-slate-500 mt-1">🔄 Learning</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 border border-orange-500/20 hover:border-orange-400/40 transition-all">
            <div className="text-sm text-slate-400">Streak</div>
            <div className="mt-2 text-3xl font-bold text-orange-400">{stats.streak}</div>
            <div className="text-xs text-slate-500 mt-1">🔥 Days</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 border border-indigo-500/20 hover:border-indigo-400/40 transition-all">
            <div className="text-sm text-slate-400">Total XP</div>
            <div className="mt-2 text-3xl font-bold text-indigo-400">{stats.xp}</div>
            <div className="text-xs text-slate-500 mt-1">⭐ Points</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <span>📊 Recent Activity</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-slate-500 transition-all">
              <span className="text-sm text-slate-300">🎓 Completed Python Basics Course</span>
              <span className="text-xs text-slate-500">Today</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-slate-500 transition-all">
              <span className="text-sm text-slate-300">📚 Started Web Development Path</span>
              <span className="text-xs text-slate-500">Yesterday</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-slate-500 transition-all">
              <span className="text-sm text-slate-300">🔥 7-Day Learning Streak</span>
              <span className="text-xs text-slate-500">This Week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

