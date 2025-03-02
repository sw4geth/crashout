"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import ScrambleHover from "@/components/text/scramble-hover"
import "@/styles/hero.css"

interface HeroSectionProps {
  onScrollToMainUI: () => void
}

export default function HeroSection({ onScrollToMainUI }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Use Framer Motion's useScroll for smooth parallax
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  return (
    <div ref={containerRef} className="hero-container">
      <motion.div 
        className="video-container"
        style={{ y }}
      >
        <video
          ref={videoRef}
          className="video-background"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/hilux.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <div className="content-overlay">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <ScrambleHover
            text="CRASHOUTTERMINAL"
            className="text-6xl font-bold tracking-wider"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <ScrambleHover
            text="fuck intents"
            className="text-2xl font-mono"
          />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="px-8 py-3 bg-white text-black font-bold text-lg"
          onClick={onScrollToMainUI}
        >
          Enter the void
        </motion.button>
      </div>

      <div className="gradient-overlay" />
    </div>
  )
}