// src/components/chat/SwapInterface.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import "@/styles/swap.css";

interface TokenWithLogo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

const WETH: TokenWithLogo = {
  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  symbol: 'WETH',
  name: 'Wrapped Ether',
  decimals: 18,
  logoURI: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
};

const USDC: TokenWithLogo = {
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  logoURI: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};

const TOKEN_LIST: TokenWithLogo[] = [WETH, USDC];

export default function SwapInterface() {
  const [inputAmount, setInputAmount] = useState('1.0');
  const [outputAmount, setOutputAmount] = useState('');
  const [inputToken, setInputToken] = useState<TokenWithLogo>(WETH);
  const [outputToken, setOutputToken] = useState<TokenWithLogo>(USDC);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuote = async (amount: string) => {
    if (!amount || Number(amount) <= 0) {
      setOutputAmount('');
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/getQuote?amountIn=${amount}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setOutputAmount(data.amountOut);
    } catch (err) {
      console.error('Fetch error:', err);
      setOutputAmount('');
      setError(err.message || 'Failed to fetch quote');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      getQuote(inputAmount);
    }, 500);
    return () => clearTimeout(debounce);
  }, [inputAmount]);

  const switchTokens = () => {
    setInputToken(outputToken);
    setOutputToken(inputToken);
    setInputAmount(outputAmount || '1.0');
    setOutputAmount('');
    getQuote(outputAmount || '1.0'); // Fetch new quote after switching
  };

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
              min="0"
              step="0.01"
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
              type="text"
              value={loading ? 'Loading...' : outputAmount}
              readOnly
              placeholder="0.0"
              className="swap-input text-xs"
            />

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
  );
}