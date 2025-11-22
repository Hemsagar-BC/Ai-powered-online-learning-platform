import React, { useState, useEffect } from 'react'

export default function Settings(){
  const [theme, setTheme] = useState('light')
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    courseUpdates: true,
    communityDigest: false,
    comments: true
  })
  const [emailFrequency, setEmailFrequency] = useState('weekly')
  const [privacy, setPrivacy] = useState('public')
  const [language, setLanguage] = useState('en')

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('codeflux-theme')
    if (savedTheme === 'dark') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [])

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Handle theme change and save to localStorage
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('codeflux-theme', newTheme)
    // Optionally apply theme globally
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with User Greeting */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-8 border-l-4 border-indigo-600">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            👋 Welcome back, <span className="text-indigo-600">Pushkar Deshpande</span>!
          </h1>
          <p className="text-slate-600">Manage your account settings and preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">

          {/* Theme Settings */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">🎨 Theme</h2>
                <p className="text-slate-600 text-sm mt-1">Choose your preferred theme</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-4 rounded-lg border-2 transition ${
                  theme === 'light'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="text-3xl mb-2">☀️</div>
                <div className="font-semibold text-slate-900">Light Theme</div>
                <div className="text-xs text-slate-600 mt-1">Bright and clean interface</div>
              </button>

              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-4 rounded-lg border-2 transition ${
                  theme === 'dark'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="text-3xl mb-2">🌙</div>
                <div className="font-semibold text-slate-900">Dark Theme</div>
                <div className="text-xs text-slate-600 mt-1">Easy on the eyes</div>
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">🔔 Notifications</h2>
                <p className="text-slate-600 text-sm mt-1">Control how you receive updates</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', icon: '📧', desc: 'Receive updates via email' },
                { key: 'push', label: 'Push Notifications', icon: '📱', desc: 'Browser push notifications' },
                { key: 'courseUpdates', label: 'Course Updates', icon: '📚', desc: 'New content in your courses' },
                { key: 'communityDigest', label: 'Community Digest', icon: '👥', desc: 'Weekly community summary' },
                { key: 'comments', label: 'Comment Replies', icon: '💬', desc: 'Notify on discussion replies' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={() => handleNotificationChange(item.key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              ))}
            </div>

            {/* Email Frequency */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="font-semibold text-slate-900 mb-3">Email Frequency</p>
              <div className="space-y-2">
                {['instantly', 'daily', 'weekly', 'monthly'].map((freq) => (
                  <label key={freq} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value={freq}
                      checked={emailFrequency === freq}
                      onChange={(e) => setEmailFrequency(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="capitalize text-slate-700">{freq}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">🔒 Privacy & Security</h2>
                <p className="text-slate-600 text-sm mt-1">Control your privacy settings</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Profile Visibility</label>
                <div className="space-y-2">
                  {['public', 'friends', 'private'].map((visibility) => (
                    <label key={visibility} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="privacy"
                        value={visibility}
                        checked={privacy === visibility}
                        onChange={(e) => setPrivacy(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="capitalize text-slate-700">
                        {visibility === 'public' && '🌍 Public - Everyone can see my profile'}
                        {visibility === 'friends' && '👥 Friends Only - Only my connections'}
                        {visibility === 'private' && '🔐 Private - Only me'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="font-semibold text-red-900 mb-2">⚠️ Data & Privacy</p>
                <button className="text-red-700 hover:text-red-900 font-semibold text-sm">
                  Download My Data
                </button>
              </div>
            </div>
          </div>

          {/* Language & Region */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">🌐 Language & Region</h2>
                <p className="text-slate-600 text-sm mt-1">Customize your experience</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="es">🇪🇸 Spanish</option>
                  <option value="fr">🇫🇷 French</option>
                  <option value="de">🇩🇪 German</option>
                  <option value="hi">🇮🇳 Hindi</option>
                  <option value="zh">🇨🇳 Chinese</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Timezone</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>UTC (GMT+0)</option>
                  <option>IST (GMT+5:30)</option>
                  <option>EST (GMT-5)</option>
                  <option>PST (GMT-8)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Learning Preferences */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">🎯 Learning Preferences</h2>
                <p className="text-slate-600 text-sm mt-1">Personalize your learning experience</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">Auto-play Videos</p>
                  <p className="text-xs text-slate-600">Automatically play next video in course</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">Download Subtitles</p>
                  <p className="text-xs text-slate-600">Download course videos for offline access</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-200">Account Actions</h2>

            <div className="space-y-3">
              <button className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold">
                💾 Save Changes
              </button>
              <button className="w-full py-3 px-4 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition font-semibold">
                🔄 Reset to Defaults
              </button>
              <button className="w-full py-3 px-4 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition font-semibold">
                🚪 Sign Out
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
