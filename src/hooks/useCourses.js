import { useState, useEffect, useCallback } from 'react'
import CourseService from '@/lib/course.service'

export const useCourses = () => {
  const [courses, setCourses] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCourses = useCallback(async (filters = {}) => {
    setIsLoading(true)
    try {
      const data = await CourseService.getAllCourses(filters)
      setCourses(data)
      return data
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchEnrolledCourses = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await CourseService.getEnrolledCourses()
      setEnrolledCourses(data)
      return data
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const enrollCourse = useCallback(async (courseId) => {
    try {
      const result = await CourseService.enrollCourse(courseId)
      await fetchEnrolledCourses()
      return result
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [fetchEnrolledCourses])

  const getCourseProgress = useCallback(async (courseId) => {
    try {
      return await CourseService.getCourseProgress(courseId)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  return {
    courses,
    enrolledCourses,
    isLoading,
    error,
    fetchCourses,
    fetchEnrolledCourses,
    enrollCourse,
    getCourseProgress
  }
}

export default useCourses
