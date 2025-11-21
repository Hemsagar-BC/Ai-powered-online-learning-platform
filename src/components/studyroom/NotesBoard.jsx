import React, { useState } from 'react';
import PropTypes from 'prop-types';

const NotesBoard = ({ 
  notes = [],
  onAddNote,
  onEditNote,
  onDeleteNote,
  onPinNote,
  isLoading = false,
  showAddButton = true,
  sortBy = 'recent',
  filterTag = null
}) => {
  const [sortOrder, setSortOrder] = useState(sortBy);
  const [selectedTag, setSelectedTag] = useState(filterTag);

  // Get all unique tags
  const allTags = [...new Set(notes.flatMap(note => note.tags || []))];

  // Filter and sort notes
  let displayNotes = [...notes];
  
  if (selectedTag) {
    displayNotes = displayNotes.filter(note => 
      note.tags?.includes(selectedTag)
    );
  }

  // Sort notes
  if (sortOrder === 'recent') {
    displayNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortOrder === 'pinned') {
    displayNotes.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Notes Board
        </h2>
        {showAddButton && (
          <button
            onClick={onAddNote}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all font-semibold"
          >
            + Add Note
          </button>
        )}
      </div>

      {/* Filters */}
      {allTags.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Filter by tag:</p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                selectedTag === null
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  selectedTag === tag
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sort options */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setSortOrder('recent')}
          className={`text-sm transition-all ${
            sortOrder === 'recent'
              ? 'text-purple-600 dark:text-purple-400 font-semibold'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Recent
        </button>
        <button
          onClick={() => setSortOrder('pinned')}
          className={`text-sm transition-all ${
            sortOrder === 'pinned'
              ? 'text-purple-600 dark:text-purple-400 font-semibold'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Pinned
        </button>
      </div>

      {/* Notes grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        </div>
      ) : displayNotes.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 mb-4">No notes yet</p>
          {showAddButton && (
            <button
              onClick={onAddNote}
              className="text-purple-600 dark:text-purple-400 hover:underline text-sm"
            >
              Create your first note
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={() => onEditNote(note.id)}
              onDelete={() => onDeleteNote(note.id)}
              onPin={() => onPinNote(note.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Note Card Component
const NoteCard = ({ note, onEdit, onDelete, onPin }) => (
  <div className={`p-4 rounded-lg border-2 ${
    note.isPinned
      ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20'
      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
  }`}>
    {/* Pin indicator */}
    {note.isPinned && (
      <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400 mb-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
        </svg>
        Pinned
      </div>
    )}

    {/* Title */}
    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
      {note.title}
    </h4>

    {/* Content preview */}
    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
      {note.content}
    </p>

    {/* Tags */}
    {note.tags && note.tags.length > 0 && (
      <div className="flex gap-2 mb-3 flex-wrap">
        {note.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    )}

    {/* Footer with actions */}
    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
      <div className="flex gap-2">
        <button
          onClick={onPin}
          className="hover:text-yellow-500 transition-colors"
          title="Pin note"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4z" />
          </svg>
        </button>
        <button
          onClick={onEdit}
          className="hover:text-blue-500 transition-colors"
          title="Edit note"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="hover:text-red-500 transition-colors"
          title="Delete note"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

NoteCard.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.string,
    isPinned: PropTypes.bool
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPin: PropTypes.func.isRequired
};

NotesBoard.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.string,
    isPinned: PropTypes.bool
  })),
  onAddNote: PropTypes.func.isRequired,
  onEditNote: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
  onPinNote: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  showAddButton: PropTypes.bool,
  sortBy: PropTypes.oneOf(['recent', 'pinned']),
  filterTag: PropTypes.string
};

export default NotesBoard;
export { NoteCard };
