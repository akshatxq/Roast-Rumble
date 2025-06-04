import { Trophy, Star, Code, Zap, Crown, Target } from "lucide-react"

const BadgeShowcase = ({ badges, userStats }) => {
  const getBadgeIcon = (badgeName) => {
    switch (badgeName) {
      case "First Victory":
        return <Crown className="w-6 h-6 text-yellow-400" />
      case "Score Master":
        return <Target className="w-6 h-6 text-green-400" />
      case "Code Warrior":
        return <Code className="w-6 h-6 text-blue-400" />
      case "Roast Survivor":
        return <Zap className="w-6 h-6 text-red-400" />
      case "Chat Champion":
        return <Star className="w-6 h-6 text-purple-400" />
      default:
        return <Trophy className="w-6 h-6 text-gray-400" />
    }
  }

  const getBadgeDescription = (badgeName) => {
    switch (badgeName) {
      case "First Victory":
        return "Won your first game"
      case "Score Master":
        return "Scored 50+ points in a game"
      case "Code Warrior":
        return "Completed a code challenge"
      case "Roast Survivor":
        return "Got roasted but kept playing"
      case "Chat Champion":
        return "Active in game chat"
      default:
        return "Achievement unlocked"
    }
  }

  const allBadges = ["First Victory", "Score Master", "Code Warrior", "Roast Survivor", "Chat Champion"]

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-yellow-500/30 p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-400" />
        Infernal Badges
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {allBadges.map((badgeName) => {
          const isEarned = badges?.includes(badgeName)

          return (
            <div
              key={badgeName}
              className={`
                relative p-3 rounded-lg border transition-all duration-300 group cursor-pointer
                ${
                  isEarned
                    ? "bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/50 hover:scale-105"
                    : "bg-gray-800/30 border-gray-600/30 opacity-50"
                }
              `}
            >
              <div className="text-center">
                <div className={`mb-2 ${isEarned ? "" : "grayscale"}`}>{getBadgeIcon(badgeName)}</div>
                <h4 className="text-white text-xs font-medium mb-1">{badgeName}</h4>
                <p className="text-gray-400 text-xs">{getBadgeDescription(badgeName)}</p>
              </div>

              {isEarned && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {getBadgeDescription(badgeName)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress */}
      <div className="mt-4 pt-4 border-t border-yellow-500/30">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Badge Progress</span>
          <span>
            {badges?.length || 0} / {allBadges.length}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((badges?.length || 0) / allBadges.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default BadgeShowcase
