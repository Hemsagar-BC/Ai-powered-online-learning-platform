import React, {useState, useEffect} from 'react'
import { generateQuizQuestions } from '../lib/quizService'

export default function QuizModal({open, onClose, chapter = null, course = null}){
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const defaultQuestions = [
    {q:'What is JSX?', opts:['A','B','C','D'], a:0, explain:'JSX is syntax.'},
    {q:'What renders UI?', opts:['A','B','C','D'], a:1, explain:'React renders UI.'},
    {q:'State or Props?', opts:['A','B','C','D'], a:2, explain:'State is local.'},
    {q:'Hook example?', opts:['A','B','C','D'], a:3, explain:'useState is a hook.'},
    {q:'What is VDOM?', opts:['A','B','C','D'], a:0, explain:'Virtual DOM explained.'}
  ]
  
  useEffect(() => {
    if (open && chapter && course) {
      loadQuestions()
    } else if (open) {
      setQuestions(defaultQuestions)
    }
  }, [open])

  const loadQuestions = async () => {
    setLoading(true)
    try {
      const generatedQuestions = await generateQuizQuestions(course)
      if (generatedQuestions && generatedQuestions.length > 0) {
        const formattedQuestions = generatedQuestions.map(q => ({
          q: q.question,
          opts: q.options,
          a: q.correctAnswer,
          explain: q.explanation
        }))
        setQuestions(formattedQuestions)
      } else {
        setQuestions(defaultQuestions)
      }
    } catch (error) {
      console.error('Error loading questions:', error)
      setQuestions(defaultQuestions)
    } finally {
      setLoading(false)
    }
  }

  function choose(i){
    setSelected(i)
    setExplanation(questions[idx].explain)
    if(i === questions[idx].a) setScore(s => s+1)
    setTimeout(()=>{
      if(idx+1 < questions.length){
        setIdx(idx+1); setSelected(null); setExplanation(null)
      } else { setDone(true) }
    }, 2500)
  }

  function restart(){ setIdx(0); setSelected(null); setScore(0); setDone(false); setExplanation(null) }

  if(!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-white rounded-md p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Generating quiz questions...</p>
          </div>
        ) : !done ? (
          <div>
            <div className="text-sm text-slate-500">Question {idx+1}/{questions.length}</div>
            <h3 className="text-lg font-semibold mt-2">{questions[idx]?.q}</h3>
            <div className="mt-4 grid gap-3">
              {questions[idx]?.opts?.map((o,i)=> (
                <button 
                  key={i} 
                  onClick={()=>choose(i)} 
                  disabled={selected !== null}
                  className={`text-left p-3 rounded-md border transition ${
                    selected===i
                      ? i === questions[idx].a
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {String.fromCharCode(65+i)}. {o}
                </button>
              ))}
            </div>
            
            {explanation && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm font-semibold text-blue-900 mb-1">Explanation:</p>
                <p className="text-sm text-blue-800">{explanation}</p>
              </div>
            )}
            
            <div className="flex justify-end mt-4">
              <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">Close</button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl font-semibold">Score: {Math.round((score/questions.length)*100)}%</h3>
            <p className="text-slate-600 mt-2">{score} out of {questions.length} correct</p>
            <div className="mt-4">
              <button onClick={restart} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2">Retake Quiz</button>
              <button onClick={onClose} className="px-4 py-2 rounded-md border hover:bg-slate-50">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
