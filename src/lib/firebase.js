import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'

// Firebase config is read from Vite env vars. Create a .env file with these keys.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()

// Initialize Firestore with persistence
export const db = getFirestore(app)

// Enable offline persistence
try {
  enableIndexedDbPersistence(db)
    .then(() => console.log('✅ Firestore offline persistence enabled'))
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('⚠️ Multiple tabs open, persistence disabled')
      } else if (err.code === 'unimplemented') {
        console.warn('⚠️ Browser doesn\'t support persistence')
      }
    })
} catch (error) {
  console.log('Offline persistence already enabled or unavailable')
}

/**
 * Sign in with Google and exchange credentials for backend session token
 */
export const signInWithGoogle = async () => {
  try {
    console.log('🔐 Starting Google Sign-In...');
    const result = await signInWithPopup(auth, provider)
    
    console.log('✅ Firebase authentication successful');
    console.log('   User:', result.user.email);
    
    // Get the Firebase ID token
    const token = await result.user.getIdToken()
    console.log('✅ Firebase ID token obtained');
    
    console.log('📡 Exchanging token with backend...');
    
    // Exchange Firebase token with backend for session token
    const response = await fetch('http://localhost:5000/api/auth/google/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        code: token,  // Using Firebase token as auth code
        user: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        }
      })
    })

    console.log('📥 Backend response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Backend error:', errorData);
      throw new Error(`Backend error: ${errorData.error || 'Failed to get session'}`)
    }

    const data = await response.json()
    
    console.log('📦 Backend response data:', data);
    
    // Store the backend session token IMMEDIATELY with proper structure
    if (data.sessionToken) {
      const sessionData = {
        token: data.sessionToken,
        email: result.user.email,
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
      localStorage.setItem('sessionToken', data.sessionToken)
      localStorage.setItem('sessionData', JSON.stringify(sessionData))
      localStorage.setItem('sessionTokenTime', new Date().toISOString())
      console.log('✅ Session token stored in localStorage');
      console.log('   Token (first 30 chars):', data.sessionToken.substring(0, 30) + '...');
      console.log('   Session data:', { email: sessionData.email, expiresAt: sessionData.expiresAt });
    } else {
      console.warn('⚠️ No sessionToken in backend response:', data)
      throw new Error('No session token received from backend')
    }
    
    // Also store user info for quick access
    if (data.user) {
      localStorage.setItem('codeflux_email', data.user.email)
      localStorage.setItem('codeflux_name', data.user.name)
      console.log('✅ User info stored in localStorage');
    }
    
    return result
  } catch (error) {
    console.error('❌ Sign in error:', error)
    localStorage.removeItem('sessionToken') // Clear any incomplete session
    throw error
  }
}

export const logout = async () => signOut(auth)

/**
 * Get the current Firebase user's ID token
 * Used for server communication when session token is not available
 */
export const getFirebaseIdToken = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('No Firebase user logged in');
      return null;
    }
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error getting Firebase ID token:', error);
    return null;
  }
}

// NOTE: Do NOT commit secrets. Use .env or a secure secret manager for API keys.
