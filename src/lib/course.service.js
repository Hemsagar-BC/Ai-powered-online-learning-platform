import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

class CourseService {
  async getAllCourses(filters = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses`, { params: filters })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch courses')
    }
  }

  async getCourseById(courseId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses/${courseId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch course')
    }
  }

  async createCourse(courseData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/courses`, courseData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create course')
    }
  }

  async updateCourse(courseId, courseData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/courses/${courseId}`, courseData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update course')
    }
  }

  async deleteCourse(courseId) {
    try {
      await axios.delete(`${API_BASE_URL}/courses/${courseId}`)
      return { success: true }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete course')
    }
  }

  async enrollCourse(courseId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/courses/${courseId}/enroll`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to enroll course')
    }
  }

  async getEnrolledCourses() {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses/enrolled`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch enrolled courses')
    }
  }

  async getCourseProgress(courseId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses/${courseId}/progress`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch course progress')
    }
  }
}

export default new CourseService()
