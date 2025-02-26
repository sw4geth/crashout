"use client"

import { useState, useEffect, RefObject, useRef } from "react"
import { motion } from "framer-motion"

interface Props {
  label: string
  className?: string
  fromFontVariationSettings: string
  toFontVariationSettings: string
  radius: number
  containerRef: RefObject<HTMLDivElement | null>
}

export default function VariableFontCursorProximity({
  label,
  className = "",
  fromFontVariationSettings,
  toFontVariationSettings,
  radius,
  containerRef,
}: Props) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const updateMousePosition = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    containerRef.current.addEventListener("mousemove", updateMousePosition)
    return () => {
      containerRef.current?.removeEventListener("mousemove", updateMousePosition)
    }
  }, [containerRef])

  useEffect(() => {
    if (!elementRef.current || !containerRef.current) return

    const element = elementRef.current
    const elementRect = element.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()

    // Calculate element center relative to container
    const elementCenterX = (elementRect.left - containerRect.left) + elementRect.width / 2
    const elementCenterY = (elementRect.top - containerRect.top) + elementRect.height / 2

    // Calculate distance from mouse to element center
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - elementCenterX, 2) +
      Math.pow(mousePosition.y - elementCenterY, 2)
    )

    // Calculate interpolation factor
    const factor = Math.max(0, Math.min(1, 1 - distance / radius))

    // Extract weight and slant values from the font variation settings
    const fromWeight = fromFontVariationSettings.match(/'wght' (\d+)/)?.[1] || "100"
    const fromSlant = fromFontVariationSettings.match(/'slnt' (-?\d+)/)?.[1] || "0"
    const toWeight = toFontVariationSettings.match(/'wght' (\d+)/)?.[1] || "900"
    const toSlant = toFontVariationSettings.match(/'slnt' (-?\d+)/)?.[1] || "-15"

    // Interpolate between the values
    const currentWeight = parseInt(fromWeight) + (parseInt(toWeight) - parseInt(fromWeight)) * factor
    const currentSlant = parseInt(fromSlant) + (parseInt(toSlant) - parseInt(fromSlant)) * factor

    // Apply the interpolated font variation settings
    element.style.fontVariationSettings = `'wght' ${currentWeight}, 'slnt' ${currentSlant}`

  }, [mousePosition, fromFontVariationSettings, toFontVariationSettings, radius, containerRef])

  return (
    <motion.span
      ref={elementRef}
      className={`${className} cursor-pointer`}
      style={{
        fontFamily: "var(--font-space-grotesk)",
        display: "inline-block"  // Needed for proper getBoundingClientRect
      }}
    >
      {label}
    </motion.span>
  )
}
