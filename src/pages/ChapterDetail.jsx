import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, BookOpen, Play, CheckCircle, Zap, Target, Map, Volume2, ExternalLink, Loader, Check } from 'lucide-react';
import chapterService from '../lib/chapterService';
import { markChapterAsDone, unmarkChapterAsDone, getCourseProgress } from '../lib/progressService';

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
  const [fetchingVideo, setFetchingVideo] = useState(false);
  const [alternativeVideos, setAlternativeVideos] = useState([]);
  const [isChapterCompleted, setIsChapterCompleted] = useState(false);
  const [markingProgress, setMarkingProgress] = useState(false);

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
            
            // Fetch best YouTube video using API
            await fetchBestYouTubeVideo(chapterData, foundCourse);

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

  const fetchBestYouTubeVideo = async (chapterData, courseData) => {
    setFetchingVideo(true);
    try {
      // Use the chapter title as the topic for YouTube search
      const topic = chapterData.title || chapterData.topic;
      console.log(`🎬 Fetching YouTube video from backend for topic: ${topic}`);
      
      // Call backend endpoint directly
      const response = await fetch(`http://localhost:5000/api/youtube/search?topic=${encodeURIComponent(topic)}`);
      const data = await response.json();
      
      if (data.success && data.videos && data.videos.length > 0) {
        // First video is the best match
        setSelectedVideo(data.videos[0]);
        console.log(`✅ Best video found: ${data.videos[0].title}`);
        
        // Remaining videos as alternatives
        if (data.videos.length > 1) {
          setAlternativeVideos(data.videos.slice(1));
        }
      } else {
        console.warn('No videos found for topic:', topic);
        // Fallback to local videos if any
        if (chapterData.youtubeVideos && chapterData.youtubeVideos.length > 0) {
          setSelectedVideo(chapterData.youtubeVideos[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching YouTube video:', error);
      // Fallback to local videos
      if (chapterData.youtubeVideos && chapterData.youtubeVideos.length > 0) {
        setSelectedVideo(chapterData.youtubeVideos[0]);
      }
    } finally {
      setFetchingVideo(false);
    }
  }

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

  // Check if chapter is completed
  const checkChapterCompletion = async () => {
    try {
      const progress = await getCourseProgress(courseId);
      const completed = progress.completedChapters?.includes(chapterId);
      setIsChapterCompleted(completed || false);
    } catch (error) {
      console.error('Error checking chapter completion:', error);
    }
  };

  // Toggle chapter completion
  const handleToggleCompletion = async () => {
    setMarkingProgress(true);
    try {
      if (isChapterCompleted) {
        await unmarkChapterAsDone(courseId, chapterId);
        setIsChapterCompleted(false);
      } else {
        await markChapterAsDone(courseId, chapterId);
        setIsChapterCompleted(true);
      }
    } catch (error) {
      console.error('Error toggling chapter completion:', error);
    } finally {
      setMarkingProgress(false);
    }
  };

  // Load completion status when chapter loads
  useEffect(() => {
    if (course && chapter) {
      checkChapterCompletion();
    }
  }, [course, chapter, courseId, chapterId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (!course || !chapter) {
    return (
      <div className="min-h-screen bg-white pt-20 flex flex-col items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black mb-2">Chapter Not Found</h2>
          <p className="text-slate-600 mb-6">The chapter you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start justify-between">
            <div>
              <button
                onClick={() => navigate(`/course/${courseId}`)}
                className="flex items-center gap-2 mb-3 text-purple-600 hover:text-purple-700 transition font-medium"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Course
              </button>
              <h1 className="text-3xl font-bold text-black">{chapter.title}</h1>
              <p className="text-slate-600 mt-1">{course.title}</p>
              <div className="flex gap-3 mt-3 text-sm flex-wrap">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full border border-purple-200 font-medium">Chapter {chapter.id}</span>
                <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full border border-cyan-200 font-medium">{course.difficulty}</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full border border-pink-200 font-medium">{course.category}</span>
              </div>
            </div>
            <button
              onClick={handleToggleCompletion}
              disabled={markingProgress}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                isChapterCompleted
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              } disabled:opacity-50 disabled:cursor-not-allowed mt-2`}
            >
              {markingProgress ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : isChapterCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {markingProgress ? 'Saving...' : isChapterCompleted ? 'Completed' : 'Mark as Done'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {detailsError && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-700 text-sm">{detailsError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Player - Left Sidebar */}
          <div className="lg:col-span-1">
            {selectedVideo && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-lg overflow-hidden border border-purple-500/20 sticky top-24">
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
                  <p className="text-xs text-gray-400 mb-3">by {selectedVideo.channel}</p>
                  
                  {/* Video Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    {selectedVideo.viewCount && (
                      <div className="bg-slate-700/50 rounded p-2">
                        <p className="text-gray-400">Views</p>
                        <p className="text-white font-semibold">{selectedVideo.viewCount}</p>
                      </div>
                    )}
                    {selectedVideo.duration && (
                      <div className="bg-slate-700/50 rounded p-2">
                        <p className="text-gray-400">Duration</p>
                        <p className="text-white font-semibold">{selectedVideo.duration}</p>
                      </div>
                    )}
                  </div>
                  
                  <button
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition cursor-pointer"
                  >
                    <Play className="w-3 h-3" />
                    Playing
                  </button>

                  {selectedVideo.type === 'best' && (
                    <div className="mt-3 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold text-center">
                      ⭐ Best Quality Video (Quality Score: {selectedVideo.quality || 0}/100)
                    </div>
                  )}
                  {selectedVideo.type === 'preferred' && (
                    <div className="mt-3 px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-semibold text-center">
                      💎 Popular Video (Quality Score: {selectedVideo.quality || 0}/100)
                    </div>
                  )}
                  {!selectedVideo.type && selectedVideo.quality && (
                    <div className="mt-3 px-2 py-1 bg-slate-700/50 text-gray-300 rounded text-xs text-center">
                      Quality Score: {selectedVideo.quality}/100
                    </div>
                  )}
                </div>

                {/* Video Selection */}
                {(alternativeVideos.length > 0 || (chapter.youtubeVideos && chapter.youtubeVideos.length > 1)) && (
                  <div className="border-t border-slate-700 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-xs text-gray-400 font-semibold">
                        {fetchingVideo ? 'Loading videos...' : 'More Videos'}
                      </p>
                      {fetchingVideo && <Loader className="w-3 h-3 animate-spin text-blue-400" />}
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {(alternativeVideos.length > 0 ? alternativeVideos : chapter.youtubeVideos || []).map((video, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedVideo(video)}
                          className={`w-full text-left p-2 rounded text-xs transition ${
                            selectedVideo?.title === video.title
                              ? 'bg-red-500/20 border border-red-500/50'
                              : 'bg-slate-700/30 hover:bg-slate-700/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-semibold text-white line-clamp-2">{video.title}</p>
                              <p className="text-gray-400 text-xs mt-1">{video.channel}</p>
                              {video.quality && (
                                <p className="text-gray-500 text-xs mt-1">📊 Quality: {video.quality}/100</p>
                              )}
                            </div>
                            {video.type === 'best' && (
                              <span className="px-1 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-semibold flex-shrink-0">⭐</span>
                            )}
                          </div>
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
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-lg overflow-hidden border border-purple-500/20">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 text-white flex items-center gap-3">
                <BookOpen className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Topic Overview</h2>
                  <p className="text-purple-100 text-sm">Definition & Key Introduction</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-purple-500/10 border-l-4 border-purple-500 pl-4 py-2 text-white">
                  <h3 className="font-semibold mb-2">What is {chapter.title}?</h3>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    {chapter.description || 'This chapter covers the fundamental concepts and practical applications of this topic. You will learn essential principles, explore real-world use cases, and discover best practices in the industry.'}
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded p-4 border border-slate-600">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-400" />
                    Definition
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {chapter.title} is a comprehensive approach that encompasses key principles and practices. It focuses on building a strong foundation while enabling practical application of concepts in real-world scenarios and professional environments.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-slate-700/50 rounded p-3 text-center border border-slate-600">
                    <p className="text-2xl font-bold text-purple-400">{chapterDetails?.lessons?.length || 3}</p>
                    <p className="text-xs text-slate-400 mt-1">Key Lessons</p>
                  </div>
                  <div className="bg-slate-700/50 rounded p-3 text-center border border-slate-600">
                    <p className="text-2xl font-bold text-cyan-400">{chapterDetails?.keyConcepts?.length || 5}</p>
                    <p className="text-xs text-slate-400 mt-1">Concepts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-lg overflow-hidden border border-cyan-500/20">
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 text-white flex items-center gap-3">
                <Target className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Learning Goals</h2>
                  <p className="text-cyan-100 text-sm">What you will achieve</p>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {chapterDetails?.learningOutcomes && chapterDetails.learningOutcomes.length > 0 ? (
                    chapterDetails.learningOutcomes.map((outcome, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-cyan-500/10 rounded hover:bg-cyan-500/20 transition border border-cyan-500/20">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                        <p className="text-slate-300 text-sm">{outcome}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 text-sm">Loading outcomes...</div>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Explanation - Row by Row */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-lg overflow-hidden border border-pink-500/20">
              <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-4 text-white flex items-center gap-3">
                <Volume2 className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Detailed Explanation</h2>
                  <p className="text-pink-100 text-sm">In-depth exploration of each topic</p>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {chapterDetails?.lessons && chapterDetails.lessons.length > 0 ? (
                  chapterDetails.lessons.map((lesson, idx) => (
                    <div key={idx} className="pb-6 border-b border-slate-600 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-pink-500/30 flex items-center justify-center flex-shrink-0 border border-pink-500/50">
                          <span className="text-pink-300 font-semibold text-sm">{idx + 1}</span>
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
                              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                            >
                              <Play className="w-3 h-3" />
                              {lesson.youtubeVideo}
                            </a>
                          </div>
                        )}

                        {lesson.resources && (
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Resources</p>
                            <p className="text-slate-300 text-sm">{lesson.resources}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400">Lessons loading...</p>
                )}
              </div>
            </div>

            {/* Key Concepts */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-lg overflow-hidden border border-purple-500/20">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 text-white flex items-center gap-3">
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
                      <div key={idx} className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition">
                        <p className="text-slate-200 font-semibold text-sm">{concept}</p>
                        <p className="text-slate-400 text-xs mt-2">
                          A cornerstone concept that will help you understand and apply the principles effectively.
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400">Concepts loading...</p>
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