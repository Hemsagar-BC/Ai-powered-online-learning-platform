import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Get the current authenticated user
 * This waits for Firebase to restore the session if needed
 */
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        reject(new Error('User not authenticated'));
      }
    }, (error) => {
      unsubscribe();
      reject(error);
    });
    
    // Timeout after 5 seconds
    setTimeout(() => {
      unsubscribe();
      reject(new Error('Authentication state check timeout'));
    }, 5000);
  });
};

/**
 * Get storage key for user's progress
 */
const getProgressStorageKey = (userId) => `userProgress_${userId}`;

/**
 * Mark a chapter as done (localStorage only)
 */
export const markChapterAsDone = async (courseId, chapterId) => {
  try {
    const user = await getCurrentUser();
    console.log(`💾 Saving to localStorage: courseId=${courseId}, chapterId=${chapterId}, userId=${user.uid}`);
    
    const storageKey = getProgressStorageKey(user.uid);
    const allProgress = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    if (!allProgress[courseId]) {
      allProgress[courseId] = {
        courseId,
        completedChapters: [],
        startedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
    }
    
    const courseProgress = allProgress[courseId];
    if (!courseProgress.completedChapters.includes(chapterId)) {
      courseProgress.completedChapters.push(chapterId);
      courseProgress.lastUpdated = new Date().toISOString();
      localStorage.setItem(storageKey, JSON.stringify(allProgress));
      console.log(`✅ Chapter ${chapterId} marked as done. Total completed: ${courseProgress.completedChapters.length}`);
    } else {
      console.log(`ℹ️ Chapter ${chapterId} already marked as done`);
    }

    return true;
  } catch (error) {
    console.error('❌ Error marking chapter as done:', error);
    throw error;
  }
};

/**
 * Unmark a chapter (remove from completed)
 */
export const unmarkChapterAsDone = async (courseId, chapterId) => {
  try {
    const user = await getCurrentUser();
    console.log(`🗑️ Removing from localStorage: courseId=${courseId}, chapterId=${chapterId}`);
    
    const storageKey = getProgressStorageKey(user.uid);
    const allProgress = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    if (allProgress[courseId]) {
      allProgress[courseId].completedChapters = allProgress[courseId].completedChapters.filter(
        id => id !== chapterId
      );
      allProgress[courseId].lastUpdated = new Date().toISOString();
      localStorage.setItem(storageKey, JSON.stringify(allProgress));
      console.log(`✅ Chapter ${chapterId} unmarked`);
    }

    return true;
  } catch (error) {
    console.error('❌ Error unmarking chapter as done:', error);
    throw error;
  }
};

/**
 * Get progress for a specific course
 */
export const getCourseProgress = async (courseId) => {
  try {
    const user = await getCurrentUser();
    const storageKey = getProgressStorageKey(user.uid);
    const allProgress = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    if (allProgress[courseId]) {
      const data = allProgress[courseId];
      console.log(`📖 Retrieved progress for ${courseId}:`, data);
      return data;
    }

    console.log(`ℹ️ No progress data yet for ${courseId}`);
    return {
      courseId,
      completedChapters: [],
      startedDate: null,
      lastUpdated: null,
    };
  } catch (error) {
    console.error('❌ Error getting course progress:', error);
    // Return empty progress instead of failing completely
    return {
      courseId,
      completedChapters: [],
      startedDate: null,
      lastUpdated: null,
    };
  }
};

/**
 * Get all user's course progress
 */
export const getAllUserProgress = async () => {
  try {
    const user = await getCurrentUser();
    const storageKey = getProgressStorageKey(user.uid);
    const allProgress = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    console.log('✅ Retrieved all progress data:', Object.keys(allProgress).length, 'courses');
    return allProgress;
  } catch (error) {
    console.error('❌ Error getting all user progress:', error);
    // Return empty object instead of failing
    return {};
  }
};

/**
 * Calculate completion percentage for a course
 */
export const calculateCompletionPercentage = (totalChapters, completedChapters) => {
  if (totalChapters === 0) return 0;
  return Math.round((completedChapters.length / totalChapters) * 100);
};

/**
 * Check if a chapter is completed
 */
export const isChapterCompleted = (completedChapters, chapterId) => {
  return completedChapters.includes(chapterId);
};
