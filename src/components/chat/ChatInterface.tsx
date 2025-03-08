"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import ScrambleIn, { ScrambleInHandle } from "@/components/text/scramble-in";
import SwapInterface from "./SwapInterface";
import StoryMintProd from "./StoryMintProd";
import WormholeBridge from "./WormholeBridge";
import GeckoChart from "../chart/GeckoChart";
import BlackWalletButton from "../wallet/BlackWalletButton";
import { generateChatResponse } from "@/lib/openai";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ActionItem {
  id: string;
  type: "videoMint" | "swap" | "bridge" | "chart";
  content: string;
  timestamp: number;
  data?: any; // For type-specific data like video URL
}

interface TimelineItem {
  id: string;
  type: "message" | "action";
  data: Message | ActionItem;
  timestamp: number;
}

interface ChatInterfaceProps {
  initialPrompt?: string;
}

const provider = new ethers.providers.JsonRpcProvider(
  "https://eth-mainnet.g.alchemy.com/v2/SNEOR8G_USDK3K_Ak29fC0ZWu_E58-7W"
);

const videos = [
  "/videos/output (7).mp4",
  "/videos/output (8).mp4",
  "/videos/output (9).mp4",
  "/videos/output.mp4",
];

export default function ChatInterface({ initialPrompt }: ChatInterfaceProps) {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrambleRef = useRef<ScrambleInHandle>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [timeline, currentResponse]);

  useEffect(() => {
    if (initialPrompt) {
      handleSubmitWithContent(initialPrompt);
    }
  }, [initialPrompt]);

  const handleMintSuccess = (txHash: string, ipId: string) => {
    const timestamp = Date.now();
    const responseId = `msg_${timestamp}`;
    setTimeline(prev => [
      ...prev,
      {
        id: responseId,
        type: "message",
        data: {
          role: "assistant",
          content: `TRANSACTION HIGHLIGHT\nMinted on Story!\nTx: ${txHash}\nIP ID: ${ipId}`,
          timestamp,
        },
        timestamp,
      },
    ]);
  };

  const isSwapPrompt = (content: string) => {
    const lowerContent = content.toLowerCase();
    const hasSwapCommand =
      lowerContent.includes("swap") ||
      lowerContent.includes("trade") ||
      lowerContent.includes("exchange") ||
      lowerContent.includes("convert");
    const hasTokens = lowerContent.includes("mnt") || lowerContent.includes("usdc");
    return hasSwapCommand && hasTokens;
  };

  const isVideoMintPrompt = (content: string) => {
    const lowerContent = content.toLowerCase();
    return lowerContent.includes("mint") || lowerContent.includes("slop");
  };

  const isBridgePrompt = (content: string) => {
    const lowerContent = content.toLowerCase();
    return (
      lowerContent.includes("bridge") &&
      lowerContent.includes("meth") &&
      lowerContent.includes("solana")
    );
  };

  const isChartPrompt = (content: string) => {
    const lowerContent = content.toLowerCase();
    return lowerContent.includes("crashout");
  };

  const handleSubmitWithContent = async (content: string) => {
    if (!content.trim()) return;

    const timestamp = Date.now();
    const messageId = `msg_${timestamp}`;

    const userMessage: Message = {
      role: "user" as const,
      content,
      timestamp,
    };

    setTimeline(prev => [
      ...prev,
      {
        id: messageId,
        type: "message",
        data: userMessage,
        timestamp,
      },
    ]);

    setInput("");

    if (isSwapPrompt(content)) {
      const actionTimestamp = timestamp + 1;
      const actionId = `action_swap_${actionTimestamp}`;
      const responseTimestamp = timestamp + 2;
      const responseId = `msg_${responseTimestamp}`;

      setTimeline(prev => [
        ...prev,
        {
          id: actionId,
          type: "action",
          data: {
            id: actionId,
            type: "swap",
            content,
            timestamp: actionTimestamp,
          },
          timestamp: actionTimestamp,
        },
        {
          id: responseId,
          type: "message",
          data: {
            role: "assistant",
            content: "sell while you still can",
            timestamp: responseTimestamp,
          },
          timestamp: responseTimestamp,
        },
      ]);
      return;
    }

    if (isVideoMintPrompt(content)) {
      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      const actionTimestamp = timestamp + 1;
      const actionId = `action_mint_${actionTimestamp}`;
      const responseTimestamp = timestamp + 2;
      const responseId = `msg_${responseTimestamp}`;

      setTimeline(prev => [
        ...prev,
        {
          id: actionId,
          type: "action",
          data: {
            id: actionId,
            type: "videoMint",
            content,
            timestamp: actionTimestamp,
            data: { video: randomVideo },
          },
          timestamp: actionTimestamp,
        },
        {
          id: responseId,
          type: "message",
          data: {
            role: "assistant",
            content: "here's your slop master",
            timestamp: responseTimestamp,
          },
          timestamp: responseTimestamp,
        },
      ]);
      return;
    }

    if (isBridgePrompt(content)) {
      const actionTimestamp = timestamp + 1;
      const actionId = `action_bridge_${actionTimestamp}`;
      const responseTimestamp = timestamp + 2;
      const responseId = `msg_${responseTimestamp}`;

      setTimeline(prev => [
        ...prev,
        {
          id: actionId,
          type: "action",
          data: {
            id: actionId,
            type: "bridge",
            content,
            timestamp: actionTimestamp,
          },
          timestamp: actionTimestamp,
        },
        {
          id: responseId,
          type: "message",
          data: {
            role: "assistant",
            content: "finna bridge",
            timestamp: responseTimestamp,
          },
          timestamp: responseTimestamp,
        },
      ]);
      return;
    }

    if (isChartPrompt(content)) {
      const actionTimestamp = timestamp + 1;
      const actionId = `action_chart_${actionTimestamp}`;
      const responseTimestamp = timestamp + 2;
      const responseId = `msg_${responseTimestamp}`;

      setTimeline(prev => [
        ...prev,
        {
          id: actionId,
          type: "action",
          data: {
            id: actionId,
            type: "chart",
            content,
            timestamp: actionTimestamp,
          },
          timestamp: actionTimestamp,
        },
        {
          id: responseId,
          type: "message",
          data: {
            role: "assistant",
            content: "time to crashout",
            timestamp: responseTimestamp,
          },
          timestamp: responseTimestamp,
        },
      ]);
      return;
    }

    try {
      setIsLoading(true);
      setCurrentResponse("");

      const response = await generateChatResponse(content);
      let fullResponse = "";

      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullResponse += content;
        setCurrentResponse((prev) => prev + content);
      }

      const responseTimestamp = Date.now();
      const responseId = `msg_${responseTimestamp}`;

      setTimeline(prev => [
        ...prev,
        {
          id: responseId,
          type: "message",
          data: {
            role: "assistant",
            content: fullResponse,
            timestamp: responseTimestamp,
          },
          timestamp: responseTimestamp,
        },
      ]);

      setCurrentResponse("");
    } catch (error) {
      console.error("Error:", error);
      const dummyResponse = "This is a dummy response to your query.";
      const responseTimestamp = Date.now();
      const responseId = `msg_${responseTimestamp}`;

      setTimeline(prev => [
        ...prev,
        {
          id: responseId,
          type: "message",
          data: {
            role: "assistant",
            content: dummyResponse,
            timestamp: responseTimestamp,
          },
          timestamp: responseTimestamp,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmitWithContent(input);
  };

  return (
    <div className="h-[calc(100vh-16rem)] flex">
      {/* Menu column */}
      <div className="w-1/4 bg-black/50 p-4 space-y-2 border-r border-white/20">
        <div className="space-y-2">
          <button
            onClick={() => handleSubmitWithContent("swap weth to usdc")}
            className="w-full p-2 text-left text-white hover:bg-white/10 transition-colors"
          >
            swap weth to usdc
          </button>
          <button
            onClick={() => handleSubmitWithContent("mint me some slop")}
            className="w-full p-2 text-left text-white hover:bg-white/10 transition-colors"
          >
            mint me some goonslop
          </button>
          <button
            onClick={() => handleSubmitWithContent("bridge meth to solana")}
            className="w-full p-2 text-left text-white hover:bg-white/10 transition-colors"
          >
            bridge meth to solana
          </button>
          <button
            onClick={() => handleSubmitWithContent("crashout")}
            className="w-full p-2 text-left text-white hover:bg-white/10 transition-colors"
          >
            crashout
          </button>
        </div>
      </div>

      {/* Chat column */}
      <div className="w-3/4 flex flex-col">
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-4 p-4">
            {timeline.map((item) => {
              if (item.type === "message") {
                const message = item.data as Message;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 break-words whitespace-pre-wrap overflow-hidden ${
                        message.role === "user"
                          ? "bg-black/50 text-white"
                          : message.content.includes("TRANSACTION HIGHLIGHT")
                          ? "highlight"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      <span className={message.content.includes("TRANSACTION HIGHLIGHT") ? "highlight-text font-bold" : ""}>
                        {message.content}
                      </span>
                    </div>
                  </motion.div>
                );
              } else if (item.type === "action") {
                const action = item.data as ActionItem;

                if (action.type === "videoMint") {
                  const videoUrl = action.data?.video; // Extract video URL
                  return (
                    <React.Fragment key={item.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start relative"
                      >
                        <div style={{width: '40%'}} className="p-3 rounded-lg bg-white/10 text-white relative overflow-hidden">
                          <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.3, delay: 1.2 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/20"
                          >
                            <div className="flex items-center gap-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white/30 border-t-white/90 rounded-full"
                              />
                              <motion.span
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="font-mono text-sm text-white/90"
                              >
                                Inferencing slop...
                              </motion.span>
                            </div>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 1.2 }}
                          >
                            {videoUrl && (
                              <motion.video
                                initial={{ filter: "opacity(0)" }}
                                animate={{
                                  filter: [
                                    "opacity(0)",
                                    "opacity(1) contrast(800%) brightness(150%)",
                                    "opacity(1) contrast(800%) brightness(150%)",
                                    "opacity(1) contrast(100%) brightness(100%)",
                                  ],
                                }}
                                transition={{ duration: 2.4, times: [0, 0.2, 0.7, 1], ease: "easeOut" }}
                                src={videoUrl}
                                className="w-full h-auto rounded transform"
                                style={{ WebkitFilter: "url(#noise)", filter: "url(#noise)" }}
                                controls
                                autoPlay
                                loop
                                muted
                              />
                            )}
                          </motion.div>
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.3 }}
                        className="flex justify-start"
                      >
                        <div style={{width: '40%'}}>
                          <StoryMintProd
                            content={action.content}
                            videoUrl={videoUrl} // Pass the video URL here
                            onMintSuccess={handleMintSuccess} // Log tx in chat
                          />
                        </div>
                      </motion.div>
                    </React.Fragment>
                  );
                } else if (action.type === "swap") {
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[80%]">
                        <SwapInterface provider={provider} />
                      </div>
                    </motion.div>
                  );
                } else if (action.type === "bridge") {
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[80%]">
                        <WormholeBridge />
                      </div>
                    </motion.div>
                  );
                } else if (action.type === "chart") {
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[80%]">
                        <GeckoChart />
                      </div>
                    </motion.div>
                  );
                }
              }
              return null;
            })}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2 text-white"
              >
                <div className="animate-pulse">Processing</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-white animate-bounce" style={{ animationDelay: "100ms" }}></div>
                  <div className="w-2 h-2 bg-white animate-bounce" style={{ animationDelay: "200ms" }}></div>
                </div>
              </motion.div>
            )}

            {currentResponse && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%] p-3 bg-white/10 text-white">
                  <ScrambleIn
                    ref={scrambleRef}
                    text={currentResponse}
                    scrambleSpeed={25}
                    scrambledLetterCount={5}
                    className="font-mono"
                    autoStart={true}
                  />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />

            {timeline.some(item => item.type === "action" && (item.data as ActionItem).type === "videoMint") && (
              <svg style={{ position: "absolute", width: 0, height: 0 }}>
                <defs>
                  <filter id="noise">
                    <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="4" stitchTiles="stitch" />
                    <feComponentTransfer>
                      <feFuncR type="linear" slope="3" intercept="-1" />
                      <feFuncG type="linear" slope="3" intercept="-1" />
                      <feFuncB type="linear" slope="3" intercept="-1" />
                    </feComponentTransfer>
                    <feComposite operator="in" in2="SourceGraphic" />
                  </filter>
                </defs>
              </svg>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-white/20 bg-black/50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-black/50 text-white p-2 focus:outline-none focus:border-white/40"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </form>
          <div className="mt-4">
            <BlackWalletButton />
          </div>
        </div>
      </div>
    </div>
  );
}