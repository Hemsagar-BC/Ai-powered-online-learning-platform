import React from 'react'
import PropTypes from 'prop-types'

/**
 * Input Component
 * @param {string} type - HTML input type
 * @param {string} placeholder - Placeholder text
 * @param {boolean} error - Show error state
 * @param {string} errorMessage - Error message
 * @param {string} label - Input label
 */
export default function Input({
  type = 'text',
  placeholder = '',
  error = false,
  errorMessage = '',
  label = '',
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  )
}

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string
}
