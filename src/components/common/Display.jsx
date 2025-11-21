import React from 'react'
import PropTypes from 'prop-types'

export function ProgressBar({
  progress = 0,
  showLabel = true,
  color = 'blue',
  size = 'md'
}) {
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600'
  }

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${colors[color]} h-full transition-all duration-300`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-gray-600 mt-1">{Math.round(progress)}%</p>
      )}
    </div>
  )
}

ProgressBar.propTypes = {
  progress: PropTypes.number,
  showLabel: PropTypes.bool,
  color: PropTypes.oneOf(['blue', 'green', 'red', 'yellow']),
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
}

export function ProgressRing({
  progress = 0,
  size = 100,
  strokeWidth = 4,
  showLabel = true
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      {showLabel && (
        <p className="absolute text-sm font-semibold text-gray-700">
          {Math.round(progress)}%
        </p>
      )}
    </div>
  )
}

ProgressRing.propTypes = {
  progress: PropTypes.number,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  showLabel: PropTypes.bool
}

export function Tooltip({
  children,
  text,
  position = 'top',
  className = ''
}) {
  const positions = {
    top: '-top-8 left-1/2 -translate-x-1/2',
    bottom: 'top-full left-1/2 -translate-x-1/2',
    left: '-left-8 top-1/2 -translate-y-1/2',
    right: '-right-8 top-1/2 -translate-y-1/2'
  }

  return (
    <div className={`relative group ${className}`}>
      {children}
      <div className={`absolute ${positions[position]} opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap`}>
        {text}
      </div>
    </div>
  )
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  className: PropTypes.string
}

export function Avatar({
  src,
  name,
  size = 'md',
  className = ''
}) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  }

  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold ${
        src ? '' : 'bg-blue-100 text-blue-700'
      } ${className}`}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full rounded-full object-cover" />
      ) : (
        initials
      )}
    </div>
  )
}

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
}

export function EmptyState({
  icon = '📭',
  title = 'No Data',
  description = 'Nothing to show here',
  action = null,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  )
}

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string
}
