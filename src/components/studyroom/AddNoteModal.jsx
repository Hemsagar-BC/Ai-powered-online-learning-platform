import React from 'react';
import PropTypes from 'prop-types';

const AddNoteModal = ({ 
  isOpen = false, 
  onClose, 
  onSave,
  initialNote = null,
  tags = [],
  isLoading = false
}) => {
  const [title, setTitle] = React.useState(initialNote?.title || '');
  const [content, setContent] = React.useState(initialNote?.content || '');
  const [selectedTags, setSelectedTags] = React.useState(initialNote?.tags || []);

  React.useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || '');
      setContent(initialNote.content || '');
      setSelectedTags(initialNote.tags || []);
    } else {
      setTitle('');
      setContent('');
      setSelectedTags([]);
    }
  }, [initialNote, isOpen]);

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      onSave({
        title: title.trim(),
        content: content.trim(),
        tags: selectedTags
      });
      setTitle('');
      setContent('');
      setSelectedTags([]);
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {initialNote ? 'Edit Note' : 'Add Note'}
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
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              maxLength={100}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
          </div>

          {/* Content textarea */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              maxLength={2000}
              disabled={isLoading}
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none dark:bg-gray-700 dark:text-white disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">{content.length}/2000</p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex gap-2 flex-wrap p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Selected: {selectedTags.join(', ')}
              </p>
            )}
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
            onClick={handleSave}
            disabled={isLoading || !title.trim() || !content.trim()}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all disabled:opacity-50 font-medium"
          >
            {isLoading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
};

AddNoteModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialNote: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string)
  }),
  tags: PropTypes.arrayOf(PropTypes.string),
  isLoading: PropTypes.bool
};

export default AddNoteModal;
