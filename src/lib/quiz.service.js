import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

class QuizService {
  async getQuiz(courseId, quizId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/courses/${courseId}/quizzes/${quizId}`
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch quiz')
    }
  }

  async submitQuiz(courseId, quizId, answers) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/courses/${courseId}/quizzes/${quizId}/submit`,
        { answers }
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit quiz')
    }
  }

  async getQuizResults(courseId, quizId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/courses/${courseId}/quizzes/${quizId}/results`
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch results')
    }
  }

  async getQuizHistory(courseId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/courses/${courseId}/quizzes/history`
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch history')
    }
  }

  async getQuizStats(courseId, quizId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/courses/${courseId}/quizzes/${quizId}/stats`
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stats')
    }
  }
}

export default new QuizService()
