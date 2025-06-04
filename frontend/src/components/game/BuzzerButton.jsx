"use client"

import { useState, useEffect } from "react"
import { Zap, Lock } from "lucide-react"

const BuzzerButton = ({ gameState, onBuzz, disabled }) => {
  const [isPressed, setIsPressed] = useState(false)
  const [canBuzz, setCanBuzz] = useState(false)

  useEffect(() => {
    // Enable buzzer when question is active and no one has buzzed yet
    setCanBuzz(gameState?.currentQuestion && !gameState?.activePlayer && !gameState?.buzzerLocked && !disabled)
  }, [gameState, disabled])

  const handleBuzz = () => {
    if (!canBuzz) return

    setIsPressed(true)
    onBuzz()

    // Play buzzer sound
    const audio = new Audio("/sfx_buzzer.mp3")
    audio.play().catch(console.error)

    setTimeout(() => setIsPressed(false), 200)
  }

  const getButtonState = () => {
    if (gameState?.buzzerLocked) {
      return {
        bg: "bg-red-600/50",
        border: "border-red-500",
        text: "LOCKED OUT",
        icon: <Lock className="w-8 h-8" />,
        disabled: true,
      }
    }

    if (gameState?.activePlayer) {
      return {
        bg: "bg-yellow-600/50",
        border: "border-yellow-500",
        text: "BUZZED",
        icon: <Zap className="w-8 h-8" />,
        disabled: true,
      }
    }

    if (canBuzz) {
      return {
        bg: "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600",
        border: "border-green-400",
        text: "BUZZ IN!",
        icon: <Zap className="w-8 h-8" />,
        disabled: false,
      }
    }

    return {
      bg: "bg-gray-600/50",
      border: "border-gray-500",
      text: "WAITING...",
      icon: <Zap className="w-8 h-8" />,
      disabled: true,
    }
  }

  const buttonState = getButtonState()

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleBuzz}
        disabled={buttonState.disabled}
        className={`
          relative w-32 h-32 rounded-full border-4 ${buttonState.border} ${buttonState.bg}
          flex flex-col items-center justify-center text-white font-bold
          transition-all duration-200 transform
          ${isPressed ? "scale-95" : "scale-100"}
          ${canBuzz ? "hover:scale-105 shadow-lg shadow-green-500/50 animate-pulse" : ""}
          ${buttonState.disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
        `}
      >
        {buttonState.icon}
        <span className="text-xs mt-1">{buttonState.text}</span>

        {/* Glow effect for active buzzer */}
        {canBuzz && <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping"></div>}
      </button>

      {/* Status text */}
      <div className="mt-4 text-center">
        {gameState?.buzzerLocked && <p className="text-red-400 text-sm font-medium">Locked out for next question</p>}
        {gameState?.activePlayer && <p className="text-yellow-400 text-sm font-medium">Player buzzed in!</p>}
        {canBuzz && <p className="text-green-400 text-sm font-medium animate-pulse">Ready to buzz!</p>}
      </div>
    </div>
  )
}

export default BuzzerButton
