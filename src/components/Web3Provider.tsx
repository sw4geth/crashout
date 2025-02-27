'use client'

import dynamic from 'next/dynamic'
import { connectors } from '../connectors'

// Import the Web3ReactProvider dynamically to avoid SSR issues
const Web3ReactProvider = dynamic(
  () => import('@web3-react/core').then(mod => mod.Web3ReactProvider),
  { ssr: false }
)

interface Web3ProviderProps {
  children: React.ReactNode
}

export default function Web3Provider({ children }: Web3ProviderProps) {
  // Conditionally render the provider only in client-side
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  return (
    <Web3ReactProvider connectors={connectors}>
      {children}
    </Web3ReactProvider>
  )
}