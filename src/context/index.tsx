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
  themeVariables: {
    '--w3m-background-color': '#000000',
    '--w3m-accent-color': '#FFFFFF',
    '--w3m-border': '1px solid rgba(255, 255, 255, 0.2)',
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
