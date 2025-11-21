import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ChatInput = ({ 
  onSend, 
  onTyping,
  placeholder = 'Type a message...',
  maxLength = 5000,
  isLoading = false,
  showEmoji = true,
  showAttachment = true,
  disabled = false,
  multiline = true
}) => {
  const [input, setInput] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxLength) {
      setInput(text);
      setCharCount(text.length);
      if (onTyping) onTyping(text.length > 0);
    }
  };

  const handleSend = () => {
    if (input.trim() && !isLoading && !disabled) {
      onSend(input);
      setInput('');
      setCharCount(0);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow new line with Shift+Enter
        return;
      }
      e.preventDefault();
      handleSend();
    }
  };

  const isNearLimit = charCount > maxLength * 0.8;

  return (
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
      {/* Character count */}
      {isNearLimit && (
        <div className="text-xs text-orange-500 mb-2">
          {charCount} / {maxLength}
        </div>
      )}

      {/* Input area */}
      <div className="flex gap-3 items-end">
        {/* Attachment button */}
        {showAttachment && (
          <button
            onClick={() => {}}
            disabled={disabled}
            className="text-gray-500 hover:text-purple-500 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
            title="Attach file"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zm-10.65 2.96h4v4h-4z" />
            </svg>
          </button>
        )}

        {/* Input field */}
        <div className="flex-1">
          {multiline ? (
            <textarea
              value={input}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              maxLength={maxLength}
              disabled={disabled || isLoading}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
          ) : (
            <input
              type="text"
              value={input}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              maxLength={maxLength}
              disabled={disabled || isLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
          )}
        </div>

        {/* Emoji button */}
        {showEmoji && (
          <button
            onClick={() => {}}
            disabled={disabled}
            className="text-gray-500 hover:text-purple-500 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
            title="Add emoji"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </button>
        )}

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading || disabled}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="1" opacity="0.3" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16151416 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99721575 L3.03521743,10.4382088 C3.03521743,10.5953061 3.34915502,10.7524035 3.50612381,10.7524035 L16.6915026,11.5379074 C16.6915026,11.5379074 17.1624089,11.5379074 17.1624089,12.0091995 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  onTyping: PropTypes.func,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  isLoading: PropTypes.bool,
  showEmoji: PropTypes.bool,
  showAttachment: PropTypes.bool,
  disabled: PropTypes.bool,
  multiline: PropTypes.bool
};

export default ChatInput;
