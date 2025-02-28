# NFT Minter with Story Protocol

This is a Next.js application that allows users to create NFT collections and mint NFTs with Story Protocol's IP registration capabilities on the Aeneid Testnet. It features a drag-and-drop interface for uploading images and metadata.

## Features

- Create NFT collections on Story Protocol
- Upload images with drag-and-drop functionality
- Automatically generate and upload metadata to IPFS
- Mint NFTs and register them as IP assets on Story Protocol
- Step-by-step guided flow from collection creation to minting

## Technologies Used

- **Next.js** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first CSS
- **Ethers.js** - Ethereum library for interacting with the blockchain
- **Wagmi** - React hooks for Ethereum
- **react-dropzone** - Drag and drop file uploads
- **IPFS** - Decentralized storage for NFT images and metadata

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- MetaMask or another Ethereum wallet
- Aeneid Testnet configured in your wallet
- Testnet tokens from the [Story Protocol faucet](https://cloud.google.com/application/web3/faucet/story/aeneid)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Create a `.env.local` file with your IPFS credentials (optional)
   ```
   NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID=your_infura_project_id
   NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET=your_infura_project_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

1. **Connect your wallet** - Click the "Connect Wallet" button to connect your Ethereum wallet
2. **Create a Collection** - Fill in the name and symbol for your NFT collection and click "Create Collection"
3. **Upload an Asset** - Drag and drop an image file or click to browse, add a name and description
4. **Mint your NFT** - Review the details and click "Mint NFT and Register IP"

## Contract Details

This application uses the Story Protocol Registration Workflows contract on the Aeneid Testnet:

- **Contract Address**: `0xbe39E1C756e921BD25DF86e7AAa31106d1eb0424`
- **Network**: Aeneid Testnet (Chain ID: 1315)

## IPFS Configuration

By default, the application attempts to use Infura's IPFS service. To use your own IPFS node:

1. Sign up for an IPFS service like Infura, Pinata, or NFT.Storage
2. Add your API keys to the `.env.local` file
3. Adjust the IPFS configuration in `components/MintNFT.tsx` if needed

## Adding Aeneid Testnet to MetaMask

To add the Aeneid Testnet to your MetaMask wallet:

1. Open MetaMask and click on the network dropdown
2. Select "Add Network"
3. Click "Add Network Manually"
4. Fill in the following details:
   - Network Name: `Aeneid Testnet`
   - New RPC URL: `https://rpc-aeneid.storyscan.xyz`
   - Chain ID: `1315`
   - Currency Symbol: `ETH`
   - Block Explorer URL: `https://aeneid.storyscan.xyz`

## Learn More

- [Story Protocol Documentation](https://docs.storyprotocol.xyz/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
