import React from 'react'
import PropTypes from 'prop-types'

export function Loader({ fullScreen = false, message = 'Loading...' }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        {content}
      </div>
    )
  }

  return content
}

Loader.propTypes = {
  fullScreen: PropTypes.bool,
  message: PropTypes.string
}

export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }

  return (
    <div className={`${sizes[size]} border-blue-200 border-t-blue-600 rounded-full animate-spin ${className}`} />
  )
}

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
}

export function SkeletonLoader({ count = 1, className = '' }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-gray-200 rounded animate-pulse ${className}`}
          style={{ height: '20px', marginBottom: '8px' }}
        />
      ))}
    </>
  )
}

SkeletonLoader.propTypes = {
  count: PropTypes.number,
  className: PropTypes.string
}

export function Toast({
  message,
  type = 'info',
  onClose,
  duration = 3000
}) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const types = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300'
  }

  return (
    <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg border ${types[type]} shadow-lg animate-slide-in`}>
      {message}
    </div>
  )
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number
}
