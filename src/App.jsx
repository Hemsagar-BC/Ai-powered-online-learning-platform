import React, { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import MyLearning from './pages/MyLearning'
import Quiz from './pages/Quiz'
import CourseOverview from './pages/CourseOverview'
import ChapterDetail from './pages/ChapterDetail'
import Profile from './pages/Profile'
import Community from './pages/Community'
import Settings from './pages/Settings'
import Onboarding from './pages/Onboarding'
import StudyTimer from './pages/StudyTimer'
import Explore from './pages/Explore'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

export default function App(){
  const location = useLocation()
  const isLanding = location.pathname === '/landing' || location.pathname === '/'
  const isOnboarding = location.pathname === '/onboarding'
  const isStudyTimer = location.pathname === '/study-timer'

  // Debug log
  useEffect(() => {
    console.log('Current path:', location.pathname)
  }, [location.pathname])

  return (
    <>
      {isLanding ? (
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/landing" element={<Landing/>} />
        </Routes>
      ) : isOnboarding ? (
        <Routes>
          <Route path="/onboarding" element={<Onboarding/>} />
        </Routes>
      ) : isStudyTimer ? (
        <Routes>
          <Route path="/study-timer" element={<StudyTimer/>} />
        </Routes>
      ) : (
        <div className="min-h-screen flex bg-surface">
          <Sidebar />
          <div className="flex-1">
            <Navbar />
            <main className="p-8">
              <Routes>
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/my-learning" element={<MyLearning/>} />
                <Route path="/quiz" element={<Quiz/>} />
                <Route path="/explore" element={<Explore/>} />
                <Route path="/course/:id" element={<CourseOverview/>} />
                <Route path="/course/:id/chapter/:cid" element={<ChapterDetail/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/community" element={<Community/>} />
                <Route path="/settings" element={<Settings/>} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </>
  )
}
