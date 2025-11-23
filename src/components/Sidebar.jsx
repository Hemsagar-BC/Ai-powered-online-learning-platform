import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { signInWithGoogle } from '../lib/firebase'
import CreateCourseModal from './CreateCourseModal'
import { Menu, X } from 'lucide-react'

export default function Sidebar({ isMobile }){
  const [showModal, setShowModal] = useState(false)
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)
  const [isGuestMode, setIsGuestMode] = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()

  const handleCreateCourse = async () => {
    if (!user || user.email === 'demo@codeflux.dev') {
      setShowSignInPrompt(true)
    } else {
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

  const navItems = [
    { to: '/landing', icon: '🏠', label: 'Home' },
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/my-learning', icon: '📚', label: 'My Learning' },
    { to: '/quiz', icon: '✏️', label: 'Quiz Center' },
    { to: '/explore', icon: '🔍', label: 'Explore' },
    { to: '/progress', icon: '📈', label: 'Progress' },
    { to: '/gamification', icon: '⭐', label: 'Gamification' },
    { to: '/profile', icon: '👤', label: 'Profile' },
    { to: '/settings', icon: '⚙️', label: 'Settings' },
    { to: '/community', icon: '👥', label: 'Community' }
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="fixed left-0 top-0 w-60 h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 border-r border-purple-500/20 z-50 flex flex-col overflow-y-auto hidden md:flex" style={{width:240}}>
          <div className="p-6 flex flex-col h-full">
            {/* Logo Section */}
            <div className="mb-8">
              <NavLink to="/landing" className="flex flex-col">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">CodeFlux</div>
                <div className="text-xs text-purple-300">AI Learning Platform</div>
              </NavLink>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 mb-6">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink 
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({isActive})=> isActive 
                        ? 'block px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold' 
                        : 'block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800'}
                    >
                      {item.icon} {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Create Course Button */}
            <div className="mt-6">
              <button 
                onClick={handleCreateCourse} 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition shadow-lg"
              >
                + Create Course
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Mobile Top Navigation Bar */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-500/20 z-50 flex items-center justify-between px-4">
          <NavLink to="/landing" className="flex flex-col">
            <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">CodeFlux</div>
          </NavLink>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2 hover:bg-slate-800 rounded-lg transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobile && mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Drawer */}
          <div className="fixed left-0 top-16 right-0 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 z-40 md:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink 
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({isActive})=> isActive 
                        ? 'block px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold' 
                        : 'block px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition'}
                    >
                      {item.icon} {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              {/* Mobile Create Button */}
              <div className="mt-6 pt-6 border-t border-purple-500/20">
                <button 
                  onClick={() => {
                    handleCreateCourse()
                    setMobileMenuOpen(false)
                  }} 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  + Create Course
                </button>
              </div>
            </nav>
          </div>
        </>
      )}

      {/* Sign In Prompt Modal */}
      {showSignInPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-lg shadow-2xl p-6 md:p-8 max-w-md w-full border border-purple-500/30">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
              <p className="text-purple-300">Create amazing AI courses</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <p className="text-sm text-slate-300 text-center">
                Sign in to create and save your courses instantly!
              </p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {signingIn ? 'Signing In...' : 'Sign in with Google'}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-purple-500/20">
              <button 
                onClick={handleGuestContinue}
                className="w-full py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
              >
                Continue as Guest
              </button>
            </div>

            <button 
              onClick={() => setShowSignInPrompt(false)}
              className="w-full mt-3 py-2 px-4 rounded-lg border border-purple-500/30 text-slate-300 hover:bg-slate-800/50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showModal && <CreateCourseModal onClose={() => setShowModal(false)} isGuest={isGuestMode} />}
    </>
  )
}
