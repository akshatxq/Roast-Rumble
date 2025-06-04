import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getUserStats, updateUserStats } from "../controllers/user.controller.js"

const router = express.Router()

router.get("/stats/:id", protectRoute, getUserStats)
router.put("/stats/:id", protectRoute, updateUserStats)

export default router
