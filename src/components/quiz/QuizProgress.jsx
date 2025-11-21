import React from 'react'
import PropTypes from 'prop-types'
import { Clock, CheckCircle } from 'lucide-react'

export const QuizProgress = ({
  currentQuestion = 1,
  totalQuestions = 10,
  answeredQuestions = 0,
  timeRemaining = 0,
  showTimeWarning = false,
  onPause,
  className = ''
}) => {
  const progress = Math.round((answeredQuestions / totalQuestions) * 100)
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-4 ${className}`}>
      {/* Current Question */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-600">Question Progress</p>
          <span className="text-sm font-bold text-blue-600">{currentQuestion}/{totalQuestions}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Answered Count */}
      <div className="mb-6 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" />
            <span className="text-sm text-gray-700">Questions Answered</span>
          </div>
          <span className="font-bold text-gray-900">{answeredQuestions}/{totalQuestions}</span>
        </div>
        <div className="mt-2 w-full bg-gray-300 rounded-full h-1">
          <div 
            className="bg-green-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Timer */}
      <div className={`mb-6 p-3 rounded-lg flex items-center justify-between ${
        showTimeWarning ? 'bg-red-50 border border-red-300' : 'bg-gray-50'
      }`}>
        <div className="flex items-center gap-2">
          <Clock size={18} className={showTimeWarning ? 'text-red-600' : 'text-gray-600'} />
          <span className={`text-sm font-medium ${showTimeWarning ? 'text-red-700' : 'text-gray-700'}`}>
            Time Remaining
          </span>
        </div>
        <span className={`font-bold text-lg ${
          showTimeWarning ? 'text-red-600 animate-pulse' : 'text-gray-900'
        }`}>
          {formatTime(timeRemaining)}
        </span>
      </div>

      {/* Pause Button */}
      <button
        onClick={onPause}
        className="w-full px-4 py-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
      >
        Pause Quiz
      </button>

      {/* Info */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 Make sure to answer all questions before submitting. You can change your answers anytime.
        </p>
      </div>
    </div>
  )
}

QuizProgress.propTypes = {
  currentQuestion: PropTypes.number,
  totalQuestions: PropTypes.number,
  answeredQuestions: PropTypes.number,
  timeRemaining: PropTypes.number,
  showTimeWarning: PropTypes.bool,
  onPause: PropTypes.func,
  className: PropTypes.string
}

export default QuizProgress
