import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import { useAuthStore } from "./useAuthStore.js"
import toast from "react-hot-toast"

export const useGameStore = create((set, get) => ({
  // State
  gameRooms: [],
  currentGame: null,
  gameState: null,
  userStats: null,
  globalLeaderboard: [],
  isLoading: false,
  isHost: false,

  // Actions
  getGameRooms: async () => {
    try {
      const res = await axiosInstance.get("/game/rooms")
      set({ gameRooms: res.data })
    } catch (error) {
      toast.error("Failed to load game rooms")
      console.error(error)
    }
  },

  createGameRoom: async (config) => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.post("/game/create", config)
      const newRoom = res.data
      const { authUser } = useAuthStore.getState()

      set((state) => ({
        gameRooms: [...state.gameRooms, newRoom],
        currentGame: newRoom,
        isHost: newRoom.host === authUser._id,
        isLoading: false,
      }))

      toast.success("Arena created successfully! Waiting for players...")
      return newRoom
    } catch (error) {
      set({ isLoading: false })
      toast.error(error.response?.data?.message || "Failed to create arena")
      throw error
    }
  },

  joinGameRoom: async (roomId) => {
    set({ isLoading: true })
    try {
      // Check if we're already in this room
      const currentGame = get().currentGame
      if (currentGame && currentGame._id === roomId) {
        set({ isLoading: false })
        return currentGame
      }

      const res = await axiosInstance.post(`/game/join/${roomId}`)
      const room = res.data
      const { authUser } = useAuthStore.getState()

      set({
        currentGame: room,
        isHost: room.host === authUser._id,
        isLoading: false,
      })

      toast.success("Joined arena successfully!")
      return room
    } catch (error) {
      set({ isLoading: false })
      // Don't show error if already in room
      if (error.response?.status !== 400) {
        toast.error(error.response?.data?.message || "Failed to join arena")
      }
      throw error
    }
  },

  leaveGameRoom: async () => {
    const { currentGame } = get()
    if (!currentGame) return

    try {
      await axiosInstance.post(`/game/leave/${currentGame._id}`)

      set({
        currentGame: null,
        gameState: null,
        isHost: false,
      })

      toast.success("Left arena")
    } catch (error) {
      toast.error("Failed to leave arena")
      console.error(error)
    }
  },

  startGame: async (roomId) => {
    set({ isLoading: true })
    try {
      console.log("Attempting to start game", roomId)
      await axiosInstance.post(`/game/start/${roomId}`)
      set({ isLoading: false })
      toast.success("Game started!")
    } catch (error) {
      console.error("Start game error:", error)
      set({ isLoading: false })
      toast.error(error.response?.data?.message || "Failed to start game")
    }
  },

  buzzer: () => {
    const socket = useAuthStore.getState().socket
    const { currentGame } = get()

    if (socket && currentGame) {
      socket.emit("game:playerBuzzed", {
        roomId: currentGame._id,
        playerId: useAuthStore.getState().authUser._id,
      })
      console.log("Buzzer event sent!")
    }
  },

  submitAnswer: (answer) => {
    const socket = useAuthStore.getState().socket
    const { currentGame } = get()

    if (socket && currentGame) {
      socket.emit("game:submitAnswer", {
        roomId: currentGame._id,
        playerId: useAuthStore.getState().authUser._id,
        answer,
      })
      console.log("Answer submitted:", answer)
    }
  },

  getUserStats: async (userId) => {
    try {
      const res = await axiosInstance.get(`/user/stats/${userId}`)
      set({ userStats: res.data })
    } catch (error) {
      console.error("Failed to load user stats:", error)
    }
  },

  getGlobalLeaderboard: async () => {
    try {
      const res = await axiosInstance.get("/leaderboard/global")
      set({ globalLeaderboard: res.data })
    } catch (error) {
      console.error("Failed to load leaderboard:", error)
    }
  },

  // Socket event handlers
  setupGameSocketListeners: () => {
    const socket = useAuthStore.getState().socket
    if (!socket) {
      console.log("No socket available for game listeners")
      return () => {}
    }

    console.log("Setting up game socket listeners")

    // Remove any existing listeners first
    socket.off("game:stateUpdate")
    socket.off("game:roomUpdate")
    socket.off("game:playerJoined")
    socket.off("game:playerLeft")
    socket.off("game:gameStarted")
    socket.off("game:gameEnded")
    socket.off("game:buzzerLockout")
    socket.off("game:roast")

    socket.on("game:stateUpdate", (gameState) => {
      console.log("Game state update:", gameState)
      set({ gameState })
    })

    socket.on("game:roomUpdate", (room) => {
      console.log("Room update received:", room)
      const { authUser } = useAuthStore.getState()

      set({
        currentGame: room,
        isHost: room.host === authUser._id,
      })

      // Update the room in gameRooms list as well
      set((state) => ({
        gameRooms: state.gameRooms.map((r) => (r._id === room._id ? room : r)),
      }))
    })

    socket.on("game:playerJoined", (data) => {
      console.log("Player joined event:", data)
      toast.success(`${data.player.fullName} joined the arena!`)

      // Refresh the current game data
      get().getGameRooms()
    })

    socket.on("game:playerLeft", (data) => {
      console.log("Player left event:", data)
      toast.info(`${data.player.fullName} left the arena`)

      // Refresh the current game data
      get().getGameRooms()
    })

    socket.on("game:gameStarted", (data) => {
      console.log("Game started event:", data)
      toast.success("Game started! Get ready to roast!")
    })

    socket.on("game:gameEnded", (results) => {
      console.log("Game ended:", results)
      toast.success("Game ended!")
      set({ gameState: null })
    })

    socket.on("game:buzzerLockout", (data) => {
      console.log("Buzzer lockout:", data)
      if (data.playerId === useAuthStore.getState().authUser._id) {
        toast.error("You're locked out for the next question!")
      }
    })

    socket.on("game:roast", (roast) => {
      console.log("Roast received:", roast)
      set((state) => ({
        gameState: {
          ...state.gameState,
          lastRoast: roast.message,
        },
      }))
    })

    return () => {
      console.log("Cleaning up game socket listeners")
      socket.off("game:stateUpdate")
      socket.off("game:roomUpdate")
      socket.off("game:playerJoined")
      socket.off("game:playerLeft")
      socket.off("game:gameStarted")
      socket.off("game:gameEnded")
      socket.off("game:buzzerLockout")
      socket.off("game:roast")
    }
  },
}))
