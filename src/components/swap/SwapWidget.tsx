"use client"

import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SupportedLocale, SUPPORTED_LOCALES, SwapWidget as UniswapWidget } from '@uniswap/widgets'
import { FiGlobe } from 'react-icons/fi'
import { Web3Provider } from '@ethersproject/providers'
import Web3Connectors from '@/components/Web3Connectors'
import { useActiveProvider } from '@/connectors'
import { JSON_RPC_URL } from '@/constants'

// Don't forget to import the fonts
import '@uniswap/widgets/fonts.css'

const TOKEN_LIST = 'https://tokens.uniswap.org'
const UNI = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'

interface SwapWidgetProps {
  provider?: Web3Provider
  compact?: boolean
}

export default function SwapWidget({ provider: externalProvider, compact = true }: SwapWidgetProps) {
  // Create a reference to the connectors div that the wallet connect button will focus
  const connectors = useRef<HTMLDivElement>(null)
  const focusConnectors = useCallback(() => connectors.current?.focus(), [])

  // Get the provider from web3-react or use the external provider
  const web3ReactProvider = useActiveProvider()
  const provider = externalProvider || web3ReactProvider

  // Configure the locale for the widget
  const [locale, setLocale] = useState<SupportedLocale>('en-US')
  const onSelectLocale = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value as SupportedLocale)
  }, [])

  return (
    <motion.div
      className="w-full mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-end items-center mb-2">
        <label className="flex items-center text-white mr-2 text-xs">
          <FiGlobe className="mr-1" />
        </label>
        <select 
          onChange={onSelectLocale} 
          className="bg-black/50 text-white border border-white/20 rounded-md p-1 text-xs"
        >
          {SUPPORTED_LOCALES.map((locale) => (
            <option key={locale} value={locale}>
              {locale}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3">
        <div className="outline-none" ref={connectors} tabIndex={-1}>
          <Web3Connectors />
        </div>

        <div className="overflow-hidden bg-black/70 backdrop-blur-sm border border-white/20 p-2 rounded-lg">
          <UniswapWidget
            jsonRpcEndpoint={JSON_RPC_URL}
            tokenList={TOKEN_LIST}
            provider={provider}
            locale={locale}
            onConnectWallet={focusConnectors}
            defaultInputTokenAddress="NATIVE"
            defaultInputAmount="1"
            defaultOutputTokenAddress={UNI}
            width="100%"
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
      </div>
    </motion.div>
  )
}