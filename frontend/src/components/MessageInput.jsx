"use client"

import { useRef, useState } from "react"
import { useChatStore } from "../store/useChatStore.js"
import { ImageIcon, Send, X } from "lucide-react"
import toast from "react-hot-toast"

const MessageInput = () => {
  const [text, setText] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const { sendMessage } = useChatStore()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!text.trim() && !imagePreview) return

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      })

      setText("")
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  return (
<div className="p-4 w-full bg-base-100/50 border-t border-base-300">


      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview || "/placeholder.svg"}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-purple-300"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-purple-600 border border-purple-200 shadow-sm
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full rounded-lg px-4 py-2 text-sm border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-zinc-800 dark:text-white dark:placeholder:text-purple-300"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />

          <button
            type="button"
            className={`hidden sm:flex items-center justify-center rounded-full w-10 h-10 transition
              ${imagePreview ? "bg-purple-200 text-purple-700" : "bg-purple-50 text-purple-400 hover:text-purple-600"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="bg-purple-500 hover:bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  )
}

export default MessageInput
