import React, { useEffect, useState } from 'react'
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
import StudyTimer from './pages/StudyTimer'
import Explore from './pages/Explore'
import Progress from './pages/Progress'
import Gamification from './pages/Gamification'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

export default function App(){
  const location = useLocation()
  const isLanding = location.pathname === '/landing' || location.pathname === '/'
  const isOnboarding = location.pathname === '/onboarding'
  const isStudyTimer = location.pathname === '/study-timer'
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
      ) : isStudyTimer ? (
        <Routes>
          <Route path="/study-timer" element={<StudyTimer/>} />
        </Routes>
      ) : (
        <>
          <Sidebar isMobile={isMobile} />
          <Navbar isMobile={isMobile} />
          <div className={`transition-all duration-300 ${isMobile ? 'ml-0 pt-20' : 'md:ml-60 md:pt-20'}`} style={isMobile ? {} : {marginLeft: 240, marginTop: 80}}>
            <main className="p-4 md:p-8 overflow-y-auto min-h-screen">
              <Routes>
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/my-learning" element={<MyLearning/>} />
                <Route path="/quiz" element={<Quiz/>} />
                <Route path="/explore" element={<Explore/>} />
                <Route path="/progress" element={<Progress/>} />
                <Route path="/gamification" element={<Gamification/>} />
                <Route path="/course/:id" element={<CourseOverview/>} />
                <Route path="/course/:id/chapter/:cid" element={<ChapterDetail/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/community" element={<Community/>} />
                <Route path="/settings" element={<Settings/>} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </>
      )}
    </>
  )
}
