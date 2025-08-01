'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FileUpload from '../components/FileUpload'
import FBXViewer from '../components/FBXViewer'
import AnimatedBackground from '../components/AnimatedBackground'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showViewer, setShowViewer] = useState(false)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setShowViewer(true)
  }

  const handleBackToUpload = () => {
    setShowViewer(false)
    setSelectedFile(null)
  }

  return (
    <main className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{ backgroundSize: '200% 200%' }}
            >
              3D FBX Viewer
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Upload your FBX 3D models and view them with our interactive, real-time 3D viewer
            </motion.p>
          </motion.div>
        </header>

        <div className="flex-1 flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            {!showViewer ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl"
              >
                <FileUpload onFileSelect={handleFileSelect} />
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="mt-12 text-center"
                >
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                    Features
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    {[
                      {
                        icon: "🎯",
                        title: "High Quality Rendering",
                        description: "Advanced Three.js rendering with realistic lighting and shadows"
                      },
                      {
                        icon: "🎮",
                        title: "Interactive Controls",
                        description: "Rotate, zoom, and pan to explore your 3D models from every angle"
                      },
                      {
                        icon: "⚡",
                        title: "Fast Loading",
                        description: "Optimized FBX loader with real-time progress tracking"
                      }
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg glass-effect hover:shadow-xl transition-all duration-300"
                      >
                        <div className="text-3xl mb-3">{feature.icon}</div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="viewer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-6xl"
              >
                <FBXViewer file={selectedFile} onBack={handleBackToUpload} />
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="mt-6 text-center"
                >
                  <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow-lg glass-effect inline-block">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use mouse to rotate • Scroll to zoom • Right-click and drag to pan
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="p-6 text-center">
          <motion.p 
            className="text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Developed By Reza Abdolmaleki geeekboy92@gmail.com
          </motion.p>
        </footer>
      </div>
    </main>
  )
}