// src/components/chat/SwapInterface.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
  const [isInputTokenMenuOpen, setIsInputTokenMenuOpen] = useState(false);
  const [isOutputTokenMenuOpen, setIsOutputTokenMenuOpen] = useState(false);
  const [inputSearch, setInputSearch] = useState('');
  const [outputSearch, setOutputSearch] = useState('');

  // Fetch Uniswap token list
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

  // Filter tokens based on search input
  const filteredInputTokens = useMemo(() => {
    return tokens.filter((token) =>
      token.symbol.toLowerCase().includes(inputSearch.toLowerCase()) ||
      token.name.toLowerCase().includes(inputSearch.toLowerCase())
    );
  }, [tokens, inputSearch]);

  const filteredOutputTokens = useMemo(() => {
    return tokens.filter((token) =>
      token.symbol.toLowerCase().includes(outputSearch.toLowerCase()) ||
      token.name.toLowerCase().includes(outputSearch.toLowerCase())
    );
  }, [tokens, outputSearch]);

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

  const selectInputToken = (token: TokenWithLogo) => {
    setInputToken(token);
    setIsInputTokenMenuOpen(false);
    setInputSearch('');
  };

  const selectOutputToken = (token: TokenWithLogo) => {
    setOutputToken(token);
    setIsOutputTokenMenuOpen(false);
    setOutputSearch('');
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
            {/* Input Token Selector */}
            <div className="token-select" onClick={() => setIsInputTokenMenuOpen(true)}>
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
            {isInputTokenMenuOpen && (
              <motion.div
                className="token-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'absolute',
                  zIndex: 10,
                  background: '#111',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  width: '100%',
                }}
              >
                <input
                  type="text"
                  value={inputSearch}
                  onChange={(e) => setInputSearch(e.target.value)}
                  placeholder="Search tokens..."
                  className="swap-input text-xs"
                  style={{ margin: '0.25rem', width: 'calc(100% - 0.5rem)' }}
                />
                {filteredInputTokens.map((token) => (
                  <div
                    key={token.address}
                    className="token-option"
                    onClick={() => selectInputToken(token)}
                  >
                    <img
                      src={token.logoURI || "https://via.placeholder.com/24"}
                      alt={token.symbol}
                      className="token-icon"
                      onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/24")}
                    />
                    <span className="token-symbol">{token.symbol}</span> - {token.name}
                  </div>
                ))}
              </motion.div>
            )}

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

            {/* Output Token Selector */}
            <div className="token-select" onClick={() => setIsOutputTokenMenuOpen(true)}>
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
            {isOutputTokenMenuOpen && (
              <motion.div
                className="token-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'absolute',
                  zIndex: 10,
                  background: '#111',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  width: '100%',
                }}
              >
                <input
                  type="text"
                  value={outputSearch}
                  onChange={(e) => setOutputSearch(e.target.value)}
                  placeholder="Search tokens..."
                  className="swap-input text-xs"
                  style={{ margin: '0.25rem', width: 'calc(100% - 0.5rem)' }}
                />
                {filteredOutputTokens.map((token) => (
                  <div
                    key={token.address}
                    className="token-option"
                    onClick={() => selectOutputToken(token)}
                  >
                    <img
                      src={token.logoURI || "https://via.placeholder.com/24"}
                      alt={token.symbol}
                      className="token-icon"
                      onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/24")}
                    />
                    <span className="token-symbol">{token.symbol}</span> - {token.name}
                  </div>
                ))}
              </motion.div>
            )}

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