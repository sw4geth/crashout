"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function GeckoChart() {
  const [showChart, setShowChart] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChart(true)
    }, 2000) // 2 second delay

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full relative">
      <AnimatePresence mode="wait">
        {!showChart ? (
          <motion.div
            key="smoking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex justify-center items-center p-4"
          >
            <motion.img
              src="/images/smoking.webp"
              alt="Loading chart..."
              className="w-48 h-48 object-contain"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.95, 1, 0.95]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="chart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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
        )}
      </AnimatePresence>
    </div>
  )
}
