import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, BookOpen, Play, CheckCircle, Zap, Target, Map, Volume2, ExternalLink, Loader, Star, Sparkles, Award, Check } from 'lucide-react';
import chapterService from '../lib/chapterService';
import { getBestYouTubeVideo, getQualityYouTubeVideos, generateVideoSummary } from '../lib/youtubeService';
import { markChapterAsDone, unmarkChapterAsDone, getCourseProgress, isChapterCompleted } from '../lib/progressService';

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
  const [videoSummary, setVideoSummary] = useState(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isChapterDone, setIsChapterDone] = useState(false);
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

            // Load progress status
            await loadProgressStatus(courseId, chapterData.id);
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

  const loadProgressStatus = async (cId, chapId) => {
    try {
      const progress = await getCourseProgress(cId);
      // Use chapter index from URL (1, 2, 3...) for consistent matching
      const chapterIndex = parseInt(chapterId);
      const completed = isChapterCompleted(progress.completedChapters || [], chapterIndex);
      console.log(`📊 Chapter ${chapterIndex} completion status:`, completed);
      setIsChapterDone(completed);
    } catch (error) {
      console.warn('⚠️ Could not load progress status:', error.message);
      // Don't fail the page load - progress is optional
      console.log('User may not be signed in yet, progress will be unavailable');
      setIsChapterDone(false);
    }
  };

  const handleMarkAsDone = async () => {
    setMarkingProgress(true);
    try {
      // Use chapter index (chapterId from URL) as the identifier
      const chapterIdentifier = parseInt(chapterId);
      
      console.log(`📍 Marking chapter ${chapterIdentifier} for course ${courseId}`);
      
      if (isChapterDone) {
        // Unmark
        await unmarkChapterAsDone(courseId, chapterIdentifier);
        setIsChapterDone(false);
        console.log(`✅ Chapter ${chapterIdentifier} unmarked`);
      } else {
        // Mark as done
        await markChapterAsDone(courseId, chapterIdentifier);
        setIsChapterDone(true);
        console.log(`✅ Chapter ${chapterIdentifier} marked as done`);
      }
    } catch (error) {
      console.error('❌ Error updating progress:', error);
      const errorMsg = error.message || error.toString();
      
      if (errorMsg.includes('User not authenticated') || errorMsg.includes('timeout')) {
        alert('Please sign in first to track your progress.');
      } else if (errorMsg.includes('permission')) {
        alert('Permission denied. Please check your Firebase rules.');
      } else if (errorMsg.includes('offline') || errorMsg.includes('DISCONNECTED') || errorMsg.includes('network')) {
        alert('You appear to be offline or have no internet connection. Progress will be saved when you reconnect.');
      } else {
        alert('Error updating progress: ' + errorMsg);
      }
    } finally {
      setMarkingProgress(false);
    }
  };


  const fetchBestYouTubeVideo = async (chapterData, courseData) => {
    setFetchingVideo(true);
    try {
      // PRIORITY 1: Check if chapter already has pre-fetched videos from backend
      if (chapterData.youtubeVideos && chapterData.youtubeVideos.length > 0) {
        console.log(`📺 Using pre-fetched videos from course generation`);
        setSelectedVideo(chapterData.youtubeVideos[0]);
        generateVideoSummaryForSelected(chapterData.youtubeVideos[0]);
        
        // Set alternatives if more than one video
        if (chapterData.youtubeVideos.length > 1) {
          setAlternativeVideos(chapterData.youtubeVideos.slice(1));
        }
        setFetchingVideo(false);
        return;
      }

      // PRIORITY 2: If no pre-fetched videos, fetch from YouTube API
      console.log(`🎬 Fetching best YouTube video for: ${courseData.title}`);
      
      // Search using the course title (exact topic) for better relevance
      const bestVideo = await getBestYouTubeVideo(courseData.title);
      
      if (bestVideo) {
        setSelectedVideo(bestVideo);
        generateVideoSummaryForSelected(bestVideo);
        console.log(`✅ Best video found: ${bestVideo.title}`);
      }
      
      // Get alternative videos
      const alternatives = await getQualityYouTubeVideos(courseData.title, 3);
      if (alternatives.length > 0) {
        setAlternativeVideos(alternatives.slice(1)); // Exclude the first one (best)
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

  const generateVideoSummaryForSelected = async (video) => {
    if (!video) return;
    
    try {
      setGeneratingSummary(true);
      setVideoSummary(null);
      console.log(`📝 Generating summary for: ${video.title}`);
      
      const summary = await generateVideoSummary(
        video.title,
        video.channel,
        video.description || ''
      );
      
      setVideoSummary(summary);
      setShowSummary(true);
      console.log(`✅ Summary generated successfully`);
    } catch (error) {
      console.error('❌ Error generating summary:', error);
      setVideoSummary(null);
    } finally {
      setGeneratingSummary(false);
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
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white sticky top-0 z-10 shadow-lg shadow-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between mb-4">
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Course
            </button>
            
            {/* Mark as Done Button */}
            <button
              onClick={handleMarkAsDone}
              disabled={markingProgress}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                isChapterDone
                  ? 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-300'
                  : 'bg-white/20 hover:bg-white/30 border border-white/30 text-white'
              } disabled:opacity-50`}
            >
              {markingProgress ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {isChapterDone ? 'Completed ✓' : 'Mark as Done'}
                </>
              )}
            </button>
          </div>
          
          <h1 className="text-3xl font-bold">{chapter.title}</h1>
          <p className="text-purple-100 mt-2">{course.title}</p>
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
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-lg shadow-purple-500/20 overflow-hidden sticky top-24 border border-purple-500/20 hover:border-purple-400/40 transition-all">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-white flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  <span className="font-semibold text-sm">Learning Video</span>
                </div>
                <div className="p-4">
                  {/* YouTube Iframe - Auto-play */}
                  {selectedVideo?.videoId ? (
                    <iframe
                      className="w-full aspect-video rounded-lg mb-4 border border-purple-500/30 hover:border-purple-400/50 transition-all shadow-lg shadow-purple-500/10"
                      src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
                      title={selectedVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-4 w-full aspect-video flex items-center justify-center border border-purple-500/20">
                      <Play className="w-12 h-12 text-purple-400" />
                    </div>
                  )}
                  
                  <h4 className="font-semibold text-white mb-1 text-sm line-clamp-2">{selectedVideo.title}</h4>
                  <p className="text-xs text-gray-400 mb-3">by {selectedVideo.channel}</p>
                  
                  {/* Video Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    {selectedVideo.viewCount && (
                      <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded p-2 border border-purple-500/20">
                        <p className="text-gray-400">Views</p>
                        <p className="text-purple-400 font-semibold">{selectedVideo.viewCount}</p>
                      </div>
                    )}
                    {selectedVideo.duration && (
                      <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 rounded p-2 border border-cyan-500/20">
                        <p className="text-gray-400">Duration</p>
                        <p className="text-cyan-400 font-semibold">{selectedVideo.duration}</p>
                      </div>
                    )}
                  </div>
                  
                  <button
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded text-sm transition cursor-pointer shadow-lg shadow-purple-500/20"
                  >
                    <Play className="w-3 h-3" />
                    Playing
                  </button>

                  {selectedVideo.type === 'best' && (
                    <div className="mt-3 px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded text-xs font-semibold text-center border border-cyan-500/30">
                      ⭐ Best Quality Video (Score: {selectedVideo.quality || 0}/100)
                    </div>
                  )}
                  {selectedVideo.type === 'preferred' && (
                    <div className="mt-3 px-2 py-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 rounded text-xs font-semibold text-center border border-pink-500/30">
                      💎 Popular Video (Score: {selectedVideo.quality || 0}/100)
                    </div>
                  )}
                  {!selectedVideo.type && selectedVideo.quality && (
                    <div className="mt-3 px-2 py-1 bg-slate-700/30 text-gray-300 rounded text-xs text-center border border-slate-600/50">
                      Quality Score: {selectedVideo.quality}/100
                    </div>
                  )}
                </div>

                {/* Video Selection */}
                {(alternativeVideos.length > 0 || (chapter.youtubeVideos && chapter.youtubeVideos.length > 1)) && (
                  <div className="border-t border-purple-500/20 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-xs text-gray-400 font-semibold">
                        {fetchingVideo ? 'Loading videos...' : 'More Videos'}
                      </p>
                      {fetchingVideo && <Loader className="w-3 h-3 animate-spin text-purple-400" />}
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {(alternativeVideos.length > 0 ? alternativeVideos : chapter.youtubeVideos || []).map((video, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedVideo(video);
                            generateVideoSummaryForSelected(video);
                          }}
                          className={`w-full text-left p-2 rounded text-xs transition ${
                            selectedVideo?.title === video.title
                              ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50'
                              : 'bg-slate-700/20 hover:bg-slate-700/40 border border-slate-700/30'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-semibold text-white line-clamp-2">{video.title}</p>
                              <p className="text-gray-400 text-xs mt-1">{video.channel}</p>
                              {video.quality && (
                                <p className="text-purple-400 text-xs mt-1">📊 Quality: {video.quality}/100</p>
                              )}
                            </div>
                            {video.type === 'best' && (
                              <span className="px-1 py-0.5 bg-cyan-500/20 text-cyan-400 rounded text-xs font-semibold flex-shrink-0">⭐</span>
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
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-lg shadow-purple-500/10 overflow-hidden border border-purple-500/20 hover:border-purple-400/40 transition-all">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 px-6 py-4 text-white flex items-center gap-3">
                <BookOpen className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Topic Overview</h2>
                  <p className="text-purple-100 text-sm">Definition & Key Introduction</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l-4 border-purple-500 pl-4 py-2 rounded">
                  <h3 className="text-white font-semibold mb-2">What is {chapter.title}?</h3>
                  <p className="text-gray-200 leading-relaxed text-sm">
                    {chapter.description || 'This chapter covers the fundamental concepts and practical applications of this topic. You will learn essential principles, explore real-world use cases, and discover best practices in the industry.'}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded p-4 border border-cyan-500/20">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    Definition
                  </h4>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {chapter.title} is a comprehensive approach that encompasses key principles and practices. It focuses on building a strong foundation while enabling practical application of concepts in real-world scenarios and professional environments.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded p-3 text-center border border-purple-500/20">
                    <p className="text-2xl font-bold text-purple-400">{chapterDetails?.lessons?.length || 3}</p>
                    <p className="text-xs text-gray-300 mt-1">Key Lessons</p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 rounded p-3 text-center border border-cyan-500/20">
                    <p className="text-2xl font-bold text-cyan-400">{chapterDetails?.keyConcepts?.length || 5}</p>
                    <p className="text-xs text-gray-300 mt-1">Concepts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-lg shadow-pink-500/10 overflow-hidden border border-pink-500/20 hover:border-pink-400/40 transition-all">
              <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 px-6 py-4 text-white flex items-center gap-3">
                <Target className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Learning Goals</h2>
                  <p className="text-pink-100 text-sm">What you will achieve</p>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {chapterDetails?.learningOutcomes && chapterDetails.learningOutcomes.length > 0 ? (
                    chapterDetails.learningOutcomes.map((outcome, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded hover:from-pink-500/20 hover:to-purple-500/20 transition border border-pink-500/20">
                        <div className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0"></div>
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
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-lg shadow-cyan-500/10 overflow-hidden border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
              <div className="bg-gradient-to-r from-cyan-600 to-purple-600 px-6 py-4 text-white flex items-center gap-3">
                <Volume2 className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Detailed Explanation</h2>
                  <p className="text-cyan-100 text-sm">In-depth exploration of each topic</p>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {chapterDetails?.lessons && chapterDetails.lessons.length > 0 ? (
                  chapterDetails.lessons.map((lesson, idx) => (
                    <div key={idx} className="pb-6 border-b border-slate-700 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center flex-shrink-0 border border-cyan-500/50">
                          <span className="text-cyan-300 font-semibold text-sm">{idx + 1}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white">{lesson.topic}</h3>
                      </div>
                      
                      <div className="ml-11 space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-cyan-400 uppercase mb-1">Learning Goal</p>
                          <p className="text-gray-200 text-sm leading-relaxed">{lesson.learningGoal}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs font-semibold text-purple-400 uppercase mb-1">Explanation</p>
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
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-lg shadow-pink-500/10 overflow-hidden border border-pink-500/20 hover:border-pink-400/40 transition-all">
              <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-4 text-white flex items-center gap-3">
                <Zap className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Key Concepts</h2>
                  <p className="text-pink-100 text-sm">Essential ideas to understand</p>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chapterDetails?.keyConcepts && chapterDetails.keyConcepts.length > 0 ? (
                    chapterDetails.keyConcepts.map((concept, idx) => (
                      <div key={idx} className="p-4 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/20 hover:border-pink-400/40 transition">
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
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-lg shadow-cyan-500/10 overflow-hidden border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 text-white flex items-center gap-3">
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
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-cyan-500/20">
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
                    <p className="text-xs font-semibold text-cyan-400 uppercase mb-4">Course Learning Path</p>
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
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-lg shadow-orange-500/10 overflow-hidden border border-orange-500/20 hover:border-orange-400/40 transition-all">
                <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-4 text-white flex items-center gap-3">
                  <BookOpen className="w-6 h-6" />
                  <div>
                    <h2 className="text-xl font-bold">Study Notes & Tips</h2>
                    <p className="text-orange-100 text-sm">Best practices and common mistakes</p>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {chapter.notes.mainConcepts && chapter.notes.mainConcepts.length > 0 && (
                    <div>
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-orange-400" />
                        Main Concepts
                      </h3>
                      <div className="space-y-2 ml-6">
                        {chapter.notes.mainConcepts.map((concept, idx) => (
                          <p key={idx} className="text-gray-200 text-sm flex items-start gap-2">
                            <span className="text-orange-400 font-bold mt-0.5">•</span>
                            <span>{concept}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {chapter.notes.commonMistakes && (
                    <div className="border-t border-slate-700 pt-6">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-pink-400" />
                        Common Mistakes to Avoid
                      </h3>
                      <div className="ml-6 p-3 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded text-gray-200 text-sm leading-relaxed border border-pink-500/20">
                        {chapter.notes.commonMistakes}
                      </div>
                    </div>
                  )}

                  {chapter.notes.bestPractices && (
                    <div className="border-t border-slate-700 pt-6">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-cyan-400" />
                        Best Practices
                      </h3>
                      <div className="ml-6 p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded text-gray-200 text-sm leading-relaxed border border-cyan-500/20">
                        {chapter.notes.bestPractices}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Premium Video Summary Panel - Full Width */}
        {(videoSummary || generatingSummary) && (
          <div className="mt-12">
            <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-purple-500/20">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 px-8 py-6 flex items-center justify-between shadow-lg shadow-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Video Summary</h2>
                    <p className="text-purple-100 text-sm mt-1">Comprehensive breakdown of {selectedVideo?.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSummary(!showSummary)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition"
                >
                  <span className="text-white text-xl">{showSummary ? '−' : '+'}</span>
                </button>
              </div>

              {/* Content */}
              {generatingSummary ? (
                <div className="px-8 py-12 flex flex-col items-center justify-center gap-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin opacity-20"></div>
                    <div className="absolute inset-2 bg-slate-800 rounded-full flex items-center justify-center">
                      <Loader className="w-8 h-8 animate-spin text-purple-400" />
                    </div>
                  </div>
                  <p className="text-gray-300 font-medium">Generating detailed summary...</p>
                  <p className="text-gray-500 text-sm">Using AI to analyze video content</p>
                </div>
              ) : (
                showSummary && videoSummary && (
                  <div className="px-8 py-8 space-y-8">
                    {/* Overview */}
                    {videoSummary.overview && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded"></div>
                          <h3 className="text-xl font-bold text-white">Overview</h3>
                        </div>
                        <p className="text-gray-200 leading-relaxed text-base">
                          {videoSummary.overview}
                        </p>
                      </div>
                    )}

                    {/* Key Points */}
                    {videoSummary.keyPoints && videoSummary.keyPoints.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded"></div>
                          <h3 className="text-xl font-bold text-white">Key Points</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {videoSummary.keyPoints.map((point, idx) => (
                            <div key={idx} className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/15 transition">
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-cyan-300 text-xs font-bold">{idx + 1}</span>
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed">{point}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Learning Outcomes */}
                    {videoSummary.learningOutcomes && videoSummary.learningOutcomes.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded"></div>
                          <h3 className="text-xl font-bold text-white">What You'll Learn</h3>
                        </div>
                        <div className="space-y-3">
                          {videoSummary.learningOutcomes.map((outcome, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/15 transition">
                              <Award className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                              <p className="text-gray-200 text-sm leading-relaxed">{outcome}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Target Audience */}
                    {videoSummary.targetAudience && (
                      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-5 h-5 text-purple-400" />
                          <p className="text-gray-400 text-sm font-semibold">Best For</p>
                        </div>
                        <p className="text-gray-200">{videoSummary.targetAudience}</p>
                      </div>
                    )}

                    {/* Video Info */}
                    <div className="pt-4 border-t border-slate-700/50">
                      <p className="text-xs text-gray-500">
                        Source: <span className="text-cyan-400 font-semibold">{selectedVideo?.channel}</span> • 
                        <span className="ml-2">Duration: {selectedVideo?.duration}</span>
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
