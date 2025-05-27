import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMagneticEffect, useRippleEffect, useBreathingEffect } from '../../hooks/useMicroInteractions'
import { Sparkles, X, Zap, Heart, Star } from 'lucide-react'

interface FloatingDemoProps {
  lang?: 'en' | 'fr'
}

const FloatingMicroInteractionsDemo: React.FC<FloatingDemoProps> = ({ 
  lang = 'en' 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  // Micro-interaction hooks
  const magneticRef = useMagneticEffect<HTMLButtonElement>({ strength: 0.4, threshold: 60 })
  const { triggerRipple, ripples } = useRippleEffect()
  const breathingRef = useBreathingEffect<HTMLButtonElement>({ intensity: 0.08, duration: 1500 })

  const demos = [
    {
      id: 'magnetic',
      icon: Zap,
      label: lang === 'fr' ? 'Magnétique' : 'Magnetic',
      color: 'from-blue-500 to-cyan-500',
      action: () => setActiveDemo('magnetic')
    },
    {
      id: 'ripple',
      icon: Sparkles,
      label: lang === 'fr' ? 'Ondulation' : 'Ripple',
      color: 'from-purple-500 to-pink-500',
      action: (e: React.MouseEvent<HTMLButtonElement>) => {
        triggerRipple(e)
        setActiveDemo('ripple')
      }
    },
    {
      id: 'breathing',
      icon: Heart,
      label: lang === 'fr' ? 'Respiration' : 'Breathing',
      color: 'from-red-500 to-orange-500',
      action: () => setActiveDemo('breathing')
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Active demo indicator */}
      <AnimatePresence>
        {activeDemo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
          >
            {lang === 'fr' ? 'Démo active:' : 'Active Demo:'} {activeDemo}
            <div className="absolute bottom-0 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black/80 transform translate-y-full" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo buttons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-20 right-0 space-y-3"
          >
            {demos.map((demo, index) => {
              const Icon = demo.icon
              return (
                <motion.button
                  key={demo.id}
                  ref={demo.id === 'magnetic' ? magneticRef : demo.id === 'breathing' ? breathingRef : undefined}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={demo.action}
                  className={`relative w-12 h-12 rounded-full bg-gradient-to-r ${demo.color} shadow-lg backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:shadow-xl transition-all duration-300 overflow-hidden group`}
                  title={demo.label}
                >
                  <Icon className="h-5 w-5 relative z-10" />
                  {demo.id === 'ripple' && ripples}
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-all duration-300 rounded-full" />
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main toggle button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen)
          if (isOpen) setActiveDemo(null)
        }}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
        aria-label={isOpen 
          ? (lang === 'fr' ? 'Fermer la démo' : 'Close demo') 
          : (lang === 'fr' ? 'Ouvrir la démo des micro-interactions' : 'Open micro-interactions demo')
        }
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Star className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-white/30"
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: [0, 1.5], opacity: [0.6, 0] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
        
        {/* Hover glow */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-all duration-300 rounded-full" />
      </motion.button>

      {/* Link to full demo */}
      <AnimatePresence>
        {isOpen && (
          <motion.a
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.3 }}
            href="/micro-interactions"
            className="absolute bottom-0 right-16 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-2 rounded-lg text-xs font-medium hover:bg-white/100 transition-all duration-300 whitespace-nowrap shadow-lg border border-gray-200"
          >
            {lang === 'fr' ? '🚀 Voir la démo complète' : '🚀 View full demo'}
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FloatingMicroInteractionsDemo
