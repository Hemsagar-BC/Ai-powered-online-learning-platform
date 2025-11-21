import React from 'react'
import PropTypes from 'prop-types'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export const QuizFeedback = ({
  isCorrect = null,
  feedback = '',
  explanation = '',
  correctAnswer = '',
  timeSpent = 0,
  earnedPoints = 0,
  totalPoints = 0,
  onContinue
}) => {
  return (
    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
      {/* Feedback Icon */}
      <div className="text-center mb-6">
        {isCorrect === true && (
          <div className="inline-block">
            <CheckCircle size={64} className="text-green-600 mx-auto animate-bounce" />
            <h2 className="text-2xl font-bold text-green-600 mt-4">Great Job! 🎉</h2>
          </div>
        )}
        {isCorrect === false && (
          <div className="inline-block">
            <XCircle size={64} className="text-red-600 mx-auto" />
            <h2 className="text-2xl font-bold text-red-600 mt-4">Not Quite Right</h2>
          </div>
        )}
        {isCorrect === null && (
          <div className="inline-block">
            <AlertCircle size={64} className="text-gray-600 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-600 mt-4">Review Your Answer</h2>
          </div>
        )}
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div className={`p-4 rounded-lg mb-6 ${
          isCorrect === true ? 'bg-green-50 border border-green-200' :
          isCorrect === false ? 'bg-red-50 border border-red-200' :
          'bg-gray-50 border border-gray-200'
        }`}>
          <p className={`font-medium ${
            isCorrect === true ? 'text-green-900' :
            isCorrect === false ? 'text-red-900' :
            'text-gray-900'
          }`}>
            {feedback}
          </p>
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
          <p className="text-blue-900 leading-relaxed">{explanation}</p>
        </div>
      )}

      {/* Correct Answer */}
      {correctAnswer && isCorrect === false && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-1">Correct Answer:</h4>
          <p className="text-green-900">{correctAnswer}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200">
        {timeSpent > 0 && (
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Time Spent</p>
            <p className="text-lg font-bold text-gray-900">{timeSpent}s</p>
          </div>
        )}
        {totalPoints > 0 && (
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Points Earned</p>
            <p className={`text-lg font-bold ${
              isCorrect === true ? 'text-green-600' : 'text-gray-900'
            }`}>
              {earnedPoints}/{totalPoints}
            </p>
          </div>
        )}
        {isCorrect && (
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Status</p>
            <p className={`text-lg font-bold ${
              isCorrect === true ? 'text-green-600' : 'text-red-600'
            }`}>
              {isCorrect === true ? '✓ Correct' : '✗ Incorrect'}
            </p>
          </div>
        )}
      </div>

      {/* Continue Button */}
      <button
        onClick={onContinue}
        className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
      >
        Continue to Next Question
      </button>
    </div>
  )
}

QuizFeedback.propTypes = {
  isCorrect: PropTypes.bool,
  feedback: PropTypes.string,
  explanation: PropTypes.string,
  correctAnswer: PropTypes.string,
  timeSpent: PropTypes.number,
  earnedPoints: PropTypes.number,
  totalPoints: PropTypes.number,
  onContinue: PropTypes.func
}

export default QuizFeedback
