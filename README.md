## DEMO
live demo:
https://crashout-three.vercel.app/

# CRASHOUTTERMINAL
Crashout Terminal is a hyper-personalized ChatGPT wrapper that interacts with on-chain protocols, bypassing traditional intent-matching and validation layers (key problems in AI agent execution) to serve familiar UI components directly in chat. It doesn't ask for permission—it just does.

Built as an extension of its creator, Crashout Terminal is idiosyncratic, reflecting the quirks, instincts, and on-chain tendencies of its user. It is not a generic assistant; it is my assistant, a prototype of the future of computing where LLM-powered interfaces replace traditional OS paradigms, adapting seamlessly to individual workflows.

Crashout Terminal swaps via the Uniswap router, bridges through Wormhole, and mints AI slop as IP on Story Protocol. It doesn't just assist—it executes.

![Project Screenshot](https://raw.githubusercontent.com/sw4geth/crashout/refs/heads/main/public/Screenshot.png)

## Demo Video

https://drive.google.com/file/d/1ZximP7g8CLnmMB-BY5sNs08QcHH4X_oz/view?usp=drive_link

## Getting Started

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_OPENAI_API_KEY=
ALCHEMY_KEY=
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
NEXT_PUBLIC_RPC_PROVIDER_URL=https://aeneid.storyrpc.io
NEXT_PUBLIC_PINATA_JWT=
```

You'll need to obtain API keys for:
- OpenAI API for the chat functionality
- Alchemy for blockchain interactions
- WalletConnect Project ID for wallet integration
- Pinata JWT for IPFS storage

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
