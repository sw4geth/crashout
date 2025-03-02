"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface ChatBubbleProps {
  message: string | ReactNode
  role: "user" | "assistant"
}

export default function ChatBubble({ message, role }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] p-3 break-words whitespace-pre-wrap ${
          role === "user" ? "bg-black/50 text-white" : "bg-white/10 text-white"
        }`}
      >
        {message}
      </div>
    </motion.div>
  )
}