import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Profile(){
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalCourses: 0,
    completed: 0,
    inProgress: 0,
    streak: 0,
    xp: 0
  })

  useEffect(() => {
    // Load user stats from localStorage or backend
    const savedStats = localStorage.getItem('codeflux_user_stats')
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
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
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-lg border dark:border-slate-700">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-4xl ${getAvatarColor()} shadow-lg`}>
          {getInitials()}
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold dark:text-white">{user?.displayName || 'CodeFlux User'}</h2>
          <div className="text-slate-600 dark:text-slate-300 mt-1">
            📧 {user?.email || 'user@codeflux.dev'}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            ✅ Member since {formattedDate}
          </div>
          <div className="flex gap-4 mt-4">
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
              ✓ Verified User
            </span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold">
              🔗 Google Sign-In
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">Total Courses</div>
          <div className="mt-2 text-3xl font-bold dark:text-white">{stats.totalCourses}</div>
          <div className="text-xs text-slate-400 mt-1">📚 Created & Enrolled</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">Completed</div>
          <div className="mt-2 text-3xl font-bold dark:text-white">{stats.completed}</div>
          <div className="text-xs text-slate-400 mt-1">✅ Finished</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">In Progress</div>
          <div className="mt-2 text-3xl font-bold dark:text-white">{stats.inProgress}</div>
          <div className="text-xs text-slate-400 mt-1">🔄 Learning</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">Streak</div>
          <div className="mt-2 text-3xl font-bold dark:text-white">{stats.streak}</div>
          <div className="text-xs text-slate-400 mt-1">🔥 Days</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">Total XP</div>
          <div className="mt-2 text-3xl font-bold dark:text-white">{stats.xp}</div>
          <div className="text-xs text-slate-400 mt-1">⭐ Points</div>
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">🏆 Achievements</h3>
        <div className="grid grid-cols-6 gap-4">
          {['🎓','📖','✅','🔥','⭐','📚','🚀','💡','🎯','🏅','🌟','💎'].map((a,i)=> (
            <div key={i} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700 text-center text-3xl hover:scale-105 transition cursor-pointer" title={`Achievement ${i+1}`}>
              {a}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">📊 Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded">
            <span className="text-sm text-slate-700 dark:text-slate-300">🎓 Completed Python Basics Course</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Today</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded">
            <span className="text-sm text-slate-700 dark:text-slate-300">📚 Started Web Development Path</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Yesterday</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded">
            <span className="text-sm text-slate-700 dark:text-slate-300">🔥 7-Day Learning Streak</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">This Week</span>
          </div>
        </div>
      </div>
    </div>
  )
}

