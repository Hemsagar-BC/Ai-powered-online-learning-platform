/**
 * Frontend API Service
 * Handles all communication with the backend server
 */

import { getFirebaseIdToken } from './firebase'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get the Google OAuth authorization URL
 */
export const getGoogleAuthUrl = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get auth URL');
    }

    const data = await response.json();
    return data.authUrl;
  } catch (error) {
    console.error('Error getting auth URL:', error);
    throw error;
  }
};

/**
 * Exchange Google authorization code for session token
 * @param {string} code - Google authorization code
 * @returns {Promise<{sessionToken: string, user: object}>}
 */
export const loginWithGoogleCode = async (code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with Google');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Authentication failed');
    }

    // Store session token in localStorage
    if (data.sessionToken) {
      localStorage.setItem('sessionToken', data.sessionToken);
    }

    return data;
  } catch (error) {
    console.error('Error authenticating with Google:', error);
    throw error;
  }
};

/**
 * Verify if the current session is still valid
 * @returns {Promise<boolean>}
 */
export const verifySession = async () => {
  try {
    const sessionToken = localStorage.getItem('sessionToken');
    
    if (!sessionToken) {
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionToken }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error verifying session:', error);
    return false;
  }
};

/**
 * Get current user profile
 * @returns {Promise<object>}
 */
export const getUserProfile = async () => {
  try {
    const sessionToken = localStorage.getItem('sessionToken');
    
    if (!sessionToken) {
      throw new Error('No session token found');
    }

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Generate a course using the backend
 * @param {object} courseData - Course generation parameters
 * @returns {Promise<object>}
 */
export const generateCourse = async (courseData) => {
  try {
    let sessionToken = localStorage.getItem('sessionToken');
    
    console.log('🔍 generateCourse called');
    console.log('   Session token exists:', !!sessionToken);
    if (sessionToken) {
      console.log('   Token (first 30 chars):', sessionToken.substring(0, 30) + '...');
    } else {
      console.warn('   ⚠️ No session token found - attempting to create one');
      
      // If no session token, try to get Firebase user and create backend session
      try {
        const firebaseToken = await getFirebaseIdToken();
        if (firebaseToken) {
          console.log('   📡 Got Firebase token, exchanging with backend...');
          const response = await fetch(`${API_BASE_URL}/auth/google/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              code: firebaseToken,
              user: JSON.parse(localStorage.getItem('codeflux_user') || '{}')
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.sessionToken) {
              sessionToken = data.sessionToken;
              localStorage.setItem('sessionToken', sessionToken);
              console.log('   ✅ Got new session token');
            }
          }
        }
      } catch (e) {
        console.warn('   Failed to create session token:', e.message);
      }
    }
    
    if (!sessionToken) {
      throw new Error('No session token found. Please sign in first.');
    }

    console.log('📤 Sending request to /api/courses/generate');
    console.log('   Token being sent:', sessionToken.substring(0, 30) + '...');

    const response = await fetch(`${API_BASE_URL}/courses/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(courseData),
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error response:', error);
      
      // Provide helpful error messages
      let userMessage = error.error || 'Failed to generate course';
      if (error.note) {
        console.log('ℹ️ Note:', error.note);
      }
      
      throw new Error(userMessage);
    }

    const data = await response.json();
    console.log('✅ Course data received successfully');
    if (data.note) {
      console.log('ℹ️', data.note);
    }
    return data;
  } catch (error) {
    console.error('Error generating course:', error);
    throw error;
  }
};

/**
 * Logout and clear session
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    const sessionToken = localStorage.getItem('sessionToken');
    
    if (!sessionToken) {
      localStorage.removeItem('sessionToken');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionToken }),
    });

    if (!response.ok) {
      console.warn('Failed to logout on server');
    }

    // Always clear local session
    localStorage.removeItem('sessionToken');
  } catch (error) {
    console.error('Error during logout:', error);
    localStorage.removeItem('sessionToken');
  }
};

/**
 * Get the session token from localStorage
 * @returns {string|null}
 */
export const getSessionToken = () => {
  return localStorage.getItem('sessionToken');
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('sessionToken');
};

/**
 * Health check for backend
 * @returns {Promise<boolean>}
 */
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.status === 'OK';
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

export default {
  getGoogleAuthUrl,
  loginWithGoogleCode,
  verifySession,
  getUserProfile,
  generateCourse,
  logout,
  getSessionToken,
  isAuthenticated,
  checkBackendHealth,
};
