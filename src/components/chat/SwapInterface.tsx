// src/components/chat/SwapInterface.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import "@/styles/swap.css";

interface TokenWithLogo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
}

export default function SwapInterface() {
  const [inputAmount, setInputAmount] = useState('1.0');
  const [outputAmount, setOutputAmount] = useState('');
  const [inputToken, setInputToken] = useState<TokenWithLogo | null>(null);
  const [outputToken, setOutputToken] = useState<TokenWithLogo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<TokenWithLogo[]>([]);

  useEffect(() => {
    fetch('https://tokens.uniswap.org')
      .then((res) => res.json())
      .then((data) => {
        const mainnetTokens = data.tokens.filter((token: TokenWithLogo) => token.chainId === 1);
        setTokens(mainnetTokens);
        setInputToken(mainnetTokens.find((t: TokenWithLogo) => t.symbol === 'WETH') || mainnetTokens[0]);
        setOutputToken(mainnetTokens.find((t: TokenWithLogo) => t.symbol === 'USDC') || mainnetTokens[1]);
      })
      .catch((err) => {
        console.error('Failed to fetch token list:', err);
        setError('Failed to load token list');
      });
  }, []);

  const getQuote = async (amount: string, inputTok: TokenWithLogo, outputTok: TokenWithLogo) => {
    if (!amount || Number(amount) <= 0 || !inputTok || !outputTok) {
      setOutputAmount('');
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const rawAmountIn = ethers.utils.parseUnits(amount, inputTok.decimals).toString();
      const response = await fetch(
        `/api/getQuote?amountIn=${rawAmountIn}&inputToken=${inputTok.address}&outputToken=${outputTok.address}&inputDecimals=${inputTok.decimals}&outputDecimals=${outputTok.decimals}`
      );
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
    if (inputToken && outputToken) {
      const debounce = setTimeout(() => {
        getQuote(inputAmount, inputToken, outputToken);
      }, 500);
      return () => clearTimeout(debounce);
    }
  }, [inputAmount, inputToken, outputToken]);

  const switchTokens = () => {
    if (inputToken && outputToken) {
      setInputToken(outputToken);
      setOutputToken(inputToken);
      setInputAmount(outputAmount || '1.0');
      setOutputAmount('');
    }
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
              {inputToken ? (
                <>
                  <img
                    src={inputToken.logoURI || "https://via.placeholder.com/24"}
                    alt={inputToken.symbol}
                    className="token-icon"
                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/24")}
                  />
                  <span className="token-symbol">{inputToken.symbol}</span>
                </>
              ) : (
                <span>Loading...</span>
              )}
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
              {outputToken ? (
                <>
                  <img
                    src={outputToken.logoURI || "https://via.placeholder.com/24"}
                    alt={outputToken.symbol}
                    className="token-icon"
                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/24")}
                  />
                  <span className="token-symbol">{outputToken.symbol}</span>
                </>
              ) : (
                <span>Loading...</span>
              )}
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