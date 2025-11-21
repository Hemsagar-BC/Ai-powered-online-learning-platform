import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Play, Loader } from 'lucide-react';
import { auth } from '../lib/firebase';
import { getContinueLearningCourses } from '../lib/firebaseCoursesService';
import QuizInterface from '../components/quiz/QuizInterface';

const Quiz = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);

        if (!auth.currentUser) {
          console.log('No user logged in');
          setLoading(false);
          return;
        }

        // Load from Firebase
        const firebaseCourses = await getContinueLearningCourses();

        if (firebaseCourses && firebaseCourses.length > 0) {
          console.log('Loaded courses from Firebase:', firebaseCourses);
          setCourses(firebaseCourses);
        } else {
          // Fallback to localStorage
          const localCourses =
            JSON.parse(localStorage.getItem('codeflux_courses')) ||
            JSON.parse(localStorage.getItem('courses')) ||
            [];
          console.log('Loaded courses from localStorage:', localCourses);
          setCourses(localCourses);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
        // Fallback
        const localCourses =
          JSON.parse(localStorage.getItem('codeflux_courses')) ||
          JSON.parse(localStorage.getItem('courses')) ||
          [];
        setCourses(localCourses);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleStartQuiz = (course) => {
    setSelectedCourse(course);
    setQuizStarted(true);
  };

  const handleBackToSelection = () => {
    setSelectedCourse(null);
    setQuizStarted(false);
  };

  // Show quiz interface if started
  if (quizStarted && selectedCourse) {
    return (
      <QuizInterface 
        course={selectedCourse} 
        onBack={handleBackToSelection}
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          <p className="mt-4 text-purple-600 font-semibold">Loading your courses...</p>
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
            <BookOpen className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-slate-900">Quiz Center</h1>
          </div>
          <p className="text-slate-600 text-lg">
            Select a course and take the quiz to test your knowledge. Each quiz contains 12 questions
            based on the course content.
          </p>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg overflow-hidden border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
              >
                {/* Card Content */}
                <div className="p-6 h-full flex flex-col">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-300 text-sm mb-4 flex-grow line-clamp-3">
                    {course.description}
                  </p>

                  {/* Course Meta */}
                  <div className="mb-6 space-y-2">
                    {course.chapters && (
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <BookOpen className="w-4 h-4 text-purple-400" />
                        <span>{course.chapters.length} chapters</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>12 questions • MCQ</span>
                    </div>
                  </div>

                  {/* Start Quiz Button */}
                  <button
                    onClick={() => handleStartQuiz(course)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold group-hover:shadow-lg"
                  >
                    <Play className="w-4 h-4" />
                    Start Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg border border-slate-200">
            <BookOpen className="w-16 h-16 text-slate-400 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Courses Yet</h2>
            <p className="text-slate-600 mb-8 text-center max-w-md">
              You don't have any courses yet. Create or enroll in a course to start taking quizzes.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold"
              >
                Create Course
              </button>
              <button
                onClick={() => navigate('/explore')}
                className="px-6 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-300 font-semibold"
              >
                Explore Courses
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
