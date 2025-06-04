// AI Service Integration
// This would integrate with your chosen LLM and TTS services

export const generateAIRoast = async (question, wrongAnswer, gameMode) => {
  try {
    // This would call your LLM API (OpenAI, Google Gemini, etc.)
    const roasts = [
      "Oh dear, that answer was so wrong it made my circuits cry! 😭",
      "I've seen better answers from a broken calculator! 🤖",
      "That was almost right... if we were living in opposite world! 🌍",
      "Your answer was so off-target, it's in a different galaxy! 🚀",
      "I'd give you points for creativity, but this isn't art class! 🎨",
    ]

    if (gameMode === "code") {
      const codeRoasts = [
        "That code has more bugs than a summer picnic! 🐛",
        "I've seen spaghetti code, but this is more like tangled Christmas lights! 🎄",
        "Your syntax is so broken, even the compiler is crying! 😢",
        "That code would make a senior developer retire early! 👴",
        "I think you confused JavaScript with ancient hieroglyphics! 📜",
      ]
      return codeRoasts[Math.floor(Math.random() * codeRoasts.length)]
    }

    return roasts[Math.floor(Math.random() * roasts.length)]
  } catch (error) {
    console.error("Error generating AI roast:", error)
    return "Well, that wasn't quite right, but nice try! 😅"
  }
}

export const evaluateAnswer = async (question, playerAnswer, gameMode) => {
  try {
    if (gameMode === "code") {
      // This would call your Code Reviewer AI API
      // For now, simple string comparison
      return playerAnswer.toLowerCase().includes(question.correctAnswer.toLowerCase())
    } else {
      // This would call your LLM for nuanced answer evaluation
      // For now, simple string comparison
      const correct = question.correctAnswer.toLowerCase()
      const answer = playerAnswer.toLowerCase()

      return answer.includes(correct) || correct.includes(answer)
    }
  } catch (error) {
    console.error("Error evaluating answer:", error)
    return false
  }
}

export const generateQuestions = async (gameMode, category, difficulty, count) => {
  try {
    // This would call your LLM API to generate questions
    // For now, return sample questions
    const questions = []

    for (let i = 0; i < count; i++) {
      if (gameMode === "code") {
        questions.push({
          text: `What will this code output? console.log(${i} + "2");`,
          type: "code",
          category: "JavaScript",
          difficulty: difficulty || "medium",
          correctAnswer: `${i}2`,
          points: 10,
        })
      } else {
        questions.push({
          text: `What is ${i} + 2?`,
          type: "trivia",
          category: "Math",
          difficulty: difficulty || "easy",
          correctAnswer: (i + 2).toString(),
          points: 10,
        })
      }
    }

    return questions
  } catch (error) {
    console.error("Error generating questions:", error)
    return []
  }
}
