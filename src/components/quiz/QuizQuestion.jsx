import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { AlertCircle, HelpCircle } from 'lucide-react'

export const QuizQuestion = ({
  questionNumber = 1,
  totalQuestions = 10,
  question = '',
  type = 'multiple-choice', // multiple-choice, true-false, short-answer
  difficulty = 'medium',
  hint = '',
  onShowHint,
  showHint = false,
  className = ''
}) => {
  const [hintUsed, setHintUsed] = useState(false)

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  }

  const handleHint = () => {
    setHintUsed(true)
    onShowHint?.()
  }

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-600">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[difficulty]}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Text */}
      <h2 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
        {question}
      </h2>

      {/* Hint */}
      {hint && (
        <>
          {showHint && (
            <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
              <div className="flex items-start gap-2">
                <HelpCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-900">{hint}</p>
              </div>
            </div>
          )}

          {!hintUsed && (
            <button
              onClick={handleHint}
              className="mb-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              <HelpCircle size={16} />
              Get a Hint
            </button>
          )}
        </>
      )}
    </div>
  )
}

QuizQuestion.propTypes = {
  questionNumber: PropTypes.number,
  totalQuestions: PropTypes.number,
  question: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['multiple-choice', 'true-false', 'short-answer']),
  difficulty: PropTypes.oneOf(['easy', 'medium', 'hard']),
  hint: PropTypes.string,
  onShowHint: PropTypes.func,
  showHint: PropTypes.bool,
  className: PropTypes.string
}

export default QuizQuestion
