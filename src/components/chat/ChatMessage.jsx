import React from 'react';
import PropTypes from 'prop-types';

const ChatMessage = ({ 
  message, 
  isOwn = false, 
  showAvatar = true,
  showTimestamp = true,
  avatar = null,
  senderName = null
}) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isOwn && showAvatar && (
        <div className="flex-shrink-0">
          {avatar ? (
            <img 
              src={avatar} 
              alt={senderName || 'User'}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
              {senderName?.[0] || 'U'}
            </div>
          )}
        </div>
      )}

      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-xs`}>
        {!isOwn && senderName && (
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
            {senderName}
          </p>
        )}
        
        <div
          className={`px-4 py-2 rounded-lg ${
            isOwn
              ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-br-none'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
          }`}
        >
          <p className="text-sm break-words">{message}</p>
        </div>

        {showTimestamp && (
          <p className={`text-xs mt-1 ${isOwn ? 'text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>
            {formatTime(new Date().toISOString())}
          </p>
        )}
      </div>

      {isOwn && showAvatar && (
        <div className="flex-shrink-0">
          {avatar ? (
            <img 
              src={avatar} 
              alt="You"
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
              U
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.string.isRequired,
  isOwn: PropTypes.bool,
  showAvatar: PropTypes.bool,
  showTimestamp: PropTypes.bool,
  avatar: PropTypes.string,
  senderName: PropTypes.string
};

export default ChatMessage;
