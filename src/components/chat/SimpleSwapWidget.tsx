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
    <div className="p-4 bg-black/50 border border-white/20 rounded-lg text-white">
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
          className="w-full p-2 bg-black/70 border border-white/30 rounded text-white"
        />
      </div>
      
      <div className="text-center my-2">↓</div>
      
      <div className="mb-4">
        <label className="block mb-2">UNI</label>
        <input
          type="text"
          value={outputAmount}
          readOnly
          className="w-full p-2 bg-black/70 border border-white/30 rounded text-white"
        />
      </div>
      
      <button 
        className="w-full p-2 bg-white/20 hover:bg-white/30 transition rounded text-white"
        onClick={() => alert('Swap function would execute here')}
      >
        Swap
      </button>
    </div>
  )
}