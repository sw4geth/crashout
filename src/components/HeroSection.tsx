"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import ScrambleHover from "@/components/text/scramble-hover"
import IntentGallery from "@/components/modal/IntentGallery"
import "@/styles/hero.css"

interface HeroSectionProps {
  onScrollToMainUI: () => void
}

export default function HeroSection({ onScrollToMainUI }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

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
          <button
            onClick={() => setIsGalleryOpen(true)}
            className="text-2xl font-mono hover:text-white/80 transition-colors"
          >
            <ScrambleHover
              text="fuck intents"
              className="text-2xl font-mono"
            />
          </button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="px-8 py-3 bg-white text-black font-bold text-lg"
          onClick={onScrollToMainUI}
        >
          crashout technology
        </motion.button>
      </div>

      <div className="gradient-overlay" />
      
      <IntentGallery 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)} 
      />
    </div>
  )
}