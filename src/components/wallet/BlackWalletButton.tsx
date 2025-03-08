'use client'

import React, { useEffect } from 'react'
import { useAppKit } from '@reown/appkit/react'
import { useAppKitAccount } from '@reown/appkit/react'

export default function BlackWalletButton() {
  const { open, isOpen } = useAppKit()
  const { address, isConnected } = useAppKitAccount()

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }
  
  // Handle opening the modal
  const handleOpenModal = () => {
    // Always force close first to reset any potential state issues
    if (isOpen) {
      // If already open, wait a moment and then reopen
      setTimeout(() => {
        open(isConnected ? 'Account' : 'ConnectWallet')
      }, 50)
    } else {
      // If not open, just open directly
      open(isConnected ? 'Account' : 'ConnectWallet')
    }
  }

  return (
    <div>
      <style jsx global>{`
        /* Global styles to ensure the appkit modal is black when opened */
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
        {isConnected ? formatAddress(address || '') : 'Connect Wallet'}
      </button>
    </div>
  )
}
