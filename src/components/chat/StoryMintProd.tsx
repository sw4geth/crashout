// src/components/chat/StoryMintProd.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useChainId, useSwitchChain, useWalletClient } from "wagmi";
import { http, encodeFunctionData, createPublicClient, getTransactionReceipt } from "viem";
import { PinataSDK } from "pinata-web3";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { createHash } from "crypto";
import { storyAeneid } from "../../config";

interface StoryMintProdProps {
  content: string;
  videoUrl?: string;
  onMintSuccess?: (txHash: string, ipId: string) => void;
}

const SPG_NFT_CONTRACT_ADDRESS = '0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc' as `0x${string}`;

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT || "",
});

export default function StoryMintProd({ content, videoUrl, onMintSuccess }: StoryMintProdProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: walletClient } = useWalletClient();
  const [mintStep, setMintStep] = useState<"idle" | "uploading" | "minting" | "complete" | "error">("idle");
  const [mintStatus, setMintStatus] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ipId, setIpId] = useState<string | null>(null);

  const mintAndRegister = async () => {
    if (!isConnected || !address || !walletClient) {
      setError("Please connect your wallet first");
      setMintStep("error");
      return;
    }

    if (chainId !== storyAeneid.id) {
      setMintStatus("Switching to Aeneid...");
      switchChain({ chainId: storyAeneid.id });
      return;
    }

    if (!videoUrl) {
      setError("No video provided to mint");
      setMintStep("error");
      return;
    }

    // Initialize StoryClient here, after walletClient is confirmed
    // Use a direct transport to the Story Protocol RPC to avoid WalletConnect's limitations
    const transport = http("https://aeneid.storyrpc.io");
    
    // Create a public client for RPC requests
    const publicClient = createPublicClient({
      transport,
      chain: storyAeneid
    });
    
    const config: StoryConfig = {
      chainId: "aeneid",
      transport: transport,
      wallet: walletClient,
    };
    
    const storyClient = StoryClient.newClient(config);
    
    // Create a custom function to send transactions directly to the Aeneid RPC
    const sendTransactionToAeneid = async (to: `0x${string}`, data: `0x${string}`) => {
      if (!walletClient || !address) {
        throw new Error("Wallet not connected");
      }
      
      try {
        // Send transaction directly using the wallet client
        return await walletClient.sendTransaction({
          chain: storyAeneid,
          to,
          data,
          account: address as `0x${string}`,
        });
      } catch (error) {
        console.error("Error sending transaction to Aeneid:", error);
        throw error;
      }
    };

    try {
      setMintStep("uploading");
      setMintStatus("Uploading video to IPFS...");
      setError(null);
      setTxHash(null);
      setIpId(null);

      console.log('Pinata JWT:', process.env.NEXT_PUBLIC_PINATA_JWT);

      // Upload video (media) to IPFS
      const videoBlob = await fetch(videoUrl).then(res => res.blob());
      const videoFile = new File([videoBlob], "goonslop.mp4", { type: "video/mp4" });
      const videoUpload = await pinata.upload.file(videoFile);
      const videoIpfsUrl = `ipfs://${videoUpload.IpfsHash}`;
      const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
      const videoHash: `0x${string}` = `0x${createHash("sha256").update(videoBuffer).digest("hex")}` as const;

      setMintStatus("Uploading metadata to IPFS...");

      // Create and upload metadata
      const metadata = {
        name: "Goonslop NFT",
        description: `A unique Goonslop NFT from "${content}" minted on Story Protocol`,
        image: videoIpfsUrl,
        animation_url: videoIpfsUrl,
        attributes: [
          { trait_type: "Type", value: "Goonslop" },
          { trait_type: "Rarity", value: "Rare" },
        ],
      };
      const metadataUpload = await pinata.upload.json(metadata);
      const metadataIpfsUrl = `ipfs://${metadataUpload.IpfsHash}`;
      const metadataHash: `0x${string}` = `0x${createHash("sha256").update(JSON.stringify(metadata)).digest("hex")}` as const;

      setMintStep("minting");
      setMintStatus("Minting and registering IP on Story Protocol...");

      // Prepare contract call data for mintAndRegisterIp
      const ipAssetRegistryAddress = "0xbe39E1C756e921BD25DF86e7AAa31106d1eb0424"; // IP Asset Registry contract address
      
      // Encode the function call data
      const ipMetadata = {
        ipMetadataURI: metadataIpfsUrl,
        ipMetadataHash: metadataHash,
        nftMetadataURI: metadataIpfsUrl,
        nftMetadataHash: metadataHash,
      };
      
      // Use direct contract interaction instead of SDK wrapper
      try {
        // Send the transaction directly to the Aeneid RPC
        const txHash = await sendTransactionToAeneid(
          ipAssetRegistryAddress as `0x${string}`,
          // This is the encoded function call for mintAndRegisterIp
          encodeFunctionData({
            functionName: "mintAndRegisterIp",
            address: ipAssetRegistryAddress as `0x${string}`,
            abi: [
              {
                inputs: [
                  { name: "spgNftContract", type: "address" },
                  { name: "recipient", type: "address" },
                  { 
                    name: "ipMetadata", 
                    type: "tuple", 
                    components: [
                      { name: "ipMetadataURI", type: "string" },
                      { name: "ipMetadataHash", type: "bytes32" },
                      { name: "nftMetadataURI", type: "string" },
                      { name: "nftMetadataHash", type: "bytes32" }
                    ]
                  },
                  { name: "allowDuplicates", type: "bool" }
                ],
                name: "mintAndRegisterIp",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
              }
            ],
            args: [
              SPG_NFT_CONTRACT_ADDRESS,
              address as `0x${string}`,
              {
                ipMetadataURI: ipMetadata.ipMetadataURI,
                ipMetadataHash: ipMetadata.ipMetadataHash,
                nftMetadataURI: ipMetadata.nftMetadataURI,
                nftMetadataHash: ipMetadata.nftMetadataHash
              },
              true
            ],
          }) as `0x${string}`
        );
        
        setTxHash(txHash);
        
        // Wait for transaction receipt
        setMintStatus("Waiting for transaction confirmation...");
        
        // Use the public client to wait for the transaction receipt
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        
        // Extract ipId from logs (this is simplified, you might need to decode the logs)
        const ipId = receipt?.logs?.[0]?.topics?.[1] ? 
          "0x" + receipt.logs[0].topics[1].slice(26) : 
          null;
        setIpId(ipId);
        
        setMintStep("complete");
        setMintStatus("Successfully minted and registered IP asset!");
        
        if (onMintSuccess && txHash && ipId) {
          onMintSuccess(txHash, ipId);
        }
      } catch (err: any) {
        console.error("Error in mint process:", err);
        setMintStep("error");
        setError(err.message.length > 100 ? `${err.message.slice(0, 100)}... (see console for full error)` : err.message);
      }
    } catch (err: any) {
      console.error("Error in mint process:", err);
      setMintStep("error");
      setError(err.message.length > 100 ? `${err.message.slice(0, 100)}... (see console for full error)` : err.message);
    }
  };

  const renderMintStepUI = () => {
    switch (mintStep) {
      case "idle":
        return (
          <button
            onClick={mintAndRegister}
            className="bg-black text-white font-bold py-2 px-4 rounded hover:bg-black/80 transition-colors"
          >
            Mint Goonslop NFT
          </button>
        );
      case "uploading":
      case "minting":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white/90 rounded-full"
              />
              <span className="text-white">{mintStatus}</span>
            </div>
            {txHash && (
              <div className="text-sm text-white/70">
                Transaction: {txHash.slice(0, 6)}...{txHash.slice(-4)}
              </div>
            )}
          </div>
        );
      case "complete":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{mintStatus}</span>
            </div>
            {txHash && (
              <div className="text-sm text-white/70">
                Transaction: {txHash.slice(0, 6)}...{txHash.slice(-4)}
              </div>
            )}
            {ipId && (
              <div className="text-sm text-white/70">
                IP ID: {ipId.slice(0, 6)}...{ipId.slice(-4)}
              </div>
            )}
          </div>
        );
      case "error":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-400 whitespace-pre-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>Error: {error}</span>
            </div>
            <button
              onClick={mintAndRegister}
              className="bg-black text-white font-bold py-2 px-4 rounded hover:bg-black/80 transition-colors"
            >
              Retry
            </button>
          </div>
        );
    }
  };

  return (
    <div className="p-4 bg-white/10 rounded-lg space-y-4">
      <h3 className="text-lg font-bold text-white">Story Protocol Mint</h3>
      <div className="space-y-2">{renderMintStepUI()}</div>
    </div>
  );
}