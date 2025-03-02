"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface StoryProtocolMintProps {
  content: string
}

export default function StoryProtocolMint({ content }: StoryProtocolMintProps) {
  const handleMint = () => {
    alert(`Simulating minting and registering IP for: "${content}" on Story Protocol`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-black border border-white/20 p-4"
    >
      <div className="flex justify-between items-center">
        <button
          onClick={handleMint}
          className="px-4 py-2 bg-white text-black font-bold hover:bg-white/90"
        >
          MINT IP
        </button>
        <span className="text-white/60 font-mono">AI SLOP #420</span>
      </div>
    </motion.div>
  )
}