import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader, AlertCircle } from 'lucide-react';
import { generateQuizQuestions, calculateQuizResults, saveQuizAttempt } from '../../lib/quizService';
import { auth } from '../../lib/firebase';
import QuizResults from './QuizResults';

const QuizInterface = ({ course, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Loading quiz for course:', course.title);
        
        const generatedQuestions = await generateQuizQuestions(course);
        setQuestions(generatedQuestions);
        setUserAnswers(new Array(generatedQuestions.length).fill(undefined));
      } catch (err) {
        console.error('Error loading quiz:', err);
        setError(err.message || 'Failed to generate quiz questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [course]);

  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      setSubmitting(true);

      // Check if all questions are answered
      if (userAnswers.some((answer) => answer === undefined)) {
        setError('Please answer all questions before submitting.');
        setSubmitting(false);
        return;
      }

      // Calculate results
      const quizResults = calculateQuizResults(questions, userAnswers);
      setResults(quizResults);

      // Save to Firebase
      if (auth.currentUser) {
        try {
          await saveQuizAttempt(auth.currentUser.uid, course.id, quizResults);
          console.log('Quiz attempt saved to Firebase');
        } catch (fbError) {
          console.error('Error saving to Firebase:', fbError);
          // Don't fail the quiz if Firebase save fails
        }
      }

      // Save to localStorage as backup
      const localQuizzes = JSON.parse(localStorage.getItem('codeflux_quizzes')) || {};
      if (!localQuizzes[course.id]) {
        localQuizzes[course.id] = { attempts: [] };
      }
      localQuizzes[course.id].attempts.push({
        ...quizResults,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('codeflux_quizzes', JSON.stringify(localQuizzes));

      setQuizCompleted(true);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isAnswered = userAnswers[currentQuestion] !== undefined;

  // Show results page
  if (quizCompleted && results) {
    return <QuizResults course={course} results={results} onBack={onBack} />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-purple-600 font-semibold">Generating quiz questions...</p>
          <p className="text-slate-500 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20 pb-16">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg border-2 border-red-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Error</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Quiz Selection
          </button>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{course.title}</h1>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span className="font-semibold text-purple-600">{Math.round(progress)}% Complete</span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 mb-8">
          {/* Question Text */}
          <h2 className="text-2xl font-bold text-slate-900 mb-8">{question.question}</h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(idx)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  userAnswers[currentQuestion] === idx
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-slate-200 bg-slate-50 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full border-2 font-semibold ${
                      userAnswers[currentQuestion] === idx
                        ? 'border-purple-600 bg-purple-600 text-white'
                        : 'border-slate-300 text-slate-600'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-lg text-slate-900 font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Answer Status */}
          {isAnswered && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="text-green-700 font-semibold">Answer selected</span>
            </div>
          )}
        </div>

        {/* Navigation & Submit */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex-1 flex justify-center">
            <div className="text-center text-sm text-slate-600">
              <span className="font-semibold text-purple-600">{userAnswers.filter(a => a !== undefined).length}</span> of{' '}
              <span className="font-semibold">{questions.length}</span> answered
            </div>
          </div>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting || userAnswers.some(a => a === undefined)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Quiz'
              )}
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Next →
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-12 bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm font-semibold text-slate-700 mb-4">Quick Navigation</p>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-full aspect-square rounded-lg font-semibold text-sm transition-all duration-200 ${
                  currentQuestion === idx
                    ? 'bg-purple-600 text-white scale-110'
                    : userAnswers[idx] !== undefined
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;
