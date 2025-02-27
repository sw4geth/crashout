"use client"

import { useState, useRef, useCallback } from "react"
import { FiGlobe } from "react-icons/fi"
import { SupportedLocale, SUPPORTED_LOCALES, SwapWidget } from "@uniswap/widgets"
import { motion } from "framer-motion"
import { useActiveProvider } from "@/connectors"
import Web3Connectors from "@/components/Web3Connectors"
import GlitchText from "@/components/text/glitch-text"
import PixelTrail from "@/components/background/pixel-trail"

// Import Uniswap widget fonts
import "@uniswap/widgets/fonts.css"
import "@/styles/uniswap-fonts.css"

import { JSON_RPC_URL } from "@/constants"

const TOKEN_LIST = "https://tokens.uniswap.org"
const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"

export default function SwapPage() {
  // When a user clicks "Connect your wallet" in the SwapWidget, this callback focuses the connectors
  const connectors = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const focusConnectors = useCallback(() => connectors.current?.focus(), [])

  // The provider to pass to the SwapWidget
  const provider = useActiveProvider()

  // The locale to pass to the SwapWidget
  const [locale, setLocale] = useState<SupportedLocale>("en-US")
  const onSelectLocale = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setLocale(e.target.value as SupportedLocale), [])

  return (
    <div ref={containerRef} className="min-h-screen w-screen bg-black text-white overflow-x-hidden py-16 px-8 sm:px-16 md:px-24 lg:px-32">
      {/* Pixel Trail Effect with pointer-events-none */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <PixelTrail
          pixelSize={24}
          fadeDuration={500}
          pixelClassName="bg-white"
        />
      </div>

      <div className="flex justify-end items-center mb-4">
        <label className="flex items-center text-white mr-2">
          <FiGlobe className="mr-2" />
        </label>
        <select 
          onChange={onSelectLocale}
          className="bg-black/50 text-white border border-white/20 rounded-md p-1"
        >
          {SUPPORTED_LOCALES.map((locale) => (
            <option key={locale} value={locale}>
              {locale}
            </option>
          ))}
        </select>
      </div>

      <div className="relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4">
            <span className="highlight">
              <span className="highlight-text">SWAP</span>
            </span> INTERFACE
          </h1>
          <p className="text-lg text-white/70 mb-8 font-mono">Powered by Uniswap Protocol</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
          <motion.div
            className="lg:w-64 space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-white mb-4 text-sm uppercase tracking-wider font-mono">
              Connect Wallet
            </h2>
            <div className="bg-black/50 backdrop-blur-sm border border-white/20 p-4 rounded-lg" ref={connectors} tabIndex={-1}>
              <Web3Connectors />
            </div>
          </motion.div>

          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-black/50 backdrop-blur-sm border border-white/20 p-4 rounded-lg overflow-hidden">
              <SwapWidget
                jsonRpcEndpoint={JSON_RPC_URL}
                tokenList={TOKEN_LIST}
                provider={provider}
                locale={locale}
                onConnectWallet={focusConnectors}
                defaultInputTokenAddress="NATIVE"
                defaultInputAmount="1"
                defaultOutputTokenAddress={UNI}
                className="swap-widget"
                theme={{
                  primary: '#ffffff',
                  secondary: '#ffffff',
                  interactive: '#383838',
                  container: '#000000',
                  module: '#0a0a0a',
                  accent: '#ffffff',
                  outline: '#303030',
                  dialog: '#000000',
                  fontFamily: 'IBM Plex Mono',
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Status text with glitch effect */}
        <motion.div
          className="fixed bottom-4 left-4 text-sm text-white/60 font-mono"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <GlitchText
            text="TRADING ACTIVE // LIQUIDITY PROTOCOLS ENGAGED // CONSENSUS ESTABLISHED"
            className="font-mono"
          />
        </motion.div>
      </div>
    </div>
  )
}