import User from "../models/user.model.js"

export const getGlobalLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find({})
      .select("fullName email profilePic devilCores badges")
      .sort({ devilCores: -1 })
      .limit(50)

    res.status(200).json(topUsers)
  } catch (error) {
    console.error("Error fetching global leaderboard:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
