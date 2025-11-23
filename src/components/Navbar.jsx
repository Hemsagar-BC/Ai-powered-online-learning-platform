import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar({ isMobile }){
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
        <div className={`fixed top-4 right-4 px-4 md:px-6 py-3 rounded-lg shadow-lg z-50 transition-all text-sm md:text-base ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Desktop Navbar */}
      {!isMobile && (
        <header className="fixed left-60 right-0 top-0 h-20 flex items-center justify-between px-6 md:px-8 py-4 border-b bg-gradient-to-r from-slate-50 via-purple-50 to-pink-50 border-purple-200 z-40 shadow-sm hidden md:flex" style={{left: 240, height: 80}}>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="text-base md:text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI-Powered Learning</div>
            <div className="text-xs md:text-sm text-purple-600 hidden sm:block">Personalized • Gamified • Collaborative</div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <input 
              placeholder="Search courses" 
              className="border rounded-md px-3 py-2 text-sm w-48 md:w-72 bg-white border-purple-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200" 
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
                      onClick={() => { navigate('/progress'); setShowDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    >
                      📊 Progress
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
      )}

      {/* Mobile Navbar (hidden on desktop) */}
      {isMobile && (
        <header className="fixed right-0 top-0 h-16 flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-slate-50 via-purple-50 to-pink-50 border-purple-200 z-30 shadow-sm md:hidden w-full">
          <div className="text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Learning</div>
          
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold cursor-pointer transition hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 ${getAvatarColor()}`}
                title={user.email}
              >
                {getInitials()}
              </button>

              {/* Mobile Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border dark:border-slate-700 z-50">
                  <div className="p-3 border-b dark:border-slate-700">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{user.displayName || 'User'}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{user.email}</div>
                  </div>

                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    👤 Profile
                  </button>

                  <button
                    onClick={() => { navigate('/progress'); setShowDropdown(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    📊 Progress
                  </button>

                  <button
                    onClick={() => { navigate('/settings'); setShowDropdown(false); }}
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
        </header>
      )}
    </>
  )
}

