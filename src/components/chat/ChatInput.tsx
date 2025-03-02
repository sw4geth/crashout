"use client"

import { useState } from "react"

interface ChatInputProps {
  onSubmit: (content: string) => void
  isLoading: boolean
}

export default function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit(input)
      setInput("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 p-2 bg-black/50 border border-white/20 text-white focus:outline-none focus:border-white/50"
        placeholder="Enter your query..."
        disabled={isLoading}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-white/20 text-white hover:bg-white/30 transition-colors disabled:opacity-50"
        disabled={isLoading || !input.trim()}
      >
        Send
      </button>
    </form>
  )
}