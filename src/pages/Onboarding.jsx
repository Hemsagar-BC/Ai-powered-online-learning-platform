import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { db as firestore } from '../lib/firebase'
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'
import { formatDateForDb } from '../lib/dateUtils'

const STUDY_REASONS = [
  'School/College',
  'Competitive Exams',
  'Professional Development',
  'Skill Learning',
  'Personal Growth',
  'Language Learning'
]

const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
  'Geography',
  'Economics',
  'Computer Science',
  'Programming',
  'Data Science',
  'Web Development',
  'UI/UX Design',
  'Business',
  'Psychology',
  'Philosophy',
  'Art',
  'Music'
]

const AVATARS = Array.from({ length: 12 }, (_, i) => `avatar_${i + 1}`)

const STUDY_TIMES = ['Morning', 'Afternoon', 'Evening', 'Night']

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, showNotification } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    studyingFor: '',
    subjects: [],
    dailyHours: 4,
    examDate: '',
    studyTimes: [],
    avatar: 'avatar_1',
    name: user?.displayName || ''
  })

  // Check if user already completed onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user?.uid) return
      try {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid))
        if (userDoc.exists() && userDoc.data().onboardingCompleted) {
          navigate('/dashboard')
        }
      } catch (err) {
        console.error('Error checking onboarding:', err)
      }
    }
    checkOnboarding()
  }, [user, navigate])

  const handleNext = async () => {
    // Validate current step
    if (step === 1 && !formData.studyingFor) {
      showNotification('Please select what you are studying for', 'error')
      return
    }
    if (step === 2 && formData.subjects.length === 0) {
      showNotification('Please select at least one subject', 'error')
      return
    }
    if (step === 4 && formData.studyTimes.length === 0) {
      showNotification('Please select at least one study time', 'error')
      return
    }

    if (step === 5) {
      // Save preferences to Firestore
      await savePreferences()
    } else {
      setStep(step + 1)
    }
  }

  const savePreferences = async () => {
    if (!user?.uid) {
      showNotification('User not found', 'error')
      return
    }

    try {
      setLoading(true)
      const today = formatDateForDb()

      // Update user document with preferences
      await setDoc(
        doc(firestore, 'users', user.uid),
        {
          onboardingCompleted: true,
          onboardingDate: Timestamp.now(),
          studyingFor: formData.studyingFor,
          subjects: formData.subjects,
          dailyGoalHours: formData.dailyHours,
          examDate: formData.examDate || null,
          preferredStudyTimes: formData.studyTimes,
          avatar: formData.avatar,
          lastOnboardingUpdate: today
        },
        { merge: true }
      )

      // Initialize streak document
      const streakRef = doc(firestore, 'streaks', user.uid)
      const streakSnap = await getDoc(streakRef)

      if (!streakSnap.exists()) {
        await setDoc(streakRef, {
          current: 0,
          longest: 0,
          lastStudyDate: null,
          totalStudyDays: 0,
          freezesAvailable: 0,
          freezeUsedDate: null,
          studyDays: {},
          createdAt: Timestamp.now()
        })
      }

      showNotification('✅ Onboarding complete! Welcome to StudySync!', 'success')
      navigate('/dashboard')
    } catch (err) {
      console.error('Error saving preferences:', err)
      showNotification('Failed to save preferences. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const toggleSubject = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

  const toggleStudyTime = (time) => {
    setFormData(prev => ({
      ...prev,
      studyTimes: prev.studyTimes.includes(time)
        ? prev.studyTimes.filter(t => t !== time)
        : [...prev.studyTimes, time]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            {[1, 2, 3, 4, 5].map(num => (
              <div
                key={num}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  num <= step
                    ? 'bg-white text-purple-600'
                    : 'bg-white/20 text-white'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-white/95">
          {/* Step 1: Study Purpose */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What are you studying for?</h2>
              <p className="text-gray-600 mb-6">Help us personalize your learning experience</p>
              <div className="space-y-3">
                {STUDY_REASONS.map(reason => (
                  <button
                    key={reason}
                    onClick={() => setFormData(prev => ({ ...prev, studyingFor: reason }))}
                    className={`w-full p-4 rounded-lg border-2 transition-all font-medium text-left ${
                      formData.studyingFor === reason
                        ? 'border-purple-600 bg-purple-50 text-purple-600'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-purple-300'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Subjects */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select your subjects</h2>
              <p className="text-gray-600 mb-6">Pick all that apply (minimum 1)</p>
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {SUBJECTS.map(subject => (
                  <button
                    key={subject}
                    onClick={() => toggleSubject(subject)}
                    className={`p-3 rounded-lg border-2 transition-all font-medium text-sm ${
                      formData.subjects.includes(subject)
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Daily Goal */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Daily study goal</h2>
              <p className="text-gray-600 mb-8">How many hours do you want to study daily?</p>
              <div className="mb-8">
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={formData.dailyHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, dailyHours: parseInt(e.target.value) }))}
                  className="w-full h-3 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="text-5xl font-bold text-purple-600 text-center mt-6">
                  {formData.dailyHours}h
                </div>
              </div>

              <label className="block mb-4">
                <span className="text-sm font-medium text-gray-700 mb-2 block">Exam/Deadline Date (optional)</span>
                <input
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, examDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </label>
            </div>
          )}

          {/* Step 4: Study Times */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">When do you study best?</h2>
              <p className="text-gray-600 mb-6">Select your preferred study times</p>
              <div className="space-y-3">
                {STUDY_TIMES.map(time => (
                  <button
                    key={time}
                    onClick={() => toggleStudyTime(time)}
                    className={`w-full p-4 rounded-lg border-2 transition-all font-medium text-left ${
                      formData.studyTimes.includes(time)
                        ? 'border-green-600 bg-green-50 text-green-600'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-green-300'
                    }`}
                  >
                    {time === 'Morning' && '🌅'} {time === 'Afternoon' && '☀️'}{' '}
                    {time === 'Evening' && '🌆'} {time === 'Night' && '🌙'} {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Avatar Selection */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your avatar</h2>
              <p className="text-gray-600 mb-6">Pick an avatar that represents you</p>
              <div className="grid grid-cols-4 gap-4">
                {AVATARS.map(avatar => (
                  <button
                    key={avatar}
                    onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                    className={`aspect-square rounded-lg border-3 transition-all font-semibold text-4xl flex items-center justify-center ${
                      formData.avatar === avatar
                        ? 'border-purple-600 bg-purple-100'
                        : 'border-gray-200 bg-gray-100 hover:border-purple-300'
                    }`}
                  >
                    {avatar === 'avatar_1' && '😊'}
                    {avatar === 'avatar_2' && '🤓'}
                    {avatar === 'avatar_3' && '🎓'}
                    {avatar === 'avatar_4' && '🚀'}
                    {avatar === 'avatar_5' && '💡'}
                    {avatar === 'avatar_6' && '⭐'}
                    {avatar === 'avatar_7' && '🎯'}
                    {avatar === 'avatar_8' && '🏆'}
                    {avatar === 'avatar_9' && '💪'}
                    {avatar === 'avatar_10' && '🔥'}
                    {avatar === 'avatar_11' && '🌟'}
                    {avatar === 'avatar_12' && '👨‍🚀'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={handlePrevious}
              disabled={step === 1}
              className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Saving...' : step === 5 ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/80 mt-6 text-sm">
          Step {step} of 5
        </p>
      </div>
    </div>
  )
}
