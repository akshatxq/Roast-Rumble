"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore.js"
import { useGameStore } from "../store/useGameStore.js"
import AIHostDisplay from "../components/game/AIHostDisplay.jsx"
import BuzzerButton from "../components/game/BuzzerButton.jsx"
import AnswerInput from "../components/game/AnswerInput.jsx"
import LiveLeaderboard from "../components/game/LiveLeaderboard.jsx"
import TimerDisplay from "../components/game/TimerDisplay.jsx"
import GameChat from "../components/game/GameChat.jsx"
import { Crown, Users, DoorClosedIcon as ExitIcon } from "lucide-react"
import GameEffects from "../components/game/GameEffects.jsx"
import PlayerStats from "../components/game/PlayerStats.jsx"
import QuestionDisplay from "../components/game/QuestionDisplay.jsx"

const GameRoomPage = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { authUser, socket } = useAuthStore()
  const {
    currentGame,
    gameState,
    joinGameRoom,
    startGame,
    leaveGameRoom,
    buzzer,
    submitAnswer,
    setupGameSocketListeners,
    getGameRooms,
  } = useGameStore()

  // Determine if the current user is the host
  const isHost = currentGame && authUser && currentGame.host === authUser._id
  const isActivePlayer = gameState && authUser && gameState.activePlayer === authUser._id

  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    if (roomId && socket) {
      console.log("Setting up room for:", roomId)

      // Set up socket listeners first
      const cleanup = setupGameSocketListeners()

      // Join the socket room
      socket.emit("game:joinRoom", roomId)

      // Try to join the game room (this might fail if already in room, which is fine)
      joinGameRoom(roomId).catch((error) => {
        console.log("Join room failed (might already be in room):", error.response?.data?.message)
      })

      return () => {
        if (cleanup) cleanup()
        if (socket) {
          socket.emit("game:leaveRoom", roomId)
        }
      }
    }
  }, [roomId, socket])

  // Refresh game rooms when component mounts to get latest data
  useEffect(() => {
    getGameRooms()
  }, [])

  const handleStartGame = () => {
    if (roomId) {
      console.log("Starting game for room:", roomId)
      startGame(roomId)
    }
  }

  const handleLeaveRoom = () => {
    leaveGameRoom()
    navigate("/lobby")
  }

  const handleBuzzer = () => {
    console.log("Buzzer pressed!")
    buzzer()
  }

  const handleSubmitAnswer = (answer) => {
    console.log("Submitting answer:", answer)
    submitAnswer(answer)
  }

  if (!currentGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Arena...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-20">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg%20width%3D'40'%20height%3D'40'%20viewBox%3D'0%200%2040%2040'%20xmlns%3D'http%3A//www.w3.org/2000/svg'%3E%3Cg%20fill%3D'%23ffffff'%20fill-opacity%3D'0.05'%3E%3Cpath%20d%3D'M20%2020c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-400" />
                {currentGame.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {currentGame.players.length}/{currentGame.maxPlayers}
                </span>
                <span className="capitalize">{currentGame.gameMode}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    currentGame.status === "waiting"
                      ? "bg-green-500/20 text-green-400"
                      : currentGame.status === "playing"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {currentGame.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowChat(!showChat)}
                className="btn btn-sm bg-blue-600 hover:bg-blue-700 border-none text-white"
              >
                Chat
              </button>
              {isHost && currentGame.status === "waiting" && (
                <button
                  onClick={handleStartGame}
                  className="btn btn-sm bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 border-none text-white"
                >
                  Start Game
                </button>
              )}
              <button
                onClick={handleLeaveRoom}
                className="btn btn-sm bg-red-600 hover:bg-red-700 border-none text-white"
              >
                <ExitIcon className="w-4 h-4" />
                Leave
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Game Instructions */}
            {currentGame.status === "playing" && (
              <div className="bg-blue-900/40 backdrop-blur-sm rounded-xl border border-blue-500/30 p-4">
                <h3 className="text-lg font-bold text-white mb-2">How to Play:</h3>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>1. 🎯 Listen to the question from the AI host</p>
                  <p>2. ⚡ Press the BUZZER when you know the answer</p>
                  <p>3. ✍️ Type your answer when it's your turn</p>
                  <p>4. 🏆 Earn points for correct answers!</p>
                </div>
              </div>
            )}

            {/* Question Display */}
            {currentGame.status === "playing" && gameState?.currentQuestion && (
              <QuestionDisplay
                question={gameState.currentQuestion}
                gameState={gameState}
                timeRemaining={gameState?.questionTimeRemaining || 0}
              />
            )}

            {/* AI Host */}
            <AIHostDisplay gameState={gameState} currentGame={currentGame} />

            {/* Game Controls */}
            {currentGame.status === "playing" && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Buzzer & Answer */}
                <div className="space-y-4">
                  {/* Buzzer - Show for everyone when question is active */}
                  {gameState?.currentQuestion && !gameState?.activePlayer && (
                    <div className="text-center">
                      <p className="text-white mb-4 text-lg font-semibold">🎯 Know the answer? Buzz in now!</p>
                      <BuzzerButton gameState={gameState} onBuzz={handleBuzzer} disabled={gameState?.buzzerLocked} />
                    </div>
                  )}

                  {/* Answer Input - Show only for active player */}
                  {isActivePlayer && gameState?.waitingForAnswer && (
                    <div className="text-center">
                      <p className="text-green-400 mb-4 text-lg font-semibold">✨ You buzzed in! Enter your answer:</p>
                      <AnswerInput
                        onSubmit={handleSubmitAnswer}
                        timeLimit={currentGame.answerTimeLimit}
                        gameMode={currentGame.gameMode}
                      />
                    </div>
                  )}

                  {/* Waiting for other player */}
                  {gameState?.activePlayer && !isActivePlayer && (
                    <div className="text-center p-6 bg-yellow-900/40 rounded-xl border border-yellow-500/30">
                      <p className="text-yellow-400 text-lg font-semibold">⏳ Another player is answering...</p>
                      <p className="text-gray-300 text-sm mt-2">Get ready for the next question!</p>
                    </div>
                  )}
                </div>

                {/* Timer */}
                <div className="flex items-center justify-center">
                  <TimerDisplay gameState={gameState} timeLimit={currentGame.answerTimeLimit} />
                </div>
              </div>
            )}

            {/* Player Stats Grid */}
            {currentGame.status === "playing" && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentGame.players.map((player) => (
                  <PlayerStats
                    key={player._id}
                    player={player}
                    gameState={gameState}
                    isCurrentUser={player._id === authUser._id}
                  />
                ))}
              </div>
            )}

            {/* Waiting Room */}
            {currentGame.status === "waiting" && (
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Waiting for Players...</h2>
                <p className="text-gray-300 mb-6">
                  {isHost ? "Start the game when ready!" : "Waiting for host to start the game."}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {currentGame.players.map((player) => (
                    <div key={player._id} className="bg-purple-800/50 rounded-lg p-3">
                      <img
                        src={player.profilePic || "/avatar.png"}
                        alt={player.fullName}
                        className="w-12 h-12 rounded-full mx-auto mb-2"
                      />
                      <p className="text-white text-sm font-medium">{player.fullName}</p>
                      {player._id === currentGame.host && <span className="text-yellow-400 text-xs">Host</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <LiveLeaderboard gameState={gameState} players={currentGame.players} />

            {/* Chat */}
            {showChat && <GameChat roomId={roomId} players={currentGame.players} />}
          </div>
        </div>
      </div>
      {/* Game Effects */}
      <GameEffects gameState={gameState} currentGame={currentGame} />
    </div>
  )
}

export default GameRoomPage
