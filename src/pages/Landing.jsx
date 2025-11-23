import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Trophy,
  Zap,
  Users,
  BarChart3,
  MessageCircle,
  Sun,
  Moon
} from 'lucide-react'

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

  return (
    <div className={`transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Navigation Header */}
      <nav className={`sticky top-0 z-40 backdrop-blur-lg border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-slate-950/80 border-purple-800/30' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'}`}>CodeFlux</div>
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-slate-800 text-yellow-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {isDark ? <Sun className="w-4 md:w-5 h-4 md:h-5" /> : <Moon className="w-4 md:w-5 h-4 md:h-5" />}
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-3 md:px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold text-sm md:text-base"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`relative min-h-screen overflow-hidden pt-20 pb-20 transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-slate-950 via-purple-900/20 to-slate-900'
          : 'bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50'
      }`}>
        {/* Background decorative elements */}
        {!isDark && (
          <>
            <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
            <div className="absolute top-40 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}} />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}} />
          </>
        )}

        {isDark && (
          <>
            <div className="absolute top-20 right-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
            <div className="absolute top-40 left-10 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}} />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}} />
          </>
        )}

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-8 md:gap-12 items-center min-h-[80vh]">
          {/* LEFT COLUMN */}
          <div className="flex flex-col justify-center">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full mb-4 md:mb-6 w-fit text-sm md:text-base ${
              isDark
                ? 'bg-purple-900/40 border border-purple-700/50'
                : 'bg-purple-100 border border-purple-200'
            }`}>
              <Sparkles className={`w-4 h-4 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
              <span className={`text-xs md:text-sm font-semibold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                Powered by AI Technology
              </span>
            </div>

            {/* Main Heading */}
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                Learn Smarter,
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Grow Faster
              </span>
            </h1>

            {/* Tagline */}
            <p className={`text-lg md:text-2xl font-bold mb-3 md:mb-4 ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
              ✨ The Future of Personalized Learning is Here
            </p>

            {/* Subtitle */}
            <p className={`text-base md:text-lg mb-6 md:mb-8 max-w-xl leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Create AI-powered courses, ace gamified challenges, connect with a vibrant community, and get instant help from your personal AI study buddy. Your learning journey starts here.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 md:gap-4 mb-8">
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base ${
                  isDark
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                } hover:scale-105 shadow-lg`}
              >
                🚀 Get Started
              </button>
              
              <button
                onClick={() => {
                  document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-all duration-300 border-2 text-sm md:text-base ${
                  isDark
                    ? 'border-purple-400/50 text-purple-300 hover:border-purple-300 hover:bg-purple-900/20'
                    : 'border-purple-600 text-purple-600 hover:border-purple-700 hover:bg-purple-50 bg-white'
                } hover:scale-105`}
              >
                📚 Explore Features
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN - Illustration */}
          <div className="relative hidden md:flex items-center justify-center h-full">
            <div className="absolute top-20 left-1/4 animate-bounce" style={{ animationDelay: '0s' }}>
              <GraduationCap className={`w-32 h-32 ${isDark ? 'text-purple-400' : 'text-purple-600'} opacity-80`} />
            </div>

            <div className="absolute top-1/3 right-10 animate-bounce" style={{ animationDelay: '0.2s' }}>
              <BookOpen className={`w-24 h-24 ${isDark ? 'text-pink-400' : 'text-pink-600'} opacity-60`} />
            </div>

            <div className="absolute bottom-1/3 left-1/4 animate-pulse">
              <Sparkles className="w-16 h-16 text-yellow-400 opacity-70" />
            </div>

            <div className="absolute bottom-20 right-1/4 animate-bounce" style={{ animationDelay: '0.4s' }}>
              <Trophy className="w-20 h-20 text-amber-400 opacity-60" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-80 h-80 rounded-full blur-3xl ${
                isDark
                  ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20'
                  : 'bg-gradient-to-r from-purple-400/20 to-pink-400/20'
              }`} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className={`py-20 transition-colors duration-300 ${
        isDark
          ? 'bg-slate-900/50 border-t border-purple-800/30'
          : 'bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Why Choose CodeFlux?
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Experience revolutionary features designed to transform your learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
              isDark
                ? 'bg-slate-800/40 border-purple-700/30 hover:border-purple-500/60 hover:bg-slate-800/60'
                : 'bg-white border-gray-100 hover:border-purple-200'
            } hover:shadow-xl`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                isDark
                  ? 'bg-purple-900/40 group-hover:bg-purple-800/60'
                  : 'bg-purple-100 group-hover:bg-purple-200'
              }`}>
                <Zap className={`w-7 h-7 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <h4 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🚀 AI Course Generation
              </h4>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Generate personalized courses with a single click. Our AI creates structured content with topics, exercises, and Q&A.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
              isDark
                ? 'bg-slate-800/40 border-pink-700/30 hover:border-pink-500/60 hover:bg-slate-800/60'
                : 'bg-white border-gray-100 hover:border-pink-200'
            } hover:shadow-xl`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                isDark
                  ? 'bg-pink-900/40 group-hover:bg-pink-800/60'
                  : 'bg-pink-100 group-hover:bg-pink-200'
              }`}>
                <Zap className={`w-7 h-7 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
              </div>
              <h4 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ✏️ Quiz Center
              </h4>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Test your knowledge with AI-powered quizzes tailored to your learning pace. Get instant feedback and detailed explanations for every answer.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
              isDark
                ? 'bg-slate-800/40 border-amber-700/30 hover:border-amber-500/60 hover:bg-slate-800/60'
                : 'bg-white border-gray-100 hover:border-amber-200'
            } hover:shadow-xl`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                isDark
                  ? 'bg-amber-900/40 group-hover:bg-amber-800/60'
                  : 'bg-amber-100 group-hover:bg-amber-200'
              }`}>
                <Trophy className={`w-7 h-7 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
              </div>
              <h4 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🎮 Gamification & Rewards
              </h4>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Earn XP, maintain streaks, unlock badges, and climb the leaderboard. Learning has never been this fun and engaging.
              </p>
            </div>

            {/* Feature 4 */}
            <div className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
              isDark
                ? 'bg-slate-800/40 border-blue-700/30 hover:border-blue-500/60 hover:bg-slate-800/60'
                : 'bg-white border-gray-100 hover:border-blue-200'
            } hover:shadow-xl`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                isDark
                  ? 'bg-blue-900/40 group-hover:bg-blue-800/60'
                  : 'bg-blue-100 group-hover:bg-blue-200'
              }`}>
                <Users className={`w-7 h-7 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h4 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                👥 Community & Collaboration
              </h4>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Join Study Rooms, collaborate with thousands of learners, share insights, and grow together as a community.
              </p>
            </div>

            {/* Feature 5 */}
            <div className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
              isDark
                ? 'bg-slate-800/40 border-green-700/30 hover:border-green-500/60 hover:bg-slate-800/60'
                : 'bg-white border-gray-100 hover:border-green-200'
            } hover:shadow-xl`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                isDark
                  ? 'bg-green-900/40 group-hover:bg-green-800/60'
                  : 'bg-green-100 group-hover:bg-green-200'
              }`}>
                <BarChart3 className={`w-7 h-7 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <h4 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                📊 Progress Tracking
              </h4>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Visualize your learning journey with detailed analytics, progress rings, and comprehensive performance metrics.
              </p>
            </div>

            {/* Feature 6 */}
            <div className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
              isDark
                ? 'bg-slate-800/40 border-purple-700/30 hover:border-purple-500/60 hover:bg-slate-800/60'
                : 'bg-white border-gray-100 hover:border-purple-200'
            } hover:shadow-xl`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                isDark
                  ? 'bg-purple-900/40 group-hover:bg-purple-800/60'
                  : 'bg-purple-100 group-hover:bg-purple-200'
              }`}>
                <Sparkles className={`w-7 h-7 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <h4 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ✨ Personalization
              </h4>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                AI adapts to your learning style and pace. Get recommendations tailored specifically to your goals and interests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-slate-900 to-slate-950'
          : 'bg-gradient-to-b from-indigo-50 to-white'
      }`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className={`text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Ready to Transform Your Learning?</h2>
          <p className={`text-xl mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Join thousands of learners who are already experiencing the future of AI-powered education. Start your free journey today.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition font-bold text-lg hover:scale-105 shadow-lg"
          >
            🚀 Start Learning Today
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