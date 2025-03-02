"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface IntentGalleryProps {
  isOpen: boolean
  onClose: () => void
}

const slides = [
  {
    title: "CLIENT INTERFACES EXIST BUT YOU CAN'T REALLY USE THEM",
    image: "/placeholder.jpg",
    description: "Traditional interfaces are broken and unusable"
  },
  {
    title: "INTENT VALIDATION IS FUCKY",
    image: "/placeholder.jpg",
    description: "Current validation methods are fundamentally flawed"
  },
  {
    title: "LLM INTERFACES ARE THE FUTURE OF COMPUTING",
    image: "/placeholder.jpg",
    description: "Natural language is the only way forward"
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-black border border-white/20 p-8 max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-white/80"
            >
              <span className="text-2xl">×</span>
            </button>

            {/* Gallery content */}
            <div className="relative">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-white font-spaceGrotesk">
                  {slides[currentSlide].title}
                </h2>
                <div className="bg-white/5 border border-white/10 aspect-video">
                  <img
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-white/80 text-lg">
                  {slides[currentSlide].description}
                </p>
              </motion.div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevSlide}
                  className="px-4 py-2 bg-white text-black font-bold hover:bg-white/90"
                >
                  PREV
                </button>
                <div className="flex items-center space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 border border-white ${
                        currentSlide === index ? "bg-white" : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextSlide}
                  className="px-4 py-2 bg-white text-black font-bold hover:bg-white/90"
                >
                  NEXT
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
