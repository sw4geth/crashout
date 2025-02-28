import { createConfig } from 'wagmi';
import { http } from 'viem';
import { injected } from '@wagmi/connectors';

// Define Aeneid testnet
const aeneidChain = {
  id: 1315,
  name: 'Aeneid Testnet',
  network: 'aeneid',
  nativeCurrency: {
    name: 'Story Protocol Token',
    symbol: 'SPT',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc-aeneid.storyscan.xyz'] },
    public: { http: ['https://rpc-aeneid.storyscan.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Storyscan', url: 'https://aeneid.storyscan.xyz' },
  },
  testnet: true,
};

// Create wagmi config
export const wagmiConfig = createConfig({
  chains: [aeneidChain],
  transports: {
    [aeneidChain.id]: http(aeneidChain.rpcUrls.default.http[0]),
  },
  connectors: [
    injected(),
  ],
});