import React from 'react'
import PropTypes from 'prop-types'

export function Textarea({
  placeholder = '',
  error = false,
  errorMessage = '',
  label = '',
  rows = 4,
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
      <textarea
        placeholder={placeholder}
        rows={rows}
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

Textarea.propTypes = {
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  rows: PropTypes.number,
  className: PropTypes.string
}

export function Select({
  options = [],
  placeholder = 'Select...',
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
      <select
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  )
}

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })),
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string
}

export function Toggle({
  checked = false,
  onChange,
  label = '',
  disabled = false,
  className = ''
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={() => onChange && onChange(!checked)}
        disabled={disabled}
        className={`w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    </div>
  )
}

Toggle.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string
}
