import React from 'react'
import PropTypes from 'prop-types'
import { Star, Users, Clock } from 'lucide-react'
import { Badge } from '../common'

export function CourseCard({ course, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
    >
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {course.image && (
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        )}
        <Badge variant="primary" className="absolute top-4 right-4">
          {course.difficulty}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {course.description}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500" />
            <span>{course.rating || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{course.students || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{course.duration || 0}h</span>
          </div>
        </div>
      </div>
    </div>
  )
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    difficulty: PropTypes.string,
    image: PropTypes.string,
    rating: PropTypes.number,
    students: PropTypes.number,
    duration: PropTypes.number
  }),
  onClick: PropTypes.func
}

export function CourseGrid({ courses, loading, onCourseClick }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-72 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          onClick={() => onCourseClick && onCourseClick(course)}
        />
      ))}
    </div>
  )
}

CourseGrid.propTypes = {
  courses: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onCourseClick: PropTypes.func
}

export function CourseStats({ course }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-600 text-sm">Students</p>
        <p className="text-2xl font-bold text-gray-900">{course.students || 0}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-600 text-sm">Rating</p>
        <p className="text-2xl font-bold text-yellow-500">{course.rating || 0}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-600 text-sm">Duration</p>
        <p className="text-2xl font-bold text-gray-900">{course.duration || 0}h</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-600 text-sm">Chapters</p>
        <p className="text-2xl font-bold text-gray-900">{course.chapters?.length || 0}</p>
      </div>
    </div>
  )
}

CourseStats.propTypes = {
  course: PropTypes.shape({
    students: PropTypes.number,
    rating: PropTypes.number,
    duration: PropTypes.number,
    chapters: PropTypes.array
  })
}
