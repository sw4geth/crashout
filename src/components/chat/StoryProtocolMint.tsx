"use client"

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
      className="p-4 bg-white/10 rounded-lg border border-white/20 text-white"
    >
      <h3 className="mb-2 font-bold">Mint & Register IP on Story Protocol</h3>
      <p className="mb-4 text-sm">Content: "{content}"</p>
      <button
        onClick={handleMint}
        className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition-colors"
      >
        MINT IP
      </button>
    </motion.div>
  )
}