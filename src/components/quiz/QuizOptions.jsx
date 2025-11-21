import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CheckCircle, XCircle, Circle } from 'lucide-react'

export const QuizOptions = ({
  options = [],
  selectedOption = null,
  correctOption = null,
  questionAnswered = false,
  onSelectOption,
  type = 'multiple-choice',
  className = ''
}) => {
  const [hoveredOption, setHoveredOption] = useState(null)

  const getOptionStyle = (index) => {
    const isSelected = selectedOption === index
    const isCorrect = correctOption === index
    const isAnswered = questionAnswered

    if (!isAnswered) {
      return isSelected
        ? 'border-blue-600 bg-blue-50'
        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
    }

    // After answer is submitted
    if (isCorrect) {
      return 'border-green-600 bg-green-50'
    }
    if (isSelected && !isCorrect) {
      return 'border-red-600 bg-red-50'
    }
    return 'border-gray-200'
  }

  const getIcon = (index) => {
    const isSelected = selectedOption === index
    const isCorrect = correctOption === index
    const isAnswered = questionAnswered

    if (!isAnswered) {
      return isSelected ? (
        <CheckCircle size={20} className="text-blue-600" />
      ) : (
        <Circle size={20} className="text-gray-300" />
      )
    }

    if (isCorrect) {
      return <CheckCircle size={20} className="text-green-600" />
    }
    if (isSelected && !isCorrect) {
      return <XCircle size={20} className="text-red-600" />
    }
    return <Circle size={20} className="text-gray-300" />
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {type === 'true-false' ? (
        // True/False Options
        <div className="grid grid-cols-2 gap-3">
          {['True', 'False'].map((option, idx) => (
            <button
              key={idx}
              onClick={() => !questionAnswered && onSelectOption?.(idx)}
              disabled={questionAnswered}
              className={`p-4 rounded-lg border-2 font-semibold transition-all flex items-center justify-center gap-2 ${getOptionStyle(idx)}`}
            >
              {getIcon(idx)}
              {option}
            </button>
          ))}
        </div>
      ) : (
        // Multiple Choice Options
        options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => !questionAnswered && onSelectOption?.(idx)}
            disabled={questionAnswered}
            onMouseEnter={() => setHoveredOption(idx)}
            onMouseLeave={() => setHoveredOption(null)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-start gap-3 ${getOptionStyle(idx)}`}
          >
            <div className="flex-shrink-0 mt-1">
              {getIcon(idx)}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{option.text}</p>
              {option.explanation && questionAnswered && (
                <p className="text-sm text-gray-600 mt-1">{option.explanation}</p>
              )}
            </div>
          </button>
        ))
      )}
    </div>
  )
}

QuizOptions.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    explanation: PropTypes.string
  })),
  selectedOption: PropTypes.number,
  correctOption: PropTypes.number,
  questionAnswered: PropTypes.bool,
  onSelectOption: PropTypes.func,
  type: PropTypes.oneOf(['multiple-choice', 'true-false']),
  className: PropTypes.string
}

export default QuizOptions
