import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { mainnet, arbitrum, avalanche, base, optimism, polygon, solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'

// Get projectId from https://cloud.reown.com
export const projectId = '6807a1263e9cb3daf10b08baaada08e8'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [mainnet, arbitrum, avalanche, base, optimism, polygon, solana, solanaTestnet, solanaDevnet]

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks: [mainnet, arbitrum, avalanche, base, optimism, polygon], // EVM only
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY || 'sgd3N8JnssdBdF6c9c1BZ-BRMx084YDk'}`),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [avalanche.id]: http('https://api.avax.network/ext/bc/C/rpc'),
    [base.id]: http('https://mainnet.base.org'),
    [optimism.id]: http('https://mainnet.optimism.io'),
    [polygon.id]: http('https://polygon-rpc.com'),
  },
})

// Set up the Solana Adapter
export const solanaAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
})

export const config = wagmiAdapter.wagmiConfig
