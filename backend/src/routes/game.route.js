import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import {
  createGameRoom,
  joinGameRoom,
  leaveGameRoom,
  startGame,
  getGameRooms,
  getGameRoom,
} from "../controllers/game.controller.js"

const router = express.Router()

router.get("/rooms", protectRoute, getGameRooms)
router.get("/room/:id", protectRoute, getGameRoom)
router.post("/create", protectRoute, createGameRoom)
router.post("/join/:id", protectRoute, joinGameRoom)
router.post("/leave/:id", protectRoute, leaveGameRoom)
router.post("/start/:id", protectRoute, startGame)

export default router
