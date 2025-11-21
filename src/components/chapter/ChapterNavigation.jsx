import React from 'react'
import PropTypes from 'prop-types'
import { ChevronLeft, ChevronRight, Lock, CheckCircle } from 'lucide-react'

export const ChapterNavigation = ({
  currentChapter,
  totalChapters,
  chapters = [],
  onPrevious,
  onNext,
  onSelectChapter,
  isCompleted = false,
  className = ''
}) => {
  const canGoPrevious = currentChapter > 1
  const canGoNext = currentChapter < totalChapters

  const currentChapterData = chapters[currentChapter - 1] || {}

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Chapter {currentChapter} of {totalChapters}</p>
        <h3 className="text-lg font-bold text-gray-900">{currentChapterData.title || 'Chapter'}</h3>
      </div>

      {/* Navigation Controls */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            canGoPrevious
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        {/* Progress */}
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center">
            <span className="text-sm font-semibold text-gray-700">
              {currentChapter}/{totalChapters}
            </span>
            {isCompleted && (
              <CheckCircle size={18} className="text-green-600" />
            )}
          </div>
        </div>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            canGoNext
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Chapter List */}
      {chapters.length > 0 && (
        <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-600 px-2 mb-3">All Chapters</p>
          {chapters.map((chapter, idx) => {
            const chapterNum = idx + 1
            const isCurrentChapter = chapterNum === currentChapter
            const isChapterCompleted = chapter.completed
            const isLocked = chapter.locked

            return (
              <button
                key={idx}
                onClick={() => !isLocked && onSelectChapter?.(chapterNum)}
                disabled={isLocked}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                  isCurrentChapter
                    ? 'bg-blue-50 border-l-4 border-blue-600'
                    : 'hover:bg-gray-50'
                } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {isLocked ? (
                    <Lock size={16} className="text-gray-400" />
                  ) : isChapterCompleted ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      isCurrentChapter ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`} />
                  )}
                </div>

                {/* Chapter Title */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    isCurrentChapter ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {chapter.title || `Chapter ${chapterNum}`}
                  </p>
                  {chapter.duration && (
                    <p className="text-xs text-gray-500">{chapter.duration}</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

ChapterNavigation.propTypes = {
  currentChapter: PropTypes.number.isRequired,
  totalChapters: PropTypes.number.isRequired,
  chapters: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    duration: PropTypes.string,
    completed: PropTypes.bool,
    locked: PropTypes.bool
  })),
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,
  onSelectChapter: PropTypes.func,
  isCompleted: PropTypes.bool,
  className: PropTypes.string
}

export default ChapterNavigation
