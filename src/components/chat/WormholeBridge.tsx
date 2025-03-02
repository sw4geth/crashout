"use client"

import { motion } from "framer-motion"

interface WormholeBridgeProps {
  fromToken: string
  toChain: string
}

export default function WormholeBridge({ fromToken, toChain }: WormholeBridgeProps) {
  const handleBridge = () => {
    alert(`Simulating bridging ${fromToken} to ${toChain} via Wormhole Token Bridge`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white/10 rounded-lg border border-white/20 text-white"
    >
      <h3 className="mb-2 font-bold">Wormhole Token Bridge</h3>
      <p className="mb-4 text-sm">Bridge {fromToken} to {toChain}</p>
      <button
        onClick={handleBridge}
        className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition-colors"
      >
        BRIDGE TOKENS
      </button>
    </motion.div>
  )
}