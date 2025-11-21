import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Chrome, Loader } from 'lucide-react'

export const GoogleSignInButton = ({
  isLoading = false,
  disabled = false,
  onSignIn,
  variant = 'primary', // primary, secondary, outline
  size = 'md', // sm, md, lg
  fullWidth = false,
  className = ''
}) => {
  const [isHovering, setIsHovering] = useState(false)

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg'
  }

  const variantClasses = {
    primary: 'bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-900 hover:border-gray-400',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-2 border-gray-300',
    outline: 'bg-transparent border-2 border-gray-300 hover:bg-gray-50 text-gray-900'
  }

  const handleClick = (e) => {
    e.preventDefault()
    if (!isLoading && !disabled) {
      onSignIn?.()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || disabled}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        font-semibold rounded-lg transition-all duration-200
        flex items-center justify-center gap-2
        disabled:opacity-60 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader size={20} className="animate-spin" />
          <span>Signing in...</span>
        </>
      ) : (
        <>
          <Chrome size={20} />
          <span>Sign in with Google</span>
        </>
      )}
    </button>
  )
}

GoogleSignInButton.propTypes = {
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  onSignIn: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  className: PropTypes.string
}

export default GoogleSignInButton
