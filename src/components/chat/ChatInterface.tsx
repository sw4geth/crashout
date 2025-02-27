"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ethers } from "ethers"
import ScrambleIn, { ScrambleInHandle } from "@/components/text/scramble-in"
import SwapInterface from "./SwapInterface"
import { generateChatResponse } from "@/lib/openai"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatInterfaceProps {
  initialPrompt?: string
}

// Initialize provider
const provider = new ethers.providers.JsonRpcProvider(
  "https://eth-mainnet.g.alchemy.com/v2/SNEOR8G_USDK3K_Ak29fC0ZWu_E58-7W"
)

export default function ChatInterface({ initialPrompt }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentResponse, setCurrentResponse] = useState("")
  const [showSwap, setShowSwap] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrambleRef = useRef<ScrambleInHandle>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentResponse, showSwap])

  useEffect(() => {
    if (initialPrompt) {
      handleSubmitWithContent(initialPrompt)
    }
  }, [initialPrompt])

  const isSwapPrompt = (content: string) => {
    const lowerContent = content.toLowerCase()
    // Check for swap-related keywords
    const hasSwapCommand =
      lowerContent.includes("swap") ||
      lowerContent.includes("trade") ||
      lowerContent.includes("exchange") ||
      lowerContent.includes("convert")

    // Check for token keywords
    const hasTokens =
      lowerContent.includes("eth") ||
      lowerContent.includes("meth") ||
      lowerContent.includes("fbtc")

    return hasSwapCommand && hasTokens
  }

  const handleSubmitWithContent = async (content: string) => {
    if (!content.trim()) return

    const userMessage = { role: "user" as const, content }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Check for swap commands first
    if (isSwapPrompt(content)) {
      setShowSwap(true)
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "I've opened the Uniswap swap widget for you. You can now trade between ETH, mETH, and fBTC. Just connect your wallet to get started!"
      }])
      return
    }

    try {
      setIsLoading(true)
      setCurrentResponse("")

      const response = await generateChatResponse(content)
      let fullResponse = ""

      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || ""
        fullResponse += content
        setCurrentResponse((prev) => prev + content)
      }

      setMessages((prev) => [...prev, { role: "assistant", content: fullResponse }])
      setInput("")
      setCurrentResponse("")
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmitWithContent(input)
  }

  return (
    <div className="h-[70vh] w-full max-w-3xl mx-auto flex flex-col gap-4 p-4 bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg">
      <div className="flex-1 overflow-auto space-y-4 p-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user" ? "bg-black/50 text-white" : "bg-white/10 text-white"
              }`}
            >
              {message.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 text-white"
          >
            <div className="animate-pulse">Processing</div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "100ms" }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></div>
            </div>
          </motion.div>
        )}
        {currentResponse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="max-w-[80%] p-3 rounded-lg bg-white/10 text-white">
              <ScrambleIn
                ref={scrambleRef}
                text={currentResponse}
                scrambleSpeed={25}
                scrambledLetterCount={5}
                className="font-mono"
                autoStart={true}
              />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showSwap ? (
        <SwapInterface provider={provider} />
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/50"
            placeholder="Enter your query..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            Send
          </button>
        </form>
      )}
    </div>
  )
}
