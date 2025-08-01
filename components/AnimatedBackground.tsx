'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const FloatingShape = ({ 
  size, 
  initialX, 
  initialY, 
  duration, 
  delay 
}: { 
  size: number
  initialX: number
  initialY: number
  duration: number
  delay: number
}) => {
  return (
    <motion.div
      className="absolute rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-xl"
      style={{
        width: size,
        height: size,
        left: initialX,
        top: initialY,
      }}
      animate={{
        x: [0, 100, -50, 0],
        y: [0, -100, 50, 0],
        scale: [1, 1.2, 0.8, 1],
        opacity: [0.3, 0.6, 0.3, 0.3],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

const GridPattern = () => {
  return (
    <div className="absolute inset-0 opacity-30">
      <svg width="100%" height="100%">
        <defs>
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-300 dark:text-gray-700"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  )
}

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900"
      />
      
      <GridPattern />
      
      {[...Array(8)].map((_, i) => (
        <FloatingShape
          key={i}
          size={Math.random() * 200 + 100}
          initialX={Math.random() * window.innerWidth}
          initialY={Math.random() * window.innerHeight}
          duration={Math.random() * 10 + 15}
          delay={Math.random() * 5}
        />
      ))}
      
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-600/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}