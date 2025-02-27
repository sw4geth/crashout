"use client"

import dynamic from 'next/dynamic'
import { ethers } from 'ethers'
import { JSON_RPC_URL } from '@/constants'

// Use dynamic import to avoid SSR issues with the SwapWidget
const SwapWidget = dynamic(() => import('@/components/swap/SwapWidget'), {
  ssr: false,
  loading: () => <div className="text-white text-center p-8">Loading swap widget...</div>
})

export default function SwapPage() {
  // Initialize a provider for testing
  const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL)

  return (
    <div className="min-h-screen w-screen bg-black text-white py-16 px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Uniswap Widget (Standalone)</h1>
        <p className="text-white/70 mb-8">This page renders the Uniswap widget independently for testing.</p>
        
        <div className="mx-auto">
          <SwapWidget provider={provider as any} />
        </div>
      </div>
    </div>
  )
}