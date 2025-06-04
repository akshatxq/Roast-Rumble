"use client"

import { useState, useEffect } from "react"
import { Clock, Zap } from "lucide-react"

const TimerDisplay = ({ gameState, timeLimit }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (gameState?.timerStart && gameState?.waitingForAnswer) {
      setIsActive(true)
      const startTime = new Date(gameState.timerStart).getTime()

      const timer = setInterval(() => {
        const now = Date.now()
        const elapsed = Math.floor((now - startTime) / 1000)
        const remaining = Math.max(0, timeLimit - elapsed)

        setTimeLeft(remaining)

        if (remaining === 0) {
          setIsActive(false)
          clearInterval(timer)
        }
      }, 100)

      return () => clearInterval(timer)
    } else {
      setIsActive(false)
      setTimeLeft(0)
    }
  }, [gameState, timeLimit])

  const getTimerColor = () => {
    if (!isActive) return "text-gray-400"

    const percentage = (timeLeft / timeLimit) * 100
    if (percentage <= 20) return "text-red-400"
    if (percentage <= 50) return "text-yellow-400"
    return "text-green-400"
  }

  const getTimerBg = () => {
    if (!isActive) return "bg-gray-600/20"

    const percentage = (timeLeft / timeLimit) * 100
    if (percentage <= 20) return "bg-red-600/20"
    if (percentage <= 50) return "bg-yellow-600/20"
    return "bg-green-600/20"
  }

  const shouldPulse = isActive && timeLeft <= 3

  return (
    <div
      className={`
      ${getTimerBg()} backdrop-blur-sm rounded-2xl border-2 p-8 text-center
      ${isActive ? "border-purple-400/50" : "border-gray-600/30"}
      ${shouldPulse ? "animate-pulse" : ""}
      transition-all duration-300
    `}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Timer Icon */}
        <div
          className={`
          w-16 h-16 rounded-full flex items-center justify-center
          ${isActive ? "bg-purple-600/30" : "bg-gray-600/30"}
          ${shouldPulse ? "animate-bounce" : ""}
        `}
        >
          {isActive ? <Zap className={`w-8 h-8 ${getTimerColor()}`} /> : <Clock className="w-8 h-8 text-gray-400" />}
        </div>

        {/* Timer Display */}
        <div className="space-y-2">
          <div
            className={`
            text-6xl font-bold font-mono ${getTimerColor()}
            ${shouldPulse ? "animate-pulse" : ""}
          `}
          >
            {isActive ? timeLeft : "--"}
          </div>

          <p className="text-gray-300 text-sm">{isActive ? "Time Remaining" : "Waiting..."}</p>
        </div>

        {/* Progress Ring */}
        {isActive && (
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-600/30"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className={getTimerColor()}
                style={{
                  strokeDasharray: `${2 * Math.PI * 45}`,
                  strokeDashoffset: `${2 * Math.PI * 45 * (1 - timeLeft / timeLimit)}`,
                  transition: "stroke-dashoffset 0.1s linear",
                }}
              />
            </svg>
          </div>
        )}

        {/* Status Messages */}
        {gameState?.activePlayer && (
          <div className="text-center">
            <p className="text-blue-400 text-sm font-medium">Player is answering...</p>
          </div>
        )}

        {!isActive && gameState?.currentQuestion && !gameState?.activePlayer && (
          <div className="text-center">
            <p className="text-purple-400 text-sm font-medium animate-pulse">Waiting for buzz in...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TimerDisplay
