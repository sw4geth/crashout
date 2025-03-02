"use client"

import { ethers } from 'ethers'
import { useRef, useState } from 'react'
import { UNI } from '@/constants'

interface SimpleSwapWidgetProps {
  provider: ethers.providers.JsonRpcProvider
}

export default function SimpleSwapWidget({ provider }: SimpleSwapWidgetProps) {
  const [inputAmount, setInputAmount] = useState('1')
  const [outputAmount, setOutputAmount] = useState('0')
  
  // Mock swap quotes
  const calculateQuote = () => {
    // This is a mock calculation - in reality you'd fetch a price from an API
    const inputValue = parseFloat(inputAmount) || 0
    setOutputAmount((inputValue * 38.25).toFixed(2))
  }
  
  return (
    <div className="relative w-[300px] h-[500px]">
      <video
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/Subway Surfers.mp4" type="video/mp4" />
      </video>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[280px] p-4 bg-black/50 border border-white/20 text-white">
        <h2 className="text-xl font-bold mb-4">Simple Swap</h2>
        
        <div className="mb-4">
          <label className="block mb-2">ETH</label>
          <input
            type="text"
            value={inputAmount}
            onChange={(e) => {
              setInputAmount(e.target.value)
              calculateQuote()
            }}
            className="w-full p-2 bg-black/70 border border-white/30 text-white"
          />
        </div>
        
        <div className="text-center my-2">↓</div>
        
        <div className="mb-4">
          <label className="block mb-2">UNI</label>
          <input
            type="text"
            value={outputAmount}
            readOnly
            className="w-full p-2 bg-black/70 border border-white/30 text-white"
          />
        </div>
        
        <button 
          className="w-full p-2 bg-white/20 hover:bg-white/30 transition text-white"
          onClick={() => alert('Swap function would execute here')}
        >
          Swap
        </button>
      </div>
    </div>
  )
}