/**
 * YouTube API Service
 * Fetches and selects the best YouTube videos based on:
 * - View count (popularity)
 * - Content quality indicators
 * - Upload date (recent content)
 */

const YOUTUBE_API_KEY = 'AIzaSyBXUIu04K2XSHLVpwY5AXwbjrbXgk-sy4o'

/**
 * Search for best YouTube video based on topic
 * @param {string} searchQuery - Topic or video title to search
 * @param {string} maxResults - Maximum number of results to fetch (default: 10)
 * @returns {Promise<Object>} Best video object with details
 */
export const getBestYouTubeVideo = async (searchQuery, maxResults = 10) => {
  try {
    console.log(`🎬 Searching best YouTube video for: ${searchQuery}`)

    // Search for videos
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search')
    searchUrl.searchParams.set('part', 'snippet')
    searchUrl.searchParams.set('type', 'video')
    searchUrl.searchParams.set('q', searchQuery)
    searchUrl.searchParams.set('maxResults', maxResults)
    searchUrl.searchParams.set('order', 'viewCount') // Sort by most viewed
    searchUrl.searchParams.set('relevanceLanguage', 'en')
    searchUrl.searchParams.set('key', YOUTUBE_API_KEY)

    const searchResponse = await fetch(searchUrl.toString())
    const searchData = await searchResponse.json()

    if (!searchData.items || searchData.items.length === 0) {
      console.warn('No videos found for:', searchQuery)
      return null
    }

    // Get the first video (most viewed)
    const topVideoSnippet = searchData.items[0].snippet
    const videoId = searchData.items[0].id.videoId

    // Get detailed video statistics
    const statsUrl = new URL('https://www.googleapis.com/youtube/v3/videos')
    statsUrl.searchParams.set('part', 'statistics,contentDetails')
    statsUrl.searchParams.set('id', videoId)
    statsUrl.searchParams.set('key', YOUTUBE_API_KEY)

    const statsResponse = await fetch(statsUrl.toString())
    const statsData = await statsResponse.json()

    const videoStats = statsData.items[0]
    const stats = videoStats.statistics
    const contentDetails = videoStats.contentDetails

    // Format video object
    const videoObject = {
      videoId: videoId,
      title: topVideoSnippet.title,
      channel: topVideoSnippet.channelTitle,
      thumbnail: topVideoSnippet.thumbnails.high?.url || topVideoSnippet.thumbnails.default.url,
      description: topVideoSnippet.description.substring(0, 200) + '...',
      duration: formatDuration(contentDetails.duration),
      viewCount: formatViewCount(parseInt(stats.viewCount || 0)),
      likes: formatViewCount(parseInt(stats.likeCount || 0)),
      publishedAt: new Date(topVideoSnippet.publishedAt).toLocaleDateString(),
      url: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      quality: calculateQuality(stats, contentDetails),
      type: 'best'
    }

    console.log(`✅ Best video selected: ${videoObject.title}`)
    return videoObject
  } catch (error) {
    console.error('❌ Error fetching YouTube video:', error)
    return null
  }
}

/**
 * Get multiple quality videos for selection
 * @param {string} searchQuery - Topic to search
 * @param {number} count - Number of videos to return
 * @returns {Promise<Array>} Array of video objects
 */
