import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

class GamificationService {
  async getStreakInfo() {
    try {
      const response = await axios.get(`${API_BASE_URL}/gamification/streak`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch streak')
    }
  }

  async getXPInfo() {
    try {
      const response = await axios.get(`${API_BASE_URL}/gamification/xp`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch XP')
    }
  }

  async addXP(amount, reason) {
    try {
      const response = await axios.post(`${API_BASE_URL}/gamification/xp`, {
        amount,
        reason
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add XP')
    }
  }

  async getAchievements() {
    try {
      const response = await axios.get(`${API_BASE_URL}/gamification/achievements`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch achievements')
    }
  }

  async unlockAchievement(achievementId) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/gamification/achievements/${achievementId}/unlock`
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to unlock achievement')
    }
  }

  async getLeaderboard(limit = 10) {
    try {
      const response = await axios.get(`${API_BASE_URL}/gamification/leaderboard`, {
        params: { limit }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch leaderboard')
    }
  }

  async getUserRank() {
    try {
      const response = await axios.get(`${API_BASE_URL}/gamification/rank`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch rank')
    }
  }
}

export default new GamificationService()
