import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CheckCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react'

export const KeyPoints = ({
  points = [],
  canMark = true,
  onPointComplete,
  className = ''
}) => {
  const [expandedIndex, setExpandedIndex] = useState(0)
  const [completedPoints, setCompletedPoints] = useState(new Set())

  const togglePoint = (index) => {
    setExpandedIndex(expandedIndex === index ? -1 : index)
  }

  const toggleComplete = (index) => {
    const newCompleted = new Set(completedPoints)
    if (newCompleted.has(index)) {
      newCompleted.delete(index)
    } else {
      newCompleted.add(index)
    }
    setCompletedPoints(newCompleted)
    onPointComplete?.(index, !completedPoints.has(index))
  }

  const completionPercentage = Math.round((completedPoints.size / points.length) * 100) || 0

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Points</h2>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-semibold text-blue-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Points List */}
      <div className="space-y-2">
        {points.map((point, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
            {/* Point Header */}
            <button
              onClick={() => togglePoint(idx)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
            >
              {/* Checkbox */}
              {canMark && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleComplete(idx)
                  }}
                  className="flex-shrink-0"
                >
                  {completedPoints.has(idx) ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : (
                    <Circle size={20} className="text-gray-400" />
                  )}
                </button>
              )}

              {/* Title */}
              <div className="flex-1">
                <h3 className={`font-semibold text-gray-900 ${completedPoints.has(idx) ? 'line-through text-gray-500' : ''}`}>
                  {point.title}
                </h3>
              </div>

              {/* Toggle Icon */}
              <div className="text-gray-400">
                {expandedIndex === idx ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
            </button>

            {/* Point Details */}
            {expandedIndex === idx && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-700 leading-relaxed">{point.description}</p>

                {/* Sub-points */}
                {point.subPoints && point.subPoints.length > 0 && (
                  <ul className="mt-3 space-y-1 ml-4">
                    {point.subPoints.map((subPoint, subIdx) => (
                      <li key={subIdx} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{subPoint}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Example */}
                {point.example && (
                  <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Example:</p>
                    <code className="text-xs text-gray-600 font-mono">{point.example}</code>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      {points.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">{completedPoints.size} of {points.length}</span> key points mastered
          </p>
        </div>
      )}
    </div>
  )
}

KeyPoints.propTypes = {
  points: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    subPoints: PropTypes.arrayOf(PropTypes.string),
    example: PropTypes.string
  })),
  canMark: PropTypes.bool,
  onPointComplete: PropTypes.func,
  className: PropTypes.string
}

export default KeyPoints
