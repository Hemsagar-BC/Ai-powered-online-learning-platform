import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const ChatPanel = ({ 
  isOpen = false, 
  onClose, 
  conversations = [],
  selectedConversation = null,
  onSelectConversation,
  onSendMessage,
  isLoading = false,
  position = 'bottom-right'
}) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage({
        conversationId: selectedConversation?.id,
        content: messageInput,
        timestamp: new Date().toISOString()
      });
      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed ${positionClasses[position]} z-50 w-80 h-96 bg-white dark:bg-gray-900 rounded-lg shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700 animation-fade-in`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-bold text-lg">Messages</h3>
        <button
          onClick={onClose}
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
          </svg>
        </button>
      </div>

      {/* Conversations List / Messages View */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        {!selectedConversation ? (
          // Conversations list
          <div className="divide-y dark:divide-gray-700">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className="w-full p-3 hover:bg-gray-200 dark:hover:bg-gray-700 text-left transition-colors border-b border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <img 
                      src={conv.avatar} 
                      alt={conv.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {conv.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        ) : (
          // Messages view
          <div className="p-3 space-y-3 flex flex-col h-full">
            {selectedConversation.messages?.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-purple-500 text-white rounded-br-none'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-purple-100' : 'text-gray-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      {selectedConversation && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex gap-2">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              rows="2"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !messageInput.trim()}
              className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="1" opacity="0.3" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16151416 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99721575 L3.03521743,10.4382088 C3.03521743,10.5953061 3.34915502,10.7524035 3.50612381,10.7524035 L16.6915026,11.5379074 C16.6915026,11.5379074 17.1624089,11.5379074 17.1624089,12.0091995 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

ChatPanel.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  conversations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    lastMessage: PropTypes.string,
    unread: PropTypes.number
  })),
  selectedConversation: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    messages: PropTypes.arrayOf(PropTypes.shape({
      sender: PropTypes.oneOf(['user', 'other']),
      content: PropTypes.string,
      timestamp: PropTypes.string
    }))
  }),
  onSelectConversation: PropTypes.func.isRequired,
  onSendMessage: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  position: PropTypes.oneOf(['bottom-right', 'bottom-left', 'top-right', 'top-left'])
};

export default ChatPanel;
