'use client'

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

interface FBXModelProps {
  url: string
  onLoad?: () => void
  onError?: (error: any) => void
}

function FBXModel({ url, onLoad, onError }: FBXModelProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [model, setModel] = useState<THREE.Group | null>(null)

  useEffect(() => {
    const loader = new FBXLoader()
    
    loader.load(
      url,
      (fbx) => {
        // Debug: Log model information
        console.log('FBX Model loaded:', fbx)
        console.log('Model children count:', fbx.children.length)
        console.log('Model bounding box:', fbx.boundingBox)
        
        // Calculate bounding box to determine appropriate scaling
        const box = new THREE.Box3().setFromObject(fbx)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        
        console.log('Model size:', size)
        console.log('Model center:', center)
        
        // Auto-scale based on model size (target size of 3 units max)
        const maxDimension = Math.max(size.x, size.y, size.z)
        const scale = maxDimension > 0 ? Math.min(3 / maxDimension, 1) : 0.5
        
        fbx.scale.setScalar(scale)
        
        // Simple centering - just move to origin
        fbx.position.set(0, 0, 0)
        
        // If the model is too far from origin, center it
        if (center.length() > 5) {
          fbx.position.x = -center.x * scale
          fbx.position.y = -center.y * scale
          fbx.position.z = -center.z * scale
        }
        
        // Ensure materials are visible
        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
            
            // Fix materials
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((mat) => {
                  mat.needsUpdate = true
                  // Ensure material is visible
                  if (mat instanceof THREE.MeshPhongMaterial || mat instanceof THREE.MeshLambertMaterial) {
                    mat.transparent = false
                    mat.opacity = 1
                  }
                })
              } else {
                child.material.needsUpdate = true
                // Ensure material is visible
                if (child.material instanceof THREE.MeshPhongMaterial || child.material instanceof THREE.MeshLambertMaterial) {
                  child.material.transparent = false
                  child.material.opacity = 1
                }
              }
            } else {
              // Add default material if none exists
              child.material = new THREE.MeshPhongMaterial({ 
                color: 0x888888,
                side: THREE.DoubleSide
              })
            }
            
            console.log('Mesh found:', child.name, 'Material:', child.material)
          }
        })
        
        console.log('Final model position:', fbx.position)
        console.log('Final model scale:', fbx.scale)
        
        setModel(fbx)
        onLoad?.()
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%')
      },
      (error) => {
        console.error('Error loading FBX:', error)
        onError?.(error)
      }
    )
  }, [url, onLoad, onError])

  // Removed auto-rotation to prevent unwanted movement
  // useFrame((state) => {
  //   if (meshRef.current) {
  //     meshRef.current.rotation.y += 0.005
  //   }
  // })

  if (!model) return null

  return <primitive ref={meshRef} object={model} />
}

function LoadingSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl"
    >
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 mx-auto border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Loading 3D model...
        </p>
      </div>
    </motion.div>
  )
}

function ViewerControls({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 left-4 space-y-2"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onReset}
        className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 glass-effect"
        title="Reset view"
      >
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </motion.button>
    </motion.div>
  )
}

interface FBXViewerProps {
  file: File | null
  onBack?: () => void
}

export default function FBXViewer({ file, onBack }: FBXViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setModelUrl(url)
      setIsLoading(true)
      setError(null)

      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [file])

  const handleModelLoad = () => {
    setIsLoading(false)
  }

  const handleModelError = (error: any) => {
    setIsLoading(false)
    setError('Failed to load 3D model. Please ensure the file is a valid FBX format.')
  }

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  if (!file || !modelUrl) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[600px] relative rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
    >
      {onBack && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="absolute top-4 left-4 z-10 flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 glass-effect"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      )}

      <div className="absolute top-4 right-4 z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg glass-effect"
        >
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate max-w-48">
            {file.name}
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {isLoading && <LoadingSpinner />}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-xl"
          >
            <div className="text-center space-y-2 p-8">
              <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                Loading Error
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400 max-w-md">
                {error}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Canvas shadows camera={{ position: [0, 0, 5], fov: 75 }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight
          position={[-10, -10, -10]}
          intensity={0.6}
        />
        <pointLight position={[5, 5, 5]} intensity={0.4} />
        <pointLight position={[-5, -5, -5]} intensity={0.4} />

        <Suspense fallback={null}>
          <FBXModel
            url={modelUrl}
            onLoad={handleModelLoad}
            onError={handleModelError}
          />
          <ContactShadows
            position={[0, -1, 0]}
            opacity={0.4}
            scale={10}
            blur={1}
            far={10}
            resolution={256}
            color="#000000"
          />
          {/* Environment removed to prevent HDR loading errors */}
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={20}
          autoRotate={false}
        />
      </Canvas>

      {!isLoading && !error && <ViewerControls onReset={resetView} />}
    </motion.div>
  )
}