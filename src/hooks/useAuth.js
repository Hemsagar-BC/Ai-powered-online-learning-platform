import { useState, useEffect, useCallback } from 'react'
import AuthService from '@/lib/auth.service'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const currentUser = await AuthService.getCurrentUser()
          setUser(currentUser)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    try {
      const userData = await AuthService.login(email, password)
      setUser(userData.user)
      return userData
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await AuthService.logout()
      setUser(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    logout
  }
}

export default useAuth
