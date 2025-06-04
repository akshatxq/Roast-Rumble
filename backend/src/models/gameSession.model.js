import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["trivia", "code"],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 10,
  },
})

const gameSessionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    maxPlayers: {
      type: Number,
      required: true,
      min: 2,
      max: 8,
    },
    questionsPerGame: {
      type: Number,
      required: true,
      min: 5,
      max: 20,
    },
    answerTimeLimit: {
      type: Number,
      required: true,
      min: 5,
      max: 30,
    },
    allowTeams: {
      type: Boolean,
      default: false,
    },
    gameMode: {
      type: String,
      enum: ["trivia", "code"],
      required: true,
    },
    status: {
      type: String,
      enum: ["waiting", "playing", "finished"],
      default: "waiting",
    },
    scores: {
      type: Map,
      of: Number,
      default: {},
    },
    questions: [questionSchema],
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    gameStartTime: {
      type: Date,
    },
    gameEndTime: {
      type: Date,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
)

const GameSession = mongoose.model("GameSession", gameSessionSchema)

export default GameSession
