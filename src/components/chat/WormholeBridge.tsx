"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import "@/styles/swap.css"

interface WormholeBridgeProps {
  fromToken?: string
  toChain?: string
}

const chains = {
  ethereum: {
    name: "Ethereum",
    symbol: "mETH",
    logoURI: "/images/meth.jpg"
  },
  solana: {
    name: "Solana",
    symbol: "SOL",
    logoURI: "https://assets.coingecko.com/coins/images/4128/small/solana.png"
  }
}

export default function WormholeBridge({ fromToken = "mETH", toChain = "Solana" }: WormholeBridgeProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleBridge = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert("Bridge transaction simulated!")
    }, 2000)
  }

  return (
    <div className="relative w-[240px] h-[400px]">
      <video
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/Subway Surfers.mp4" type="video/mp4" />
      </video>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[160px] p-2 bg-black border border-white/20">
        <div className="swap-container">
          <motion.div
            className="swap-container text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="token-select">
              <img
                src="/images/meth.jpg"
                alt="mETH"
                className="token-icon"
              />
              <span className="token-symbol">{fromToken}</span>
            </div>

            <input
              type="number"
              placeholder="0.0"
              className="swap-input text-xs"
            />

            <div className="swap-arrow">
              ↓
            </div>

            <div className="token-select">
              <img
                src={chains.solana.logoURI}
                alt={chains.solana.symbol}
                className="token-icon"
              />
              <span className="token-symbol">{chains.solana.symbol}</span>
            </div>

            <div className="text-xs text-white/60 px-1">
              Est. Time: ~15min
            </div>

            <button
              className="swap-button text-xs"
              onClick={handleBridge}
              disabled={isLoading}
            >
              {isLoading ? "Bridging..." : "Bridge"}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}