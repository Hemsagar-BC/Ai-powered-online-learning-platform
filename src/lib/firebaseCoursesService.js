import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get, update, remove } from 'firebase/database'
import { getAuth } from 'firebase/auth'

// Initialize Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
}

export const db = getDatabase()
export const auth = getAuth()

/**
 * Get current user's Firebase UID
 */
export const getCurrentUserUID = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe()
      if (user) {
        resolve(user.uid)
      } else {
        reject(new Error('User not authenticated'))
      }
    })
  })
}

/**
 * Save course to Firebase
 */
export const saveCourseToFirebase = async (course, userEmail) => {
  try {
    if (!userEmail) {
      console.warn('⚠️ No user email provided, skipping Firebase save')
      return course.id
    }

    // Get current user UID
    const uid = await getCurrentUserUID()
    console.log('✅ Got user UID:', uid)
    
    const courseData = {
      id: course.id,
      title: course.title,
      description: course.description || '',
      category: course.category || 'Technology',
      difficulty: course.difficulty || 'Beginner',
      totalChapters: course.chapters?.length || 0,
      createdAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      progress: 0,
      currentChapter: 0,
      status: 'in_progress',
      thumbnail: course.thumbnail || null,
      chapterDetails: (course.chapters || []).map((ch, idx) => ({
        id: ch.id || `ch_${idx}`,
        title: ch.title || `Chapter ${idx + 1}`,
        completed: false,
        progress: 0,
        lastAccessedAt: null
      })),
      fullCourseData: {
        ...course,
        chapters: course.chapters || []
      }
    }

    const courseRef = ref(db, `users/${uid}/courses/${course.id}`)
    await set(courseRef, courseData)
    
    console.log('✅ Course saved to Firebase:', course.title)
    return course.id
  } catch (error) {
    console.error('❌ Error saving course to Firebase:', error.message)
    throw error
  }
}

/**
 * Get all courses for current user from Firebase
 */
export const getUserCoursesFromFirebase = async (userEmail) => {
  try {
    if (!userEmail) {
      console.warn('⚠️ No user email provided')
      return []
    }

    const uid = await getCurrentUserUID()
    const coursesRef = ref(db, `users/${uid}/courses`)
    
    const snapshot = await get(coursesRef)
    
    if (snapshot.exists()) {
      const courses = []
      snapshot.forEach(courseSnapshot => {
        courses.push({
          id: courseSnapshot.key,
          ...courseSnapshot.val()
        })
      })
      console.log(`✅ Fetched ${courses.length} courses from Firebase`)
      return courses
    } else {
      console.log('ℹ️ No courses found for this user')
      return []
    }
  } catch (error) {
    console.error('❌ Error fetching user courses:', error.message)
    return []
  }
}

/**
 * Get a specific course from Firebase
 */
export const getCourseFromFirebase = async (userEmail, courseId) => {
  try {
    if (!userEmail || !courseId) {
      return null
    }

    const uid = await getCurrentUserUID()
    const courseRef = ref(db, `users/${uid}/courses/${courseId}`)
    
    const snapshot = await get(courseRef)
    
    if (snapshot.exists()) {
      return {
        id: snapshot.key,
        ...snapshot.val()
      }
    }
    return null
  } catch (error) {
    console.error('❌ Error fetching course:', error.message)
    return null
  }
}

/**
 * Update course progress
 */
export const updateCourseProgress = async (userEmail, courseId, progress) => {
  try {
    const uid = await getCurrentUserUID()
    const courseRef = ref(db, `users/${uid}/courses/${courseId}`)
    
    await update(courseRef, {
      progress: progress,
      lastAccessedAt: new Date().toISOString()
    })
    
    console.log('✅ Course progress updated')
  } catch (error) {
    console.error('❌ Error updating course progress:', error.message)
    throw error
  }
}

/**
 * Delete course from Firebase
 */
export const deleteCourseFromFirebase = async (userEmail, courseId) => {
  try {
    const uid = await getCurrentUserUID()
    const courseRef = ref(db, `users/${uid}/courses/${courseId}`)
    
    await remove(courseRef)
    console.log('✅ Course deleted from Firebase')
  } catch (error) {
    console.error('❌ Error deleting course:', error.message)
    throw error
  }
}

/**
 * Get continue learning courses (latest 5)
 */
export const getContinueLearningCourses = async (userEmail, limit = 5) => {
  try {
    const courses = await getUserCoursesFromFirebase(userEmail)
    // Sort by last accessed date and limit
    return courses
      .sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt))
      .slice(0, limit)
  } catch (error) {
    console.error('❌ Error getting continue learning courses:', error.message)
    return []
  }
}
