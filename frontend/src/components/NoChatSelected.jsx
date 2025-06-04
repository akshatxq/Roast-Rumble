import { MessageSquare } from "lucide-react"

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center
             justify-center animate-bounce"
            >
              <MessageSquare className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          Welcome to Roasting Arena!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
        Choose a challenger from the sidebar to begin your duel.
        </p>
      </div>
    </div>
  )
}

export default NoChatSelected