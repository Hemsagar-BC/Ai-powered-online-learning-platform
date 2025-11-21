import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FileText, Link as LinkIcon, MessageSquare, BookMarked, ChevronDown, ChevronUp } from 'lucide-react'

export const ChapterSidebar = ({
  resources = [],
  notes = [],
  discussions = [],
  relatedChapters = [],
  onDownloadResource,
  onOpenDiscussion,
  onSelectNote,
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState({
    resources: true,
    notes: true,
    discussions: false,
    related: false
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const SectionHeader = ({ icon: Icon, title, count, section }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-blue-600" />
        <span className="font-semibold text-gray-900">{title}</span>
        {count > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
            {count}
          </span>
        )}
      </div>
      {expandedSections[section] ? (
        <ChevronUp size={18} className="text-gray-400" />
      ) : (
        <ChevronDown size={18} className="text-gray-400" />
      )}
    </button>
  )

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Resources Section */}
      <div className="border-b border-gray-200">
        <SectionHeader icon={FileText} title="Resources" count={resources.length} section="resources" />
        {expandedSections.resources && (
          <div className="px-4 py-3 space-y-2 bg-gray-50 max-h-48 overflow-y-auto">
            {resources.length > 0 ? (
              resources.map((resource, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-white rounded border border-gray-200 hover:border-blue-300 transition-colors flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-700 truncate">{resource.name}</span>
                  <button
                    onClick={() => onDownloadResource?.(resource)}
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium ml-2"
                  >
                    Download
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No resources</p>
            )}
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="border-b border-gray-200">
        <SectionHeader icon={BookMarked} title="My Notes" count={notes.length} section="notes" />
        {expandedSections.notes && (
          <div className="px-4 py-3 space-y-2 bg-gray-50 max-h-48 overflow-y-auto">
            {notes.length > 0 ? (
              notes.map((note, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectNote?.(note)}
                  className="w-full text-left p-2 bg-white rounded border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <p className="text-xs font-medium text-gray-700 truncate">{note.title}</p>
                  <p className="text-xs text-gray-500 truncate mt-1">{note.content}</p>
                  <p className="text-xs text-gray-400 mt-1">{note.timestamp}</p>
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500">No notes yet</p>
            )}
          </div>
        )}
      </div>

      {/* Discussions Section */}
      <div className="border-b border-gray-200">
        <SectionHeader icon={MessageSquare} title="Discussions" count={discussions.length} section="discussions" />
        {expandedSections.discussions && (
          <div className="px-4 py-3 space-y-2 bg-gray-50 max-h-48 overflow-y-auto">
            {discussions.length > 0 ? (
              discussions.map((discussion, idx) => (
                <button
                  key={idx}
                  onClick={() => onOpenDiscussion?.(discussion)}
                  className="w-full text-left p-2 bg-white rounded border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <p className="text-xs font-medium text-gray-700">{discussion.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{discussion.replies || 0} replies</p>
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500">No discussions</p>
            )}
          </div>
        )}
      </div>

      {/* Related Chapters */}
      <div>
        <SectionHeader icon={LinkIcon} title="Related Chapters" count={relatedChapters.length} section="related" />
        {expandedSections.related && (
          <div className="px-4 py-3 space-y-2 bg-gray-50 max-h-48 overflow-y-auto">
            {relatedChapters.length > 0 ? (
              relatedChapters.map((chapter, idx) => (
                <a
                  key={idx}
                  href={chapter.url}
                  className="block p-2 bg-white rounded border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <p className="text-xs font-medium text-blue-600">{chapter.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{chapter.course}</p>
                </a>
              ))
            ) : (
              <p className="text-sm text-gray-500">No related chapters</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

ChapterSidebar.propTypes = {
  resources: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string
  })),
  notes: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string
  })),
  discussions: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    replies: PropTypes.number
  })),
  relatedChapters: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    course: PropTypes.string,
    url: PropTypes.string
  })),
  onDownloadResource: PropTypes.func,
  onOpenDiscussion: PropTypes.func,
  onSelectNote: PropTypes.func,
  className: PropTypes.string
}

export default ChapterSidebar
