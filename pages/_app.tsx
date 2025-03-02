// pages/_app.tsx
import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from 'wagmi/providers/infura'
// Polyfill Buffer for the browser
import { Buffer } from 'buffer'

// Make Buffer available globally
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer
}

// Configure chains & providers
const { chains, publicClient } = configureChains(
  [mainnet, sepolia],
  [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_KEY || 'YOUR_INFURA_KEY' }),
    publicProvider()
  ]
)

// Set up RainbowKit
const { connectors } = getDefaultWallets({
  appName: 'Wormhole Token Bridge',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains
})

// Set up Wagmi
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}