"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ethers } from "ethers"
import ScrambleIn, { ScrambleInHandle } from "@/components/text/scramble-in"
import DummyUniswapSwap from "./DummyUniswapSwap"
import StoryProtocolMint from "./StoryProtocolMint"
import WormholeBridge from "./WormholeBridge"
import GeckoChart from "../chart/GeckoChart"
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
  const [showChart, setShowChart] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrambleRef = useRef<ScrambleInHandle>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentResponse, showSwap, showVideoAndMint, showBridge, showChart])

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
      lowerContent.includes("mint") ||
      lowerContent.includes("slop")
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
    setShowChart(false)

    // Check for swap prompt
    if (isSwapPrompt(content)) {
      setShowSwap(true)
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "sell while you still can"
      }])
      return
    }

    // Check for image and mint prompt
    if (isImageAndMintPrompt(content)) {
      setShowVideoAndMint(content)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "here's your slop master" }
      ])
      return
    }

    // Check for bridge prompt
    if (isBridgePrompt(content)) {
      setShowBridge(true)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "finna bridge" }
      ])
      return
    }

    // Check for crashout prompt
    if (content.toLowerCase().includes("crashout")) {
      setShowChart(true)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "time to crashout" }
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

  return (
    <div className="h-[calc(100vh-16rem)] flex">
      {/* Menu column */}
      <div className="w-1/4 bg-black/50 p-4 space-y-2 border-r border-white/20">
        <div className="space-y-2">
          <button
            onClick={() => handleSubmitWithContent("swap mnt to usdc")}
            className="w-full p-2 text-left text-white hover:bg-white/10 transition-colors"
          >
            swap mnt to usdc
          </button>
          <button
            onClick={() => handleSubmitWithContent("mint me some slop")}
            className="w-full p-2 text-left text-white hover:bg-white/10 transition-colors"
          >
            mint me some slop
          </button>
          <button
            onClick={() => handleSubmitWithContent("bridge meth to solana")}
            className="w-full p-2 text-left text-white hover:bg-white/10 transition-colors"
          >
            bridge meth to solana
          </button>
          <button
            onClick={() => handleSubmitWithContent("crashout")}
            className="w-full p-2 text-left text-white hover:bg-white/10 transition-colors"
          >
            crashout
          </button>
        </div>
      </div>
      
      {/* Chat column */}
      <div className="w-3/4 flex flex-col">
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-4 p-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 break-words whitespace-pre-wrap overflow-hidden ${
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
                  <div className="w-2 h-2 bg-white animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-white animate-bounce" style={{ animationDelay: "100ms" }}></div>
                  <div className="w-2 h-2 bg-white animate-bounce" style={{ animationDelay: "200ms" }}></div>
                </div>
              </motion.div>
            )}
            {currentResponse && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%] p-3 bg-white/10 text-white">
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
                  className="flex justify-start relative"
                >
                  <div className="max-w-[80%] p-3 rounded-lg bg-white/10 text-white relative overflow-hidden">
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 1.2
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/20"
                    >
                      <div className="flex items-center gap-2">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white/90 rounded-full"
                        />
                        <motion.span
                          animate={{
                            opacity: [1, 0.5, 1]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="font-mono text-sm text-white/90"
                        >
                          Inferencing slop...
                        </motion.span>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 1.2
                      }}
                    >
                      <motion.video 
                        initial={{
                          filter: "opacity(0)"
                        }}
                        animate={{
                          filter: [
                            "opacity(0)",
                            "opacity(1) contrast(800%) brightness(150%)",
                            "opacity(1) contrast(800%) brightness(150%)",
                            "opacity(1) contrast(100%) brightness(100%)"
                          ]
                        }}
                        transition={{
                          duration: 2.4,
                          times: [0, 0.2, 0.7, 1],
                          ease: "easeOut"
                        }}
                        src="/output.mp4" 
                        className="max-w-full h-auto rounded transform"
                        style={{
                          WebkitFilter: "url(#noise)",
                          filter: "url(#noise)"
                        }}
                        controls
                        autoPlay
                        loop
                        muted
                      />
                    </motion.div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.3 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[80%]">
                    <StoryProtocolMint content={showVideoAndMint} />
                  </div>
                </motion.div>
                {/* SVG Filter */}
                <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                  <defs>
                    <filter id="noise">
                      <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="4" stitchTiles="stitch" />
                      <feComponentTransfer>
                        <feFuncR type="linear" slope="3" intercept="-1" />
                        <feFuncG type="linear" slope="3" intercept="-1" />
                        <feFuncB type="linear" slope="3" intercept="-1" />
                      </feComponentTransfer>
                      <feComposite operator="in" in2="SourceGraphic" />
                    </filter>
                  </defs>
                </svg>
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
            
            {/* Chart Component */}
            {showChart && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="w-[90%]">
                  <GeckoChart />
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className="p-4 border-t border-white/20 bg-black/50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-black/50 text-white p-2 focus:outline-none focus:border-white/40"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
