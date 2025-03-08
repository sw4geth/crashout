// src/components/wallet/BlackWalletButton.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAppKit, useAppKitNetwork } from '@reown/appkit/react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useBalance } from 'wagmi';

// No forced chain ID here—let components handle it
export default function BlackWalletButton() {
  const { open, close } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const [localBalance, setLocalBalance] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: balanceData } = useBalance({
    address: address as `0x${string}`,
    chainId: chainId ? Number(chainId) : undefined,
    query: {
      enabled: isConnected && !!address && !!chainId,
    },
  });

  useEffect(() => {
    if (balanceData) {
      setLocalBalance(`${parseFloat(balanceData.formatted).toFixed(4)} ${balanceData.symbol}`);
    } else {
      setLocalBalance(null);
    }
  }, [balanceData]);

  useEffect(() => {
    console.log('Current Chain ID:', chainId);
    console.log('Wagmi Balance:', balanceData?.formatted, balanceData?.symbol);

    // Optional: Inject balance into Reown if it’s not picking it up (e.g., for Aeneid)
    if (isConnected && balanceData && chainId && (!balanceData.formatted || balanceData.formatted === '0')) {
      console.log('Injecting balance into Reown...');
      window.dispatchEvent(
        new CustomEvent('walletconnect_balance_update', {
          detail: {
            chainId: chainId,
            balance: {
              amount: balanceData.value.toString(), // Raw wei
              decimals: balanceData.decimals,
              symbol: balanceData.symbol,
            },
          },
        })
      );
    }
  }, [chainId, balanceData, isConnected]);

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleOpenModal = () => {
    if (isModalOpen) {
      close().then(() => {
        setTimeout(() => {
          setIsModalOpen(true);
          open({ view: isConnected ? 'Account' : 'Connect' });
        }, 50);
      });
    } else {
      setIsModalOpen(true);
      open({ view: isConnected ? 'Account' : 'Connect' }).catch(() => {
        setIsModalOpen(false);
      });
    }
  };

  return (
    <div>
      <style jsx global>{`
        :root {
          --w3m-accent-color: #000000 !important;
          --w3m-accent-fill-color: #000000 !important;
          --w3m-background-color: #000000 !important;
          --w3m-button-background-color: #000000 !important;
          --w3m-button-text-color: #FFFFFF !important;
          --w3m-button-border-color: rgba(255, 255, 255, 0.2) !important;
          --w3m-border-radius-master: 0px !important;
          --w3m-button-border-radius: 0px !important;
          --w3m-container-border-radius: 0px !important;
          --w3m-wallet-icon-border-radius: 0px !important;
        }
      `}</style>
      <button
        onClick={handleOpenModal}
        className="bg-black text-white border border-white/20 px-4 py-2 font-mono text-sm hover:bg-white/10 transition-colors"
      >
        {isConnected
          ? `${formatAddress(address || '')} ${localBalance ? `(${localBalance})` : ''}`
          : 'Connect Wallet'}
      </button>
    </div>
  );
}