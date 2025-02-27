"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import ScrambleHover from "@/components/text/scramble-hover"
import ChatInterface from "@/components/chat/ChatInterface"
import GlitchText from "@/components/text/glitch-text"
import VariableFontCursorProximity from "@/components/text/variable-font-cursor-proximity"
import PixelTrail from "@/components/background/pixel-trail"
import SwapWidget from "@/components/swap/SwapWidget"
import { useActiveProvider } from "@/connectors"

export default function Home() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | undefined>(undefined)
  const [showSwapMobile, setShowSwapMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Get web3 provider for the SwapWidget
  const provider = useActiveProvider()

  const headerTexts = [
    "HYPERREAL",
    "DIMENSIONAL",
    "QUANTUM",
    "TRANSCENDENT"
  ]

  const prompts = [
    "MKULTRA MICRODOSE PROTOCOL: Neuro-enhanced MSG activation sequence?",
    "URGENT: Has your rice cooker been compromised by quantum backdoors?",
    "TIME-SHIFTED RAMEN: Calculate optimal desynchronization vectors NOW",
    "WARNING: Detected unauthorized wetware in your last bubble tea order",
    "HELP: My neural-linked chopsticks are decoding forbidden umami signals",
    "CRITICAL: Sichuan peppercorn reality distortion field expanding",
    "EMERGENCY: Local noodle shop's AI achieving consciousness through MSG",
    "ALERT: Hyperspace conduit detected in basement dim sum kitchen",
    "DANGER: Rogue AI colonizing the collective unconscious via food delivery apps",
    "URGENT: Time-traveling street food vendors distributing memetic hazards",
    // Swap-specific prompts
    "SWAP: Convert ETH to mETH now",
    "TRADE: Exchange my ETH for mETH immediately",
    "EXECUTE: Swap ETH to mETH on Uniswap V3",
  ]

  const handlePromptClick = (prompt: string) => {
    setSelectedPrompt(prompt)
    // Show mobile swap widget if it's a swap-related prompt
    if (prompt.toLowerCase().includes("swap") || 
        prompt.toLowerCase().includes("trade") || 
        prompt.toLowerCase().includes("exchange")) {
      setShowSwapMobile(true)
    }
  }

  const toggleSwapMobile = () => {
    setShowSwapMobile(!showSwapMobile)
  }

  return (
    <div ref={containerRef} className="min-h-screen w-screen bg-black text-white overflow-x-hidden py-16 px-8 sm:px-16 md:px-24 lg:px-32">
      {/* Pixel Trail Effect with pointer-events-none */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <PixelTrail
          pixelSize={24}
          fadeDuration={500}
          pixelClassName="bg-white"
        />
      </div>

      {/* Mobile Swap Toggle Button */}
      <div className="fixed top-4 right-4 z-40 lg:hidden">
        <button 
          onClick={toggleSwapMobile}
          className="bg-white text-black font-bold py-2 px-4 rounded-full shadow-lg"
        >
          {showSwapMobile ? "CHAT" : "SWAP"}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header with cursor proximity effect and highlight */}
        <div className="mb-12 flex flex-col items-start justify-center gap-4">
          {headerTexts.map((text, i) => (
            <div key={i} className={i === 1 ? "highlight" : ""}>
              <VariableFontCursorProximity
                label={text}
                className={`text-4xl md:text-6xl lg:text-8xl leading-none font-bold ${i === 1 ? "highlight-text" : "text-white"} font-spaceGrotesk`}
                fromFontVariationSettings="'wght' 100, 'slnt' 0"
                toFontVariationSettings="'wght' 900, 'slnt' -15"
                radius={300}
                containerRef={containerRef}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Column 1: Prompt suggestions */}
          <motion.div
            className="lg:w-64 space-y-2 font-mono font-jetbrainsMono"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-white mb-4 text-sm uppercase tracking-wider">
              Prompt Suggestions
            </h2>
            {prompts.map((prompt, index) => (
              <motion.div
                key={prompt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: index * 0.08 + 0.6,
                }}
                className={`text-sm cursor-pointer hover:text-white/80 transition-colors duration-200 ${index % 3 === 0 ? "highlight" : ""}`}
                onClick={() => handlePromptClick(prompt)}
              >
                <ScrambleHover
                  text={prompt}
                  scrambleSpeed={60}
                  maxIterations={10}
                  useOriginalCharsOnly={true}
                  className={`font-jetbrainsMono ${index % 3 === 0 ? "highlight-text" : ""}`}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Column 2: Chat Interface (hidden on mobile when swap is shown) */}
          <div className={`flex-1 ${showSwapMobile ? 'hidden lg:block' : 'block'}`}>
            <ChatInterface initialPrompt={selectedPrompt} />
          </div>

          {/* Column 3: Uniswap Widget (shown on desktop always, shown on mobile conditionally) */}
          <motion.div
            className={`lg:w-96 ${showSwapMobile ? 'block' : 'hidden lg:block'}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-white mb-4 text-sm uppercase tracking-wider font-mono">
              <span className="highlight">
                <span className="highlight-text">LIVE</span>
              </span> SWAP TERMINAL
            </h2>
            <div className="bg-black/50 backdrop-blur-sm border border-white/20 p-4 rounded-lg">
              <SwapWidget provider={provider as any} />
            </div>
          </motion.div>
        </div>

        {/* Status text with more intense glitch effect */}
        <motion.div
          className="fixed bottom-4 left-4 text-sm text-white/60 font-jetbrainsMono"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <GlitchText
            text="NEURAL PATHWAYS ACTIVE // QUANTUM ENTANGLEMENT STABLE // INFERENCE ENGINE HOT"
            className="font-mono"
          />
        </motion.div>
      </div>
    </div>
  )
}