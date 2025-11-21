import React, { useState } from 'react';
import PropTypes from 'prop-types';

const QuestionsBoard = ({ 
  questions = [],
  onAskQuestion,
  onAnswerQuestion,
  onUpvoteQuestion,
  onMarkAsAnswered,
  isLoading = false,
  showAskButton = true,
  sortBy = 'recent',
  filterTag = null
}) => {
  const [sortOrder, setSortOrder] = useState(sortBy);
  const [selectedTag, setSelectedTag] = useState(filterTag);

  // Get all unique tags
  const allTags = [...new Set(questions.flatMap(q => q.tags || []))];

  // Filter and sort questions
  let displayQuestions = [...questions];
  
  if (selectedTag) {
    displayQuestions = displayQuestions.filter(q => 
      q.tags?.includes(selectedTag)
    );
  }

  // Sort questions
  if (sortOrder === 'recent') {
    displayQuestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortOrder === 'unanswered') {
    displayQuestions.sort((a, b) => (b.answers?.length || 0) - (a.answers?.length || 0));
  } else if (sortOrder === 'trending') {
    displayQuestions.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Q&A Board
        </h2>
        {showAskButton && (
          <button
            onClick={onAskQuestion}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all font-semibold"
          >
            + Ask Question
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
          onClick={() => setSortOrder('unanswered')}
          className={`text-sm transition-all ${
            sortOrder === 'unanswered'
              ? 'text-purple-600 dark:text-purple-400 font-semibold'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Unanswered
        </button>
        <button
          onClick={() => setSortOrder('trending')}
          className={`text-sm transition-all ${
            sortOrder === 'trending'
              ? 'text-purple-600 dark:text-purple-400 font-semibold'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Trending
        </button>
      </div>

      {/* Questions list */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        </div>
      ) : displayQuestions.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.556-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">No questions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onAnswer={() => onAnswerQuestion(question.id)}
              onUpvote={() => onUpvoteQuestion(question.id)}
              onMarkAsAnswered={() => onMarkAsAnswered(question.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Question Card Component
const QuestionCard = ({ question, onAnswer, onUpvote, onMarkAsAnswered }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          {question.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {question.content}
        </p>
      </div>
      {question.isAnswered && (
        <div className="flex-shrink-0 ml-2">
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold px-2 py-1 rounded">
            Answered
          </div>
        </div>
      )}
    </div>

    {/* Tags */}
    {question.tags && question.tags.length > 0 && (
      <div className="flex gap-2 mb-3 flex-wrap">
        {question.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    )}

    {/* Footer */}
    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
      <div className="flex gap-4">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
          </svg>
          {question.answers?.length || 0} answers
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {question.upvotes || 0} votes
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onUpvote}
          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          title="Upvote"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2s-2-.69-2-2c0-2.92 2.94-5 5-5 .13 0 .26 0 .39.01C7.5 11.13 8.4 10 9.5 10H14c1.1 0 2 .9 2 2v11c0 1.1-.9 2-2 2h-5c-1.1 0-2-.9-2-2v-4h-2v-3z" />
          </svg>
        </button>
        <button
          onClick={onAnswer}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          title="Answer"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.5 6c-2.61 0-4.92-1.01-6.7-2.66-.19-.18-.49-.18-.68 0-1.79 1.65-4.09 2.66-6.7 2.66C2.5 6 0 8.5 0 11.5S2.5 17 6.5 17c2.61 0 4.92 1.01 6.7 2.66.19.18.49.18.68 0 1.79-1.65 4.09-2.66 6.7-2.66 4 0 6.5-2.5 6.5-5.5s-2.5-5.5-6.5-5.5z" />
          </svg>
        </button>
        {!question.isAnswered && (
          <button
            onClick={onMarkAsAnswered}
            className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
            title="Mark as answered"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  </div>
);

QuestionCard.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    answers: PropTypes.array,
    upvotes: PropTypes.number,
    isAnswered: PropTypes.bool
  }).isRequired,
  onAnswer: PropTypes.func.isRequired,
  onUpvote: PropTypes.func.isRequired,
  onMarkAsAnswered: PropTypes.func.isRequired
};

QuestionsBoard.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    answers: PropTypes.array,
    upvotes: PropTypes.number,
    isAnswered: PropTypes.bool,
    createdAt: PropTypes.string
  })),
  onAskQuestion: PropTypes.func.isRequired,
  onAnswerQuestion: PropTypes.func.isRequired,
  onUpvoteQuestion: PropTypes.func.isRequired,
  onMarkAsAnswered: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  showAskButton: PropTypes.bool,
  sortBy: PropTypes.oneOf(['recent', 'unanswered', 'trending']),
  filterTag: PropTypes.string
};

export default QuestionsBoard;
export { QuestionCard };
