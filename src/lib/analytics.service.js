import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

class AnalyticsService {
  async trackEvent(eventName, eventData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/analytics/events`, {
        eventName,
        eventData,
        timestamp: new Date().toISOString()
      })
      return response.data
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  }

  async getLearningStats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/learning-stats`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stats')
    }
  }

  async getActivityHeatmap(days = 30) {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/activity-heatmap`, {
        params: { days }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch heatmap')
    }
  }

  async getCourseStats(courseId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/analytics/courses/${courseId}/stats`
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch course stats')
    }
  }

  async trackPageView(pageName, metadata = {}) {
    return this.trackEvent('page_view', { page: pageName, ...metadata })
  }

  async trackCourseEnrollment(courseId, courseName) {
    return this.trackEvent('course_enrollment', { courseId, courseName })
  }

  async trackChapterCompletion(courseId, chapterId) {
    return this.trackEvent('chapter_completion', { courseId, chapterId })
  }

  async trackQuizSubmission(quizId, score, totalPoints) {
    return this.trackEvent('quiz_submission', { quizId, score, totalPoints })
  }
}

export default new AnalyticsService()
