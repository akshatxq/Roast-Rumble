"use client"

import { useState, useEffect } from "react"
import { Code, Brain, Clock, Star } from "lucide-react"

const QuestionDisplay = ({ question, gameState, timeRemaining }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (question) {
      setIsVisible(false)
      setTimeout(() => setIsVisible(true), 100)
    }
  }, [question])

  if (!question) return null

  const getCategoryIcon = () => {
    switch (question.type) {
      case "code":
        return <Code className="w-6 h-6 text-blue-400" />
      default:
        return <Brain className="w-6 h-6 text-purple-400" />
    }
  }

  const getDifficultyColor = () => {
    switch (question.difficulty) {
      case "easy":
        return "text-green-400 bg-green-500/20"
      case "hard":
        return "text-red-400 bg-red-500/20"
      default:
        return "text-yellow-400 bg-yellow-500/20"
    }
  }

  return (
    <div
      className={`
      bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-sm 
      rounded-2xl border border-purple-500/30 p-6 transition-all duration-500
      ${isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"}
    `}
    >
      {/* Question Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {getCategoryIcon()}
          <div>
            <h3 className="text-xl font-bold text-white">Question {gameState?.currentQuestionIndex + 1}</h3>
            <p className="text-gray-300 text-sm">{question.category}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor()}`}>
            {question.difficulty}
          </span>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4" />
            <span className="font-bold">{question.points}</span>
          </div>
        </div>
      </div>

      {/* Question Text */}
      <div className="bg-black/30 rounded-xl p-6 mb-4">
        <p className="text-white text-lg leading-relaxed">{question.text}</p>

        {question.type === "code" && question.codeSnippet && (
          <div className="mt-4 bg-gray-900 rounded-lg p-4 border border-gray-700">
            <pre className="text-green-400 font-mono text-sm overflow-x-auto">
              <code>{question.codeSnippet}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Question Progress */}
      <div className="flex items-center justify-between text-sm text-gray-300">
        <span>
          Progress: {gameState?.currentQuestionIndex + 1} / {gameState?.totalQuestions}
        </span>

        {timeRemaining > 0 && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Time to buzz: {timeRemaining}s</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
          style={{
            width: `${((gameState?.currentQuestionIndex + 1) / gameState?.totalQuestions) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}

export default QuestionDisplay
