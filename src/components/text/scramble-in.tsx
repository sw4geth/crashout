"use client"

import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react"

export interface ScrambleInHandle {
  reset: () => void
}

interface ScrambleInProps {
  text: string
  scrambleSpeed?: number
  scrambledLetterCount?: number
  className?: string
}

const ScrambleIn = forwardRef<ScrambleInHandle, ScrambleInProps>(
  (
    {
      text,
      scrambleSpeed = 50,
      scrambledLetterCount = 5,
      className,
    },
    ref
  ) => {
    const [displayChars, setDisplayChars] = useState<string[]>([])
    const targetChars = text.split("")
    const animationRef = useRef<number | null>(null)
    const prevTextRef = useRef<string>("")

    const getRandomChar = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
      return chars[Math.floor(Math.random() * chars.length)]
    }

    // Compare current text with previous to detect changes
    if (text !== prevTextRef.current) {
      // Update previous text ref
      prevTextRef.current = text

      // Cancel any ongoing animation
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }

      // Initialize or update display characters
      setDisplayChars((prev) => {
        const newChars = targetChars.map((char, i) => {
          // If we have a previous char and it matches, keep it
          if (i < prev.length && prev[i] === char) return char
          // Otherwise, start with a random char
          return getRandomChar()
        })
        return newChars
      })

      // Start scrambling animation
      const animate = () => {
        setDisplayChars((prevChars) => {
          const newChars = [...prevChars]
          let isComplete = true

          for (let i = 0; i < targetChars.length; i++) {
            if (newChars[i] !== targetChars[i]) {
              isComplete = false
              if (Math.random() < 0.3) {
                // Gradually reveal correct character
                newChars[i] = targetChars[i]
              } else {
                newChars[i] = getRandomChar()
              }
            }
          }

          if (!isComplete) {
            animationRef.current = requestAnimationFrame(animate)
          } else {
            animationRef.current = null
          }

          return newChars
        })
      }

      // Kick off the animation
      animationRef.current = requestAnimationFrame(animate)
    }

    useImperativeHandle(ref, () => ({
      reset: () => {
        setDisplayChars(targetChars.map(() => getRandomChar()))
        if (animationRef.current !== null) {
          cancelAnimationFrame(animationRef.current)
        }
        animationRef.current = requestAnimationFrame(() => {
          setDisplayChars([...targetChars])
        })
      },
    }))

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (animationRef.current !== null) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }, [])

    return <span className={className}>{displayChars.join("")}</span>
  }
)

ScrambleIn.displayName = "ScrambleIn"

export default ScrambleIn
