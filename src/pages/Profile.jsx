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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8 p-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/20 rounded-lg backdrop-blur-sm">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-4xl ${getAvatarColor()} shadow-lg ring-2 ring-purple-400/30`}>
            {getInitials()}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white">{user?.displayName || 'CodeFlux User'}</h2>
            <div className="text-slate-300 mt-1">
              📧 {user?.email || 'user@codeflux.dev'}
            </div>
            <div className="text-sm text-slate-400 mt-2">
              ✅ Member since {formattedDate}
            </div>
            <div className="flex gap-4 mt-4 flex-wrap">
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold border border-green-500/30">
                ✓ Verified User
              </span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold border border-blue-500/30">
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

