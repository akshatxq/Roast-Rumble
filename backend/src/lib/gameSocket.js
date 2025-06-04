import GameSession from "../models/gameSession.model.js"
import User from "../models/user.model.js"
import { generateAIRoast, evaluateAnswer } from "./aiService.js"

export const handleGameSocketEvents = (io, socket) => {
  // Join game room
  socket.on("game:joinRoom", async (roomId) => {
    try {
      socket.join(`game_${roomId}`)
      console.log(`User ${socket.userId} joined game room ${roomId}`)
    } catch (error) {
      console.error("Error joining game room:", error)
    }
  })

  // Leave game room
  socket.on("game:leaveRoom", (roomId) => {
    socket.leave(`game_${roomId}`)
    console.log(`User ${socket.userId} left game room ${roomId}`)
  })

  // Player buzzed
  socket.on("game:playerBuzzed", async (data) => {
    try {
      const { roomId, playerId } = data
      const gameSession = await GameSession.findById(roomId)

      if (!gameSession || gameSession.status !== "playing") return

      // Check if someone already buzzed or if player is locked out
      const gameState = await getGameState(roomId)
      if (gameState.activePlayer || gameState.buzzerLocked) return

      // Set active player and start timer
      const timerStart = new Date()

      // Update game state
      const updatedGameState = {
        ...gameState,
        activePlayer: playerId,
        waitingForAnswer: true,
        timerStart: timerStart.toISOString(),
      }

      // Play buzzer sound effect
      io.to(`game_${roomId}`).emit("game:buzzerSound")
      io.to(`game_${roomId}`).emit("game:stateUpdate", updatedGameState)

      // Set timeout for answer
      setTimeout(async () => {
        const currentState = await getGameState(roomId)
        if (currentState.activePlayer === playerId && currentState.waitingForAnswer) {
          await handleTimeoutAnswer(roomId, playerId, io)
        }
      }, gameSession.answerTimeLimit * 1000)
    } catch (error) {
      console.error("Error handling player buzz:", error)
    }
  })

  // Submit answer
  socket.on("game:submitAnswer", async (data) => {
    try {
      const { roomId, playerId, answer } = data
      await handlePlayerAnswer(roomId, playerId, answer, io)
    } catch (error) {
      console.error("Error handling answer submission:", error)
    }
  })

  // Game chat
  socket.on("game:joinChat", (roomId) => {
    socket.join(`chat_${roomId}`)
  })

  socket.on("game:sendChatMessage", (message) => {
    io.to(`chat_${message.roomId}`).emit("game:chatMessage", message)
  })
}

// Helper functions
const getGameState = async (roomId) => {
  // This would typically be stored in Redis or memory for real-time access
  // For now, we'll simulate it
  return {
    activePlayer: null,
    waitingForAnswer: false,
    buzzerLocked: false,
    timerStart: null,
    currentQuestion: null,
    scores: {},
    lastRoast: null,
  }
}

const handlePlayerAnswer = async (roomId, playerId, answer, io) => {
  try {
    const gameSession = await GameSession.findById(roomId).populate("players")
    if (!gameSession) return

    const currentQuestion = gameSession.questions[gameSession.currentQuestionIndex]
    if (!currentQuestion) return

    // Evaluate answer using AI
    const isCorrect = await evaluateAnswer(currentQuestion, answer, gameSession.gameMode)

    let scoreChange = 0
    let roastMessage = null

    if (isCorrect) {
      scoreChange = currentQuestion.points
      gameSession.scores.set(playerId, (gameSession.scores.get(playerId) || 0) + scoreChange)

      // Play correct sound
      io.to(`game_${roomId}`).emit("game:correctAnswer")
    } else {
      scoreChange = -5 // Penalty for wrong answer
      gameSession.scores.set(playerId, Math.max(0, (gameSession.scores.get(playerId) || 0) + scoreChange))

      // Generate AI roast
      roastMessage = await generateAIRoast(currentQuestion, answer, gameSession.gameMode)

      // Lock out player for next question
      io.to(`game_${roomId}`).emit("game:buzzerLockout", { playerId })

      // Play incorrect sound
      io.to(`game_${roomId}`).emit("game:incorrectAnswer")
    }

    await gameSession.save()

    // Update game state
    const gameState = {
      activePlayer: null,
      waitingForAnswer: false,
      buzzerLocked: false,
      scores: Object.fromEntries(gameSession.scores),
      lastScoreChange: { [playerId]: scoreChange },
      lastRoast: roastMessage,
    }

    io.to(`game_${roomId}`).emit("game:stateUpdate", gameState)

    if (roastMessage) {
      io.to(`game_${roomId}`).emit("game:roast", { message: roastMessage })
    }

    // Move to next question after delay
    setTimeout(async () => {
      await nextQuestion(roomId, gameSession, io)
    }, 3000)
  } catch (error) {
    console.error("Error handling player answer:", error)
  }
}

const handleTimeoutAnswer = async (roomId, playerId, io) => {
  // Handle when player doesn't answer in time
  await handlePlayerAnswer(roomId, playerId, "", io)
}

const nextQuestion = async (roomId, gameSession, io) => {
  try {
    gameSession.currentQuestionIndex++

    if (gameSession.currentQuestionIndex >= gameSession.questions.length) {
      // Game finished
      await endGame(roomId, gameSession, io)
      return
    }

    const nextQuestion = gameSession.questions[gameSession.currentQuestionIndex]
    await gameSession.save()

    const gameState = {
      currentQuestion: nextQuestion,
      currentQuestionIndex: gameSession.currentQuestionIndex,
      totalQuestions: gameSession.questions.length,
      activePlayer: null,
      waitingForAnswer: false,
      buzzerLocked: false,
      scores: Object.fromEntries(gameSession.scores),
    }

    io.to(`game_${roomId}`).emit("game:stateUpdate", gameState)
  } catch (error) {
    console.error("Error moving to next question:", error)
  }
}

const endGame = async (roomId, gameSession, io) => {
  try {
    gameSession.status = "finished"
    gameSession.gameEndTime = new Date()

    // Find winner
    let maxScore = -1
    let winnerId = null

    for (const [playerId, score] of gameSession.scores) {
      if (score > maxScore) {
        maxScore = score
        winnerId = playerId
      }
    }

    gameSession.winner = winnerId
    await gameSession.save()

    // Award XP and badges
    await awardGameRewards(gameSession)

    const results = {
      winner: winnerId,
      finalScores: Object.fromEntries(gameSession.scores),
      gameSession,
    }

    io.to(`game_${roomId}`).emit("game:gameEnded", results)
  } catch (error) {
    console.error("Error ending game:", error)
  }
}

const awardGameRewards = async (gameSession) => {
  try {
    for (const playerId of gameSession.players) {
      const user = await User.findById(playerId)
      if (!user) continue

      // Award base XP for participation
      user.devilCores = (user.devilCores || 0) + 10

      // Bonus XP for winner
      if (playerId.toString() === gameSession.winner?.toString()) {
        user.devilCores += 25

        // Award winner badge if first win
        if (!user.badges.includes("First Victory")) {
          user.badges.push("First Victory")
        }
      }

      // Award badges based on performance
      const playerScore = gameSession.scores.get(playerId.toString()) || 0

      if (playerScore >= 50 && !user.badges.includes("Score Master")) {
        user.badges.push("Score Master")
      }

      if (gameSession.gameMode === "code" && !user.badges.includes("Code Warrior")) {
        user.badges.push("Code Warrior")
      }

      await user.save()
    }
  } catch (error) {
    console.error("Error awarding game rewards:", error)
  }
}
