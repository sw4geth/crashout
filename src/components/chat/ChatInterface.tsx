"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ethers } from "ethers"
import ScrambleIn, { ScrambleInHandle } from "@/components/text/scramble-in"
import DummyUniswapSwap from "./DummyUniswapSwap"
import StoryProtocolMint from "./StoryProtocolMint"
import WormholeBridge from "./WormholeBridge"
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
  const [showVideoAndMint, setShowVideoAndMint] = useState<string | null>(null)
  const [showBridge, setShowBridge] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrambleRef = useRef<ScrambleInHandle>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentResponse, showSwap, showVideoAndMint, showBridge])

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
      lowerContent.includes("mnt") ||
      lowerContent.includes("usdc")

    return hasSwapCommand && hasTokens
  }

  const isImageAndMintPrompt = (content: string) => {
    const lowerContent = content.toLowerCase()
    return (
      lowerContent.includes("generate") &&
      lowerContent.includes("image") &&
      (lowerContent.includes("mint") || lowerContent.includes("story protocol"))
    )
  }

  const isBridgePrompt = (content: string) => {
    const lowerContent = content.toLowerCase()
    return (
      lowerContent.includes("bridge") &&
      lowerContent.includes("meth") &&
      lowerContent.includes("solana")
    )
  }

  const handleSubmitWithContent = async (content: string) => {
    if (!content.trim()) return

    const userMessage = { role: "user" as const, content }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    
    // Reset all UI components
    setShowSwap(false)
    setShowVideoAndMint(null)
    setShowBridge(false)

    // Check for swap prompt
    if (isSwapPrompt(content)) {
      setShowSwap(true)
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Here's the swap interface prepopulated with MNT to USDC!"
      }])
      return
    }

    // Check for image and mint prompt
    if (isImageAndMintPrompt(content)) {
      setShowVideoAndMint(content)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Here's your generated image and minting UI!" }
      ])
      return
    }

    // Check for bridge prompt
    if (isBridgePrompt(content)) {
      setShowBridge(true)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Here's the Wormhole Token Bridge to move mETH to Solana!" }
      ])
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
      setCurrentResponse("")
    } catch (error) {
      console.error("Error:", error)
      // Fallback to dummy response if API fails
      const dummyResponse = "This is a dummy response to your query."
      setMessages((prev) => [...prev, { role: "assistant", content: dummyResponse }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmitWithContent(input)
  }

  // Prompt suggestions
  const suggestions = [
    "swap mnt to usdc",
    "generate and mint image",
    "bridge meth to solana"
  ]

  return (
    <div className="h-[70vh] w-full max-w-3xl mx-auto flex flex-col gap-4 p-4 bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg">
      <div className="flex-1 flex gap-4">
        {/* Suggestion column */}
        <div className="w-1/4">
          <div className="bg-black/50 border border-white/20 rounded-lg p-2 flex flex-col gap-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded cursor-pointer transition-colors text-sm"
                onClick={() => setInput(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat column */}
        <div className="w-3/4 overflow-auto space-y-4 p-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === "user" 
                    ? "bg-black/50 text-white" 
                    : message.content.includes("TRANSACTION HIGHLIGHT")
                      ? "highlight" 
                      : "bg-white/10 text-white"
                }`}
              >
                <span className={message.content.includes("TRANSACTION HIGHLIGHT") ? "highlight-text font-bold" : ""}>
                  {message.content}
                </span>
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
          
          {/* Swap Component */}
          {showSwap && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%]">
                <DummyUniswapSwap />
              </div>
            </motion.div>
          )}
          
          {/* Video and Mint Component */}
          {showVideoAndMint && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%] p-3 rounded-lg bg-white/10 text-white">
                  <video 
                    src="/output.mp4" 
                    className="max-w-full h-auto rounded"
                    controls
                    autoPlay
                    loop
                    muted
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%]">
                  <StoryProtocolMint content={showVideoAndMint} />
                </div>
              </motion.div>
            </>
          )}
          
          {/* Bridge Component */}
          {showBridge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%]">
                <WormholeBridge fromToken="mETH" toChain="Solana" />
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/50"
          placeholder="Enter your query (e.g., 'swap mnt to usdc', 'generate and mint image', 'bridge meth to solana')..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition-colors"
        >
          SEND
        </button>
      </form>
    </div>
  )
}
