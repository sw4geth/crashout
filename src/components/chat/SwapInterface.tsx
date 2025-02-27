"use client"

import { useState } from 'react'
import { ethers } from 'ethers'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

// Dynamic import of the SwapWidget component
const DynamicSwapWidget = dynamic(
  () => import('@/components/swap/SwapWidget'),
  { ssr: false }
)

interface SwapInterfaceProps {
  provider: ethers.providers.JsonRpcProvider
}

export default function SwapInterface({ provider }: SwapInterfaceProps) {
  const [showRawUniswap, setShowRawUniswap] = useState(false)

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Swap Interface</h2>
        <button
          onClick={() => setShowRawUniswap(!showRawUniswap)}
          className="px-3 py-1 rounded-md bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
        >
          {showRawUniswap ? "Show Simple Swap" : "Show Uniswap Widget"}
        </button>
      </div>

      {showRawUniswap ? (
        <DynamicSwapWidget provider={provider as any} />
      ) : (
        <div className="w-full max-w-lg mx-auto">
          <div className="p-4 bg-black/50 border border-white/20 rounded-lg text-white">
            <h2 className="text-xl font-bold mb-4">Quick Swap</h2>
            
            <div className="mb-4">
              <label className="block mb-2">ETH</label>
              <input
                type="text"
                defaultValue="1"
                className="w-full p-2 bg-black/70 border border-white/30 rounded text-white"
              />
            </div>
            
            <div className="text-center my-2">↓</div>
            
            <div className="mb-4">
              <label className="block mb-2">mETH</label>
              <input
                type="text"
                value="38.25"
                readOnly
                className="w-full p-2 bg-black/70 border border-white/30 rounded text-white"
              />
            </div>
            
            <button 
              className="w-full p-2 bg-white hover:bg-white/90 transition rounded text-black font-bold"
              onClick={() => setShowRawUniswap(true)}
            >
              Advanced Swap
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}