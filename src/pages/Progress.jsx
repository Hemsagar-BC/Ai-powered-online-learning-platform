import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BookOpen, Play, CheckCircle, Clock, Calendar, TrendingUp } from 'lucide-react';
import { getAllUserProgress, calculateCompletionPercentage } from '../lib/progressService';

export default function Progress() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch all courses from localStorage
        let allCourses = JSON.parse(localStorage.getItem('generatedCourses') || '[]');
        if (allCourses.length === 0) {
          allCourses = JSON.parse(localStorage.getItem('codeflux_courses') || '[]');
        }

        // Add course IDs if missing
        allCourses = allCourses.map(course => ({
          ...course,
          id: course.id || course.title.toLowerCase().replace(/\s+/g, '-'),
        }));

        setCourses(allCourses);

        // Fetch user progress from localStorage (as fallback)
        // In production, this would come from Firebase
        const progressData = await getAllUserProgress();
        setUserProgress(progressData);

        setLoading(false);
      } catch (error) {
        console.error('Error loading progress data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Listen for progress updates
  useEffect(() => {
    const handleProgressUpdate = async () => {
      try {
        const progressData = await getAllUserProgress();
        console.log('🔄 Progress updated:', progressData);
        setUserProgress(progressData);
      } catch (error) {
        console.warn('⚠️ Could not fetch progress:', error.message);
        // Set empty progress if user not authenticated - don't fail
        setUserProgress({});
      }
    };

    // Poll for updates every 1 second for better real-time feel
    const interval = setInterval(handleProgressUpdate, 1000);
    
    // Also update immediately on mount
    handleProgressUpdate();
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading progress...</p>
        </div>
      </div>
    );
  }

  const totalChapters = courses.reduce((sum, course) => {
    return sum + (course.chapters?.length || 0);
  }, 0);

  const totalCompleted = Object.values(userProgress).reduce((sum, progress) => {
    return sum + (progress.completedChapters?.length || 0);
  }, 0);

  const overallPercentage = totalChapters > 0 
    ? Math.round((totalCompleted / totalChapters) * 100) 
    : 0;

  const overallData = [
    { name: 'Completed', value: totalCompleted },
    { name: 'Remaining', value: Math.max(0, totalChapters - totalCompleted) },
  ];

  const COLORS = ['#a855f7', '#e879f9'];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white sticky top-0 z-10 shadow-lg shadow-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Your Learning Progress</h1>
          </div>
          <p className="text-purple-100 text-lg">Track your course completion and achievements</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Overall Progress Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-lg shadow-purple-500/10 overflow-hidden border border-purple-500/20 p-8">
            <div className="flex flex-col items-center">
              <h3 className="text-white font-semibold text-lg mb-6">Overall Progress</h3>

              {/* Circular Progress */}
              <div className="relative w-40 h-40 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={overallData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {overallData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-3xl font-bold text-purple-400">{overallPercentage}%</p>
                  <p className="text-xs text-gray-400">Complete</p>
                </div>
              </div>

              <div className="w-full space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Completed:</span>
                  <span className="text-purple-400 font-semibold">{totalCompleted} chapters</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-cyan-400 font-semibold">{totalChapters} chapters</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Courses Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-lg shadow-pink-500/10 overflow-hidden border border-pink-500/20 p-6">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg">
                  <BookOpen className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Courses</p>
                  <p className="text-3xl font-bold text-pink-400">{courses.length}</p>
                </div>
              </div>
            </div>

            {/* Completion Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-lg shadow-cyan-500/10 overflow-hidden border border-cyan-500/20 p-6">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Chapters Completed</p>
                  <p className="text-3xl font-bold text-cyan-400">{totalCompleted}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Progress Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-400" />
            Course Progress
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const progress = userProgress[course.id] || { completedChapters: [] };
              const chapterCount = course.chapters?.length || 0;
              const completedCount = progress.completedChapters?.length || 0;
              const completionPercentage = calculateCompletionPercentage(chapterCount, progress.completedChapters || []);

              const courseProgressData = [
                { name: 'Completed', value: completedCount },
                { name: 'Remaining', value: Math.max(0, chapterCount - completedCount) },
              ];

              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
                  className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-lg shadow-purple-500/10 overflow-hidden border border-purple-500/20 hover:border-purple-400/40 transition-all cursor-pointer"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-6 border-b border-purple-500/20">
                    <h3 className="text-white font-bold text-lg line-clamp-2 mb-2">{course.title}</h3>
                    <p className="text-gray-400 text-xs">{chapterCount} chapters</p>
                  </div>

                  {/* Progress Section */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-24 h-24">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={courseProgressData}
                              cx="50%"
                              cy="50%"
                              innerRadius={35}
                              outerRadius={50}
                              paddingAngle={1}
                              dataKey="value"
                            >
                              {courseProgressData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>

                        {/* Center Percentage */}
                        <div className="absolute ml-3 mt-1 text-center">
                          <p className="text-lg font-bold text-purple-400">{completionPercentage}%</p>
                        </div>
                      </div>

                      <div className="flex-1 ml-6 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Completed:</span>
                          <span className="text-purple-400 font-semibold">{completedCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Remaining:</span>
                          <span className="text-cyan-400 font-semibold">{Math.max(0, chapterCount - completedCount)}</span>
                        </div>

                        {completionPercentage === 100 && completionPercentage > 0 && (
                          <div className="mt-3 px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded text-xs text-cyan-300 font-semibold text-center border border-cyan-500/30">
                            ✨ Completed!
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden mb-6 border border-slate-600/50">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>

                    {/* View Course Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/course/${course.id}`);
                      }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-sm font-semibold transition shadow-lg shadow-purple-500/20"
                    >
                      <Play className="w-3 h-3 inline-block mr-2" />
                      Continue Course
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {selectedCourse === course.id && course.chapters && course.chapters.length > 0 && (
                    <div className="border-t border-slate-700 p-6 bg-slate-800/50">
                      <h4 className="text-white font-semibold text-sm mb-3">Chapter Progress</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {course.chapters.map((chapter, idx) => {
                          const isCompleted = progress.completedChapters?.includes(chapter.id);
                          return (
                            <div
                              key={chapter.id}
                              className="flex items-center gap-3 p-2 rounded bg-slate-700/30 hover:bg-slate-700/50 transition"
                            >
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  isCompleted
                                    ? 'bg-green-500/20 border-green-500'
                                    : 'border-gray-500'
                                }`}
                              >
                                {isCompleted && (
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-300 line-clamp-1">
                                  {idx + 1}. {chapter.title}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No courses yet. Start learning!</p>
              <button
                onClick={() => navigate('/explore')}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-semibold transition"
              >
                Explore Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
