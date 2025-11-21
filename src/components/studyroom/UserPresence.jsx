import React from 'react';
import PropTypes from 'prop-types';

const UserPresence = ({ 
  user,
  showOnlineStatus = true,
  showTypingStatus = false,
  isTyping = false,
  actionMenu = null
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
      <div className="flex items-center gap-3 flex-1">
        {/* Avatar with status */}
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          {showOnlineStatus && (
            <div
              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                user.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
          )}
        </div>

        {/* User info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
              {user.name}
            </h4>
            {user.isCreator && (
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-semibold px-2 py-0.5 rounded">
                Host
              </span>
            )}
          </div>

          {/* Status or typing indicator */}
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {showTypingStatus && isTyping ? (
              <div className="flex items-center gap-1">
                <span>typing</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            ) : (
              <>
                {user.status && <span>{user.status}</span>}
                {user.isOnline && <span> • Active now</span>}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action menu */}
      {actionMenu && (
        <div className="flex-shrink-0">
          {actionMenu}
        </div>
      )}
    </div>
  );
};

UserPresence.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    isOnline: PropTypes.bool,
    isCreator: PropTypes.bool,
    status: PropTypes.string
  }).isRequired,
  showOnlineStatus: PropTypes.bool,
  showTypingStatus: PropTypes.bool,
  isTyping: PropTypes.bool,
  actionMenu: PropTypes.node
};

export default UserPresence;
