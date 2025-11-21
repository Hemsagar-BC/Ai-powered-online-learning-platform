import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { courseService } from '../lib/course.service';

const CourseContext = createContext();

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourseContext must be used within CourseProvider');
  }
  return context;
};

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all courses
  const fetchCourses = async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await courseService.getAllCourses(filters);
      setCourses(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await courseService.getEnrolledCourses();
      setEnrolledCourses(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch enrolled courses');
      console.error('Error fetching enrolled courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Enroll in a course
  const enrollCourse = async (courseId) => {
    setError(null);
    try {
      const data = await courseService.enrollCourse(courseId);
      setEnrolledCourses([...enrolledCourses, data]);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to enroll in course');
      console.error('Error enrolling in course:', err);
    }
  };

  // Get course by ID
  const getCourseById = async (courseId) => {
    setError(null);
    try {
      const data = await courseService.getCourseById(courseId);
      setSelectedCourse(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch course');
      console.error('Error fetching course:', err);
    }
  };

  // Get course progress
  const getCourseProgress = async (courseId) => {
    setError(null);
    try {
      const data = await courseService.getCourseProgress(courseId);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch course progress');
      console.error('Error fetching progress:', err);
    }
  };

  // Update selected course
  const updateSelectedCourse = (course) => {
    setSelectedCourse(course);
  };

  // Clear selected course
  const clearSelectedCourse = () => {
    setSelectedCourse(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Load courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const value = {
    courses,
    enrolledCourses,
    selectedCourse,
    isLoading,
    error,
    fetchCourses,
    fetchEnrolledCourses,
    enrollCourse,
    getCourseById,
    getCourseProgress,
    updateSelectedCourse,
    clearSelectedCourse,
    clearError
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

CourseProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default CourseContext;
