import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { auth } from '../lib/firebase'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { verifySession, isAuthenticated as checkAuth, logout as apiLogout } from '../lib/api'

const AuthContext = createContext({ user: null, loading: true, isAuthenticated: false, logout: null, login: null })

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  const [notification, setNotification] = useState(null)

  // Show notification
  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), duration)
  }, [])

  // Persist user and session to localStorage
  const persistUser = useCallback((userData, sessionToken = null) => {
    if (userData) {
      localStorage.setItem('codeflux_user', JSON.stringify({
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        metadata: {
          creationTime: userData.metadata?.creationTime,
          lastSignInTime: userData.metadata?.lastSignInTime
        }
      }))
      localStorage.setItem('codeflux_last_login', new Date().toISOString())
      
      // Store session token separately with timestamp
      if (sessionToken) {
        localStorage.setItem('sessionToken', sessionToken)
        localStorage.setItem('sessionTokenTime', new Date().toISOString())
        console.log('✅ Session persisted to localStorage')
      }
    }
  }, [])

  // Retrieve user from localStorage
  const retrieveUser = useCallback(() => {
    const stored = localStorage.getItem('codeflux_user')
    return stored ? JSON.parse(stored) : null
  }, [])

  // Login handler
  const login = useCallback((userData, sessionToken = null) => {
    setUser(userData)
    setIsAuth(true)
    persistUser(userData, sessionToken)
    showNotification('✅ Logged in successfully!', 'success')
  }, [persistUser, showNotification])

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await apiLogout()
      await firebaseSignOut(auth)
      setUser(null)
      setIsAuth(false)
      localStorage.removeItem('codeflux_user')
      localStorage.removeItem('sessionToken')
      localStorage.removeItem('codeflux_email')
      localStorage.removeItem('codeflux_name')
      localStorage.removeItem('codeflux_last_login')
      showNotification('👋 Logged out successfully', 'info')
    } catch (err) {
      console.error('Logout error:', err)
      showNotification('❌ Logout failed', 'error')
    }
  }, [showNotification])

  useEffect(() => {
    let isMounted = true

    const initAuth = async () => {
      try {
        // First check stored user and session
        const storedUser = retrieveUser()
        const sessionToken = localStorage.getItem('sessionToken')
        
        console.log('🔐 AuthContext Init')
        console.log('  - Stored user:', storedUser?.email)
        console.log('  - Session token exists:', !!sessionToken)
        
        // If we have both stored user and session token, restore session immediately
        if (isMounted && storedUser && sessionToken) {
          console.log('  ✅ Restoring stored session')
          setUser(storedUser)
          setIsAuth(true)
          setLoading(false)
          return
        }

        // Check for valid session
        if (isMounted && storedUser) {
          console.log('  ⚠️ User exists but validating session')
          setUser(storedUser)
          setIsAuth(true)
        }

        // Set up Firebase listener
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
          if (!isMounted) return

          console.log('🔥 Firebase state changed:', firebaseUser?.email)

          if (firebaseUser) {
            const userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || 'CodeFlux User',
              photoURL: firebaseUser.photoURL
            }
            
            // Get current session token if available
            const currentToken = localStorage.getItem('sessionToken')
            
            if (isMounted) {
              persistUser(userData, currentToken)
              setUser(userData)
              setIsAuth(true)
              showNotification('✅ Logged in successfully!', 'success')
            }
          } else if (storedUser && sessionToken) {
            console.log('  ✅ Keeping stored session active')
            if (isMounted) {
              setUser(storedUser)
              setIsAuth(true)
            }
          } else if (storedUser) {
            console.log('  ⚠️ Stored user exists, keeping auth state')
            if (isMounted) {
              setUser(storedUser)
              setIsAuth(true)
            }
          } else {
            if (isMounted) {
              setUser(null)
              setIsAuth(false)
            }
          }

          if (isMounted) {
            setLoading(false)
          }
        })

        return unsub
      } catch (err) {
        console.error('Auth init error:', err)
        if (isMounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    const cleanup = initAuth()
    return () => {
      isMounted = false
      cleanup?.then(unsub => unsub?.())
    }
  }, [persistUser, retrieveUser, showNotification])

  return (
    <AuthContext.Provider value={{user, loading, isAuthenticated: isAuth, logout, login, notification, showNotification}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}

