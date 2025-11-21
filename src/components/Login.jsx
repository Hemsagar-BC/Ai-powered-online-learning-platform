import React, { useState } from 'react'
import { signInWithGoogle } from '../lib/firebase'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function login(){
    setIsLoading(true)
    setLoginError('')
    try{
      await signInWithGoogle()
      navigate('/dashboard')
    }catch(e){
      console.error('Login error', e)
      const errorMsg = e.code === 'auth/popup-blocked' 
        ? 'Pop-up blocked. Please allow pop-ups and try again.'
        : e.code === 'auth/cancelled-popup-request'
        ? 'Sign-in cancelled.'
        : e.code === 'auth/network-request-failed'
        ? 'Network error. Please check your connection.'
        : 'Google Sign-In not configured. Please use Try Demo instead.'
      setLoginError(errorMsg)
      console.error('Full error:', e)
    }finally{
      setIsLoading(false)
    }
  }

  function goToDemo(){
    navigate('/dashboard')
  }

  function goToLanding(){
    navigate('/landing')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold text-indigo-600">CodeFlux</div>
            <span className="text-sm text-slate-500 font-medium">Education Platform</span>
          </div>
          <div className="text-sm text-slate-600">Learn. Create. Share.</div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Attractive Background with Images */}
          <div className="relative h-full min-h-96 rounded-2xl overflow-hidden shadow-2xl">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-90"></div>
            
            {/* Decorative circles and shapes */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-white opacity-10 rounded-full -mr-36 -mt-36"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-48 -mb-48"></div>
            
            {/* Educational content showcase */}
            <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
              <div>
                <h2 className="text-4xl font-bold mb-4">Transform Education</h2>
                <p className="text-lg opacity-90 leading-relaxed">
                  Learn cutting-edge skills from industry experts. Create courses in minutes, not months. Join a community of learners and educators.
                </p>
              </div>

              {/* Feature highlights on left */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition">
                  <span className="text-2xl">📚</span>
                  <div>
                    <p className="font-semibold">10,000+</p>
                    <p className="text-sm opacity-80">Courses Created</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition">
                  <span className="text-2xl">👥</span>
                  <div>
                    <p className="font-semibold">50,000+</p>
                    <p className="text-sm opacity-80">Active Learners</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="font-semibold">4.9/5</p>
                    <p className="text-sm opacity-80">Average Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Login Form & Features */}
          <div className="space-y-6">
            
            {/* Login Card */}
            <div className="w-full bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back!</h2>
                <p className="text-slate-600">Sign in to unlock your learning journey</p>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  ⚠️ {loginError}
                </div>
              )}

              {/* Google Sign-In Button */}
              <button 
                onClick={login}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-200 shadow-lg hover:shadow-xl mb-4 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">Or explore as guest</span>
                </div>
              </div>

              {/* Demo Button */}
              <button 
                onClick={goToDemo}
                className="w-full py-3 px-6 rounded-xl border-2 border-indigo-200 text-indigo-600 font-semibold hover:border-indigo-300 hover:bg-indigo-50 transition duration-200 transform hover:scale-105"
              >
                Try Demo
              </button>

              {/* Explore Landing */}
              <button 
                onClick={goToLanding}
                className="w-full py-3 px-6 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition duration-200 mt-3"
              >
                Explore Platform
              </button>

              {/* Footer Info */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-500 text-center">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-md border border-slate-100 hover:shadow-lg transition">
                <div className="text-2xl mb-2">✨</div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">Quick Courses</h3>
                <p className="text-xs text-slate-600">Generate courses instantly</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-slate-100 hover:shadow-lg transition">
                <div className="text-2xl mb-2">💬</div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">AI Buddy</h3>
                <p className="text-xs text-slate-600">24/7 learning support</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-slate-100 hover:shadow-lg transition">
                <div className="text-2xl mb-2">🎓</div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">Free Learning</h3>
                <p className="text-xs text-slate-600">No hidden costs</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-slate-100 hover:shadow-lg transition">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">Share & Earn</h3>
                <p className="text-xs text-slate-600">Build your portfolio</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-slate-600">
          <p>© 2024 CodeFlux. Empowering learners and educators worldwide.</p>
        </div>
      </footer>
    </div>
  )
}
