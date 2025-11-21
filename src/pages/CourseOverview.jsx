import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const ChapterCard = ({i, title, description}) => (
  <div className="flex items-center gap-4 p-4 rounded-md bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:shadow-lg transition-shadow cursor-pointer">
    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">{i}</div>
    <div className="flex-1">
      <div className="font-semibold">{title}</div>
      <div className="text-sm opacity-80">{description || '8-12 min'}</div>
    </div>
  </div>
)

export default function CourseOverview(){
  const navigate = useNavigate()
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch course from localStorage
    const courses = JSON.parse(localStorage.getItem('codeflux_courses') || '[]')
    const foundCourse = courses.find(c => c.id === id)
    
    if (foundCourse) {
      console.log('📚 Course found:', foundCourse)
      setCourse(foundCourse)
    } else {
      console.warn('Course not found:', id)
      // Show default course if not found
      setCourse({
        id,
        title: 'Course Not Found',
        description: 'The course you are looking for could not be found.',
        objectives: [],
        chapters: []
      })
    }
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-slate-500">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 mb-4">Course not found</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-primary-500 hover:bg-primary-600 text-white rounded-md px-4 py-2"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  const totalDuration = course.chapters?.length ? `${course.chapters.length * 1.5} hours` : '0 hours'

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-slate-500 mt-2">{course.description}</p>

        {/* Course Metadata */}
        <div className="flex gap-4 mt-6 flex-wrap">
          <div className="card flex-1 min-w-[150px]">
            <div className="text-sm text-slate-500">Duration</div>
            <div className="mt-2 font-semibold">{totalDuration}</div>
          </div>
          <div className="card min-w-[150px]">
            <div className="text-sm text-slate-500">Chapters</div>
            <div className="mt-2 font-semibold">{course.chapters?.length || 0}</div>
          </div>
          <div className="card min-w-[150px]">
            <div className="text-sm text-slate-500">Difficulty</div>
            <div className="mt-2 font-semibold">{course.difficulty || 'N/A'}</div>
          </div>
          <div className="card min-w-[150px]">
            <div className="text-sm text-slate-500">Category</div>
            <div className="mt-2 font-semibold">{course.category || 'General'}</div>
          </div>
        </div>

        {/* Objectives */}
        {course.objectives && course.objectives.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-3">📚 Learning Objectives</h3>
            <ul className="space-y-2">
              {course.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-md">
                  <span className="text-primary-500 font-bold">✓</span>
                  <span className="text-slate-700">{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Chapters */}
        {course.chapters && course.chapters.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-3">📖 Chapters</h3>
            <div className="space-y-3">
              {course.chapters.map((chapter, i)=> (
                <div key={i} onClick={() => navigate(`/course/${id}/chapter/${chapter.id || i+1}`)} className="cursor-pointer">
                  <ChapterCard 
                    i={i+1} 
                    title={chapter.title} 
                    description={chapter.description}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {(!course.chapters || course.chapters.length === 0) && (
          <div className="mt-8 p-6 bg-slate-50 rounded-lg text-center text-slate-500">
            <p>No chapters available for this course yet.</p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="col-span-1">
        <div className="card sticky top-24">
          <div className="h-40 bg-gradient-to-br from-indigo-400 to-pink-300 rounded-md mb-4"></div>
          <h3 className="font-semibold text-slate-900 mb-2">Course Info</h3>
          <p className="text-sm text-slate-600 mb-4">
            Start learning with {course.chapters?.length || 0} chapters designed to help you master {course.title}.
          </p>
          <button 
            onClick={() => course.chapters?.length > 0 && navigate(`/course/${id}/chapter/${course.chapters[0].id || 1}`)}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white rounded-md py-3 font-semibold"
          >
            🚀 Start Learning
          </button>
          {course.createdAt && (
            <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
              Created: {new Date(course.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </aside>

    </div>
  )
}
