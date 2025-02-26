"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface ScrambleHoverProps {
  text: string
  scrambleSpeed?: number
  maxIterations?: number
  useOriginalCharsOnly?: boolean
  className?: string
}

export default function ScrambleHover({
  text,
  scrambleSpeed = 50,
  maxIterations = 15,
  useOriginalCharsOnly = false,
  className = "",
}: ScrambleHoverProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [displayText, setDisplayText] = useState(text)
  const chars = useOriginalCharsOnly ? text.split("") : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()".split("")

  useEffect(() => {
    let iteration = 0
    let interval: NodeJS.Timeout

    if (isHovering) {
      interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, idx) => {
              if (idx < iteration) {
                return text[idx]
              }
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join("")
        )

        if (iteration >= text.length) {
          clearInterval(interval)
        }

        iteration += 1 / 3
      }, scrambleSpeed)
    } else {
      setDisplayText(text)
    }

    return () => clearInterval(interval)
  }, [isHovering, text, chars, scrambleSpeed])

  return (
    <motion.span
      className={className}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      onTouchStart={() => setIsHovering(true)}
      onTouchEnd={() => setIsHovering(false)}
    >
      {displayText}
    </motion.span>
  )
}
