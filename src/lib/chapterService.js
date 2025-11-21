/**
 * Chapter Details Service
 * Handles fetching structured chapter content from the backend
 */

const API_BASE = 'http://localhost:5000/api';

export const chapterService = {
  /**
   * Fetch detailed chapter content from Gemini via backend
   * @param {string} chapterTitle - Title of the chapter
   * @param {string} courseTitle - Title of the course
   * @param {string} courseTopic - Specific topic (optional)
   * @param {string} difficulty - Difficulty level (beginner|intermediate|advanced)
   * @returns {Promise<Object>} Chapter content with lessons, concepts, etc.
   */
  async getChapterDetails(chapterTitle, courseTitle, courseTopic = '', difficulty = 'intermediate') {
    try {
      const response = await fetch(`${API_BASE}/chapters/details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chapterTitle: chapterTitle.trim(),
          courseTitle: courseTitle.trim(),
          courseTopic: courseTopic.trim(),
          difficulty,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching chapter details:', error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  },

  /**
   * Format chapter content for display
   * @param {Object} chapterData - Raw chapter data from API
   * @returns {Object} Formatted chapter data
   */
  formatChapterContent(chapterData) {
    if (!chapterData) return null;

    return {
      title: chapterData.chapterTitle || 'Chapter',
      lessons: (chapterData.lessons || []).map((lesson, index) => ({
        ...lesson,
        lessonNumber: index + 1,
        id: lesson.id || `${index + 1}`,
      })),
      keyConcepts: chapterData.keyConcepts || [],
      learningOutcomes: chapterData.learningOutcomes || [],
      practicalExercises: chapterData.practicalExercises || [],
      resources: chapterData.resources || [],
      source: chapterData.source || 'unknown',
      isAiGenerated: chapterData.source === 'gemini',
    };
  },

  /**
   * Prepare lesson data for table display
   * @param {Array} lessons - Array of lesson objects
   * @returns {Array} Formatted lessons for table
   */
  prepareLessonsForTable(lessons) {
    return (lessons || []).map((lesson) => ({
      id: lesson.id,
      topic: lesson.topic,
      learningGoal: lesson.learningGoal,
      youtubeVideo: lesson.youtubeVideo,
      resources: lesson.resources,
      isResourceUrl: lesson.resources?.includes('http') || lesson.resources?.includes('www'),
    }));
  },

  /**
   * Get resource download link if available
   * @param {string} resourceString - Resource description or link
   * @returns {Object} Object with url and label
   */
  parseResourceLink(resourceString) {
    if (!resourceString) return { url: null, label: 'No resources' };

    if (resourceString.includes('http')) {
      const urlMatch = resourceString.match(/(https?:\/\/[^\s]+)/);
      return {
        url: urlMatch ? urlMatch[1] : null,
        label: resourceString.replace(/https?:\/\/[^\s]+/g, '').trim() || 'Download Resource',
      };
    }

    return {
      url: null,
      label: resourceString,
    };
  },
};

export default chapterService;
