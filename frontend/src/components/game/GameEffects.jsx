"use client"

import { useEffect, useState } from "react"

const GameEffects = ({ gameState, currentGame }) => {
  const [showCorrectEffect, setShowCorrectEffect] = useState(false)
  const [showIncorrectEffect, setShowIncorrectEffect] = useState(false)
  const [showRoastEffect, setShowRoastEffect] = useState(false)

  useEffect(() => {
    if (gameState?.lastScoreChange) {
      const hasPositiveChange = Object.values(gameState.lastScoreChange).some((change) => change > 0)
      const hasNegativeChange = Object.values(gameState.lastScoreChange).some((change) => change < 0)

      if (hasPositiveChange) {
        setShowCorrectEffect(true)
        setTimeout(() => setShowCorrectEffect(false), 2000)
      }

      if (hasNegativeChange) {
        setShowIncorrectEffect(true)
        setTimeout(() => setShowIncorrectEffect(false), 2000)
      }
    }

    if (gameState?.lastRoast) {
      setShowRoastEffect(true)
      setTimeout(() => setShowRoastEffect(false), 3000)
    }
  }, [gameState])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Correct Answer Effect */}
      {showCorrectEffect && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl font-bold text-green-400 animate-bounce">✅ CORRECT!</div>
          <div className="absolute inset-0">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              >
                ⭐
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incorrect Answer Effect */}
      {showIncorrectEffect && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl font-bold text-red-400 animate-pulse">❌ WRONG!</div>
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.3}s`,
                }}
              >
                💥
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roast Effect */}
      {showRoastEffect && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-orange-400 animate-pulse">🔥 ROASTED! 🔥</div>
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute text-xl animate-spin"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.8}s`,
                }}
              >
                🔥
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Background Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default GameEffects
