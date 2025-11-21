import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Award, Trophy, Star, Zap, TrendingUp, Calendar } from 'lucide-react'

export const RecentAchievements = ({
  achievements = [],
  className = ''
}) => {
  const [filter, setFilter] = useState('all')

  const filteredAchievements = filter === 'all' 
    ? achievements 
    : achievements.filter(a => a.type === filter)

  const typeIcons = {
    badge: <Award size={20} />,
    trophy: <Trophy size={20} />,
    milestone: <Star size={20} />,
    streak: <Zap size={20} />
  }

  const typeColors = {
    badge: 'bg-purple-100 text-purple-800',
    trophy: 'bg-yellow-100 text-yellow-800',
    milestone: 'bg-blue-100 text-blue-800',
    streak: 'bg-red-100 text-red-800'
  }

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Achievements</h3>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {['all', 'badge', 'trophy', 'milestone', 'streak'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Achievements List */}
      <div className="space-y-3">
        {filteredAchievements.length > 0 ? (
          filteredAchievements.map((achievement, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all flex items-start gap-3 ${typeColors[achievement.type]}`}
            >
              <div className="flex-shrink-0 mt-1">
                {typeIcons[achievement.type]}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{achievement.title}</h4>
                <p className="text-sm opacity-90 mb-2">{achievement.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {achievement.date}
                  </span>
                  {achievement.points && (
                    <span className="font-semibold text-lg">+{achievement.points} XP</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Trophy size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">No achievements yet. Keep learning!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const ActivityChart = ({
  data = [],
  className = ''
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 1)

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Activity</h3>
        <span className="text-xs text-gray-600">Last 7 days</span>
      </div>

      <div className="flex items-end justify-between gap-2 h-40">
        {data.length > 0 ? (
          data.map((day, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-200 rounded-t relative group cursor-pointer">
                <div 
                  className="w-full bg-blue-600 rounded-t transition-all duration-200 group-hover:bg-blue-700"
                  style={{ height: `${(day.value / maxValue) * 100}%` }}
                />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {day.value} min
                </div>
              </div>
              <span className="text-xs text-gray-600 mt-2">{day.day}</span>
            </div>
          ))
        ) : (
          <div className="w-full flex items-center justify-center text-gray-500">
            No activity data
          </div>
        )}
      </div>
    </div>
  )
}

export const QuizPerformanceChart = ({
  data = [],
  className = ''
}) => {
  const stats = {
    total: data.length,
    passed: data.filter(d => d.score >= 70).length,
    failed: data.filter(d => d.score < 70).length,
    average: data.length > 0 
      ? Math.round(data.reduce((sum, d) => sum + d.score, 0) / data.length)
      : 0
  }

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Quiz Performance</h3>
        <TrendingUp size={20} className="text-blue-600" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Total Quizzes</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Passed</p>
          <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
        </div>
        <div className="p-3 bg-red-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Failed</p>
          <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Average</p>
          <p className="text-2xl font-bold text-blue-600">{stats.average}%</p>
        </div>
      </div>

      {/* Recent Quizzes */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-600 mb-2">Recent Attempts</p>
        {data.slice(0, 3).map((quiz, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-700">{quiz.name}</span>
            <span className={`text-sm font-semibold ${quiz.score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
              {quiz.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const LearningHeatmap = ({
  data = [],
  className = ''
}) => {
  const weeks = 4
  const daysPerWeek = 7
  const intensityColors = (value) => {
    if (value === 0) return 'bg-gray-100'
    if (value < 30) return 'bg-blue-100'
    if (value < 60) return 'bg-blue-400'
    if (value < 90) return 'bg-blue-600'
    return 'bg-blue-800'
  }

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Heatmap</h3>
      
      <div className="space-y-2">
        {Array(weeks).fill(0).map((_, weekIdx) => (
          <div key={weekIdx} className="flex gap-1 items-center">
            <span className="text-xs text-gray-500 w-8">W{weekIdx + 1}</span>
            <div className="flex gap-1">
              {Array(daysPerWeek).fill(0).map((_, dayIdx) => {
                const index = weekIdx * daysPerWeek + dayIdx
                const value = data[index] || 0
                return (
                  <div
                    key={dayIdx}
                    title={`${value} minutes`}
                    className={`w-6 h-6 rounded transition-all hover:scale-110 cursor-pointer ${intensityColors(value)}`}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-xs">
        <span className="text-gray-600">Less</span>
        {[0, 30, 60, 90].map(val => (
          <div key={val} className={`w-4 h-4 rounded ${intensityColors(val)}`} />
        ))}
        <span className="text-gray-600">More</span>
      </div>
    </div>
  )
}

RecentAchievements.propTypes = {
  achievements: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['badge', 'trophy', 'milestone', 'streak']),
    date: PropTypes.string,
    points: PropTypes.number
  })),
  className: PropTypes.string
}

ActivityChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    day: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  })),
  className: PropTypes.string
}

QuizPerformanceChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired
  })),
  className: PropTypes.string
}

LearningHeatmap.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  className: PropTypes.string
}

export default {
  RecentAchievements,
  ActivityChart,
  QuizPerformanceChart,
  LearningHeatmap
}
