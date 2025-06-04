"use client"

import { useEffect, useRef } from "react"
import { useAuthStore } from "../../store/useAuthStore.js"

const SoundManager = () => {
  const { socket } = useAuthStore()
  const audioRefs = useRef({
    buzzer: null,
    correct: null,
    incorrect: null,
  })

  useEffect(() => {
    // Preload audio files
    audioRefs.current.buzzer = new Audio("/sfx_buzzer.mp3")
    audioRefs.current.correct = new Audio("/sfx_correct.mp3")
    audioRefs.current.incorrect = new Audio("/sfx_incorrect.mp3")

    // Set volume
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) audio.volume = 0.7
    })

    if (socket) {
      socket.on("game:buzzerSound", () => {
        audioRefs.current.buzzer?.play().catch(console.error)
      })

      socket.on("game:correctAnswer", () => {
        audioRefs.current.correct?.play().catch(console.error)
      })

      socket.on("game:incorrectAnswer", () => {
        audioRefs.current.incorrect?.play().catch(console.error)
      })

      return () => {
        socket.off("game:buzzerSound")
        socket.off("game:correctAnswer")
        socket.off("game:incorrectAnswer")
      }
    }
  }, [socket])

  return null // This component doesn't render anything
}

export default SoundManager
