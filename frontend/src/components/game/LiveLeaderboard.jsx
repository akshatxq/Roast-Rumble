import { Trophy, Crown, Zap, TrendingUp } from "lucide-react"

const LiveLeaderboard = ({ gameState, players }) => {
  const getPlayerScore = (playerId) => {
    return gameState?.scores?.[playerId] || 0
  }

  const sortedPlayers = [...players].sort((a, b) => getPlayerScore(b._id) - getPlayerScore(a._id))

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-400" />
      case 1:
        return <Trophy className="w-5 h-5 text-gray-400" />
      case 2:
        return <Trophy className="w-5 h-5 text-orange-600" />
      default:
        return <TrendingUp className="w-4 h-4 text-gray-500" />
    }
  }

  const getRankBg = (index) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-yellow-500/50"
      case 1:
        return "bg-gradient-to-r from-gray-600/30 to-gray-700/30 border-gray-500/50"
      case 2:
        return "bg-gradient-to-r from-orange-600/30 to-red-600/30 border-orange-500/50"
      default:
        return "bg-purple-800/30 border-purple-500/30"
    }
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-400" />
        Live Leaderboard
      </h3>

      <div className="space-y-3">
        {sortedPlayers.map((player, index) => {
          const score = getPlayerScore(player._id)
          const isActive = gameState?.activePlayer === player._id

          return (
            <div
              key={player._id}
              className={`
                ${getRankBg(index)} rounded-lg p-3 border transition-all duration-300
                ${isActive ? "ring-2 ring-blue-400 scale-105" : ""}
              `}
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <div className="flex items-center justify-center w-8 h-8">{getRankIcon(index)}</div>

                {/* Player Info */}
                <div className="flex items-center gap-2 flex-1">
                  <img
                    src={player.profilePic || "/avatar.png"}
                    alt={player.fullName}
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{player.fullName}</p>
                    {isActive && <p className="text-blue-400 text-xs">Answering...</p>}
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-1 text-right">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-bold">{score}</span>
                </div>
              </div>

              {/* Score change animation */}
              {gameState?.lastScoreChange?.[player._id] && (
                <div className="mt-2 text-center">
                  <span
                    className={`text-sm font-bold animate-bounce ${
                      gameState.lastScoreChange[player._id] > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {gameState.lastScoreChange[player._id] > 0 ? "+" : ""}
                    {gameState.lastScoreChange[player._id]}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Game Progress */}
      {gameState?.currentQuestionIndex !== undefined && (
        <div className="mt-6 pt-4 border-t border-purple-500/30">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Progress</span>
            <span>
              {gameState.currentQuestionIndex + 1} / {gameState.totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${((gameState.currentQuestionIndex + 1) / gameState.totalQuestions) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveLeaderboard
