'use client'

import { useState } from 'react'

const questions = [
  {
    question: "What does JSX stand for?",
    options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"],
    answer: 0
  },
  {
    question: "Which hook is used for state in React?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    answer: 1
  },
  {
    question: "Next.js is built on top of which framework?",
    options: ["Vue", "React", "Angular", "Svelte"],
    answer: 1
  }
]

export default function Quiz() {
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (index) => {
    if (index === questions[current].answer) {
      setScore(score + 1)
    }

    if (current + 1 < questions.length) {
      setCurrent(current + 1)
    } else {
      setShowResult(true)
    }
  }

  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Quiz Complete!</h1>
          <p className="text-xl mb-6">
            You scored {score} out of {questions.length}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
