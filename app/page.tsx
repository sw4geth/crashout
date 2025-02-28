'use client';

import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '../lib/wagmiClient';
import MintNFT from '../components/MintNFT';

// Create a client
const queryClient = new QueryClient();

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-10">
      <div className="container mx-auto px-4">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">NFT Minter</h1>
          <p className="text-slate-300">Create, upload, and mint NFTs on Story Protocol</p>
        </header>

        <QueryClientProvider client={queryClient}>
          <WagmiConfig config={wagmiConfig}>
            <MintNFT />
          </WagmiConfig>
        </QueryClientProvider>
        
        <footer className="mt-20 text-center text-slate-400 text-sm">
          <p>Built with Next.js, Wagmi, and Story Protocol</p>
        </footer>
      </div>
    </div>
  );
}
