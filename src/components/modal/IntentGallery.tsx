"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface IntentGalleryProps {
  isOpen: boolean
  onClose: () => void
}

const slides = [
  {
    title: "current direct cleint interfaces are unusable and bad",
    image: "/images/griffain_mogging.png",
    content: "griffain?  hey anon?  ngmi."
  },
  {
    title: "intents are fucky",
    image: "/images/actions.png",
    content: "literally why would you even bother?"
  },
  {
    title: "EMBRACE THE FUTURE",
    image: "/images/future.png",
    content: "literally just serve them a component bro. serving apps through a chatgpt interface is the future of computing"
  },
  {
    title: "GET IN TOUCH",
    image: "/images/me.jpeg",
    content: "ty"
  }
]

export default function IntentGallery({ isOpen, onClose }: IntentGalleryProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-black border border-white/20 p-6 max-w-2xl w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          ✕
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-white mb-4">{slides[currentSlide].title}</h2>
            <div className="aspect-video relative overflow-hidden rounded bg-black/50">
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className={`w-full h-full ${
                  currentSlide === slides.length - 1 
                    ? "object-contain" 
                    : "object-cover"
                }`}
              />
            </div>
            <p className="text-white/80 text-lg">{slides[currentSlide].content}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <button
            onClick={prevSlide}
            className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            Previous
          </button>
          <div className="flex gap-2 items-center">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSlide === index ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            Next
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
