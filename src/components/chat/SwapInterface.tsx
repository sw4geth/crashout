"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Token, CurrencyAmount, TradeType, Percent } from '@uniswap/sdk-core'
import { Pool, Route, SwapQuoter, SwapRouter } from '@uniswap/v3-sdk'
import { ethers } from 'ethers'
import '@/styles/swap.css'

interface TokenWithLogo extends Token {
  logoURI?: string
}

// Token definitions with logos
const WETH: TokenWithLogo = Object.assign(
  new Token(
    1,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  {
    logoURI: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
  }
)

const METH: TokenWithLogo = Object.assign(
  new Token(
    1,
    '0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa',
    18,
    'mETH',
    'Mantle ETH'
  ),
  {
    logoURI: 'https://assets.coingecko.com/coins/images/30983/small/mETH.png'
  }
)

const FBTC: TokenWithLogo = Object.assign(
  new Token(
    1,
    '0xc96de26018a54d51c097160568752c4e3bd6c364',
    18,
    'fBTC',
    'Futures Bitcoin'
  ),
  {
    logoURI: 'https://assets.coingecko.com/coins/images/30984/small/fBTC.png'
  }
)

interface SwapInterfaceProps {
  provider: ethers.providers.JsonRpcProvider
}

export default function SwapInterface({ provider }: SwapInterfaceProps) {
  const [inputAmount, setInputAmount] = useState('')
  const [outputAmount, setOutputAmount] = useState('')
  const [inputToken, setInputToken] = useState<TokenWithLogo>(WETH)
  const [outputToken, setOutputToken] = useState<TokenWithLogo>(METH)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSwap = async () => {
    if (!inputAmount || !provider) return
    
    setLoading(true)
    setError('')
    
    try {
      // Implementation coming in next step
      console.log('Swap initiated')
    } catch (err) {
      setError('Failed to execute swap')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const switchTokens = () => {
    setInputToken(outputToken)
    setOutputToken(inputToken)
    setInputAmount(outputAmount)
    setOutputAmount(inputAmount)
  }

  return (
    <motion.div
      className="swap-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="token-select" onClick={() => console.log('Select input token')}>
        <img 
          src={inputToken.logoURI || 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'} 
          alt={inputToken.symbol} 
          className="token-icon"
          onError={(e) => {
            e.currentTarget.src = 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
          }}
        />
        <span className="token-symbol">{inputToken.symbol}</span>
      </div>
      
      <input
        type="number"
        value={inputAmount}
        onChange={(e) => setInputAmount(e.target.value)}
        placeholder="0.0"
        className="swap-input"
      />

      <div className="swap-arrow" onClick={switchTokens}>
        ↓
      </div>

      <div className="token-select" onClick={() => console.log('Select output token')}>
        <img 
          src={outputToken.logoURI || 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'} 
          alt={outputToken.symbol} 
          className="token-icon"
          onError={(e) => {
            e.currentTarget.src = 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
          }}
        />
        <span className="token-symbol">{outputToken.symbol}</span>
      </div>

      <input
        type="number"
        value={outputAmount}
        readOnly
        placeholder="0.0"
        className="swap-input"
      />

      <button
        className="swap-button"
        onClick={handleSwap}
        disabled={loading || !inputAmount}
      >
        {loading ? 'Loading...' : 'Swap'}
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
  )
}
