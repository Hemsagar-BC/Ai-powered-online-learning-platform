import React, { useState } from 'react';
import PropTypes from 'prop-types';

const StudyRoomLayout = ({ 
  roomId,
  roomName = 'Study Room',
  roomDescription = '',
  activeUsers = [],
  onLeaveRoom,
  children,
  showSidebar = true,
  layout = 'default'
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const layoutClasses = {
    default: 'grid grid-cols-1 lg:grid-cols-4 gap-4',
    wide: 'grid grid-cols-1 gap-4',
    split: 'grid grid-cols-1 lg:grid-cols-2 gap-4'
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {roomName}
            </h1>
            {roomDescription && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {roomDescription}
              </p>
            )}
          </div>
          <button
            onClick={onLeaveRoom}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
          >
            Leave Room
          </button>
        </div>

        {/* Active users count */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span>{activeUsers.length} users active</span>
        </div>
      </div>

      {/* Main content with optional sidebar */}
      <div className={layoutClasses[layout]}>
        {/* Main content area */}
        <div className="lg:col-span-3">
          {children}
        </div>

        {/* Sidebar */}
        {showSidebar && sidebarOpen && (
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Active Users
            </h3>
            <div className="space-y-3">
              {activeUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.status || 'Active'}
                    </p>
                  </div>
                  {user.isOnline && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sidebar toggle */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed bottom-4 right-4 bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg"
            title="Show sidebar"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

StudyRoomLayout.propTypes = {
  roomId: PropTypes.string.isRequired,
  roomName: PropTypes.string,
  roomDescription: PropTypes.string,
  activeUsers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    status: PropTypes.string,
    isOnline: PropTypes.bool
  })),
  onLeaveRoom: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  showSidebar: PropTypes.bool,
  layout: PropTypes.oneOf(['default', 'wide', 'split'])
};

export default StudyRoomLayout;
