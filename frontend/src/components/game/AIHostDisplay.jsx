"use client"

import { useState, useEffect } from "react"
import { Bot, Zap, MessageCircle } from "lucide-react"

const AIHostDisplay = ({ gameState, currentGame }) => {
  const [hostMessage, setHostMessage] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [hostMood, setHostMood] = useState("neutral") // neutral, excited, roasting, thinking

  useEffect(() => {
    if (gameState?.currentQuestion) {
      setHostMessage(gameState.currentQuestion.text)
      setHostMood("excited")
      setIsAnimating(true)

      // Simulate TTS
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(gameState.currentQuestion.text)
        utterance.rate = 0.9
        utterance.pitch = 1.1
        speechSynthesis.speak(utterance)
      }
    } else if (gameState?.lastRoast) {
      setHostMessage(gameState.lastRoast)
      setHostMood("roasting")
      setIsAnimating(true)

      // Simulate TTS for roast
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(gameState.lastRoast)
        utterance.rate = 1.1
        utterance.pitch = 1.2
        speechSynthesis.speak(utterance)
      }
    } else if (currentGame?.status === "waiting") {
      setHostMessage(
        "Welcome to The Roasting Arena! I'm your AI host, ready to serve up some epic roasts. Let's see who can handle the heat!",
      )
      setHostMood("neutral")
    }

    const timer = setTimeout(() => setIsAnimating(false), 1000)
    return () => clearTimeout(timer)
  }, [gameState, currentGame])

  const getHostExpression = () => {
    switch (hostMood) {
      case "excited":
        return "🤩"
      case "roasting":
        return "🔥"
      case "thinking":
        return "🤔"
      case "celebrating":
        return "🎉"
      case "disappointed":
        return "😤"
      default:
        return "😎"
    }
  }

  const getHostAnimation = () => {
    if (isAnimating) {
      return hostMood === "roasting" ? "animate-bounce" : "animate-pulse"
    }
    return "animate-pulse"
  }

  return (
    <div className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
      <div className="flex items-start gap-6">
        {/* AI Host Avatar */}
        <div className="relative">
          <div
            className={`w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-3xl ${getHostAnimation()}`}
          >
            <Bot className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-lg">
            {getHostExpression()}
          </div>

          {/* Mood indicator */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div
              className={`w-4 h-4 rounded-full ${
                hostMood === "roasting"
                  ? "bg-red-500 animate-ping"
                  : hostMood === "excited"
                    ? "bg-green-500 animate-pulse"
                    : hostMood === "thinking"
                      ? "bg-yellow-500 animate-bounce"
                      : "bg-blue-500"
              }`}
            ></div>
          </div>
        </div>

        {/* Host Message */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xl font-bold text-white">AI Roast Master</h3>
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>

          <div className="bg-black/30 rounded-xl p-4 border border-purple-400/30">
            {hostMessage ? (
              <p
                className={`text-white text-lg leading-relaxed ${
                  isAnimating ? "animate-fadeIn" : ""
                } ${hostMood === "roasting" ? "text-red-300" : ""}`}
              >
                {hostMessage}
              </p>
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <MessageCircle className="w-5 h-5 animate-pulse" />
                <span>Preparing something wicked...</span>
              </div>
            )}
          </div>

          {/* Question Info */}
          {gameState?.currentQuestion && (
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-300">
              <span className="bg-purple-600/30 px-3 py-1 rounded-full">
                Question {gameState.currentQuestionIndex + 1} of {currentGame.questionsPerGame}
              </span>
              <span className="bg-blue-600/30 px-3 py-1 rounded-full capitalize">
                {gameState.currentQuestion.category || currentGame.gameMode}
              </span>
              <span className="bg-green-600/30 px-3 py-1 rounded-full">
                {gameState.currentQuestion.difficulty || "Medium"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Visual Effects */}
      {hostMood === "roasting" && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 right-4 text-red-500 animate-bounce">🔥</div>
          <div className="absolute bottom-4 left-4 text-orange-500 animate-pulse">💥</div>
        </div>
      )}
      {hostMood === "excited" && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-2 text-yellow-500 animate-ping">⭐</div>
          <div className="absolute top-6 right-6 text-blue-500 animate-bounce">✨</div>
          <div className="absolute bottom-6 left-6 text-green-500 animate-pulse">💫</div>
        </div>
      )}
      {hostMessage && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIHostDisplay
