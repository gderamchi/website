import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './interactive-effects.css'

interface CursorTrailProps {
  color?: string
  size?: number
  delay?: number
  className?: string
}

export const CursorTrail: React.FC<CursorTrailProps> = ({
  color = 'rgb(59, 130, 246)',
  size = 4,
  delay = 0.05,
  className,
}) => {
  const getSizeClass = () => {
    if (size <= 3) return 'trail-size-small'
    if (size <= 5) return 'trail-size-medium'
    return 'trail-size-large'
  }

  return (
    <div className={`cursor-trail-container ${getSizeClass()} ${className || ''}`}>
      {/* Simple trail effect using CSS animations */}
      <div className="cursor-trail-element opacity-80" />
      <div className="cursor-trail-element opacity-70" />
      <div className="cursor-trail-element opacity-60" />
      <div className="cursor-trail-element opacity-50" />
    </div>
  )
}

interface FloatingParticlesProps {
  count?: number
  className?: string
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 6,
  className,
}) => {
  const particles = Array.from({ length: count }, (_, i) => i)

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className || ''}`}>
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent/30 rounded-full floating-particle"
          data-delay={i * 0.5}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

interface MorphingShapeProps {
  className?: string
  color?: string
  size?: number
}

export const MorphingShape: React.FC<MorphingShapeProps> = ({
  className,
  color = 'hsl(var(--accent))',
  size = 100,
}) => {
  const pathVariants = {
    shape1: {
      d: 'M50,10 C70,10 90,30 90,50 C90,70 70,90 50,90 C30,90 10,70 10,50 C10,30 30,10 50,10 Z',
    },
    shape2: {
      d: 'M50,5 C80,15 95,35 85,55 C75,75 55,85 35,75 C15,65 5,45 15,25 C25,5 45,5 50,5 Z',
    },
    shape3: {
      d: 'M50,15 C65,5 85,15 95,35 C95,55 85,75 65,85 C45,95 25,85 15,65 C5,45 15,25 35,15 C45,5 50,15 50,15 Z',
    },
  }

  const getSizeClass = () => {
    if (size <= 75) return 'shape-size-small'
    if (size <= 125) return 'shape-size-medium'
    return 'shape-size-large'
  }

  return (
    <div className={`relative morphing-shape-container ${getSizeClass()} ${className || ''}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className="absolute inset-0 morphing-shape-svg"
      >
        <motion.path
          fill={color}
          fillOpacity={0.6}
          animate={pathVariants.shape1}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          className="morphing-path-blur"
        />
      </svg>
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/10 to-primary/10"
        animate={{
          scale: [1, 1.2, 0.8, 1],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

export default CursorTrail
