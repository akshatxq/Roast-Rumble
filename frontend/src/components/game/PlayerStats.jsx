import { Trophy, Zap } from "lucide-react"

const PlayerStats = ({ player, gameState, isCurrentUser }) => {
  const playerScore = gameState?.scores?.[player._id] || 0
  const isActive = gameState?.activePlayer === player._id
  const isLocked = gameState?.lockedPlayers?.includes(player._id)

  return (
    <div
      className={`
      bg-black/40 backdrop-blur-sm rounded-xl border p-4 transition-all duration-300
      ${isCurrentUser ? "border-blue-500/50 ring-2 ring-blue-400/30" : "border-purple-500/30"}
      ${isActive ? "scale-105 border-yellow-500/50 ring-2 ring-yellow-400/30" : ""}
      ${isLocked ? "opacity-60" : ""}
    `}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <img
            src={player.profilePic || "/avatar.png"}
            alt={player.fullName}
            className="w-12 h-12 rounded-full border-2 border-white/20"
          />
          {isActive && <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>}
          {isLocked && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full">🔒</div>}
        </div>

        <div className="flex-1">
          <h4 className="text-white font-medium text-sm">{player.fullName}</h4>
          {isCurrentUser && <span className="text-blue-400 text-xs">You</span>}
          {isActive && <span className="text-yellow-400 text-xs animate-pulse">Answering...</span>}
          {isLocked && <span className="text-red-400 text-xs">Locked Out</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-purple-600/20 rounded-lg p-2 text-center">
          <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
          <div className="text-white font-bold">{playerScore}</div>
          <div className="text-gray-400">Score</div>
        </div>

        <div className="bg-blue-600/20 rounded-lg p-2 text-center">
          <Trophy className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <div className="text-white font-bold">{player.badges?.length || 0}</div>
          <div className="text-gray-400">Badges</div>
        </div>
      </div>

      {/* Score change animation */}
      {gameState?.lastScoreChange?.[player._id] && (
        <div className="mt-2 text-center">
          <span
            className={`
            text-lg font-bold animate-bounce
            ${gameState.lastScoreChange[player._id] > 0 ? "text-green-400" : "text-red-400"}
          `}
          >
            {gameState.lastScoreChange[player._id] > 0 ? "+" : ""}
            {gameState.lastScoreChange[player._id]}
          </span>
        </div>
      )}
    </div>
  )
}

export default PlayerStats
