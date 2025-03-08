'use client'

import { wagmiAdapter, solanaAdapter, projectId, networks } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react' 
import { mainnet } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'Crashout',
  description: 'Brutalist Web3 AI Terminal',
  url: 'https://crashout.xyz', // origin must match your domain & subdomain
  icons: ['/crash.svg']
}

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter, solanaAdapter],
  projectId,
  networks: networks,
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
  themeMode: 'dark', // Force dark mode
  themeVariables: {
    '--w3m-accent-color': '#000000', // Black accent
    '--w3m-accent-fill-color': '#000000', // Black fill
    '--w3m-background-color': '#000000', // Black background
    '--w3m-button-background-color': '#000000', // Black button bg
    '--w3m-button-text-color': '#FFFFFF', // White text
    '--w3m-button-border-color': 'rgba(255, 255, 255, 0.2)', // Brutalist border
    '--w3m-border-radius-master': '0px', // Square
    '--w3m-button-border-radius': '0px', // Extra override for button corners
    '--w3m-container-border-radius': '0px', // Container corners
    '--w3m-wallet-icon-border-radius': '0px', // Wallet icons
    '--w3m-font-family': 'JetBrains Mono, monospace',
    '--w3m-button-hover-background-color': 'rgba(255, 255, 255, 0.1)', // Hover effect
    '--w3m-border': '1px solid rgba(255, 255, 255, 0.2)', // Brutalist border
    '--w3m-color-primary': '#000000', // Primary color
    '--w3m-color-bg-1': '#000000', // Background color 1
    '--w3m-color-bg-2': '#000000', // Background color 2
    '--w3m-color-fg-1': '#FFFFFF', // Foreground color 1
    '--w3m-color-fg-2': '#FFFFFF', // Foreground color 2
    '--w3m-color-fg-3': '#FFFFFF', // Foreground color 3
    '--w3m-color-mix': '#000000', // Mix color (often used for gradients)
    '--w3m-color-mix-strength': '0', // No color mix
    '--w3m-overlay-background-color': '#000000', // Overlay background
    '--w3m-overlay-text-color': '#FFFFFF', // Overlay text
    '--w3m-secondary-button-background-color': '#000000', // Secondary button bg
    '--w3m-secondary-button-text-color': '#FFFFFF', // Secondary button text
    '--w3m-accent-text-color': '#FFFFFF', // Accent text color
    '--w3m-text-big-bold-size': '16px', // Text size
    '--w3m-text-big-bold-weight': '700', // Text weight
    '--w3m-text-big-bold-line-height': '24px', // Text line height
    '--w3m-text-medium-regular-size': '14px',
    '--w3m-text-medium-regular-weight': '400',
    '--w3m-text-medium-regular-line-height': '20px',
    '--w3m-text-small-regular-size': '12px',
    '--w3m-text-small-regular-weight': '400',
    '--w3m-text-small-regular-line-height': '16px',
    '--w3m-text-small-thin-size': '12px',
    '--w3m-text-small-thin-weight': '300',
    '--w3m-text-small-thin-line-height': '16px',
    '--w3m-text-xsmall-bold-size': '10px',
    '--w3m-text-xsmall-bold-weight': '700',
    '--w3m-text-xsmall-bold-line-height': '12px',
    '--w3m-text-xsmall-regular-size': '10px',
    '--w3m-text-xsmall-regular-weight': '400',
    '--w3m-text-xsmall-regular-line-height': '12px'
  }
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider
