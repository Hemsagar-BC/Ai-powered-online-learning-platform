import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { signInWithGoogle } from '../lib/firebase'
import { generateCourse } from '../lib/api'
import { saveCourseToFirebase } from '../lib/firebaseCoursesService'

export default function CreateCourseModal({onClose, isGuest}){
  const [open, setOpen] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [chapters, setChapters] = useState(7)
  const [difficulty, setDifficulty] = useState('Beginner')
  const [category, setCategory] = useState('Technology')
  const [loading, setLoading] = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const navigate = useNavigate()
  const { user, isAuthenticated: authStatus, showNotification } = useAuth()

  const isSignedIn = authStatus || (user && user.email !== 'demo@codeflux.dev')

  async function submit(e){
    e.preventDefault()
    
    if (!isSignedIn) {
      showNotification('⚠️ Please sign in to generate courses', 'error')
      return
    }

    if (!name.trim()) {
      showNotification('⚠️ Please enter a course name', 'error')
      return
    }

    setLoading(true)
    try{
      showNotification('🤖 Generating course with AI...', 'info')
      
      // Call backend API to generate course with Gemini
      const data = await generateCourse({
        title: name,
        description: description,
        chapters: chapters,
        difficulty: difficulty,
        category: category
      })

      if (data.success && data.course) {
        // Store course in localStorage with unique ID
        const courseId = data.course.id || `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const fullCourse = {
          id: courseId,
          ...data.course,
          createdBy: user?.email,
          createdAt: new Date().toISOString()
        }

        // Save to localStorage
        const courses = JSON.parse(localStorage.getItem('codeflux_courses') || '[]')
        courses.push(fullCourse)
        localStorage.setItem('codeflux_courses', JSON.stringify(courses))

        // ✅ Save to Firebase
        if (user?.email && user?.email !== 'demo@codeflux.dev') {
          try {
            await saveCourseToFirebase(fullCourse, user.email)
            showNotification('✅ Course saved to Firebase!', 'success')
          } catch (error) {
            console.error('Firebase save error:', error)
            showNotification('⚠️ Course created locally (Firebase save failed)', 'warning')
          }
        }

        // Update user stats
        const stats = JSON.parse(localStorage.getItem('codeflux_user_stats') || '{"totalCourses":0,"completed":0,"inProgress":0,"streak":0,"xp":0}')
        stats.totalCourses = (stats.totalCourses || 0) + 1
        stats.inProgress = (stats.inProgress || 0) + 1
        localStorage.setItem('codeflux_user_stats', JSON.stringify(stats))

        showNotification('✅ Course generated successfully!', 'success')
        
        // Navigate to the generated course
        setTimeout(() => {
          navigate(`/course/${courseId}`)
          setOpen(false)
          if(onClose) onClose()
        }, 1500)
      } else {
        throw new Error('No course data received')
      }
    }catch(err){
      console.error('Course generation error:', err)
      showNotification(`❌ Error: ${err.message || 'Failed to generate course'}`, 'error')
    }finally{
      setLoading(false)
    }
  }

  const handleSignIn = async () => {
    setSigningIn(true)
    try {
      await signInWithGoogle()
      showNotification('✅ Signed in successfully!', 'success')
    } catch (error) {
      console.error('Sign-in error:', error)
      showNotification('❌ Sign-in failed', 'error')
    } finally {
      setSigningIn(false)
    }
  }

  function closeModal(){
    setOpen(false)
    if(onClose) onClose()
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form onSubmit={submit} className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg p-8 shadow-xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold dark:text-white">✨ Create Course</h3>
              <button type="button" onClick={closeModal} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-2xl">✕</button>
            </div>

            {!isSignedIn && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                  <strong>🔐 Sign In Required:</strong> Sign in with Google to generate AI-powered courses.
                </p>
                <button 
                  type="button"
                  onClick={handleSignIn}
                  disabled={signingIn}
                  className="w-full py-2 px-4 rounded-lg bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition font-semibold disabled:opacity-50"
                >
                  {signingIn ? '🔄 Signing In...' : '🔵 Sign in with Google'}
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 text-sm font-semibold dark:text-white">Course Name *</label>
                <input 
                  required 
                  maxLength={100} 
                  value={name} 
                  onChange={e=>setName(e.target.value)} 
                  placeholder="e.g., Machine Learning Basics"
                  className="w-full border rounded-lg p-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white" 
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold dark:text-white">Category</label>
                <select 
                  value={category} 
                  onChange={e=>setCategory(e.target.value)} 
                  className="w-full border rounded-lg p-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  disabled={loading}
                >
                  <option>Technology</option>
                  <option>Business</option>
                  <option>Science</option>
                  <option>Arts</option>
                  <option>Health</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold dark:text-white">Course Description</label>
              <textarea 
                maxLength={500} 
                value={description} 
                onChange={e=>setDescription(e.target.value)} 
                placeholder="What should students learn from this course?"
                className="w-full border rounded-lg p-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white h-20" 
                disabled={loading}
              />
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description.length}/500 characters</div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-white">Chapters</label>
                <select 
                  value={chapters} 
                  onChange={e=>setChapters(Number(e.target.value))} 
                  className="w-full border rounded-lg p-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  disabled={loading}
                >
                  {Array.from({length: 13}, (_, i) => i + 3).map(n => (
                    <option key={n} value={n}>{n} chapters</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-white">Difficulty</label>
                <select 
                  value={difficulty} 
                  onChange={e=>setDifficulty(e.target.value)} 
                  className="w-full border rounded-lg p-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  disabled={loading}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-white">Course Type</label>
                <select 
                  className="w-full border rounded-lg p-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  disabled={loading}
                >
                  <option>Text + Quiz</option>
                  <option>With Examples</option>
                  <option>Project-Based</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                type="button"
                onClick={closeModal}
                className="flex-1 py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition font-semibold"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading || !isSignedIn} 
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  loading || !isSignedIn
                    ? 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                }`}
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin">⏳</span>
                    Generating...
                  </>
                ) : (
                  <>
                    ✨ Generate Course
                  </>
                )}
              </button>
            </div>

            {!isSignedIn && (
              <p className="text-xs text-slate-600 dark:text-slate-400 text-center mt-4">
                💡 Sign in to unlock AI course generation
              </p>
            )}
          </form>
        </div>
      )}
    </>
  )
}
