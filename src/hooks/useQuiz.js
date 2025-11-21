import { useState, useEffect, useCallback } from 'react'
import QuizService from '@/lib/quiz.service'

export const useQuiz = (courseId, quizId) => {
  const [quiz, setQuiz] = useState(null)
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (courseId && quizId) {
      fetchQuiz()
    }
  }, [courseId, quizId])

  const fetchQuiz = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await QuizService.getQuiz(courseId, quizId)
      setQuiz(data)
      return data
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [courseId, quizId])

  const submitAnswers = useCallback(async (answers) => {
    setIsLoading(true)
    try {
      const result = await QuizService.submitQuiz(courseId, quizId, answers)
      setResults(result)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [courseId, quizId])

  const getStats = useCallback(async () => {
    try {
      return await QuizService.getQuizStats(courseId, quizId)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [courseId, quizId])

  return {
    quiz,
    results,
    isLoading,
    error,
    fetchQuiz,
    submitAnswers,
    getStats
  }
}

export default useQuiz
