import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ChatButton = ({ 
  onClick, 
  unreadCount = 0, 
  variant = 'default',
  size = 'md',
  disabled = false,
  tooltipText = 'Open chat'
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  };

  const variantClasses = {
    default: 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    secondary: 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700',
    outline: 'border-2 border-purple-500 hover:bg-purple-50 dark:border-purple-400 dark:hover:bg-purple-900'
  };

  const textColorClass = variant === 'outline' ? 'text-purple-500' : 'text-white';

  return (
    <div className="relative">
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          ${sizeClasses[size]} 
          ${variantClasses[variant]} 
          rounded-full 
          flex items-center justify-center 
          shadow-lg 
          transition-all duration-200 
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          relative
        `}
        title={tooltipText}
      >
        <svg 
          className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-6 h-6' : 'w-7 h-7'} ${textColorClass}`}
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
          {tooltipText}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

ChatButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  unreadCount: PropTypes.number,
  variant: PropTypes.oneOf(['default', 'secondary', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  tooltipText: PropTypes.string
};

export default ChatButton;
