import React from 'react';
import PropTypes from 'prop-types';

const ActiveUsers = ({ 
  users = [],
  onUserClick,
  showStatus = true,
  maxDisplay = 10
}) => {
  const displayUsers = users.slice(0, maxDisplay);
  const hiddenCount = users.length - maxDisplay;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Active Users
        </h3>
        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold px-2 py-1 rounded-full">
          {users.length} online
        </span>
      </div>

      <div className="space-y-2">
        {displayUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => onUserClick?.(user.id)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left group"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                  user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400">
                {user.name}
              </p>
              {showStatus && (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.status || (user.isOnline ? 'Online' : 'Offline')}
                </p>
              )}
            </div>

            {/* Activity indicator */}
            {user.isActive && (
              <div className="flex-shrink-0">
                <svg className="w-4 h-4 text-blue-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
            )}
          </button>
        ))}

        {hiddenCount > 0 && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              +{hiddenCount} more users
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

ActiveUsers.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    status: PropTypes.string,
    isOnline: PropTypes.bool,
    isActive: PropTypes.bool
  })),
  onUserClick: PropTypes.func,
  showStatus: PropTypes.bool,
  maxDisplay: PropTypes.number
};

export default ActiveUsers;
