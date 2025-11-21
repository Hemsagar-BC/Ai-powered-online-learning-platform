import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing(){
  const navigate = useNavigate()
  const [isDark, setIsDark] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('codeflux-theme')
    if (savedTheme === 'dark') {
      setIsDark(true)
    } else {
      setIsDark(false)
    }
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    setIsDark(!isDark)
    localStorage.setItem('codeflux-theme', !isDark ? 'dark' : 'light')
  }

  const bgColor = isDark ? 'bg-slate-900' : 'bg-white'
  const navBg = isDark ? 'bg-slate-800 border-b border-slate-700' : 'bg-white'
  const heroBg = isDark ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
  const sectionBg = isDark ? 'bg-slate-800' : 'bg-white'
  const sectionBgAlt = isDark ? 'bg-slate-700' : 'bg-slate-50'
  const textPrimary = isDark ? 'text-white' : 'text-slate-900'
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600'
  const textTertiary = isDark ? 'text-slate-500' : 'text-slate-500'
  const borderColor = isDark ? 'border-slate-700' : 'border-slate-200'
  const cardBg = isDark ? 'bg-slate-700 hover:shadow-lg hover:shadow-indigo-500/20' : 'bg-slate-50 hover:shadow-lg'

  return (
    <div className={`transition-colors duration-300 ${bgColor}`}>
      {/* Navigation Header */}
      <nav className={`fixed top-0 w-full shadow-md z-40 transition-colors duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className={`text-3xl font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>CodeFlux</div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-lg transition font-semibold flex items-center gap-2 ${isDark ? 'bg-slate-600 text-slate-100 hover:bg-slate-500' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
            >
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`pt-32 pb-20 transition-colors duration-300 ${heroBg}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <h1 className={`text-6xl font-bold mb-6 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Learn Smarter,<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Create Faster
                </span>
              </h1>
              <p className={`text-xl mb-8 ${textSecondary}`}>
                CodeFlux is an AI-powered learning platform where anyone can create and share courses instantly. 
                No fees, no limits—just pure learning powered by artificial intelligence.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold text-lg"
                >
                  Get Started
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('features-section').scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-8 py-4 border-2 rounded-lg transition font-semibold text-lg ${isDark ? 'border-slate-600 text-slate-300 hover:border-slate-500' : 'border-slate-300 text-slate-900 hover:border-slate-400'}`}
                >
                  Explore Features
                </button>
              </div>

              {/* Stats - REMOVED as per request */}
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="space-y-4">
                  <div className="text-5xl">📚</div>
                  <h3 className="text-2xl font-bold">AI-Powered Learning</h3>
                  <p className="text-indigo-100">Generate complete courses in minutes with our cutting-edge AI technology</p>
                  <div className="pt-4 border-t border-indigo-400">
                    <p className="text-sm text-indigo-100">✓ Auto-generated curriculum</p>
                    <p className="text-sm text-indigo-100">✓ Video explanations</p>
                    <p className="text-sm text-indigo-100">✓ Interactive quizzes</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-300 rounded-full opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-purple-300 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className={`py-20 transition-colors duration-300 ${sectionBg}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${textPrimary}`}>Why Choose CodeFlux?</h2>
            <p className={`text-xl ${textSecondary}`}>Everything you need to learn and create amazing courses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Lightning Fast Course Creation',
                description: 'Just describe your course topic, duration, and difficulty. Our AI generates a complete curriculum with videos and content in seconds.'
              },
              {
                icon: '🎓',
                title: 'Learn for Completely Free',
                description: 'No subscriptions, no hidden fees. All courses are free forever. Learn at your own pace with lifetime access.'
              },
              {
                icon: '👥',
                title: 'Vibrant Community',
                description: 'Connect with learners studying the same courses. Share experiences, ask questions, and grow together.'
              },
              {
                icon: '💬',
                title: 'AI Study Buddy',
                description: 'Get instant help 24/7 from our AI-powered Study Buddy. Ask any question and get detailed explanations immediately.'
              },
              {
                icon: '🏆',
                title: 'Gamification & Rewards',
                description: 'Earn XP, build streaks, unlock achievements, and climb leaderboards as you progress through courses.'
              },
              {
                icon: '🚀',
                title: 'Share Your Expertise',
                description: 'Create and publish courses to build your portfolio. Help others learn while establishing yourself as an educator.'
              }
            ].map((feature, i) => (
              <div key={i} className={`p-8 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-white border-slate-200'}`}>
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className={`text-xl font-bold mb-3 ${textPrimary}`}>{feature.title}</h3>
                <p className={textSecondary}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-20 transition-colors duration-300 ${sectionBgAlt}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${textPrimary}`}>How CodeFlux Works</h2>
            <p className={`text-xl ${textSecondary}`}>Three simple steps to create your first course</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '1',
                title: 'Enter Course Details',
                description: 'Tell us your course topic, desired duration, and difficulty level.'
              },
              {
                number: '2',
                title: 'AI Generates Content',
                description: 'Our AI instantly creates a complete curriculum with videos, topics, and assignments.'
              },
              {
                number: '3',
                title: 'Start Teaching & Learning',
                description: 'Publish your course and start learning or teaching immediately. No technical skills needed!'
              }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${textPrimary}`}>{step.title}</h3>
                <p className={textSecondary}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-indigo-100 mb-8">Join CodeFlux today and unlock unlimited learning potential</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-slate-100 transition font-bold text-lg"
          >
            Start Free Now →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-900 text-white'} py-16`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="text-3xl font-bold text-indigo-400 mb-4">CodeFlux</div>
              <p className={isDark ? 'text-slate-500' : 'text-slate-400'}>Empowering learners and educators worldwide through AI-powered education.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className={`space-y-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className={`space-y-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className={`space-y-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className={`border-t py-8 mt-8 ${isDark ? 'border-slate-800' : 'border-slate-700'}`}>
            {/* Credits & Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="font-bold text-indigo-400 mb-2">🎯 Our Mission</h4>
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  To democratize education by making high-quality learning accessible, affordable, and engaging for everyone, everywhere.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-indigo-400 mb-2">🚀 Technology</h4>
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Built with React, Vite, Tailwind CSS, Firebase, and powered by Google's Gemini AI. Built for speed, scalability, and excellence.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-indigo-400 mb-2">📞 Support</h4>
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Questions? Email us at support@codeflux.dev or visit our help center. We're here to help 24/7.
                </p>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className={`border-t py-8 ${isDark ? 'border-slate-800' : 'border-slate-700'}`}>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  © 2024 CodeFlux. All rights reserved.
                </p>
                <div className="flex gap-6 mt-4 md:mt-0">
                  <a href="#" className={`hover:text-indigo-400 transition ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Twitter</a>
                  <a href="#" className={`hover:text-indigo-400 transition ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>LinkedIn</a>
                  <a href="#" className={`hover:text-indigo-400 transition ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>GitHub</a>
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div className={`mt-8 pt-8 rounded-lg p-6 ${isDark ? 'bg-slate-800' : 'bg-slate-800'}`}>
              <h4 className="font-bold text-indigo-400 mb-4">👥 Team Members</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-300 font-semibold mb-3">Team Lead</p>
                  <ul className={`text-sm space-y-2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                    <li>• <span className="text-indigo-300">Hemsagar B C</span></li>
                    <li>• <span className="text-indigo-300">Pushkar R Deshpande</span></li>
                  </ul>
                </div>
                <div>
                  <p className="text-slate-300 font-semibold mb-3">Team Members</p>
                  <ul className={`text-sm space-y-2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                    <li>• N Shreeraksha</li>
                    <li>• Spoorti Bhatkal</li>
                    <li>• Parimala M Ingalagi</li>
                    <li>• Bharath HT</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Special Credits */}

          </div>
        </div>
      </footer>
    </div>
  )
}
