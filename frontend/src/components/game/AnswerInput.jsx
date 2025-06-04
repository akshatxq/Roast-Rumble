"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Code, MessageSquare } from "lucide-react"

const AnswerInput = ({ onSubmit, timeLimit, gameMode }) => {
  const [answer, setAnswer] = useState("")
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const inputRef = useRef(null)

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Start countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    onSubmit(answer.trim())
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          {gameMode === "code" ? (
            <>
              <Code className="w-5 h-5 text-blue-400" />
              Submit Code
            </>
          ) : (
            <>
              <MessageSquare className="w-5 h-5 text-green-400" />
              Your Answer
            </>
          )}
        </h3>
        <div
          className={`text-2xl font-bold ${
            timeLeft <= 2 ? "text-red-400 animate-pulse" : timeLeft <= 5 ? "text-yellow-400" : "text-green-400"
          }`}
        >
          {timeLeft}s
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {gameMode === "code" ? (
          <textarea
            ref={inputRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="// Write your code here..."
            className="w-full h-32 px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none font-mono text-sm resize-none"
            disabled={timeLeft === 0}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer..."
            className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
            disabled={timeLeft === 0}
          />
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!answer.trim() || timeLeft === 0}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Submit Answer
          </button>
        </div>
      </form>

      {/* Progress bar */}
      <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${
            timeLeft <= 2 ? "bg-red-500" : timeLeft <= 5 ? "bg-yellow-500" : "bg-green-500"
          }`}
          style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}

export default AnswerInput
