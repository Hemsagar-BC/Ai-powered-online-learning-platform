import React from 'react'
import { useStreak } from '../contexts/StreakContext'

export default function StreakWidget() {
  const { streak, loading } = useStreak()

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200 animate-pulse">
        <div className="h-4 bg-orange-200 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-orange-200 rounded w-1/2"></div>
      </div>
    )
  }

  const currentStreak = streak?.current || 0
  const longestStreak = streak?.longest || 0
  const freezes = streak?.freezesAvailable || 0
  const totalStudyDays = streak?.totalStudyDays || 0

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">Current Streak</p>
          <div className="flex items-center gap-2">
            <span className="text-4xl">🔥</span>
            <div>
              <p className="text-3xl font-bold text-orange-600">{currentStreak}</p>
              <p className="text-xs text-gray-600">days</p>
            </div>
          </div>
        </div>
        {freezes > 0 && (
          <div className="bg-blue-100 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-600">Freezes</p>
            <p className="text-2xl font-bold text-blue-600">❄️ ×{freezes}</p>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-orange-200">
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">Longest Streak</p>
          <p className="text-xl font-bold text-orange-600">{longestStreak}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">Total Days</p>
          <p className="text-xl font-bold text-orange-600">{totalStudyDays}</p>
        </div>
      </div>

      {/* Message */}
      {currentStreak > 0 && (
        <div className="mt-4 p-3 bg-white rounded-lg border border-orange-200">
          <p className="text-sm font-medium text-gray-900">
            {currentStreak === 1 && '🎯 Great start! Keep it going!'}
            {currentStreak > 1 && currentStreak < 7 && `🚀 ${currentStreak} days strong!`}
            {currentStreak >= 7 && currentStreak < 30 && `🌟 Amazing consistency!`}
            {currentStreak >= 30 && `👑 You are a study legend!`}
          </p>
        </div>
      )}
    </div>
  )
}
