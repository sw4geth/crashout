"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import "@/styles/swap.css"

interface TokenWithLogo {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

const MNT: TokenWithLogo = {
  address: "0x3c3a81e81dc234f0e90b51817c3caf01e13c6d91",
  symbol: "MNT",
  name: "Mantle",
  decimals: 18,
  logoURI: "https://assets.coingecko.com/coins/images/30983/small/mETH.png",
}

const USDC: TokenWithLogo = {
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  symbol: "USDC",
  name: "USD Coin",
  decimals: 6,
  logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
}

export default function DummyUniswapSwap() {
  const [inputAmount, setInputAmount] = useState("1.0")
  const [outputAmount, setOutputAmount] = useState("1,812.47")
  const [inputToken, setInputToken] = useState<TokenWithLogo>(MNT)
  const [outputToken, setOutputToken] = useState<TokenWithLogo>(USDC)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSwap = async () => {
    if (!inputAmount) return
    setLoading(true)
    setError("")
    // Simulate swap
    setTimeout(() => {
      setOutputAmount((parseFloat(inputAmount) * 1.5).toFixed(2)) // Dummy conversion rate
      setLoading(false)
      alert(`Swapped ${inputAmount} ${inputToken.symbol} to ${outputAmount} ${outputToken.symbol}`)
    }, 1000)
  }

  const switchTokens = () => {
    setInputToken(outputToken)
    setOutputToken(inputToken)
    setInputAmount(outputAmount)
    setOutputAmount(inputAmount)
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
            <div className="token-select" onClick={() => console.log("Select input token")}>
              <img
                src={inputToken.logoURI || "https://via.placeholder.com/24"}
                alt={inputToken.symbol}
                className="token-icon"
                onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/24")}
              />
              <span className="token-symbol">{inputToken.symbol}</span>
            </div>

            <input
              type="number"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              placeholder="0.0"
              className="swap-input text-xs"
            />

            <div className="swap-arrow" onClick={switchTokens}>
              ↓
            </div>

            <div className="token-select" onClick={() => console.log("Select output token")}>
              <img
                src={outputToken.logoURI || "https://via.placeholder.com/24"}
                alt={outputToken.symbol}
                className="token-icon"
                onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/24")}
              />
              <span className="token-symbol">{outputToken.symbol}</span>
            </div>

            <input
              type="number"
              value={outputAmount}
              readOnly
              placeholder="0.0"
              className="swap-input text-xs"
            />

            <button
              className="swap-button"
              onClick={handleSwap}
              disabled={loading || !inputAmount}
            >
              {loading ? "Loading..." : "Swap"}
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 mt-2"
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