import GameSession from "../models/gameSession.model.js"
import { io } from "../lib/socket.js"

export const createGameRoom = async (req, res) => {
  try {
    const { name, maxPlayers, questionsPerGame, answerTimeLimit, allowTeams, gameMode } = req.body
    const hostId = req.user._id

    if (!name || !maxPlayers || !questionsPerGame) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const gameSession = new GameSession({
      name,
      host: hostId,
      players: [hostId],
      maxPlayers,
      questionsPerGame,
      answerTimeLimit,
      allowTeams,
      gameMode,
      status: "waiting",
      scores: { [hostId]: 0 },
      currentQuestionIndex: 0,
      questions: [],
    })

    await gameSession.save()
    await gameSession.populate("players", "fullName email profilePic")

    res.status(201).json(gameSession)
  } catch (error) {
    console.error("Error creating game room:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const joinGameRoom = async (req, res) => {
  try {
    const { id: roomId } = req.params
    const playerId = req.user._id

    const gameSession = await GameSession.findById(roomId).populate("players", "fullName email profilePic")

    if (!gameSession) {
      return res.status(404).json({ message: "Game room not found" })
    }

    if (gameSession.status !== "waiting") {
      return res.status(400).json({ message: "Game has already started" })
    }

    if (gameSession.players.length >= gameSession.maxPlayers) {
      return res.status(400).json({ message: "Game room is full" })
    }

    if (gameSession.players.some((p) => p._id.toString() === playerId.toString())) {
      return res.status(400).json({ message: "Already in this game room" })
    }

    gameSession.players.push(playerId)
    gameSession.scores[playerId] = 0
    await gameSession.save()
    await gameSession.populate("players", "fullName email profilePic")

    // Notify other players
    io.to(`game_${roomId}`).emit("game:playerJoined", {
      player: req.user,
      room: gameSession,
    })

    res.status(200).json(gameSession)
  } catch (error) {
    console.error("Error joining game room:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const leaveGameRoom = async (req, res) => {
  try {
    const { id: roomId } = req.params
    const playerId = req.user._id

    const gameSession = await GameSession.findById(roomId).populate("players", "fullName email profilePic")

    if (!gameSession) {
      return res.status(404).json({ message: "Game room not found" })
    }

    gameSession.players = gameSession.players.filter((p) => p._id.toString() !== playerId.toString())
    delete gameSession.scores[playerId]

    if (gameSession.players.length === 0) {
      await GameSession.findByIdAndDelete(roomId)
    } else {
      if (gameSession.host.toString() === playerId.toString() && gameSession.players.length > 0) {
        gameSession.host = gameSession.players[0]._id
      }
      await gameSession.save()
    }

    // Notify other players
    io.to(`game_${roomId}`).emit("game:playerLeft", {
      player: req.user,
      room: gameSession,
    })

    res.status(200).json({ message: "Left game room successfully" })
  } catch (error) {
    console.error("Error leaving game room:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const startGame = async (req, res) => {
  try {
    const { id: roomId } = req.params
    const hostId = req.user._id

    const gameSession = await GameSession.findById(roomId).populate("players", "fullName email profilePic")

    if (!gameSession) {
      return res.status(404).json({ message: "Game room not found" })
    }

    if (gameSession.host.toString() !== hostId.toString()) {
      return res.status(403).json({ message: "Only the host can start the game" })
    }

    if (gameSession.status !== "waiting") {
      return res.status(400).json({ message: "Game has already started" })
    }

    if (gameSession.players.length < 2) {
      return res.status(400).json({ message: "Need at least 2 players to start" })
    }

    // Generate questions (this would integrate with AI service)
    const questions = await generateQuestions(gameSession.gameMode, gameSession.questionsPerGame)

    gameSession.status = "playing"
    gameSession.questions = questions
    gameSession.currentQuestionIndex = 0
    gameSession.gameStartTime = new Date()

    await gameSession.save()

    // Start the first question
    const firstQuestion = questions[0]
    const gameState = {
      currentQuestion: firstQuestion,
      currentQuestionIndex: 0,
      totalQuestions: questions.length,
      scores: gameSession.scores,
      activePlayer: null,
      waitingForAnswer: false,
      buzzerLocked: false,
      timerStart: null,
    }

    // Notify all players
    io.to(`game_${roomId}`).emit("game:gameStarted", gameSession)
    io.to(`game_${roomId}`).emit("game:stateUpdate", gameState)

    res.status(200).json({ message: "Game started successfully" })
  } catch (error) {
    console.error("Error starting game:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const getGameRooms = async (req, res) => {
  try {
    const gameRooms = await GameSession.find({ status: { $in: ["waiting", "playing"] } })
      .populate("players", "fullName email profilePic")
      .populate("host", "fullName email profilePic")
      .sort({ createdAt: -1 })

    res.status(200).json(gameRooms)
  } catch (error) {
    console.error("Error fetching game rooms:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const getGameRoom = async (req, res) => {
  try {
    const { id: roomId } = req.params

    const gameRoom = await GameSession.findById(roomId)
      .populate("players", "fullName email profilePic")
      .populate("host", "fullName email profilePic")

    if (!gameRoom) {
      return res.status(404).json({ message: "Game room not found" })
    }

    res.status(200).json(gameRoom)
  } catch (error) {
    console.error("Error fetching game room:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

// AI Integration Functions
const generateQuestions = async (gameMode, count) => {
  // This would integrate with your LLM API
  const questions = []

  for (let i = 0; i < count; i++) {
    if (gameMode === "code") {
      questions.push({
        text: `Fix the bug in this JavaScript function: function add(a, b) { return a + b + 1; }`,
        type: "code",
        category: "JavaScript",
        difficulty: "medium",
        correctAnswer: "function add(a, b) { return a + b; }",
        points: 10,
      })
    } else {
      questions.push({
        text: `What is the capital of France?`,
        type: "trivia",
        category: "Geography",
        difficulty: "easy",
        correctAnswer: "Paris",
        points: 10,
      })
    }
  }

  return questions
}
