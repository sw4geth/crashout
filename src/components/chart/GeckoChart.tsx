"use client"

import { motion } from "framer-motion"

export default function GeckoChart() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-[50vh] bg-black border border-white/20 overflow-hidden"
    >
      <iframe 
        height="100%" 
        width="100%" 
        id="geckoterminal-embed" 
        title="GeckoTerminal Embed" 
        src="https://www.geckoterminal.com/eth/pools/0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640?embed=1&info=0&swaps=0&grayscale=0&light_chart=0&chart_type=price&resolution=1month" 
        frameBorder="0" 
        allow="clipboard-write" 
        allowFullScreen
        className="scale-[1.02]" // Just enough to cover borders
      />
    </motion.div>
  )
}
