import React from 'react'
import PropTypes from 'prop-types'
import { Clock, BookOpen, Users, Star, Download } from 'lucide-react'

export const ChapterInfo = ({ 
  title,
  description,
  duration,
  difficulty = 'intermediate',
  studentsCount = 0,
  rating = 4.5,
  resources = [],
  instructor = {},
  onDownloadResource
}) => {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-blue-100 text-blue-800',
    advanced: 'bg-red-100 text-red-800'
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-y border-gray-200">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-blue-600" />
          <div>
            <p className="text-xs text-gray-600">Duration</p>
            <p className="font-semibold text-gray-900">{duration}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-green-600" />
          <div>
            <p className="text-xs text-gray-600">Difficulty</p>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${difficultyColors[difficulty]}`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Users size={18} className="text-purple-600" />
          <div>
            <p className="text-xs text-gray-600">Students</p>
            <p className="font-semibold text-gray-900">{studentsCount.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Star size={18} className="text-yellow-500" />
          <div>
            <p className="text-xs text-gray-600">Rating</p>
            <p className="font-semibold text-gray-900">{rating.toFixed(1)}/5</p>
          </div>
        </div>
      </div>

      {/* Instructor */}
      {instructor.name && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Instructor</p>
          <div className="flex items-center gap-3">
            {instructor.avatar && (
              <img 
                src={instructor.avatar} 
                alt={instructor.name}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div>
              <p className="font-semibold text-gray-900">{instructor.name}</p>
              {instructor.title && <p className="text-sm text-gray-600">{instructor.title}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Resources */}
      {resources.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Resources</h3>
          <div className="space-y-2">
            {resources.map((resource, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">{resource.name}</span>
                <button
                  onClick={() => onDownloadResource?.(resource)}
                  className="p-1 hover:bg-white rounded transition-colors"
                >
                  <Download size={16} className="text-blue-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

ChapterInfo.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  difficulty: PropTypes.oneOf(['beginner', 'intermediate', 'advanced']),
  studentsCount: PropTypes.number,
  rating: PropTypes.number,
  resources: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string
  })),
  instructor: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
    avatar: PropTypes.string
  }),
  onDownloadResource: PropTypes.func
}

export default ChapterInfo
