'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const COURSE_ID = '5c7383d3-c9c6-464b-97af-618aafa2b8c1'

export default function Quiz() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    async function loadQuestions() {
      const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('course_id', COURSE_ID)
      .limit(30)
      if (error) console.error(error)
      else setQuestions(data)
      setLoading(false)
    }
    loadQuestions()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Ai + Coding Future Academy...</div>
  if (!questions.length) return <div className="min-h-screen flex items-center justify-center">No questions found</div>
  if (finished) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
        <p className="text-gray-600 mb-6">Ai + Coding Future Academy</p>
        <div className="bg-blue-50 rounded-2xl p-6 mb-6">
          <p className="text-sm text-gray-600">Your Score</p>
          <p className="text-5xl font-bold text-blue-600">{score}/{questions.length}</p>
        </div>
        <button onClick={() => window.location.reload()} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold">
          Retake Quiz
        </button>
      </div>
    </div>
  )

  const q = questions[current]
  const progress = ((current + 1) / questions.length) * 100
  const options = [
    { label: 'A', text: q.option_a },
    { label: 'B', text: q.option_b },
    { label: 'C', text: q.option_c },
    { label: 'D', text: q.option_d }
  ]

  function handleAnswer(option) {
    if (showResult) return
    setSelected(option)
    setShowResult(true)
    if (option === q.correct_answer) setScore(score + 1)
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(current + 1)
        setSelected(null)
        setShowResult(false)
      } else setFinished(true)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Ai + Coding Future Academy</span>
            <span>Score: {score}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Question {current + 1} of {questions.length}</p>
        </div>
        <h2 className="text-2xl font-bold mb-8">{q.question_text}</h2>
        <div className="space-y-3">
          {options.map((opt) => {
            let bgClass = "border-gray-200 hover:border-blue-400"
            if (showResult) {
              if (opt.text === q.correct_answer) bgClass = "border-green-500 bg-green-50"
              else if (opt.text === selected) bgClass = "border-red-500 bg-red-50"
            }
            return (
              <button key={opt.label} onClick={() => handleAnswer(opt.text)} disabled={showResult}
                className={`w-full text-left p-4 border-2 rounded-xl ${bgClass}`}>
                <span className="font-bold mr-3">{opt.label}.</span>{opt.text}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
