"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Pixel {
  id: number;
  x: number;
  y: number;
}

interface PixelTrailProps {
  pixelSize?: number;
  fadeDuration?: number;
  pixelClassName?: string;
}

export default function PixelTrail({
  pixelSize = 24,
  fadeDuration = 500,
  pixelClassName = "bg-white",
}: PixelTrailProps) {
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [isActive, setIsActive] = useState(true);
  const nextPixelId = useRef(0);

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newPixel: Pixel = {
        id: nextPixelId.current,
        x: e.clientX - pixelSize / 2,
        y: e.clientY - pixelSize / 2,
      };

      setPixels((prev) => [...prev, newPixel]);
      nextPixelId.current += 1;

      // Add cleanup timeout
      setTimeout(() => {
        setPixels((prev) => prev.filter((p) => p.id !== newPixel.id));
      }, fadeDuration);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isActive, pixelSize, fadeDuration]);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {pixels.map((pixel) => (
        <motion.div
          key={pixel.id}
          className={`absolute ${pixelClassName}`}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0 }}
          transition={{ duration: fadeDuration / 500, ease: "linear" }}
          style={{
            left: pixel.x,
            top: pixel.y,
            width: pixelSize,
            height: pixelSize,
          }}
        />
      ))}
    </div>
  );
}
