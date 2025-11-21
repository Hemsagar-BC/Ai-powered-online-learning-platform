/**
 * LessonsTable Component
 * Displays structured lesson content in a clean table format
 */

import React from 'react';
import { ExternalLink, Download, BookOpen, Target } from 'lucide-react';

const LessonsTable = ({ lessons, isLoading, source }) => {
  if (isLoading) {
    return (
      <div className="w-full p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
        <div className="flex items-center justify-center gap-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
        <p className="text-center text-slate-600 mt-3">Generating course content...</p>
      </div>
    );
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="w-full p-8 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <BookOpen className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
        <p className="text-yellow-800">No lessons available</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Source Badge */}
      {source && (
        <div className="flex justify-end mb-4">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            source === 'gemini' 
              ? 'bg-purple-100 text-purple-700' 
              : 'bg-slate-100 text-slate-600'
          }`}>
            {source === 'gemini' ? '✨ AI Generated' : 'Structured Format'}
          </span>
        </div>
      )}

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900 w-24">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Lesson/Topic
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Learning Goal
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                YouTube Video Roadmap
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Notes/Resources
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200">
            {lessons.map((lesson, index) => (
              <tr 
                key={lesson.id || index} 
                className="hover:bg-blue-50 transition-colors duration-150"
              >
                {/* ID Column */}
                <td className="px-4 py-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                    {lesson.id}
                  </span>
                </td>

                {/* Topic Column */}
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-slate-900">{lesson.topic}</p>
                </td>

                {/* Learning Goal Column */}
                <td className="px-4 py-4">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {lesson.learningGoal}
                  </p>
                </td>

                {/* YouTube Video Column */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-slate-700 flex-1">
                      {lesson.youtubeVideo}
                    </p>
                    <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  </div>
                </td>

                {/* Resources Column */}
                <td className="px-4 py-4">
                  {lesson.resources ? (
                    <a 
                      href={lesson.resources.includes('http') ? lesson.resources : '#'}
                      target={lesson.resources.includes('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className={`text-sm font-medium flex items-center gap-2 ${
                        lesson.resources.includes('http')
                          ? 'text-blue-600 hover:text-blue-800 cursor-pointer'
                          : 'text-slate-700'
                      }`}
                    >
                      {lesson.resources.includes('PDF') || lesson.resources.includes('pdf') ? (
                        <>
                          <Download className="w-4 h-4" />
                          PDF
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          {lesson.resources.substring(0, 20)}
                          {lesson.resources.length > 20 ? '...' : ''}
                        </>
                      )}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Legend */}
      <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-xs text-slate-600 font-medium mb-2">📋 Table Legend:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
          <div>• <strong>ID:</strong> Lesson identifier (e.g., 1.1, 1.2)</div>
          <div>• <strong>Topic:</strong> Lesson title or topic name</div>
          <div>• <strong>Goal:</strong> What you'll learn in this lesson</div>
          <div>• <strong>Video:</strong> YouTube video suggestion to watch</div>
          <div>• <strong>Resources:</strong> Downloadable materials or references</div>
        </div>
      </div>
    </div>
  );
};

export default LessonsTable;
