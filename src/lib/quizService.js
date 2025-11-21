import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Generate quiz questions dynamically based on course content
 * @param {Object} course - The course object containing chapters, lessons, etc.
 * @returns {Promise<Array>} - Array of 12 MCQ questions
 */
export const generateQuizQuestions = async (course) => {
  try {
    console.log('Starting quiz generation for course:', course.title);

    // Extract course content for context
    let courseContent = `Course: ${course.title}\n`;
    courseContent += `Description: ${course.description}\n\n`;
    courseContent += `Key Topics:\n`;

    if (course.chapters && course.chapters.length > 0) {
      course.chapters.forEach((chapter, idx) => {
        courseContent += `\nChapter ${idx + 1}: ${chapter.title}\n`;
        courseContent += `- ${chapter.description}\n`;
        if (chapter.keyTakeaways) {
          courseContent += `Key Points: ${chapter.keyTakeaways.join(', ')}\n`;
        }
      });
    }

    // Prompt for Gemini to generate questions
    const prompt = `Based on this course content, generate exactly 12 multiple choice questions (MCQ). 

${courseContent}

Generate the quiz in the following JSON format ONLY, with no additional text:
[
  {
    "id": 1,
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Explanation of why the correct answer is right"
  },
  ...continue for 12 questions...
]

Rules:
- Each question must have exactly 4 options
- correctAnswer is the index (0, 1, 2, or 3) of the correct option
- Questions should cover key concepts from the course
- Explanations should be clear and educational
- Vary the difficulty level
- Make sure correct answer position varies (not always same index)

Return ONLY valid JSON array, no markdown, no code blocks.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Raw Gemini response:', text);

    // Parse the response
    let questions;
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        questions = JSON.parse(text);
      }
    } catch (parseError) {
      console.error('Failed to parse quiz questions:', parseError);
      throw new Error('Invalid quiz format received from AI');
    }

    // Validate questions
    if (!Array.isArray(questions) || questions.length < 12) {
      throw new Error(`Expected 12 questions, got ${questions.length}`);
    }

    console.log('Generated quiz questions:', questions);
    return questions;
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw error;
  }
};

/**
 * Calculate quiz results
 * @param {Array} questions - Array of quiz questions
 * @param {Array} userAnswers - Array of user's selected answers (indices)
 * @returns {Object} - Results object with score, percentage, and details
 */
export const calculateQuizResults = (questions, userAnswers) => {
  let score = 0;
  const details = [];

  questions.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === question.correctAnswer;

    if (isCorrect) {
      score++;
    }

    details.push({
      questionId: question.id,
      question: question.question,
      userAnswer: userAnswer !== undefined ? question.options[userAnswer] : 'Not answered',
      correctAnswer: question.options[question.correctAnswer],
      isCorrect,
      explanation: question.explanation,
    });
  });

  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 70; // 70% to pass

  return {
    score,
    totalQuestions: questions.length,
    percentage,
    passed,
    details,
  };
};

/**
 * Save quiz attempt to Firebase
 * @param {string} userId - User's UID
 * @param {string} courseId - Course ID
 * @param {Object} quizResult - Quiz results object
 * @returns {Promise<void>}
 */
export const saveQuizAttempt = async (userId, courseId, quizResult) => {
  try {
    // Get current user's quiz data from Firebase
    const { db } = await import('./firebase');
    const { ref, set, get } = await import('firebase/database');

    const quizAttemptRef = ref(db, `users/${userId}/quizzes/${courseId}`);
    
    // Prepare attempt data
    const attempt = {
      courseId,
      score: quizResult.score,
      totalQuestions: quizResult.totalQuestions,
      percentage: quizResult.percentage,
      passed: quizResult.passed,
      timestamp: new Date().toISOString(),
      details: quizResult.details,
    };

    // Get existing quiz data
    const snapshot = await get(quizAttemptRef);
    let quizData = snapshot.val() || { attempts: [], bestScore: 0 };

    if (!Array.isArray(quizData.attempts)) {
      quizData.attempts = [];
    }

    // Add new attempt
    quizData.attempts.push(attempt);

    // Update best score if this is better
    if (quizResult.score > quizData.bestScore) {
      quizData.bestScore = quizResult.score;
    }

    // Update Firebase
    await set(quizAttemptRef, quizData);

    console.log('Quiz attempt saved to Firebase:', attempt);
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    throw error;
  }
};

/**
 * Get quiz attempts for a course
 * @param {string} userId - User's UID
 * @param {string} courseId - Course ID
 * @returns {Promise<Object>} - Quiz data with attempts and best score
 */
export const getQuizAttempts = async (userId, courseId) => {
  try {
    const { db } = await import('./firebase');
    const { ref, get } = await import('firebase/database');

    const quizRef = ref(db, `users/${userId}/quizzes/${courseId}`);
    const snapshot = await get(quizRef);

    return snapshot.val() || { attempts: [], bestScore: 0 };
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return { attempts: [], bestScore: 0 };
  }
};
