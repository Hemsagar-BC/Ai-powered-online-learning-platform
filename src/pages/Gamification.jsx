import React, { useState, useEffect } from 'react'
import { Zap, Award, Trophy, Flame, TrendingUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { calculateLevel, checkAchievements, getAchievementDetails, getAllAchievements, LEVEL_THRESHOLDS } from '../lib/xpCalculator'
import { XPDisplay, LevelBadge, LevelProgress } from '../components/gamification/GamificationDisplays'
import { getAllUserProgress } from '../lib/progressService'

export default function Gamification() {
  const { user } = useAuth()
  const [xpData, setXpData] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadGamificationData = async () => {
      try {
        setLoading(true)
        
        // Get all courses and progress
        let allCourses = JSON.parse(localStorage.getItem('generatedCourses') || '[]')
        if (allCourses.length === 0) {
          allCourses = JSON.parse(localStorage.getItem('codeflux_courses') || '[]')
        }
        
        const progressData = await getAllUserProgress()
        
        // Calculate total XP
        let totalXP = 0
        let lessonsCompleted = 0
        let coursesCompleted = 0
        
        Object.values(progressData).forEach(course => {
          if (course.completedChapters?.length > 0) {
            lessonsCompleted += course.completedChapters.length
            totalXP += course.completedChapters.length * 50 // Lesson XP
          }
          if (course.completed) {
            totalXP += 500 // Course completion XP
            coursesCompleted++
          }
        })
        
        // Calculate level
        const levelInfo = calculateLevel(totalXP)
        
        // Set XP data
        const xpInfo = {
          currentXP: totalXP % (levelInfo.nextLevelXP - levelInfo.minXP),
          totalXP: totalXP,
          xpToNextLevel: levelInfo.nextLevelXP,
          level: levelInfo.level,
          progress: levelInfo.progressToNextLevel
        }
        setXpData(xpInfo)
        
        // Check achievements
        const userStats = {
          lessonsCompleted,
          coursesCompleted,
          coursesCreated: allCourses.length,
          streakDays: 0,
          totalStudyTime: 0,
          achievements: []
        }
        
        const unlockedIds = checkAchievements(userStats)
        const unlockedAchievements = unlockedIds
          .map(id => getAchievementDetails(id))
          .filter(Boolean)
        setAchievements(unlockedAchievements)
        
        // Set milestones
        setMilestones(LEVEL_THRESHOLDS)
        
        // Create mock leaderboard
        const mockLeaderboard = [
          { rank: 1, name: 'Alex Chen', xp: 5000, level: 5, avatar: '👨‍💻' },
          { rank: 2, name: 'Sarah Johnson', xp: 4500, level: 4, avatar: '👩‍💻' },
          { rank: 3, name: 'Mike Williams', xp: 4200, level: 4, avatar: '👨‍🎓' },
          { rank: 4, name: 'Emma Davis', xp: 3800, level: 4, avatar: '👩‍🎓' },
          { rank: 5, name: 'John Smith', xp: 3500, level: 3, avatar: '👨‍💼' },
        ]
        setLeaderboard(mockLeaderboard)
      } catch (error) {
        console.error('Error loading gamification data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadGamificationData()
  }, [user?.uid])

  if (!xpData || loading) {
    return <div className="animate-pulse text-center py-12">Loading gamification stats...</div>
  }

  const levelBadge = calculateLevel(xpData.totalXP)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Gamification Stats</h1>
        <p className="text-slate-600">Track your progress, achievements, and rankings</p>
      </div>

      {/* XP and Level Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <XPDisplay
            currentXP={xpData.currentXP}
            xpToNextLevel={xpData.xpToNextLevel}
            level={xpData.level}
            className="h-full"
          />
        </div>
        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${levelBadge.color} border-4 border-white shadow-lg mb-4`}>
            <span className="text-6xl font-bold">{xpData.level}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center">{levelBadge.title}</h3>
          <div className="text-3xl mt-2">{levelBadge.emoji}</div>
        </div>
      </div>

      {/* Achievements */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Award size={32} className="text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Achievements ({achievements.length})</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {achievements.map((ach, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-lg transition-shadow cursor-pointer group"
              title={ach.description}
            >
              <div className="text-4xl mb-2 group-hover:scale-125 transition-transform">{ach.icon}</div>
              <p className="text-xs font-semibold text-purple-900 text-center">{ach.name}</p>
            </div>
          ))}
        </div>

        {achievements.length === 0 && (
          <p className="text-center text-slate-500 py-8">Start learning to unlock achievements!</p>
        )}
      </section>

      {/* Leaderboard */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy size={32} className="text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
        </div>

        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div 
              key={entry.rank}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                entry.rank === 1 ? 'bg-yellow-50 border-yellow-300' :
                entry.rank === 2 ? 'bg-gray-50 border-gray-300' :
                entry.rank === 3 ? 'bg-orange-50 border-orange-300' :
                'bg-white border-gray-200'
              }`}
            >
        <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                </div>
                <div className="text-2xl">{entry.avatar}</div>
                <div>
                  <p className="font-semibold text-gray-900">{entry.name}</p>
                  <p className="text-sm text-slate-500">Level {entry.level}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-xl font-bold text-purple-600">
                  <Zap size={20} />
                  {entry.xp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones */}
      <section>
        <LevelProgress
          currentLevel={xpData.level}
          milestones={milestones}
        />
      </section>

      {/* Stats Summary */}
      <section className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <p className="text-sm text-slate-600 mb-1">Total XP</p>
            <p className="text-3xl font-bold text-indigo-600">{xpData.totalXP}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <p className="text-sm text-slate-600 mb-1">Current Level</p>
            <p className="text-3xl font-bold text-indigo-600">{xpData.level}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <p className="text-sm text-slate-600 mb-1">Progress to Next</p>
            <p className="text-3xl font-bold text-indigo-600">{Math.round(xpData.progress)}%</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <p className="text-sm text-slate-600 mb-1">Achievements</p>
            <p className="text-3xl font-bold text-indigo-600">{achievements.length}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
