import React, { useState } from 'react'

export default function Community(){
  const [selectedCourse, setSelectedCourse] = useState(null)
  
  // Mock data for courses and their members
  const courseGroups = [
    {
      id: 1,
      name: 'React Fundamentals',
      members: 342,
      activeNow: 24,
      avatar: '⚛️',
      description: 'Learn React basics and build modern web apps',
      discussions: 156,
      lastActive: '2 minutes ago'
    },
    {
      id: 2,
      name: 'Machine Learning 101',
      members: 521,
      activeNow: 47,
      avatar: '🤖',
      description: 'Introduction to AI and ML concepts',
      discussions: 234,
      lastActive: '5 minutes ago'
    },
    {
      id: 3,
      name: 'Web Design Mastery',
      members: 289,
      activeNow: 18,
      avatar: '🎨',
      description: 'Create stunning user interfaces and designs',
      discussions: 89,
      lastActive: '12 minutes ago'
    },
    {
      id: 4,
      name: 'Python for Data Science',
      members: 416,
      activeNow: 31,
      avatar: '🐍',
      description: 'Analyze data and build ML models with Python',
      discussions: 198,
      lastActive: 'Just now'
    }
  ]

  // Mock members in selected course
  const courseMembers = [
    { id: 1, name: 'Alex Johnson', role: 'Learner', avatar: '👨‍💼', joinedDays: 5 },
    { id: 2, name: 'Sarah Smith', role: 'Mentor', avatar: '👩‍🏫', joinedDays: 12 },
    { id: 3, name: 'Mike Chen', role: 'Learner', avatar: '👨‍💻', joinedDays: 2 },
    { id: 4, name: 'Emma Davis', role: 'Learner', avatar: '👩‍💼', joinedDays: 8 },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Community</h1>
          <p className="text-slate-600">Connect with learners studying the same courses as you</p>
        </div>

        {selectedCourse ? (
          // Course Community View
          <div>
            <button 
              onClick={() => setSelectedCourse(null)}
              className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              ← Back to Communities
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Course Info */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-md p-8 mb-6">
                  <div className="flex items-start gap-6">
                    <div className="text-6xl">{selectedCourse.avatar}</div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-slate-900 mb-2">{selectedCourse.name}</h2>
                      <p className="text-slate-600 mb-4">{selectedCourse.description}</p>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-indigo-50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-indigo-600">{selectedCourse.members}</div>
                          <div className="text-sm text-slate-600">Total Members</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-green-600">{selectedCourse.activeNow}</div>
                          <div className="text-sm text-slate-600">Active Now</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-purple-600">{selectedCourse.discussions}</div>
                          <div className="text-sm text-slate-600">Discussions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Discussions */}
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Recent Discussions</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer">
                        <div className="flex items-start gap-4">
                          <div className="text-2xl">👤</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900">How do I implement hooks in React?</h4>
                            <p className="text-sm text-slate-600 mt-1">Asked by Sarah Smith • 2 hours ago</p>
                            <p className="text-sm text-slate-500 mt-2">23 replies • 145 views</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">Trending</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar: Active Members */}
              <div>
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Active Members</h3>
                  <div className="space-y-3">
                    {courseMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-2xl">{member.avatar}</div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">{member.name}</p>
                            <p className="text-xs text-slate-500">{member.role}</p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500">+{member.joinedDays}d</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-6 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold">
                    Start Discussion
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Community List View
          <div>
    

            {/* Search */}
            <div className="mb-8">
              <input 
                type="text" 
                placeholder="Search communities..." 
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Course Communities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {courseGroups.map((course) => (
                <div 
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer border border-slate-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{course.avatar}</div>
                    <div className="text-right">
                      <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {course.activeNow} Online
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">{course.name}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                  <div className="space-y-2 mb-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">👥 Members</span>
                      <span className="font-semibold text-slate-900">{course.members}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">💬 Discussions</span>
                      <span className="font-semibold text-slate-900">{course.discussions}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">⏱️ Last Active</span>
                      <span className="font-semibold text-slate-900">{course.lastActive}</span>
                    </div>
                  </div>

                  <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold">
                    Join Community
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
