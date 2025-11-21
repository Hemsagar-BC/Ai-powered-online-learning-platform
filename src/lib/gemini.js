// Gemini API integration
import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

/**
 * generateCourse - returns a generated course outline using Gemini
 * @param {Object} options - { title, description, chaptersCount, difficulty, category }
 * @returns {Promise<Object>} - {title, description, objectives, chapters: [{title, description, keyPoints}] }
 */
export async function generateCourse(options){
  if (!genAI) {
    console.warn('Gemini API not configured. Using stub data.')
    const { title = 'New Course', chaptersCount = 7 } = options
    const chapters = Array.from({length: chaptersCount}).map((_,i)=>({
      title: `Chapter ${i+1}: Topic overview`,
      description: `Description for chapter ${i+1}`,
      keyPoints: ['Point A','Point B','Point C']
    }))
    return {
      title,
      description: options.description || 'AI generated course description (stub)',
      objectives: ['Learn fundamentals','Build projects','Apply knowledge'],
      chapters
    }
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const { title, description, chaptersCount = 5, difficulty = 'beginner', category = 'Technology' } = options
    
    const prompt = `Create a detailed course outline for: "${title}"
    
Description: ${description}
Difficulty: ${difficulty}
Category: ${category}
Number of chapters: ${chaptersCount}

Format the response as JSON with this structure:
{
  "title": "Course Title",
  "description": "2-3 sentence overview",
  "objectives": ["Objective 1", "Objective 2", "Objective 3"],
  "chapters": [
    {
      "title": "Chapter Title",
      "description": "Brief description",
      "keyPoints": ["Point 1", "Point 2", "Point 3"]
    }
  ]
}

Return ONLY valid JSON, no markdown or extra text.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    
    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const courseData = JSON.parse(jsonMatch[0])
      return courseData
    }
    
    throw new Error('Invalid response format from Gemini')
  } catch (error) {
    console.error('Error generating course with Gemini:', error)
    // Fallback to stub data
    const { title = 'New Course', chaptersCount = 7 } = options
    const chapters = Array.from({length: chaptersCount}).map((_,i)=>({
      title: `Chapter ${i+1}: ${title} Overview`,
      description: `Detailed content for chapter ${i+1}`,
      keyPoints: ['Key concept 1', 'Key concept 2', 'Key concept 3']
    }))
    return {
      title,
      description: options.description || 'Course description',
      objectives: ['Understand core concepts', 'Apply learning', 'Master skills'],
      chapters
    }
  }
}

/**
 * generateQuiz - returns an array of multiple choice questions for a chapter using Gemini
 * @param {String} chapterText
 * @returns {Promise<Array>} - [{question, options:[...], answerIndex, explanation}]
 */
export async function generateQuiz(chapterText){
  if (!genAI) {
    console.warn('Gemini API not configured. Using stub data.')
    return Array.from({length:5}).map((_,i)=>({
      question: `Sample question ${i+1} about the chapter (stub)` ,
      options: ['Option A','Option B','Option C','Option D'],
      answerIndex: Math.floor(Math.random()*4),
      explanation: 'Short explanation for the correct answer.'
    }))
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `Based on this chapter content, generate 5 multiple choice quiz questions:

"${chapterText}"

Format the response as JSON array with this structure:
[
  {
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answerIndex": 0,
    "explanation": "Why this answer is correct"
  }
]

Return ONLY valid JSON array, no markdown or extra text.
Ensure answerIndex is 0-3.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    
    // Parse JSON from response
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/)
    if (jsonMatch) {
      const quizData = JSON.parse(jsonMatch[0])
      return quizData
    }
    
    throw new Error('Invalid response format from Gemini')
  } catch (error) {
    console.error('Error generating quiz with Gemini:', error)
    // Fallback to stub data
    return Array.from({length:5}).map((_,i)=>({
      question: `Question ${i+1}: What is a key concept from this chapter?`,
      options: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
      answerIndex: 0,
      explanation: 'This is the correct answer based on the chapter content.'
    }))
  }
}

/**
 * Generate study notes using Gemini
 * @param {String} chapterText
 * @returns {Promise<String>} - Study notes
 */
export async function generateStudyNotes(chapterText){
  if (!genAI) {
    return 'Study notes generation requires Gemini API key.'
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `Create concise study notes for this chapter content:

"${chapterText}"

Format as:
- Main Concepts: (bullet points)
- Key Terms: (definitions)
- Summary: (2-3 sentences)
- Practice Tips: (bullet points)`

    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error('Error generating study notes:', error)
    return 'Unable to generate study notes at this time.'
  }
}
