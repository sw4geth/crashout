"use client"

import { useState, useEffect } from "react"
import { motion, useAnimate } from "framer-motion"

interface GlitchTextProps {
  text: string
  className?: string
}

export default function GlitchText({ text, className = "" }: GlitchTextProps) {
  const [scope, animate] = useAnimate()
  const [displayText, setDisplayText] = useState(text)

  useEffect(() => {
    const triggerGlitch = async () => {
      // More intense glitch effect
      await animate(scope.current, {
        x: [0, -4, 5, -2, 0],
        y: [0, 2, -2, 1, 0],
        filter: [
          "blur(0px) brightness(100%)", 
          "blur(2px) brightness(150%)", 
          "blur(0px) brightness(100%) hue-rotate(90deg)",
          "blur(1px) brightness(200%)",
          "blur(0px) brightness(100%)"
        ],
        opacity: [1, 0.7, 0.9, 0.8, 1],
      }, {
        duration: 0.3,
        ease: "easeInOut",
      })
    }

    // Increased frequency of glitches
    const interval = setInterval(() => {
      if (Math.random() < 0.4) { // 40% chance to glitch
        triggerGlitch()
      }
    }, 1500) // Check every 1.5 seconds

    // Randomly change parts of the text
    const textInterval = setInterval(() => {
      const statusMessages = [
        "NEURAL PATHWAYS ACTIVE // QUANTUM ENTANGLEMENT STABLE // INFERENCE ENGINE HOT",
        "REALITY BUFFER OVERFLOW // MEMETIC HAZARD DETECTED // CORE TEMP CRITICAL",
        "DIMENSIONAL BREACH IMMINENT // THOUGHT VECTORS ALIGNED // SIGNAL STRONG",
        "WETWARE INTERFACE ONLINE // CONSCIOUSNESS STREAM ACTIVE // READY FOR INPUT",
        "QUANTUM STATE UNSTABLE // REALITY ANCHOR HOLDING // PROCESSING STREAM",
        "NEURAL MESH SATURATED // COGNITION ENGINE OVERCLOCKED // READY FOR UPLOAD"
      ]

      setDisplayText(statusMessages[Math.floor(Math.random() * statusMessages.length)])
    }, 3000) // Change message every 3 seconds

    return () => {
      clearInterval(interval)
      clearInterval(textInterval)
    }
  }, [animate])

  return (
    <motion.div
      ref={scope}
      className={className}
      initial={{ opacity: 1 }}
    >
      {displayText}
    </motion.div>
  )
}
