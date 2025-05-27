import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

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
  const trailRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const trailElements = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }

    const animateTrail = () => {
      trailElements.current.forEach((element, index) => {
        const targetX = mousePosition.current.x - size / 2
        const targetY = mousePosition.current.y - size / 2

        const currentX = parseFloat(element.style.left) || targetX
        const currentY = parseFloat(element.style.top) || targetY

        const deltaX = targetX - currentX
        const deltaY = targetY - currentY

        const easing = 0.2 - index * 0.02

        element.style.left = `${currentX + deltaX * easing}px`
        element.style.top = `${currentY + deltaY * easing}px`
        element.style.opacity = `${0.8 - index * 0.1}`
        element.style.transform = `scale(${1 - index * 0.1})`
      })

      requestAnimationFrame(animateTrail)
    }

    // Create trail elements
    if (trailRef.current) {
      for (let i = 0; i < 8; i++) {
        const element = document.createElement('div')
        element.className = `absolute pointer-events-none rounded-full ${className || ''}`
        element.style.width = `${size}px`
        element.style.height = `${size}px`
        element.style.background = color
        element.style.position = 'fixed'
        element.style.zIndex = '9999'
        element.style.mixBlendMode = 'multiply'
        
        trailRef.current.appendChild(element)
        trailElements.current.push(element)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    animateTrail()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      trailElements.current.forEach(element => element.remove())
      trailElements.current = []
    }
  }, [color, size, delay, className])

  return <div ref={trailRef} className="pointer-events-none" />
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
          className="absolute w-1 h-1 bg-accent/30 rounded-full"
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
          style={{
            animationDelay: `${i * 0.5}s`,
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

  const shapes = Object.keys(pathVariants)

  return (
    <div className={`relative ${className || ''}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" className="absolute inset-0">
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
          style={{
            filter: 'blur(1px)',
          }}
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
