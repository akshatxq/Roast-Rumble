"use client"

import { useState, useEffect, useRef } from "react"
import { useAuthStore } from "../../store/useAuthStore.js"
import { Send, MessageCircle } from "lucide-react"

const GameChat = ({ roomId, players }) => {
  const { authUser, socket } = useAuthStore()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (socket) {
      // Listen for game chat messages
      socket.on("game:chatMessage", (message) => {
        setMessages((prev) => [...prev, message])
      })

      // Join the game chat room
      socket.emit("game:joinChat", roomId)

      return () => {
        socket.off("game:chatMessage")
      }
    }
  }, [socket, roomId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !socket) return

    const message = {
      text: newMessage.trim(),
      sender: authUser,
      timestamp: new Date(),
      roomId,
    }

    socket.emit("game:sendChatMessage", message)
    setNewMessage("")
  }

  const getPlayerName = (playerId) => {
    const player = players.find((p) => p._id === playerId)
    return player?.fullName || "Unknown Player"
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-4 h-80 flex flex-col">
      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-blue-400" />
        Game Chat
      </h3>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="text-sm">
              <div className="flex items-start gap-2">
                <img
                  src={message.sender.profilePic || "/avatar.png"}
                  alt={message.sender.fullName}
                  className="w-6 h-6 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white text-xs">{message.sender.fullName}</span>
                    <span className="text-gray-400 text-xs">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs break-words">{message.text}</p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 bg-black/30 border border-blue-500/30 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none text-sm"
          maxLength={200}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}

export default GameChat
