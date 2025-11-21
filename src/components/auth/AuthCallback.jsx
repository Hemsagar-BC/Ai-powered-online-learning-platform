import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Loader, AlertCircle, CheckCircle } from 'lucide-react'

export const AuthCallback = ({
  onSuccess,
  onError,
  isProcessing = true,
  error = null,
  className = ''
}) => {
  const [message, setMessage] = useState('Authenticating...')

  useEffect(() => {
    // Extract auth code from URL
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    const errorParam = params.get('error')

    if (errorParam) {
      const errorDesc = params.get('error_description') || 'Authentication failed'
      onError?.(new Error(errorDesc))
      setMessage('Authentication failed')
    } else if (code) {
      // Process authentication code
      onSuccess?.({ code, state })
      setMessage('Redirecting...')
    } else if (!isProcessing) {
      setMessage('Processing authentication...')
    }
  }, [onSuccess, onError, isProcessing])

  return (
    <div className={`flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {error ? (
            <>
              <AlertCircle size={48} className="text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h2>
              <p className="text-gray-600 mb-6">{error.message || 'Something went wrong'}</p>
              <button
                onClick={() => window.location.href = '/login'}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Back to Login
              </button>
            </>
          ) : isProcessing ? (
            <>
              <Loader size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{message}</h2>
              <p className="text-sm text-gray-600">Please wait while we complete your sign-in</p>
            </>
          ) : (
            <>
              <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Almost there!</h2>
              <p className="text-sm text-gray-600">Completing your sign-in...</p>
            </>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-1000 ${
                error ? 'bg-red-600 w-full' : 'bg-blue-600 w-1/2'
              }`}
              style={{
                width: isProcessing ? '75%' : error ? '100%' : '100%'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

AuthCallback.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  isProcessing: PropTypes.bool,
  error: PropTypes.instanceOf(Error),
  className: PropTypes.string
}

export default AuthCallback
