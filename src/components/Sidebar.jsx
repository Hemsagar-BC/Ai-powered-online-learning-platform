import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { signInWithGoogle } from '../lib/firebase'
import CreateCourseModal from './CreateCourseModal'

export default function Sidebar(){
  const [showModal, setShowModal] = useState(false)
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)
  const [isGuestMode, setIsGuestMode] = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const { user } = useAuth()

  const handleCreateCourse = async () => {
    // If demo/guest user, show sign-in prompt
    if (!user || user.email === 'demo@codeflux.dev') {
      setShowSignInPrompt(true)
    } else {
      // Already signed in, show create modal
      setShowModal(true)
    }
  }

  const handleGuestContinue = () => {
    setIsGuestMode(true)
    setShowSignInPrompt(false)
    setShowModal(true)
  }

  const handleGoogleSignIn = async () => {
    setSigningIn(true)
    try {
      await signInWithGoogle()
      setShowSignInPrompt(false)
      setShowModal(true)
      setIsGuestMode(false)
    } catch (error) {
      console.error('Sign-in error:', error)
      alert('Sign-in failed. Please try again.')
    } finally {
      setSigningIn(false)
    }
  }

  return (
    <aside className="w-60 h-screen bg-white border-r" style={{width:240}}>
      <div className="p-6 flex flex-col h-full">
        <div className="mb-8 cursor-pointer hover:opacity-80 transition">
          <NavLink to="/landing" className="flex flex-col">
            <div className="text-2xl font-bold text-primary-600">CodeFlux</div>
            <div className="text-sm text-slate-500">AI Learning</div>
          </NavLink>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li><NavLink to="/landing" className={({isActive})=> isActive? 'font-semibold text-primary-600' : 'text-slate-700'}>Home</NavLink></li>
            <li><NavLink to="/dashboard" className={({isActive})=> isActive? 'font-semibold text-primary-600' : 'text-slate-700'}>Dashboard</NavLink></li>
            <li><NavLink to="/my-learning" className={({isActive})=> isActive? 'font-semibold text-primary-600' : 'text-slate-700'}>My Learning</NavLink></li>
            <li><NavLink to="/quiz" className={({isActive})=> isActive? 'font-semibold text-primary-600' : 'text-slate-700'}>Quiz Center</NavLink></li>
            <li><NavLink to="/explore" className={({isActive})=> isActive? 'font-semibold text-primary-600' : 'text-slate-700'}>Explore</NavLink></li>
            <li><NavLink to="/profile" className={({isActive})=> isActive? 'font-semibold text-primary-600' : 'text-slate-700'}>Profile</NavLink></li>
            <li><NavLink to="/settings" className={({isActive})=> isActive? 'font-semibold text-primary-600' : 'text-slate-700'}>Settings</NavLink></li>
            <li><NavLink to="/community" className={({isActive})=> isActive? 'font-semibold text-primary-600' : 'text-slate-700'}>Community</NavLink></li>
          </ul>
        </nav>

        <div className="mt-4">
          <button onClick={handleCreateCourse} className="w-full bg-primary-500 text-white rounded-md py-2 hover:bg-primary-600 transition">Create New Course</button>
        </div>

        <div className="mt-auto text-sm text-slate-500">Signed in as <strong>Jane</strong></div>
      </div>

      {/* Sign In Prompt Modal */}
      {showSignInPrompt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign In Required</h2>
              <p className="text-slate-600">You need to sign in to generate AI courses.</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <p className="text-sm text-slate-600 text-center">
                Sign in to unlock AI-powered course generation and save your courses!
              </p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 transition font-semibold text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>🔵</span> {signingIn ? 'Signing In...' : 'Sign in with Google'}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <button 
                onClick={handleGuestContinue}
                className="w-full py-2 px-4 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold"
              >
                Continue as Guest
              </button>
              <p className="text-xs text-slate-600 text-center mt-3">
                As a guest, you can view the form but won't be able to generate courses.
              </p>
            </div>

            <button 
              onClick={() => setShowSignInPrompt(false)}
              className="w-full mt-3 py-2 px-4 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showModal && <CreateCourseModal onClose={() => setShowModal(false)} isGuest={isGuestMode} />}
    </aside>
  )
}
