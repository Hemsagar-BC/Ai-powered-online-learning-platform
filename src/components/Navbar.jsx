import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar(){
  const navigate = useNavigate()
  const { user, logout, notification } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  // Get initials for avatar
  const getInitials = () => {
    if (!user) return '?'
    const names = (user.displayName || user.email).split(' ')
    return names.map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Get avatar color based on user email
  const getAvatarColor = () => {
    if (!user) return 'bg-slate-300'
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-cyan-500']
    const hash = user.email.charCodeAt(0) + user.email.charCodeAt(user.email.length - 1)
    return colors[hash % colors.length]
  }

  const handleProfileClick = () => {
    navigate('/profile')
    setShowDropdown(false)
  }

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
  }

  return (
    <>
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      <header className="flex items-center justify-between px-8 py-4 border-b bg-white dark:bg-slate-900 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold dark:text-white">AI-Powered Learning</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Personalized • Gamified • Collaborative</div>
        </div>
        <div className="flex items-center gap-6">
          <input 
            placeholder="Search courses" 
            className="border rounded-md px-3 py-2 text-sm w-72 dark:bg-slate-800 dark:border-slate-600 dark:text-white" 
          />
          
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer transition hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 ${getAvatarColor()}`}
                title={user.email}
              >
                {getInitials()}
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border dark:border-slate-700 z-50">
                  <div className="p-4 border-b dark:border-slate-700">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{user.displayName || 'User'}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                  </div>

                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    👤 View Profile
                  </button>

                  <button
                    onClick={() => navigate('/settings')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    ⚙️ Settings
                  </button>

                  <div className="border-t dark:border-slate-700 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  )
}

