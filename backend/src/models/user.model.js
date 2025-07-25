import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    devilCores: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
    gameHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "GameSession" }],
  },
  { timestamps: true },
)

const User = mongoose.model("User", userSchema)

export default User
