import User from "../models/user.model.js"

export const getUserStats = async (req, res) => {
  try {
    const { id: userId } = req.params

    const user = await User.findById(userId).select("devilCores badges gameHistory")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error("Error fetching user stats:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const updateUserStats = async (req, res) => {
  try {
    const { id: userId } = req.params
    const { devilCores, badges } = req.body

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (devilCores !== undefined) {
      user.devilCores = (user.devilCores || 0) + devilCores
    }

    if (badges && Array.isArray(badges)) {
      badges.forEach((badge) => {
        if (!user.badges.includes(badge)) {
          user.badges.push(badge)
        }
      })
    }

    await user.save()

    res.status(200).json(user)
  } catch (error) {
    console.error("Error updating user stats:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
