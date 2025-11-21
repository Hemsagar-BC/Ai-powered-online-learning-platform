import React from 'react';
import PropTypes from 'prop-types';

const AskQuestionModal = ({ 
  isOpen = false, 
  onClose, 
  onSubmit,
  tags = [],
  isLoading = false
}) => {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [charCount, setCharCount] = React.useState(0);

  const handleContentChange = (e) => {
    const text = e.target.value;
    setContent(text);
    setCharCount(text.length);
  };

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSubmit({
        title: title.trim(),
        content: content.trim(),
        tags: selectedTags
      });
      setTitle('');
      setContent('');
      setSelectedTags([]);
      setCharCount(0);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ask a Question
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Question Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question? Be specific..."
              maxLength={150}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/150</p>
          </div>

          {/* Description textarea */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Question Details
            </label>
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Provide context and details about your question. Include what you've already tried..."
              maxLength={5000}
              disabled={isLoading}
              rows="8"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none dark:bg-gray-700 dark:text-white disabled:opacity-50"
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-500">{charCount}/5000</p>
              {charCount > 4500 && (
                <p className="text-xs text-orange-500">Getting close to limit</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tags (Select up to 3)
            </label>
            <div className="flex gap-2 flex-wrap p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  disabled={selectedTags.length >= 3 && !selectedTags.includes(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Selected: {selectedTags.join(', ')} ({selectedTags.length}/3)
              </p>
            )}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Tips for a great question:</h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Be specific and clear</li>
              <li>• Include relevant code snippets or examples</li>
              <li>• Describe what you've already tried</li>
              <li>• Add relevant tags for better visibility</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all disabled:opacity-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !title.trim() || !content.trim()}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all disabled:opacity-50 font-medium"
          >
            {isLoading ? 'Posting...' : 'Post Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

AskQuestionModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  isLoading: PropTypes.bool
};

export default AskQuestionModal;
