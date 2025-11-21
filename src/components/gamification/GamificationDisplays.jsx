import React from 'react'
import PropTypes from 'prop-types'
import { Flame, Zap, Award, TrendingUp } from 'lucide-react'

export const StreakDisplay = ({
  streakDays = 0,
  bestStreak = 0,
  onStreakClick,
  className = ''
}) => {
  const streakPercentage = Math.min((streakDays / bestStreak) * 100, 100) || 0

  return (
    <div 
      onClick={onStreakClick}
      className={`bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200 cursor-pointer hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <Flame size={28} className="text-orange-600" />
        <h3 className="text-lg font-bold text-gray-900">Streak</h3>
      </div>

      <div className="space-y-4">
        {/* Current Streak */}
        <div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-bold text-orange-600">{streakDays}</span>
            <span className="text-lg text-orange-500 mb-1">🔥</span>
          </div>
          <p className="text-sm text-gray-600">Current Streak</p>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Best: {bestStreak} days</span>
            <span className="text-xs font-semibold text-orange-600">{Math.round(streakPercentage)}%</span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-2">
            <div 
              className="bg-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${streakPercentage}%` }}
            />
          </div>
        </div>

        {/* Motivational Message */}
        <p className="text-xs text-orange-700 bg-orange-100 p-2 rounded">
          {streakDays === 0 ? '🎯 Start your first day today!' : '⚡ Keep the momentum going!'}
        </p>
      </div>
    </div>
  )
}

export const XPDisplay = ({
  currentXP = 0,
  xpToNextLevel = 100,
  level = 1,
  onXPClick,
  className = ''
}) => {
  const xpProgress = Math.min((currentXP / xpToNextLevel) * 100, 100)
  const xpRemaining = Math.max(xpToNextLevel - currentXP, 0)

  return (
    <div 
      onClick={onXPClick}
      className={`bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200 cursor-pointer hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <Zap size={28} className="text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900">Experience</h3>
      </div>

      <div className="space-y-4">
        {/* Current XP */}
        <div>
          <p className="text-sm text-gray-600 mb-1">Level {level}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-purple-600">{currentXP}</span>
            <span className="text-sm text-gray-500">/ {xpToNextLevel} XP</span>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">To Next Level</span>
            <span className="text-xs font-semibold text-purple-600">{xpRemaining} needed</span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const LevelBadge = ({
  level = 1,
  title = 'Learner',
  badges = [],
  className = ''
}) => {
  const colors = {
    1: 'bg-gray-100 text-gray-900',
    2: 'bg-blue-100 text-blue-900',
    3: 'bg-purple-100 text-purple-900',
    4: 'bg-red-100 text-red-900',
    5: 'bg-yellow-100 text-yellow-900'
  }

  const getColor = () => colors[Math.min(level, 5)] || colors[1]

  return (
    <div className={`text-center ${className}`}>
      <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getColor()} border-4 border-white shadow-lg mb-3`}>
        <span className="text-4xl font-bold">{level}</span>
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      
      {badges && badges.length > 0 && (
        <div className="mt-3 flex gap-1 justify-center flex-wrap">
          {badges.map((badge, idx) => (
            <span key={idx} className="text-xl" title={badge.name}>
              {badge.emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export const LevelProgress = ({
  currentLevel = 1,
  milestones = [],
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg p-6 border border-gray-200 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Level Milestones</h3>
      
      <div className="space-y-3">
        {milestones.map((milestone, idx) => {
          const isCompleted = currentLevel >= milestone.level
          const isCurrent = currentLevel === milestone.level

          return (
            <div 
              key={idx}
              className={`p-3 rounded-lg border-l-4 transition-all ${
                isCompleted
                  ? 'border-l-green-600 bg-green-50'
                  : isCurrent
                  ? 'border-l-blue-600 bg-blue-50'
                  : 'border-l-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Level {milestone.level}</p>
                  <p className="text-sm text-gray-600">{milestone.title}</p>
                </div>
                {isCompleted && (
                  <span className="text-2xl">✓</span>
                )}
              </div>
              {isCurrent && (
                <p className="text-xs text-blue-600 mt-2">Current Level</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

StreakDisplay.propTypes = {
  streakDays: PropTypes.number,
  bestStreak: PropTypes.number,
  onStreakClick: PropTypes.func,
  className: PropTypes.string
}

XPDisplay.propTypes = {
  currentXP: PropTypes.number,
  xpToNextLevel: PropTypes.number,
  level: PropTypes.number,
  onXPClick: PropTypes.func,
  className: PropTypes.string
}

LevelBadge.propTypes = {
  level: PropTypes.number,
  title: PropTypes.string,
  badges: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    emoji: PropTypes.string
  })),
  className: PropTypes.string
}

LevelProgress.propTypes = {
  currentLevel: PropTypes.number,
  milestones: PropTypes.arrayOf(PropTypes.shape({
    level: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired
  })),
  className: PropTypes.string
}

export default {
  StreakDisplay,
  XPDisplay,
  LevelBadge,
  LevelProgress
}
