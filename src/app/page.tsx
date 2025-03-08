"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import ScrambleHover from "@/components/text/scramble-hover"
import ChatInterface from "@/components/chat/ChatInterface"
import GlitchText from "@/components/text/glitch-text"
import VariableFontCursorProximity from "@/components/text/variable-font-cursor-proximity"
import PixelTrail from "@/components/background/pixel-trail"
import HeroSection from "@/components/HeroSection"
import { modal } from "@/context"
import { useAccount, useBalance } from "wagmi"
import { formatEther } from "viem"

export default function Home() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const mainUIRef = useRef<HTMLDivElement>(null)
  
  const { address, isConnected } = useAccount()
  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address: address as `0x${string}`,
    chainId: 1, // Mainnet
  })

  const headerTexts = [
    "HYPERREAL",
    "CRASHOUT",
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
    // Feature-specific prompts
    "SWAP: swap mnt to usdc now",
    "GENERATE: generate and mint image for my cyberpunk noodle shop",
    "BRIDGE: bridge meth to solana network",
  ]

  const handlePromptClick = (prompt: string) => {
    setSelectedPrompt(prompt)
  }

  const scrollToMainUI = () => {
    mainUIRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <HeroSection onScrollToMainUI={scrollToMainUI} />
      
      <div ref={mainUIRef} className="relative z-10 min-h-screen w-screen bg-black text-white overflow-x-hidden py-16 px-8 sm:px-16 md:px-24 lg:px-32">
        {/* Pixel Trail Effect with pointer-events-none */}
        <div className="fixed inset-0 pointer-events-none z-50">
          <PixelTrail
            pixelSize={24}
            fadeDuration={500}
            pixelClassName="bg-white"
          />
        </div>

        {/* Content */}
        <div ref={containerRef} className="relative z-10">
          {/* Header with cursor proximity effect and highlight */}
          <div className="mb-12 flex flex-col items-start justify-center gap-4">
            {headerTexts.map((text, i) => (
              <div key={i} className={i === 1 ? "highlight" : ""}>
                <VariableFontCursorProximity
                  label={text}
                  className={`text-6xl md:text-7xl lg:text-9xl leading-none font-bold ${i === 1 ? "highlight-text" : "text-white"} font-spaceGrotesk`}
                  fromFontVariationSettings="'wght' 100, 'slnt' 0"
                  toFontVariationSettings="'wght' 900, 'slnt' -15"
                  radius={400}
                  containerRef={containerRef}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Prompt suggestions */}
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

            {/* Chat Interface */}
            <div className="flex-1">
              <ChatInterface initialPrompt={selectedPrompt} />
              {/* Wallet Connect Button and Balance */}
              <div className="mt-8">
                <button 
                  onClick={() => modal.open()}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-sm transition-colors duration-200"
                >
                  {isConnected ? 'Connected' : 'Connect Wallet'}
                </button>
                {isConnected && balanceData && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white text-xs mt-2 font-mono"
                  >
                    Balance: {balanceLoading ? 'Loading...' : `${formatEther(balanceData.value)} ETH`}
                  </motion.div>
                )}
              </div>
            </div>
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
    </main>
  )
}
