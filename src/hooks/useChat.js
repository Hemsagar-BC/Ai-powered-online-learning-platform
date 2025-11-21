import { useState, useCallback, useEffect } from 'react'
import ChatService from '@/lib/chat.service'

export const useChat = () => {
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await ChatService.getConversations()
      setConversations(data)
      return data
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchMessages = useCallback(async (conversationId) => {
    setIsLoading(true)
    try {
      const data = await ChatService.getMessages(conversationId)
      setMessages(prev => ({ ...prev, [conversationId]: data }))
      return data
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const sendMessage = useCallback(async (recipientId, message) => {
    try {
      const result = await ChatService.sendMessage(recipientId, message)
      await fetchConversations()
      return result
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [fetchConversations])

  const markAsRead = useCallback(async (conversationId) => {
    try {
      return await ChatService.markAsRead(conversationId)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  return {
    conversations,
    messages,
    isLoading,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markAsRead
  }
}

export default useChat
