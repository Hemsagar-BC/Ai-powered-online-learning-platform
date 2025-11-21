import React from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const QuizResults = ({ course, results, onBack }) => {
  const { score, totalQuestions, percentage, passed, details } = results;

  // Chart data
  const scoreData = [
    { name: 'Correct', value: score, fill: '#10b981' },
    { name: 'Incorrect', value: totalQuestions - score, fill: '#ef4444' },
  ];

  // Performance breakdown by question
  const performanceData = details.map((detail, idx) => ({
    name: `Q${idx + 1}`,
    correct: detail.isCorrect ? 1 : 0,
    incorrect: detail.isCorrect ? 0 : 1,
  }));

  // Wrong questions
  const wrongQuestions = details.filter(d => !d.isCorrect);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-purple-300 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Quiz Selection
        </button>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Quiz Results</h1>
          <p className="text-purple-200">{course.title}</p>
        </div>

        {/* Score Card */}
        <div className={`rounded-lg border-2 p-8 mb-8 ${passed ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className={`text-6xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {percentage}%
              </div>
              <p className={`text-lg font-semibold ${passed ? 'text-green-700' : 'text-red-700'}`}>
                {passed ? '🎉 Congratulations! You Passed!' : '📚 Keep Learning!'}
              </p>
              <p className={`text-sm ${passed ? 'text-green-600' : 'text-red-600'}`}>
                You scored {score} out of {totalQuestions} questions
              </p>
            </div>
            <div className={`text-6xl ${passed ? 'text-green-600' : 'text-red-600'}`}>
              {passed ? '✓' : '↻'}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Score Pie Chart */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Score Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Bar Chart */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Performance by Question</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="correct" stackId="a" fill="#10b981" name="Correct" />
                <Bar dataKey="incorrect" stackId="a" fill="#ef4444" name="Incorrect" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{score}</div>
            <p className="text-sm text-slate-600">Correct Answers</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">{totalQuestions - score}</div>
            <p className="text-sm text-slate-600">Incorrect Answers</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">{totalQuestions}</div>
            <p className="text-sm text-slate-600">Total Questions</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <div className={`text-3xl font-bold mb-1 ${percentage >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
              {percentage >= 70 ? 'PASS' : 'RETAKE'}
            </div>
            <p className="text-sm text-slate-600">Result</p>
          </div>
        </div>

        {/* Wrong Questions Section */}
        {wrongQuestions.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <XCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-slate-900">Questions to Review</h2>
            </div>

            <div className="space-y-6">
              {wrongQuestions.map((question, idx) => (
                <div key={idx} className="bg-white rounded-lg border-l-4 border-l-red-500 p-6">
                  {/* Question */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-600 mb-2">
                      Question {details.findIndex(d => d.questionId === question.questionId) + 1}
                    </p>
                    <h3 className="text-lg font-bold text-slate-900">{question.question}</h3>
                  </div>

                  {/* User's Answer */}
                  <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-700">Your Answer</p>
                        <p className="text-slate-700">{question.userAnswer}</p>
                      </div>
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-green-700">Correct Answer</p>
                        <p className="text-slate-700">{question.correctAnswer}</p>
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-700 mb-2">💡 Explanation</p>
                    <p className="text-slate-700">{question.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Correct Questions Summary */}
        {score > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                {score} Question{score !== 1 ? 's' : ''} Answered Correctly
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {details
                .filter(d => d.isCorrect)
                .map((question, idx) => (
                  <div key={idx} className="bg-green-50 rounded-lg border border-green-200 p-4">
                    <p className="text-sm font-semibold text-green-700 mb-2">✓ Correct</p>
                    <p className="text-slate-700 line-clamp-2">{question.question}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold"
          >
            Take Another Quiz
          </button>
          <button
            onClick={() => window.location.href = '/my-learning'}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
          >
            Back to My Learning
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
