import React from 'react';
import PropTypes from 'prop-types';

const TypingIndicator = ({ 
  isTyping = false, 
  userName = 'Someone',
  variant = 'dots'
}) => {
  if (!isTyping) return null;

  const dotsVariant = (
    <div className="flex items-center gap-1">
      <div className="text-gray-500 dark:text-gray-400 text-sm">{userName} is typing</div>
      <div className="flex gap-1 ml-1">
        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );

  const pulseVariant = (
    <div className="flex items-center gap-2">
      <div className="text-gray-500 dark:text-gray-400 text-sm">{userName} is typing</div>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );

  const typingVariant = (
    <div className="flex items-center gap-2">
      <svg className="w-4 h-4 text-purple-500 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
      <p className="text-sm text-gray-600 dark:text-gray-400">{userName} is typing...</p>
    </div>
  );

  const variants = {
    dots: dotsVariant,
    pulse: pulseVariant,
    typing: typingVariant
  };

  return (
    <div className="px-4 py-2 mb-2">
      {variants[variant]}
    </div>
  );
};

TypingIndicator.propTypes = {
  isTyping: PropTypes.bool,
  userName: PropTypes.string,
  variant: PropTypes.oneOf(['dots', 'pulse', 'typing'])
};

export default TypingIndicator;
