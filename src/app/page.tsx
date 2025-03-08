// src/app/page.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrambleHover from '@/components/text/scramble-hover';
import ChatInterface from '@/components/chat/ChatInterface';
import GlitchText from '@/components/text/glitch-text';
import VariableFontCursorProximity from '@/components/text/variable-font-cursor-proximity';
import PixelTrail from '@/components/background/pixel-trail';
import HeroSection from '@/components/HeroSection';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { formatEther, formatUnits } from 'viem';
import { networks } from '@/config';

export default function Home() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainUIRef = useRef<HTMLDivElement>(null);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address: address as `0x${string}`,
    chainId, // Dynamic chainId
  });

  useEffect(() => {
    const currentChain = networks.find(n => n.id === chainId);
    console.log('Current Chain:', chainId, currentChain?.name || 'Unknown');
  }, [chainId]);

  const isSolanaChain = [501, 502, 503].includes(chainId); // Solana mainnet, testnet, devnet
  const balanceFormatted = balanceData
    ? isSolanaChain
      ? `${formatUnits(balanceData.value, 9)} SOL` // Solana uses 9 decimals
      : `${formatEther(balanceData.value)} ETH` // EVM uses 18 decimals
    : '0';

  const headerTexts = ['HYPERREAL', 'CRASHOUT', 'QUANTUM', 'TRANSCENDENT'];

  const prompts = [
    'MKULTRA MICRODOSE PROTOCOL: Neuro-enhanced MSG activation sequence?',
    'URGENT: Has your rice cooker been compromised by quantum backdoors?',
    'TIME-SHIFTED RAMEN: Calculate optimal desynchronization vectors NOW',
    'WARNING: Detected unauthorized wetware in your last bubble tea order',
    'HELP: My neural-linked chopsticks are decoding forbidden umami signals',
    'CRITICAL: Sichuan peppercorn reality distortion field expanding',
    'EMERGENCY: Local noodle shop\'s AI achieving consciousness through MSG',
    'ALERT: Hyperspace conduit detected in basement dim sum kitchen',
    'DANGER: Rogue AI colonizing the collective unconscious via food delivery apps',
    'URGENT: Time-traveling street food vendors distributing memetic hazards',
    'SWAP: swap mnt to usdc now',
    'GENERATE: generate and mint image for my cyberpunk noodle shop',
    'BRIDGE: bridge meth to solana network',
  ];

  const handlePromptClick = (prompt: string) => setSelectedPrompt(prompt);
  const scrollToMainUI = () => mainUIRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main className="min-h-screen bg-black text-white">
      <HeroSection onScrollToMainUI={scrollToMainUI} />
      <div ref={mainUIRef} className="relative z-10 min-h-screen w-screen bg-black text-white overflow-x-hidden py-16 px-8 sm:px-16 md:px-24 lg:px-32">
        <div className="fixed inset-0 pointer-events-none z-50">
          <PixelTrail pixelSize={24} fadeDuration={500} pixelClassName="bg-white" />
        </div>
        <div ref={containerRef} className="relative z-10">
          <div className="mb-12 flex flex-col items-start justify-center gap-4">
            {headerTexts.map((text, i) => (
              <div key={i} className={i === 1 ? 'highlight' : ''}>
                <VariableFontCursorProximity
                  label={text}
                  className={`text-6xl md:text-7xl lg:text-9xl leading-none font-bold ${i === 1 ? 'highlight-text' : 'text-white'} font-spaceGrotesk`}
                  fromFontVariationSettings="'wght' 100, 'slnt' 0"
                  toFontVariationSettings="'wght' 900, 'slnt' -15"
                  radius={400}
                  containerRef={containerRef}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <motion.div
              className="lg:w-64 space-y-2 font-mono font-jetbrainsMono"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-white mb-4 text-sm uppercase tracking-wider">Prompt Suggestions</h2>
              {prompts.map((prompt, index) => (
                <motion.div
                  key={prompt}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.08 + 0.6 }}
                  className={`text-sm cursor-pointer hover:text-white/80 transition-colors duration-200 ${index % 3 === 0 ? 'highlight' : ''}`}
                  onClick={() => handlePromptClick(prompt)}
                >
                  <ScrambleHover
                    text={prompt}
                    scrambleSpeed={60}
                    maxIterations={10}
                    useOriginalCharsOnly={true}
                    className={`font-jetbrainsMono ${index % 3 === 0 ? 'highlight-text' : ''}`}
                  />
                </motion.div>
              ))}
            </motion.div>
            <div className="flex-1">
              <ChatInterface initialPrompt={selectedPrompt} />
              <div className="mt-8">
                <w3m-button label={isConnected ? 'Connected' : 'Connect Wallet'} />
                {isConnected && balanceData && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white text-xs mt-2 font-jetbrainsMono"
                  >
                    Balance: {balanceLoading ? 'Loading...' : balanceFormatted}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          <motion.div
            className="fixed bottom-4 left-4 text-sm text-white/60 font-jetbrainsMono"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            <GlitchText
              text="NEURAL PATHWAYS ACTIVE // QUANTUM ENTANGLEMENT STABLE // INFERENCE ENGINE HOT"
              className="font-mono"
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}