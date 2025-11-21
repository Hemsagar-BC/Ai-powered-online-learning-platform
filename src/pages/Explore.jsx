import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { saveCourseToFirebase } from '../lib/firebaseCoursesService'

export default function Explore() {
  const navigate = useNavigate()
  const { user, showNotification } = useAuth()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [loading, setLoading] = useState(false)

  // Pre-generated courses
  const preGeneratedCourses = [
    {
      id: 'explore-react-basics',
      title: 'React Fundamentals',
      description: 'Master the basics of React including components, hooks, state management, and lifecycle methods. Perfect for beginners starting their React journey.',
      category: 'Web Development',
      difficulty: 'Beginner',
      chapters: [
        {
          id: 1,
          title: 'Introduction to React',
          description: 'Get started with React basics and understand JSX',
          keyPoints: [
            'What is React and why use it',
            'Components and JSX syntax',
            'Virtual DOM concept',
            'Setting up your React environment'
          ],
          detailedContent: 'React is a JavaScript library for building user interfaces with reusable components. JSX is a syntax extension that allows you to write HTML-like code in JavaScript. The Virtual DOM is React\'s way of keeping the UI in sync with data.',
          lessons: [
            { title: 'What is React?', duration: '10 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' },
            { title: 'Setting up React Project', duration: '15 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' },
            { title: 'Understanding JSX', duration: '12 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' }
          ],
          keyConcepts: ['Components', 'JSX', 'Props', 'State', 'Virtual DOM'],
          learningOutcomes: [
            'Understand React fundamentals',
            'Write basic React components',
            'Use JSX effectively',
            'Set up React development environment',
            'Understand component lifecycle'
          ],
          practicalExercises: [
            { title: 'Create Your First Component', description: 'Build a simple greeting component' },
            { title: 'Props Practice', description: 'Pass data between components' }
          ]
        },
        {
          id: 2,
          title: 'Components and Props',
          description: 'Learn how to create components and pass data using props',
          keyPoints: [
            'Functional and class components',
            'Props and prop validation',
            'Component composition',
            'Reusable components'
          ],
          detailedContent: 'Components are the building blocks of React applications. Props allow you to pass data from parent to child components, making your components reusable and flexible.',
          lessons: [
            { title: 'Functional Components', duration: '12 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' },
            { title: 'Props Deep Dive', duration: '15 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' }
          ],
          keyConcepts: ['Functional Components', 'Props', 'PropTypes', 'Default Props'],
          learningOutcomes: [
            'Create functional components',
            'Use props effectively',
            'Validate props',
            'Create reusable components'
          ],
          practicalExercises: [
            { title: 'Build a Card Component', description: 'Create a reusable card component' }
          ]
        },
        {
          id: 3,
          title: 'Hooks and State Management',
          description: 'Master React Hooks for state and side effects',
          keyPoints: [
            'useState hook',
            'useEffect hook',
            'Custom hooks',
            'Rules of hooks'
          ],
          detailedContent: 'Hooks allow you to use state and other React features in functional components. useState manages component state, while useEffect handles side effects like data fetching.',
          lessons: [
            { title: 'Introduction to Hooks', duration: '10 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' },
            { title: 'useState in Detail', duration: '15 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' },
            { title: 'useEffect for Side Effects', duration: '12 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' }
          ],
          keyConcepts: ['useState', 'useEffect', 'useContext', 'Custom Hooks'],
          learningOutcomes: [
            'Use useState hook',
            'Use useEffect hook',
            'Create custom hooks',
            'Manage component lifecycle'
          ],
          practicalExercises: [
            { title: 'Todo App with Hooks', description: 'Build a todo list using hooks' }
          ]
        }
      ]
    },
    {
      id: 'explore-python-basics',
      title: 'Python for Beginners',
      description: 'Learn Python programming from scratch. Covers variables, data types, loops, functions, and object-oriented programming concepts.',
      category: 'Programming',
      difficulty: 'Beginner',
      chapters: [
        {
          id: 1,
          title: 'Python Basics',
          description: 'Introduction to Python syntax and fundamentals',
          keyPoints: [
            'Python syntax and indentation',
            'Variables and data types',
            'Print and input functions',
            'Comments in Python'
          ],
          detailedContent: 'Python is a high-level, interpreted programming language known for its simplicity and readability. Python uses indentation to define code blocks, making it clean and easy to understand.',
          lessons: [
            { title: 'Python Installation', duration: '10 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' },
            { title: 'First Program', duration: '8 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' },
            { title: 'Variables and Data Types', duration: '12 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' }
          ],
          keyConcepts: ['Syntax', 'Variables', 'Data Types', 'Operators'],
          learningOutcomes: [
            'Set up Python environment',
            'Write Python code',
            'Understand data types',
            'Use operators'
          ],
          practicalExercises: [
            { title: 'Basic Calculations', description: 'Write programs to perform calculations' }
          ]
        },
        {
          id: 2,
          title: 'Control Flow',
          description: 'Learn if statements, loops, and control structures',
          keyPoints: [
            'If, elif, else statements',
            'For loops',
            'While loops',
            'Break and continue'
          ],
          detailedContent: 'Control flow statements allow you to execute code conditionally and repeat code blocks. These are fundamental concepts in programming.',
          lessons: [
            { title: 'Conditional Statements', duration: '15 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' },
            { title: 'For Loops', duration: '12 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' },
            { title: 'While Loops', duration: '10 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' }
          ],
          keyConcepts: ['If Statement', 'For Loop', 'While Loop', 'Nested Loops'],
          learningOutcomes: [
            'Use conditional statements',
            'Implement for loops',
            'Implement while loops',
            'Control loop execution'
          ],
          practicalExercises: [
            { title: 'Number Guessing Game', description: 'Create a number guessing game' }
          ]
        },
        {
          id: 3,
          title: 'Functions and Modules',
          description: 'Master functions, parameters, and Python modules',
          keyPoints: [
            'Defining functions',
            'Parameters and arguments',
            'Return statements',
            'Importing modules'
          ],
          detailedContent: 'Functions allow you to write reusable code blocks. Modules enable you to organize code and reuse functionality from libraries.',
          lessons: [
            { title: 'Defining Functions', duration: '12 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' },
            { title: 'Parameters and Arguments', duration: '10 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' },
            { title: 'Using Modules', duration: '8 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' }
          ],
          keyConcepts: ['Functions', 'Parameters', 'Return Values', 'Modules'],
          learningOutcomes: [
            'Define and call functions',
            'Use parameters',
            'Import and use modules',
            'Write modular code'
          ],
          practicalExercises: [
            { title: 'Calculator Function', description: 'Create calculator functions' }
          ]
        }
      ]
    },
    {
      id: 'explore-web-design',
      title: 'Web Design Essentials',
      description: 'Learn the principles of good web design including layout, typography, color theory, and responsive design techniques.',
      category: 'Design',
      difficulty: 'Beginner',
      chapters: [
        {
          id: 1,
          title: 'Design Principles',
          description: 'Fundamental principles of effective web design',
          keyPoints: [
            'Visual hierarchy',
            'Balance and symmetry',
            'Whitespace and contrast',
            'Design consistency'
          ],
          detailedContent: 'Good web design follows fundamental principles that make websites intuitive, accessible, and visually appealing. These principles guide decisions about layout, colors, and typography.',
          lessons: [
            { title: 'Visual Hierarchy', duration: '12 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' },
            { title: 'Color Theory', duration: '15 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' },
            { title: 'Typography Basics', duration: '10 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' }
          ],
          keyConcepts: ['Hierarchy', 'Balance', 'Color', 'Typography'],
          learningOutcomes: [
            'Understand visual hierarchy',
            'Apply color theory',
            'Choose appropriate fonts',
            'Create balanced layouts'
          ],
          practicalExercises: [
            { title: 'Design a Landing Page', description: 'Apply design principles to a landing page' }
          ]
        },
        {
          id: 2,
          title: 'Layout and Responsive Design',
          description: 'Master layout techniques and responsive web design',
          keyPoints: [
            'Grid systems',
            'Flexbox layouts',
            'Mobile-first design',
            'Media queries'
          ],
          detailedContent: 'Responsive design ensures your website looks great on all devices. Grid systems and flexbox are modern tools for creating flexible layouts.',
          lessons: [
            { title: 'Grid Layouts', duration: '14 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' },
            { title: 'Flexbox Guide', duration: '16 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' },
            { title: 'Responsive Images', duration: '10 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' }
          ],
          keyConcepts: ['Grid', 'Flexbox', 'Responsive', 'Mobile-First'],
          learningOutcomes: [
            'Create grid layouts',
            'Use flexbox',
            'Design mobile-first',
            'Implement responsive images'
          ],
          practicalExercises: [
            { title: 'Responsive Portfolio', description: 'Build a responsive portfolio site' }
          ]
        },
        {
          id: 3,
          title: 'User Experience (UX)',
          description: 'Learn user experience design principles and best practices',
          keyPoints: [
            'User research',
            'Wireframing',
            'Prototyping',
            'Usability testing'
          ],
          detailedContent: 'User Experience design focuses on creating websites that are easy and enjoyable to use. Understanding user needs is key to good UX.',
          lessons: [
            { title: 'UX Research Methods', duration: '12 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' },
            { title: 'Wireframing Basics', duration: '10 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' },
            { title: 'Usability Best Practices', duration: '13 min', videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ' }
          ],
          keyConcepts: ['UX', 'Research', 'Wireframes', 'Testing'],
          learningOutcomes: [
            'Conduct user research',
            'Create wireframes',
            'Test usability',
            'Improve user experience'
          ],
          practicalExercises: [
            { title: 'Wireframe Design', description: 'Create wireframes for a website' }
          ]
        }
      ]
    }
  ]

  const handleEnrollCourse = async (course) => {
    if (!user || user.email === 'demo@codeflux.dev') {
      showNotification('⚠️ Please sign in to enroll in courses', 'warning')
      return
    }

    setLoading(true)
    try {
      // Use the course's own ID (don't create a new one)
      const enrolledCourse = {
        ...course,
        createdBy: user?.email,
        createdAt: new Date().toISOString()
      }

      // Save to localStorage
      const courses = JSON.parse(localStorage.getItem('codeflux_courses') || '[]')
      courses.push(enrolledCourse)
      localStorage.setItem('codeflux_courses', JSON.stringify(courses))

      // Save to Firebase
      try {
        await saveCourseToFirebase(enrolledCourse, user.email)
        showNotification('✅ Course enrolled successfully!', 'success')
      } catch (error) {
        console.error('Firebase save error:', error)
        showNotification('⚠️ Course enrolled locally (Firebase save failed)', 'warning')
      }

      // Navigate to course using the original course ID
      setTimeout(() => {
        navigate(`/course/${course.id}`)
      }, 1000)
    } catch (error) {
      console.error('Error enrolling course:', error)
      showNotification('❌ Error enrolling course', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Explore Courses</h1>
        <p className="text-slate-600">Discover pre-curated courses to enhance your learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {preGeneratedCourses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Course Header */}
            <div className="h-40 bg-gradient-to-br from-primary-500 to-primary-600 p-6 flex flex-col justify-end text-white">
              <h2 className="text-2xl font-bold">{course.title}</h2>
            </div>

            {/* Course Body */}
            <div className="p-6">
              <p className="text-slate-600 text-sm mb-4">{course.description}</p>

              {/* Course Meta */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mr-2">
                    {course.category}
                  </span>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {course.difficulty}
                  </span>
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{course.chapters.length}</p>
                  <p className="text-xs text-slate-500">Chapters</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {course.chapters.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0)}
                  </p>
                  <p className="text-xs text-slate-500">Lessons</p>
                </div>
              </div>

              {/* Enroll Button */}
              <button
                onClick={() => handleEnrollCourse(course)}
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enrolling...' : 'Enroll Course'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {preGeneratedCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No courses available yet</p>
        </div>
      )}
    </div>
  )
}
