"use client"

import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SupportedLocale, SUPPORTED_LOCALES, SwapWidget as UniswapWidget } from '@uniswap/widgets'
import { FiGlobe } from 'react-icons/fi'
import { Web3Provider } from '@ethersproject/providers'
import Web3Connectors from '@/components/Web3Connectors'
import { useActiveProvider } from '@/connectors'
import { JSON_RPC_URL, TOKEN_LIST, UNI } from '@/constants'

// Don't forget to import the fonts
import '@uniswap/widgets/fonts.css'

interface SwapWidgetProps {
  provider?: Web3Provider
}

export default function SwapWidget({ provider: externalProvider }: SwapWidgetProps) {
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
      className="swap-widget-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="i18n-selector">
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <FiGlobe style={{ marginRight: '4px' }} />
        </label>
        <select onChange={onSelectLocale} className="locale-select">
          {SUPPORTED_LOCALES.map((locale) => (
            <option key={locale} value={locale}>
              {locale}
            </option>
          ))}
        </select>
      </div>

      <div className="widget-wrapper">
        <div className="connectors-container" ref={connectors} tabIndex={-1}>
          <Web3Connectors />
        </div>

        <div className="widget-container">
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
          />
        </div>
      </div>

      <style jsx>{`
        .swap-widget-container {
          width: 100%;
          max-width: 360px;
          margin: 0 auto;
          color: white;
        }
        
        .i18n-selector {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .locale-select {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: white;
          padding: 4px 8px;
          font-size: 0.8rem;
        }
        
        .widget-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
          border: 1px solid rgba(128, 90, 213, 0.3);
          padding: 16px;
          background: rgba(0, 0, 0, 0.5);
        }
        
        .connectors-container {
          outline: none;
        }
        
        .widget-container {
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  )
}