import React, { useState, useEffect } from 'react'

export default function Settings(){
  const [theme, setTheme] = useState('light')

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('codeflux-theme')
    if (savedTheme === 'dark') {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    } else {
      setTheme('light')
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Handle theme change and save to localStorage
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('codeflux-theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 transition-colors">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 border-l-4 border-indigo-600 transition-colors">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            ⚙️ <span className="text-indigo-600">Settings</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300">Manage your preferences</p>
        </div>

        {/* Theme Settings - Only Feature */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 transition-colors">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">🎨 Theme</h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">Choose your preferred theme</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-6 rounded-lg border-2 transition ${
                theme === 'light'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900'
                  : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500'
              }`}
            >
              <div className="text-4xl mb-3">☀️</div>
              <div className="font-semibold text-slate-900 dark:text-white">Light Theme</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">Bright and clean interface</div>
            </button>

            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-6 rounded-lg border-2 transition ${
                theme === 'dark'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900'
                  : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500'
              }`}
            >
              <div className="text-4xl mb-3">🌙</div>
              <div className="font-semibold text-slate-900 dark:text-white">Dark Theme</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">Easy on the eyes</div>
            </button>
          </div>

          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <p className="text-indigo-900 dark:text-indigo-200 text-sm">
              ✨ Theme preference is saved automatically and will sync across all your sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
