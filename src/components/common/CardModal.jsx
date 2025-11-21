import React from 'react'
import PropTypes from 'prop-types'

export function Card({
  children,
  className = '',
  hover = true,
  ...props
}) {
  return (
    <div
      className={`bg-white rounded-lg shadow ${hover ? 'hover:shadow-lg transition-shadow' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool
}

export function Modal({
  isOpen,
  onClose,
  children,
  title = '',
  size = 'md',
  className = ''
}) {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`bg-white rounded-lg shadow-xl ${sizes[size]} w-full mx-4 ${className}`}
      >
        {title && (
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string
}

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}) {
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800'
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <span className={`rounded-full font-semibold ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'success', 'warning', 'danger', 'gray']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
}
