import React from 'react'
import PropTypes from 'prop-types'
import { ProgressBar } from '../common'

export function ChapterList({ chapters, currentChapter, onChapterSelect }) {
  return (
    <div className="space-y-2">
      {chapters?.map((chapter, idx) => (
        <button
          key={idx}
          onClick={() => onChapterSelect(idx)}
          className={`w-full text-left p-3 rounded-lg transition ${
            currentChapter === idx
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
          }`}
        >
          <div className="font-medium">Chapter {idx + 1}: {chapter.title}</div>
          <div className="text-xs mt-1 opacity-75">
            {chapter.sections?.length || 0} sections
          </div>
        </button>
      ))}
    </div>
  )
}

ChapterList.propTypes = {
  chapters: PropTypes.array,
  currentChapter: PropTypes.number,
  onChapterSelect: PropTypes.func
}

export function ChapterCard({ chapter, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer p-4"
    >
      <h3 className="font-semibold text-lg mb-2">{chapter.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{chapter.description}</p>
      <div className="flex justify-between items-center text-sm text-gray-700">
        <span>{chapter.sections?.length || 0} sections</span>
        <span>{chapter.duration || 0} min</span>
      </div>
    </div>
  )
}

ChapterCard.propTypes = {
  chapter: PropTypes.object,
  onClick: PropTypes.func
}

export function ChapterTimeline({ chapters, currentChapter }) {
  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
      {chapters?.map((chapter, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
              idx <= currentChapter
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            {idx + 1}
          </div>
          {idx < chapters.length - 1 && (
            <div
              className={`w-8 h-1 ${
                idx < currentChapter ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

ChapterTimeline.propTypes = {
  chapters: PropTypes.array,
  currentChapter: PropTypes.number
}

export function CourseProgress({ course }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold text-lg mb-4">Your Progress</h3>
      <ProgressBar progress={course.progress || 0} showLabel={true} />
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-600">{course.completed || 0}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{course.inProgress || 0}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Remaining</p>
          <p className="text-2xl font-bold text-gray-600">{course.remaining || 0}</p>
        </div>
      </div>
    </div>
  )
}

CourseProgress.propTypes = {
  course: PropTypes.object
}
