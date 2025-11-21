import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Edit, Camera, Mail, MapPin, Award, BookOpen } from 'lucide-react'

export const ProfileHeader = ({
  user = {},
  isEditing = false,
  onEditClick,
  onAvatarChange,
  className = ''
}) => {
  const [hovering, setHovering] = useState(false)

  return (
    <div className={`bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white ${className}`}>
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div
          className="relative"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <img
            src={user.avatar || 'https://via.placeholder.com/120'}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
          />
          {isEditing && (
            <button
              onClick={() => onAvatarChange?.()}
              className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/50 transition-opacity ${
                hovering ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Camera size={24} className="text-white" />
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{user.name || 'User Name'}</h1>
            {isEditing && (
              <button
                onClick={onEditClick}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Edit size={20} />
              </button>
            )}
          </div>

          <div className="space-y-2 text-blue-100">
            {user.email && (
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{user.location}</span>
              </div>
            )}
          </div>

          {user.bio && (
            <p className="mt-3 text-blue-100">{user.bio}</p>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-6 text-center">
          <div>
            <p className="text-2xl font-bold">{user.level || 1}</p>
            <p className="text-xs text-blue-100">Level</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{user.coursesCompleted || 0}</p>
            <p className="text-xs text-blue-100">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{user.streak || 0}</p>
            <p className="text-xs text-blue-100">Streak</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ProfileStats = ({
  stats = {},
  className = ''
}) => {
  const defaultStats = {
    coursesEnrolled: 0,
    coursesCompleted: 0,
    totalLearningHours: 0,
    certificates: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalXP: 0,
    achievements: 0,
    ...stats
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-6">Statistics</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <BookOpen size={24} className="text-blue-600 mb-2" />
          <p className="text-xs text-gray-600 mb-1">Courses Completed</p>
          <p className="text-2xl font-bold text-gray-900">{defaultStats.coursesCompleted}</p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <Award size={24} className="text-purple-600 mb-2" />
          <p className="text-xs text-gray-600 mb-1">Certificates</p>
          <p className="text-2xl font-bold text-gray-900">{defaultStats.certificates}</p>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg">
          <span className="text-2xl">🔥</span>
          <p className="text-xs text-gray-600 mb-1 mt-2">Current Streak</p>
          <p className="text-2xl font-bold text-gray-900">{defaultStats.currentStreak}</p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <span className="text-2xl">⭐</span>
          <p className="text-xs text-gray-600 mb-1 mt-2">Total XP</p>
          <p className="text-2xl font-bold text-gray-900">{defaultStats.totalXP}</p>
        </div>
      </div>
    </div>
  )
}

export const EditProfileModal = ({
  user = {},
  isOpen = false,
  isLoading = false,
  onClose,
  onSave,
  className = ''
}) => {
  const [formData, setFormData] = useState(user)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave?.(formData)
  }

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 opacity-60"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const ProfileAchievements = ({
  achievements = [],
  className = ''
}) => {
  const unlockedCount = achievements.filter(a => a.isUnlocked).length

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Achievements</h3>
        <span className="text-sm font-semibold text-blue-600">{unlockedCount}/{achievements.length}</span>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {achievements.map((achievement, idx) => (
          <div 
            key={idx}
            className={`p-3 rounded-lg text-center transition-all ${
              achievement.isUnlocked 
                ? 'bg-yellow-50 border-2 border-yellow-300' 
                : 'bg-gray-50 border-2 border-gray-300 opacity-50'
            }`}
            title={achievement.title}
          >
            <p className="text-2xl mb-1">{achievement.icon || '🏆'}</p>
            <p className="text-xs font-medium text-gray-700 truncate">{achievement.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

ProfileHeader.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    bio: PropTypes.string,
    location: PropTypes.string,
    level: PropTypes.number,
    coursesCompleted: PropTypes.number,
    streak: PropTypes.number
  }),
  isEditing: PropTypes.bool,
  onEditClick: PropTypes.func,
  onAvatarChange: PropTypes.func,
  className: PropTypes.string
}

ProfileStats.propTypes = {
  stats: PropTypes.shape({
    coursesEnrolled: PropTypes.number,
    coursesCompleted: PropTypes.number,
    totalLearningHours: PropTypes.number,
    certificates: PropTypes.number,
    currentStreak: PropTypes.number,
    longestStreak: PropTypes.number,
    totalXP: PropTypes.number,
    achievements: PropTypes.number
  }),
  className: PropTypes.string
}

EditProfileModal.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    bio: PropTypes.string,
    location: PropTypes.string
  }),
  isOpen: PropTypes.bool,
  isLoading: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  className: PropTypes.string
}

ProfileAchievements.propTypes = {
  achievements: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    icon: PropTypes.string,
    isUnlocked: PropTypes.bool
  })),
  className: PropTypes.string
}

export default {
  ProfileHeader,
  ProfileStats,
  EditProfileModal,
  ProfileAchievements
}
