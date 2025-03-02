# Wormhole Token Bridge Integration

A Next.js application that integrates with the Wormhole Token Bridge protocol, allowing users to transfer tokens between Ethereum (and Sepolia testnet) chains.

## Features

- Connect wallet using RainbowKit
- Select source and destination chains
- Choose token (ETH, USDC)
- Enter amount to transfer
- Execute cross-chain token transfers via Wormhole

## Prerequisites

- Node.js 16+
- Yarn or npm
- Infura API key
- WalletConnect v2 Project ID
- Wallet with testnet funds for testing

## Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd wormhole-integration
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create `.env.local` file:
   ```
   cp .env.local.example .env.local
   ```

4. Edit `.env.local` and add your API keys:
   - `NEXT_PUBLIC_INFURA_KEY`: Your Infura API key
   - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: Your WalletConnect v2 Project ID
   - `NEXT_PUBLIC_WORMHOLE_ENV`: Set to `testnet` for testing or `mainnet` for production

## Development

Run the development server:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

For testing purposes, it's recommended to:

1. Use the Sepolia testnet
2. Start with small transfer amounts
3. Ensure your wallet has testnet tokens for gas fees

## Production

Build the application for production:

```
npm run build
```

Run the production build:

```
npm start
```

## Important Notes

- Replace any placeholder contract addresses in `utils/wormhole.ts` with actual values
- The Wormhole SDK implementation is simplified; in production, you would need to handle attestations more carefully
- For mainnet usage, ensure proper error handling and transaction monitoring
- Always verify your addresses and contract calls before deploying to production

## Resources

- [Wormhole Documentation](https://docs.wormhole.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs)