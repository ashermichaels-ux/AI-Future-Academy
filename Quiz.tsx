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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <p className="text-xl font-semibold text-gray-700">Loading AI Future Academy...</p>
    </div>
  )

  if (!questions.length) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>No questions found for this course</p>
    </div>
  )

  if (finished) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Quiz Complete!</h1>
        <p className="text-gray-600 mb-6">AI Future Academy</p>
        <div className="bg-blue-50 rounded-2xl p-6 mb-6">
          <p className="text-sm text-gray-600 mb-2">Your Score</p>
          <p className="text-5xl font-bold text-blue-600">{score}/{questions.length}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 text-white py-3 rounded-xl
