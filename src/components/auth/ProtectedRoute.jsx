import React from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import { Loader } from 'lucide-react'

export const ProtectedRoute = ({
  isAuthenticated = false,
  isLoading = false,
  user = null,
  requiredRole = null,
  children,
  redirectTo = '/login'
}) => {
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // Check role if specified
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page</p>
        </div>
      </div>
    )
  }

  // Render children if authenticated
  return children
}

ProtectedRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
    role: PropTypes.string,
    avatar: PropTypes.string
  }),
  requiredRole: PropTypes.string,
  children: PropTypes.node.isRequired,
  redirectTo: PropTypes.string
}

export default ProtectedRoute
