import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

class StudyRoomService {
  async createStudyRoom(name, description, courseId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/study-rooms`, {
        name,
        description,
        courseId,
        createdAt: new Date().toISOString()
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create study room')
    }
  }

  async getStudyRooms(courseId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/study-rooms`, {
        params: { courseId }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch study rooms')
    }
  }

  async getStudyRoom(roomId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/study-rooms/${roomId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch study room')
    }
  }

  async joinStudyRoom(roomId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/study-rooms/${roomId}/join`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to join study room')
    }
  }

  async leaveStudyRoom(roomId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/study-rooms/${roomId}/leave`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to leave study room')
    }
  }

  async postQuestion(roomId, question, chapterId) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/study-rooms/${roomId}/questions`,
        {
          question,
          chapterId,
          timestamp: new Date().toISOString()
        }
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to post question')
    }
  }

  async postAnswer(roomId, questionId, answer) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/study-rooms/${roomId}/questions/${questionId}/answers`,
        {
          answer,
          timestamp: new Date().toISOString()
        }
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to post answer')
    }
  }

  async getActiveUsers(roomId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/study-rooms/${roomId}/active-users`
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch active users')
    }
  }
}

export default new StudyRoomService()
