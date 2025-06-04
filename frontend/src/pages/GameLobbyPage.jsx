"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "../store/useAuthStore.js"
import { useGameStore } from "../store/useGameStore.js"
import { Users, Trophy, Zap, Crown, Plus, Play } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import BadgeShowcase from "../components/game/BadgeShowcase.jsx"

const GameLobbyPage = () => {
  const navigate = useNavigate()
  const { authUser, onlineUsers } = useAuthStore()
  const {
    gameRooms,
    userStats,
    globalLeaderboard,
    createGameRoom,
    joinGameRoom,
    getGameRooms,
    getUserStats,
    getGlobalLeaderboard,
    isLoading,
  } = useGameStore()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [gameConfig, setGameConfig] = useState({
    name: "",
    maxPlayers: 6,
    questionsPerGame: 10,
    answerTimeLimit: 7,
    allowTeams: false,
    gameMode: "trivia", // trivia or code
  })

  useEffect(() => {
    getGameRooms()
    getUserStats(authUser._id)
    getGlobalLeaderboard()

    // Set up socket listeners for real-time room updates
    const cleanup = useGameStore.getState().setupGameSocketListeners()

    return cleanup
  }, [])

  const handleCreateRoom = async (e) => {
    e.preventDefault()
    try {
      const newRoom = await createGameRoom(gameConfig)
      setShowCreateModal(false)
      setGameConfig({
        name: "",
        maxPlayers: 6,
        questionsPerGame: 10,
        answerTimeLimit: 7,
        allowTeams: false,
        gameMode: "trivia",
      })
      // Navigate to the game room
      navigate(`/game/${newRoom._id}`)
    } catch (error) {
      console.error("Failed to create room:", error)
    }
  }

  const handleJoinRoom = async (roomId) => {
    try {
      await joinGameRoom(roomId)
      // Navigate to the game room
      navigate(`/game/${roomId}`)
    } catch (error) {
      console.error("Failed to join room:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-20">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%239C92AC&quot; fillOpacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            The Roasting Arena
          </h1>
          <p className="text-xl text-gray-300 mb-8">Where wit meets wisdom and roasts meet reality!</p>

          {/* User Stats */}
          <div className="flex justify-center items-center gap-8 mb-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
              <div className="flex items-center gap-2 text-yellow-400">
                <Zap className="w-5 h-5" />
                <span className="font-bold">{userStats?.devilCores || 0}</span>
                <span className="text-sm text-gray-400">Devil's Core</span>
              </div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30">
              <div className="flex items-center gap-2 text-blue-400">
                <Trophy className="w-5 h-5" />
                <span className="font-bold">{userStats?.badges?.length || 0}</span>
                <span className="text-sm text-gray-400">Badges</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Game Rooms */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  Active Arenas
                </h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-none text-white"
                >
                  <Plus className="w-4 h-4" />
                  Create Arena
                </button>
              </div>

              <div className="space-y-4">
                {gameRooms.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Crown className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No active arenas. Be the first to create one!</p>
                  </div>
                ) : (
                  gameRooms.map((room) => (
                    <div
                      key={room._id}
                      className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 rounded-xl p-4 border border-purple-400/30 hover:border-purple-400/60 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-bold text-white">{room.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {room.players.length}/{room.maxPlayers}
                            </span>
                            <span className="capitalize">{room.gameMode}</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                room.status === "waiting"
                                  ? "bg-green-500/20 text-green-400"
                                  : room.status === "playing"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {room.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {room.status === "waiting" && room.players.length < room.maxPlayers && (
                            <button
                              onClick={() => handleJoinRoom(room._id)}
                              className="btn btn-sm bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 border-none text-white"
                              disabled={isLoading}
                            >
                              <Play className="w-4 h-4" />
                              Join
                            </button>
                          )}
                          {room.status === "playing" && (
                            <Link
                              to={`/game/${room._id}`}
                              className="btn btn-sm bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-none text-white"
                            >
                              <Play className="w-4 h-4" />
                              Watch
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Badges */}
            <BadgeShowcase badges={userStats?.badges} userStats={userStats} />

            {/* Online Players */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Online Warriors ({onlineUsers.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {onlineUsers.slice(0, 10).map((userId) => (
                  <div key={userId} className="flex items-center gap-2 text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Player {userId.slice(-4)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Leaderboard */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-yellow-500/30 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Hall of Fame
              </h3>
              <div className="space-y-3">
                {globalLeaderboard.slice(0, 5).map((player, index) => (
                  <div key={player._id} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0
                          ? "bg-yellow-500 text-black"
                          : index === 1
                            ? "bg-gray-400 text-black"
                            : index === 2
                              ? "bg-orange-600 text-white"
                              : "bg-gray-600 text-white"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{player.fullName}</p>
                      <p className="text-gray-400 text-xs">{player.devilCores} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Game Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl border border-purple-500/30 p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold text-white mb-6">Create New Arena</h3>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Arena Name</label>
                <input
                  type="text"
                  value={gameConfig.name}
                  onChange={(e) => setGameConfig({ ...gameConfig, name: e.target.value })}
                  className="w-full px-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  placeholder="Epic Roast Battle"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Players</label>
                  <select
                    value={gameConfig.maxPlayers}
                    onChange={(e) => setGameConfig({ ...gameConfig, maxPlayers: Number.parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value={2}>2 Players</option>
                    <option value={4}>4 Players</option>
                    <option value={6}>6 Players</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Questions</label>
                  <select
                    value={gameConfig.questionsPerGame}
                    onChange={(e) =>
                      setGameConfig({ ...gameConfig, questionsPerGame: Number.parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Game Mode</label>
                <select
                  value={gameConfig.gameMode}
                  onChange={(e) => setGameConfig({ ...gameConfig, gameMode: e.target.value })}
                  className="w-full px-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="trivia">Trivia Roast</option>
                  <option value="code">Code Challenge</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allowTeams"
                  checked={gameConfig.allowTeams}
                  onChange={(e) => setGameConfig({ ...gameConfig, allowTeams: e.target.checked })}
                  className="w-4 h-4 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500"
                />
                <label htmlFor="allowTeams" className="text-sm text-gray-300">
                  Allow Teams
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create Arena"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameLobbyPage
