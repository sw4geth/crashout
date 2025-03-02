"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import "@/styles/swap.css"

interface Chain {
  name: string
  symbol: string
  logoURI: string
}

const CHAINS: { [key: string]: Chain } = {
  ethereum: {
    name: "Ethereum",
    symbol: "mETH",
    logoURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png"
  },
  solana: {
    name: "Solana",
    symbol: "SOL",
    logoURI: "https://assets.coingecko.com/coins/images/4128/small/solana.png"
  },
  arbitrum: {
    name: "Arbitrum",
    symbol: "ARB",
    logoURI: "https://assets.coingecko.com/coins/images/16547/small/arbitrum.png"
  }
}

interface WormholeBridgeProps {
  fromToken: string
  toChain: string
}

export default function WormholeBridge({ fromToken, toChain }: WormholeBridgeProps) {
  const [amount, setAmount] = useState("0.1")
  const [sourceChain, setSourceChain] = useState(CHAINS.ethereum)
  const [targetChain, setTargetChain] = useState(CHAINS.solana)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleBridge = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setError("")
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
                src={sourceChain.logoURI}
                alt={sourceChain.symbol}
                className="token-icon"
              />
              <span className="token-symbol">{sourceChain.symbol}</span>
            </div>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="swap-input text-xs"
            />

            <div className="swap-arrow">
              ↓
            </div>

            <div className="token-select">
              <img
                src={targetChain.logoURI}
                alt={targetChain.symbol}
                className="token-icon"
              />
              <span className="token-symbol">{targetChain.symbol}</span>
            </div>

            <div className="text-xs text-white/60 px-1">
              Est. Time: ~15min
            </div>

            <button
              className="swap-button text-xs"
              onClick={handleBridge}
              disabled={loading || !amount}
            >
              {loading ? "Bridging..." : "Bridge"}
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 mt-2 text-xs"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}