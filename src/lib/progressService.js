import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Get the current authenticated user (with timeout and fallback)
 * This waits for Firebase to restore the session if needed
 */
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        console.log('✅ User authenticated:', user.uid);
        resolve(user);
      } else {
        console.log('ℹ️ User not authenticated, using guest session');
        // For guest users, use a temporary ID
        resolve({ uid: 'guest_' + localStorage.getItem('guestId') || 'guest_' + Date.now() });
      }
    }, (error) => {
      unsubscribe();
      console.warn('⚠️ Auth check error:', error.message);
      // Fallback for guests
      resolve({ uid: 'guest_' + (localStorage.getItem('guestId') || Date.now()) });
    });
    
    // Timeout after 3 seconds
    setTimeout(() => {
      unsubscribe();
      console.warn('⏱️ Auth check timeout, using guest session');
      resolve({ uid: 'guest_' + (localStorage.getItem('guestId') || Date.now()) });
    }, 3000);
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
    // Ensure chapterId is a string for consistency
    const chapterIdStr = String(chapterId);
    console.log(`💾 Mark as done: courseId=${courseId}, chapterId=${chapterIdStr}`);
    
    const user = await getCurrentUser();
    const storageKey = getProgressStorageKey(user.uid);
    
    console.log(`📝 Storage key: ${storageKey}`);
    
    // Get existing progress
    const allProgress = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    // Create course progress if it doesn't exist
    if (!allProgress[courseId]) {
      allProgress[courseId] = {
        courseId,
        completedChapters: [],
        startedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      console.log(`🆕 Created new course progress entry for ${courseId}`);
    }
    
    const courseProgress = allProgress[courseId];
    
    // Check if already marked
    const alreadyCompleted = courseProgress.completedChapters.some(id => String(id) === chapterIdStr);
    
    if (!alreadyCompleted) {
      // Add chapter to completed list
      courseProgress.completedChapters.push(chapterIdStr);
      courseProgress.lastUpdated = new Date().toISOString();
      
      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(allProgress));
      
      console.log(`✅ Chapter ${chapterIdStr} marked as done!`);
      console.log(`📊 Total completed chapters: ${courseProgress.completedChapters.length}`);
      console.log(`📋 Completed chapters array:`, courseProgress.completedChapters);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('progressUpdated', { 
        detail: { courseId, chapterId: chapterIdStr, completedChapters: courseProgress.completedChapters }
      }));
      
      return true;
    } else {
      console.log(`ℹ️ Chapter ${chapterIdStr} already marked as done`);
      return true;
    }
  } catch (error) {
    console.error('❌ Error marking chapter as done:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

/**
 * Unmark a chapter (remove from completed)
 */
export const unmarkChapterAsDone = async (courseId, chapterId) => {
  try {
    // Ensure chapterId is a string for consistency
    const chapterIdStr = String(chapterId);
    console.log(`🗑️ Unmark: courseId=${courseId}, chapterId=${chapterIdStr}`);
    
    const user = await getCurrentUser();
    const storageKey = getProgressStorageKey(user.uid);
    
    const allProgress = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    if (allProgress[courseId]) {
      const beforeCount = allProgress[courseId].completedChapters.length;
      
      // Filter out the chapter
      allProgress[courseId].completedChapters = allProgress[courseId].completedChapters.filter(
        id => String(id) !== chapterIdStr
      );
      
      allProgress[courseId].lastUpdated = new Date().toISOString();
      localStorage.setItem(storageKey, JSON.stringify(allProgress));
      
      console.log(`✅ Chapter ${chapterIdStr} unmarked`);
      console.log(`📊 Completed chapters: ${beforeCount} → ${allProgress[courseId].completedChapters.length}`);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('progressUpdated', { 
        detail: { courseId, chapterId: chapterIdStr, completedChapters: allProgress[courseId].completedChapters }
      }));
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
      // Ensure all chapter IDs are strings for consistency
      if (data.completedChapters) {
        data.completedChapters = data.completedChapters.map(id => String(id));
      }
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
    
    console.log(`📚 Retrieved progress for user ${user.uid}:`, Object.keys(allProgress).length, 'courses');
    
    // Log each course's progress
    Object.entries(allProgress).forEach(([courseId, progress]) => {
      console.log(`   📖 Course ${courseId}: ${progress.completedChapters?.length || 0} chapters completed`);
    });
    
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
  const chapterIdStr = String(chapterId);
  return completedChapters.some(id => String(id) === chapterIdStr);
};
