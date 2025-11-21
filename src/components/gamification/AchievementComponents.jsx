import React from 'react'
import PropTypes from 'prop-types'
import { Award, Star, Lock, Unlock } from 'lucide-react'

export const AchievementBadge = ({
  icon = '🏆',
  title = 'Achievement',
  description = '',
  isUnlocked = false,
  unlockedDate = '',
  rarity = 'common', // common, rare, epic, legendary
  onClick,
  className = ''
}) => {
  const rarityColors = {
    common: 'bg-gray-100 border-gray-300 text-gray-900',
    rare: 'bg-blue-100 border-blue-300 text-blue-900',
    epic: 'bg-purple-100 border-purple-300 text-purple-900',
    legendary: 'bg-yellow-100 border-yellow-300 text-yellow-900'
  }

  const rarityGlow = {
    common: '',
    rare: 'shadow-md',
    epic: 'shadow-lg shadow-purple-500/30',
    legendary: 'shadow-lg shadow-yellow-500/30'
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
        isUnlocked
          ? rarityColors[rarity]
          : 'bg-gray-50 border-gray-200 text-gray-500 opacity-60'
      } ${rarityGlow[rarity]} ${className}`}
    >
      <div className="text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <h4 className="font-bold text-sm mb-1">{title}</h4>
        {description && (
          <p className="text-xs opacity-75 mb-2">{description}</p>
        )}
        
        {isUnlocked ? (
          <div className="flex items-center justify-center gap-1 text-xs">
            <Unlock size={12} />
            {unlockedDate && <span>{unlockedDate}</span>}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1 text-xs">
            <Lock size={12} />
            <span>Locked</span>
          </div>
        )}

        {/* Rarity Indicator */}
        <div className="mt-2 text-xs">
          {rarity === 'legendary' && '⭐⭐⭐⭐⭐'}
          {rarity === 'epic' && '⭐⭐⭐⭐'}
          {rarity === 'rare' && '⭐⭐⭐'}
          {rarity === 'common' && '⭐⭐'}
        </div>
      </div>
    </div>
  )
}

export const AchievementGrid = ({
  achievements = [],
  columns = 3,
  showLocked = true,
  onAchievementClick,
  className = ''
}) => {
  const unlockedCount = achievements.filter(a => a.isUnlocked).length

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Achievements</h3>
        <span className="text-sm font-semibold text-blue-600">
          {unlockedCount}/{achievements.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {unlockedCount} achievements unlocked
        </p>
      </div>

      {/* Achievements Grid */}
      <div className={`grid grid-cols-${columns} gap-4`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {achievements.map((achievement, idx) => {
          if (!achievement.isUnlocked && !showLocked) return null
          
          return (
            <AchievementBadge
              key={idx}
              {...achievement}
              onClick={() => onAchievementClick?.(achievement)}
            />
          )
        })}
      </div>
    </div>
  )
}

export const LevelUpModal = ({
  newLevel = 1,
  previousLevel = 0,
  reward = 0,
  badge = '',
  title = 'Level Up!',
  onClose,
  className = ''
}) => {
  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg p-8 max-w-sm mx-4 shadow-xl animate-bounce">
        {/* Icon */}
        <div className="text-center mb-6">
          <div className="inline-block text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-blue-600 mb-2">{title}</h2>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">You've reached</p>
            <p className="text-4xl font-bold text-blue-600">Level {newLevel}</p>
          </div>

          {reward > 0 && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Reward</p>
              <p className="text-2xl font-bold text-yellow-600">+{reward} XP</p>
            </div>
          )}

          {badge && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">New Badge</p>
              <p className="text-3xl">{badge}</p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Awesome! Let's Continue
        </button>
      </div>
    </div>
  )
}

export const XPAnimation = ({
  amount = 10,
  x = 0,
  y = 0,
  onComplete
}) => {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className="fixed font-bold text-xl text-yellow-500 pointer-events-none animate-pulse"
      style={{
        left: x,
        top: y,
        animation: 'float-up 2s ease-out forwards'
      }}
    >
      +{amount} XP
      <style>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px);
          }
        }
      `}</style>
    </div>
  )
}

AchievementBadge.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  isUnlocked: PropTypes.bool,
  unlockedDate: PropTypes.string,
  rarity: PropTypes.oneOf(['common', 'rare', 'epic', 'legendary']),
  onClick: PropTypes.func,
  className: PropTypes.string
}

AchievementGrid.propTypes = {
  achievements: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    isUnlocked: PropTypes.bool,
    unlockedDate: PropTypes.string,
    rarity: PropTypes.oneOf(['common', 'rare', 'epic', 'legendary'])
  })),
  columns: PropTypes.number,
  showLocked: PropTypes.bool,
  onAchievementClick: PropTypes.func,
  className: PropTypes.string
}

LevelUpModal.propTypes = {
  newLevel: PropTypes.number,
  previousLevel: PropTypes.number,
  reward: PropTypes.number,
  badge: PropTypes.string,
  title: PropTypes.string,
  onClose: PropTypes.func,
  className: PropTypes.string
}

XPAnimation.propTypes = {
  amount: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  onComplete: PropTypes.func
}

export default {
  AchievementBadge,
  AchievementGrid,
  LevelUpModal,
  XPAnimation
}
