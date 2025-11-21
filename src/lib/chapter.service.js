import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

class ChapterService {
  async getChaptersByIds(courseId, chapterIds) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/courses/${courseId}/chapters`,
        { params: { ids: chapterIds } }
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch chapters')
    }
  }

  async getChapterById(courseId, chapterId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}`
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch chapter')
    }
  }

  async completeChapter(courseId, chapterId) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}/complete`
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark chapter complete')
    }
  }

  async updateChapterProgress(courseId, chapterId, progress) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}/progress`,
        { progress }
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update progress')
    }
  }

  async getChapterResources(courseId, chapterId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}/resources`
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch resources')
    }
  }

  async addChapterNote(courseId, chapterId, note) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}/notes`,
        note
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add note')
    }
  }
}

export default new ChapterService()
