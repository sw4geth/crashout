// src/config/index.tsx
import { cookieStorage, createStorage, http } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import { mainnet, arbitrum, avalanche, base, optimism, polygon, solana, solanaTestnet, solanaDevnet, storyAeneid } from '@reown/appkit/networks';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { defineChain } from 'viem';

export const projectId = '6807a1263e9cb3daf10b08baaada08e8';

if (!projectId) throw new Error('Project ID is not defined');

// Use the storyAeneid chain definition from @reown/appkit/networks
export { storyAeneid };

export const networks = [mainnet, arbitrum, avalanche, base, optimism, polygon, storyAeneid, solana, solanaTestnet, solanaDevnet];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks: [mainnet, arbitrum, avalanche, base, optimism, polygon, storyAeneid],
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY || 'sgd3N8JnssdBdF6c9c1BZ-BRMx084YDk'}`),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [avalanche.id]: http('https://api.avax.network/ext/bc/C/rpc'),
    [base.id]: http('https://mainnet.base.org'),
    [optimism.id]: http('https://mainnet.optimism.io'),
    [polygon.id]: http('https://polygon-rpc.com'),
    [storyAeneid.id]: http('https://aeneid.storyrpc.io'),
  },
});

export const solanaAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

export const config = wagmiAdapter.wagmiConfig;