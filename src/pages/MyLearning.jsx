import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, BookOpen, ArrowRight } from 'lucide-react';
import { getContinueLearningCourses, deleteCourseFromFirebase } from '../lib/firebaseCoursesService';
import { auth } from '../lib/firebase';

const MyLearning = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        
        if (!auth.currentUser) {
          console.log('No user logged in');
          setLoading(false);
          return;
        }

        // Try Firebase first
        const firebaseCourses = await getContinueLearningCourses();
        
        if (firebaseCourses && firebaseCourses.length > 0) {
          console.log('Loaded courses from Firebase:', firebaseCourses);
          setCourses(firebaseCourses);
        } else {
          // Fallback to localStorage - try both key variations
          const localCourses = JSON.parse(localStorage.getItem('codeflux_courses')) || 
                               JSON.parse(localStorage.getItem('courses')) || [];
          console.log('Loaded courses from localStorage:', localCourses);
          setCourses(localCourses);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
        // Fallback to localStorage - try both key variations
        const localCourses = JSON.parse(localStorage.getItem('codeflux_courses')) || 
                             JSON.parse(localStorage.getItem('courses')) || [];
        setCourses(localCourses);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      // Delete from Firebase
      if (auth.currentUser) {
        await deleteCourseFromFirebase(courseId);
      }

      // Delete from localStorage
      const updatedCourses = courses.filter(course => course.id !== courseId);
      setCourses(updatedCourses);
      localStorage.setItem('codeflux_courses', JSON.stringify(updatedCourses));
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      
      setDeleteConfirm(null);
      console.log('Course deleted:', courseId);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          <p className="mt-4 text-purple-200">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-purple-600">My Learning</h1>
          </div>
          <p className="text-purple-600 text-lg">
            {courses.length === 0 
              ? 'No courses yet. Start learning by generating a new course or exploring available courses.'
              : `You have ${courses.length} course${courses.length !== 1 ? 's' : ''} in your learning path`}
          </p>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group relative bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg overflow-hidden border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
              >
                {/* Delete Confirm Modal */}
                {deleteConfirm === course.id && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-lg">
                    <div className="bg-slate-800 p-6 rounded-lg border border-red-500/30">
                      <p className="text-white font-semibold mb-4">Delete this course?</p>
                      <p className="text-slate-300 text-sm mb-6">This action cannot be undone.</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Content */}
                <div className="p-6 h-full flex flex-col">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-300 text-sm mb-4 flex-grow line-clamp-2">
                    {course.description}
                  </p>

                  {/* Course Meta */}
                  <div className="mb-4 space-y-2">
                    {course.chapters && (
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <BookOpen className="w-4 h-4 text-purple-400" />
                        <span>{course.chapters.length} chapters</span>
                      </div>
                    )}
                    {course.progress !== undefined && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                            style={{ width: `${course.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-purple-300 w-10 text-right">
                          {Math.round(course.progress || 0)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex gap-2 pt-4 border-t border-slate-600">
                    <button
                      onClick={() => handleCourseClick(course.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold text-sm"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(course.id)}
                      className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300"
                      title="Delete course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Hover Accent */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-transparent to-pink-500/0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-slate-800/50 to-purple-900/30 rounded-lg border border-slate-700">
            <BookOpen className="w-16 h-16 text-purple-400/50 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Courses Yet</h2>
            <p className="text-slate-900 text-center max-w-md">
              Your generated and enrolled courses will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;