export const getQualityYouTubeVideos = async (searchQuery, count = 3) => {
  try {
    console.log(`🎬 Searching quality YouTube videos for: ${searchQuery}`)

    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search')
    searchUrl.searchParams.set('part', 'snippet')
    searchUrl.searchParams.set('type', 'video')
    searchUrl.searchParams.set('q', searchQuery)
    searchUrl.searchParams.set('maxResults', count * 2) // Fetch more to select best ones
    searchUrl.searchParams.set('order', 'viewCount')
    searchUrl.searchParams.set('relevanceLanguage', 'en')
    searchUrl.searchParams.set('key', YOUTUBE_API_KEY)

    const searchResponse = await fetch(searchUrl.toString())
    const searchData = await searchResponse.json()

    if (!searchData.items || searchData.items.length === 0) {
      return []
    }

    const videos = []

    for (let i = 0; i < Math.min(count, searchData.items.length); i++) {
      const item = searchData.items[i]
      const videoId = item.id.videoId

      try {
        const statsUrl = new URL('https://www.googleapis.com/youtube/v3/videos')
        statsUrl.searchParams.set('part', 'statistics,contentDetails')
        statsUrl.searchParams.set('id', videoId)
        statsUrl.searchParams.set('key', YOUTUBE_API_KEY)

        const statsResponse = await fetch(statsUrl.toString())
        const statsData = await statsResponse.json()

        if (statsData.items && statsData.items[0]) {
          const videoStats = statsData.items[0]
          const stats = videoStats.statistics
          const contentDetails = videoStats.contentDetails

          videos.push({
            videoId: videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
            description: item.snippet.description.substring(0, 200) + '...',
            duration: formatDuration(contentDetails.duration),
            viewCount: formatViewCount(parseInt(stats.viewCount || 0)),
            likes: formatViewCount(parseInt(stats.likeCount || 0)),
            publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
            url: `https://www.youtube.com/watch?v=${videoId}`,
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            quality: calculateQuality(stats, contentDetails),
            type: i === 0 ? 'best' : 'preferred'
          })
        }
      } catch (error) {
        console.error(`Error fetching stats for video ${videoId}:`, error)
        continue
      }
    }

    console.log(`✅ Found ${videos.length} quality videos`)
    return videos
  } catch (error) {
    console.error('❌ Error fetching quality videos:', error)
    return []
  }
}

/**
 * Calculate quality score based on statistics
 * @param {Object} stats - Video statistics
 * @param {Object} contentDetails - Video content details
 * @returns {number} Quality score 0-100
 */
const calculateQuality = (stats, contentDetails) => {
  let score = 50 // Base score

  // View count (max 30 points)
  const viewCount = parseInt(stats.viewCount || 0)
  if (viewCount > 1000000) score += 30
  else if (viewCount > 100000) score += 25
  else if (viewCount > 10000) score += 20
  else if (viewCount > 1000) score += 10

  // Like count ratio (max 20 points)
  const likeCount = parseInt(stats.likeCount || 0)
  const likeRatio = viewCount > 0 ? likeCount / viewCount : 0
  if (likeRatio > 0.05) score += 20
  else if (likeRatio > 0.03) score += 15
  else if (likeRatio > 0.01) score += 10

  // Duration appropriateness (5-20 minutes is ideal)
  const durationSeconds = parseISO8601Duration(contentDetails.duration)
  if (durationSeconds >= 300 && durationSeconds <= 1200) score += 10

  // Comment count (if available)
  const commentCount = parseInt(stats.commentCount || 0)
  if (commentCount > 1000) score += 10

  return Math.min(score, 100)
}

/**
 * Parse ISO 8601 duration to seconds
 * @param {string} duration - ISO 8601 duration (e.g., PT10M30S)
 * @returns {number} Duration in seconds
 */
const parseISO8601Duration = (duration) => {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  const matches = duration.match(regex)

  const hours = parseInt(matches[1] || 0)
  const minutes = parseInt(matches[2] || 0)
  const seconds = parseInt(matches[3] || 0)

  return hours * 3600 + minutes * 60 + seconds
}

/**
 * Format duration from ISO 8601 format
 * @param {string} duration - ISO 8601 duration
 * @returns {string} Formatted duration (e.g., "10:30")
 */
const formatDuration = (duration) => {
  const seconds = parseISO8601Duration(duration)
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

/**
 * Format view count to readable format
 * @param {number} count - View/like count
 * @returns {string} Formatted count (e.g., "1.2M", "500K")
 */
const formatViewCount = (count) => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
  return count.toString()
}

/**
 * Get video transcript (if available)
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<string>} Video transcript or empty string
 */
export const getVideoTranscript = async (videoId) => {
  try {
    // Note: YouTube Transcript API requires server-side implementation
    // This is a placeholder for future implementation
    console.log(`📝 Transcript feature coming soon for video: ${videoId}`)
    return ''
  } catch (error) {
    console.error('Error fetching transcript:', error)
    return ''
  }
}
