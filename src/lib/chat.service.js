import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

class ChatService {
  async sendMessage(recipientId, message) {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/messages`, {
        recipientId,
        message,
        timestamp: new Date().toISOString()
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send message')
    }
  }

  async getMessages(conversationId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/chat/conversations/${conversationId}/messages`
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch messages')
    }
  }

  async getConversations() {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/conversations`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch conversations')
    }
  }

  async createConversation(participantIds) {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/conversations`, {
        participants: participantIds
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create conversation')
    }
  }

  async markAsRead(conversationId) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/chat/conversations/${conversationId}/read`
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark as read')
    }
  }

  async deleteMessage(messageId) {
    try {
      await axios.delete(`${API_BASE_URL}/chat/messages/${messageId}`)
      return { success: true }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete message')
    }
  }
}

export default new ChatService()
