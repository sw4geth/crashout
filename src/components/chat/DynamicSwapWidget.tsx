"use client"

import dynamic from 'next/dynamic'

// Dynamically import the SwapWidget with no SSR
const DynamicSwapWidget = dynamic(
  () => import('@uniswap/widgets').then((mod) => mod.SwapWidget),
  { ssr: false }
)

export default DynamicSwapWidget