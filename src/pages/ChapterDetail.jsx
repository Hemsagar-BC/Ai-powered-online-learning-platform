import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, BookOpen, Play, CheckCircle, Zap, Target, Map, Volume2, ExternalLink } from 'lucide-react';
import chapterService from '../lib/chapterService';

export default function ChapterDetail() {
  const { id: courseId, cid: chapterId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [chapterDetails, setChapterDetails] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        console.log(`🔍 Loading chapter: courseId=${courseId}, chapterId=${chapterId}`);
        
        let savedCourses = JSON.parse(localStorage.getItem('generatedCourses') || '[]');
        if (savedCourses.length === 0) {
          savedCourses = JSON.parse(localStorage.getItem('codeflux_courses') || '[]');
        }
        
        const foundCourse = savedCourses.find(c => c.id === courseId);

        if (foundCourse) {
          console.log(`✅ Course found: ${foundCourse.title}`);
          setCourse(foundCourse);
          
          const chapterIndex = parseInt(chapterId) - 1;
          
          if (foundCourse.chapters && foundCourse.chapters[chapterIndex]) {
            const chapterData = foundCourse.chapters[chapterIndex];
            console.log(`✅ Chapter found:`, chapterData);
            
            setChapter(chapterData);
            
            if (chapterData.youtubeVideos && chapterData.youtubeVideos.length > 0) {
              setSelectedVideo(chapterData.youtubeVideos[0]);
            }

            await fetchChapterDetails(foundCourse, chapterData);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading chapter:', error);
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseId, chapterId]);

  const fetchChapterDetails = async (courseData, chapterData) => {
    setFetchingDetails(true);
    setDetailsError(null);
    try {
      console.log(`🔄 Fetching chapter details for: ${chapterData.title}`);
      
      const result = await chapterService.getChapterDetails(
        chapterData.title,
        courseData.title,
        chapterData.topic || chapterData.description || courseData.description,
        courseData.difficulty
      );

      if (result.success && result.data) {
        console.log(`✅ Successfully received chapter details:`, result.data);
        const formattedContent = chapterService.formatChapterContent(result.data);
        setChapterDetails(formattedContent);
      } else {
        const fallbackContent = {
          title: chapterData.title,
          lessons: (chapterData.lessons || []).map((lesson, idx) => ({
            ...lesson,
            id: lesson.id || `${idx + 1}`,
          })),
          keyConcepts: chapterData.keyConcepts || [],
          learningOutcomes: chapterData.learningOutcomes || [],
          source: 'local',
        };
        setChapterDetails(fallbackContent);
        setDetailsError('Using cached chapter content');
      }
    } catch (error) {
      console.error('❌ Error fetching chapter details:', error);
      
      const fallbackContent = {
        title: chapterData.title,
        lessons: (chapterData.lessons || []).map((lesson, idx) => ({
          ...lesson,
          id: lesson.id || `${idx + 1}`,
        })),
        keyConcepts: chapterData.keyConcepts || [],
        learningOutcomes: chapterData.learningOutcomes || [],
        source: 'local',
      };
      setChapterDetails(fallbackContent);
      setDetailsError(`Using cached content`);
    } finally {
      setFetchingDetails(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (!course || !chapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Chapter Not Found</h2>
          <p className="text-gray-300 mb-6">The chapter you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Course
          </button>
          <h1 className="text-3xl font-bold">{chapter.title}</h1>
          <p className="text-blue-100 mt-2">{course.title}</p>
          <div className="flex gap-4 mt-4 text-sm flex-wrap">
            <span className="px-3 py-1 bg-white/20 rounded-full">Chapter {chapter.id}</span>
            <span className="px-3 py-1 bg-white/20 rounded-full">{course.difficulty}</span>
            <span className="px-3 py-1 bg-white/20 rounded-full">{course.category}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {detailsError && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
            <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-200 text-sm">{detailsError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Player - Left Sidebar */}
          <div className="lg:col-span-1">
            {selectedVideo && (
              <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden sticky top-24">
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-white flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  <span className="font-semibold text-sm">Learning Video</span>
                </div>
                <div className="p-4">
                  {/* YouTube Iframe - Auto-play */}
                  {selectedVideo?.videoId ? (
                    <iframe
                      className="w-full aspect-video rounded-lg mb-4 border border-red-500/30"
                      src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
                      title={selectedVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="bg-black rounded-lg mb-4 w-full aspect-video flex items-center justify-center">
                      <Play className="w-12 h-12 text-red-500" />
                    </div>
                  )}
                  
                  <h4 className="font-semibold text-white mb-1 text-sm line-clamp-2">{selectedVideo.title}</h4>
                  <p className="text-xs text-gray-400 mb-1">by {selectedVideo.channel}</p>
                  <p className="text-xs text-gray-500 mb-4">⏱️ {selectedVideo.duration}</p>
                  
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedVideo.title + ' ' + selectedVideo.channel)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
                  >
                    <Play className="w-3 h-3" />
                    Watch
                  </a>

                  {selectedVideo.type === 'best' && (
                    <div className="mt-3 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold text-center">
                      ⭐ Best Video
                    </div>
                  )}
                  {selectedVideo.type === 'preferred' && (
                    <div className="mt-3 px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-semibold text-center">
                      💎 Popular
                    </div>
                  )}
                </div>

                {/* Video Selection */}
                {chapter.youtubeVideos && chapter.youtubeVideos.length > 1 && (
                  <div className="border-t border-slate-700 p-4">
                    <p className="text-xs text-gray-400 mb-3 font-semibold">More Videos</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {chapter.youtubeVideos.map((video, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedVideo(video)}
                          className={`w-full text-left p-2 rounded text-xs transition ${
                            selectedVideo?.title === video.title
                              ? 'bg-red-500/20 border border-red-500/50'
                              : 'bg-slate-700/30 hover:bg-slate-700/50'
                          }`}
                        >
                          <p className="font-semibold text-white line-clamp-2">{video.title}</p>
                          <p className="text-gray-400 text-xs mt-1">{video.channel}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main Content - Right */}
          <div className="lg:col-span-3 space-y-6">
            {/* Topic Overview */}
            <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white flex items-center gap-3">
                <BookOpen className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Topic Overview</h2>
                  <p className="text-blue-100 text-sm">Definition & Key Introduction</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-blue-500/10 border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="text-white font-semibold mb-2">What is {chapter.title}?</h3>
                  <p className="text-gray-200 leading-relaxed text-sm">
                    {chapter.description || 'This chapter covers the fundamental concepts and practical applications of this topic. You will learn essential principles, explore real-world use cases, and discover best practices in the industry.'}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-slate-700 to-slate-600 rounded p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    Definition
                  </h4>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {chapter.title} is a comprehensive approach that encompasses key principles and practices. It focuses on building a strong foundation while enabling practical application of concepts in real-world scenarios and professional environments.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-slate-700/50 rounded p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">{chapterDetails?.lessons?.length || 3}</p>
                    <p className="text-xs text-gray-300 mt-1">Key Lessons</p>
                  </div>
                  <div className="bg-slate-700/50 rounded p-3 text-center">
                    <p className="text-2xl font-bold text-purple-400">{chapterDetails?.keyConcepts?.length || 5}</p>
                    <p className="text-xs text-gray-300 mt-1">Concepts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-white flex items-center gap-3">
                <Target className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Learning Goals</h2>
                  <p className="text-green-100 text-sm">What you will achieve</p>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {chapterDetails?.learningOutcomes && chapterDetails.learningOutcomes.length > 0 ? (
                    chapterDetails.learningOutcomes.map((outcome, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-green-500/10 rounded hover:bg-green-500/20 transition">
                        <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                        <p className="text-gray-200 text-sm">{outcome}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-300 text-sm">Loading outcomes...</div>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Explanation - Row by Row */}
            <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 text-white flex items-center gap-3">
                <Volume2 className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Detailed Explanation</h2>
                  <p className="text-indigo-100 text-sm">In-depth exploration of each topic</p>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {chapterDetails?.lessons && chapterDetails.lessons.length > 0 ? (
                  chapterDetails.lessons.map((lesson, idx) => (
                    <div key={idx} className="pb-6 border-b border-slate-700 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-indigo-300 font-semibold text-sm">{idx + 1}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white">{lesson.topic}</h3>
                      </div>
                      
                      <div className="ml-11 space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Learning Goal</p>
                          <p className="text-gray-200 text-sm leading-relaxed">{lesson.learningGoal}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Explanation</p>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {lesson.topic} represents a fundamental aspect of this chapter. Understanding this concept is crucial for building a strong foundation in {course?.title}. You will learn how to apply this effectively in practical scenarios and gain insights into best practices used by industry professionals.
                          </p>
                        </div>

                        {lesson.youtubeVideo && (
                          <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Video Resource</p>
                            <a 
                              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(lesson.youtubeVideo)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                            >
                              <Play className="w-3 h-3" />
                              {lesson.youtubeVideo}
                            </a>
                          </div>
                        )}

                        {lesson.resources && (
                          <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Resources</p>
                            <p className="text-gray-200 text-sm">{lesson.resources}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-300">Lessons loading...</p>
                )}
              </div>
            </div>

            {/* Key Concepts */}
            <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 text-white flex items-center gap-3">
                <Zap className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Key Concepts</h2>
                  <p className="text-purple-100 text-sm">Essential ideas to understand</p>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chapterDetails?.keyConcepts && chapterDetails.keyConcepts.length > 0 ? (
                    chapterDetails.keyConcepts.map((concept, idx) => (
                      <div key={idx} className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition">
                        <p className="text-gray-200 font-semibold text-sm">{concept}</p>
                        <p className="text-gray-400 text-xs mt-2">
                          A cornerstone concept that will help you understand and apply the principles effectively.
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-300">Concepts loading...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Learning Roadmap */}
            <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4 text-white flex items-center gap-3">
                <Map className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Learning Roadmap</h2>
                  <p className="text-cyan-100 text-sm">Your step-by-step learning path</p>
                </div>
              </div>
              <div className="p-6">
                {chapter.roadmap ? (
                  <div className="space-y-3">
                    {chapter.roadmap.split('\n').map((step, idx) => (
                      step.trim() && (
                        <div key={idx} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {idx + 1}
                            </div>
                            {idx < (chapter.roadmap.split('\n').filter(s => s.trim()).length - 1) && (
                              <div className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-transparent my-1"></div>
                            )}
                          </div>
                          <div className="pt-1">
                            <p className="text-gray-200 text-sm font-medium">{step.replace(/^\d+\.\s*/, '')}</p>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-300">Roadmap loading...</p>
                )}

                {course?.learningPath && course.learningPath.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-4">Course Learning Path</p>
                    <div className="space-y-3">
                      {course.learningPath.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-200 text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Study Notes & Tips */}
            {chapter.notes && (
              <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 text-white flex items-center gap-3">
                  <BookOpen className="w-6 h-6" />
                  <div>
                    <h2 className="text-xl font-bold">Study Notes & Tips</h2>
                    <p className="text-amber-100 text-sm">Best practices and common mistakes</p>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {chapter.notes.mainConcepts && chapter.notes.mainConcepts.length > 0 && (
                    <div>
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-amber-400" />
                        Main Concepts
                      </h3>
                      <div className="space-y-2 ml-6">
                        {chapter.notes.mainConcepts.map((concept, idx) => (
                          <p key={idx} className="text-gray-200 text-sm flex items-start gap-2">
                            <span className="text-amber-400 font-bold mt-0.5">•</span>
                            <span>{concept}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {chapter.notes.commonMistakes && (
                    <div className="border-t border-slate-700 pt-6">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-red-400" />
                        Common Mistakes to Avoid
                      </h3>
                      <div className="ml-6 p-3 bg-red-500/10 rounded text-gray-200 text-sm leading-relaxed">
                        {chapter.notes.commonMistakes}
                      </div>
                    </div>
                  )}

                  {chapter.notes.bestPractices && (
                    <div className="border-t border-slate-700 pt-6">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Best Practices
                      </h3>
                      <div className="ml-6 p-3 bg-green-500/10 rounded text-gray-200 text-sm leading-relaxed">
                        {chapter.notes.bestPractices}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
