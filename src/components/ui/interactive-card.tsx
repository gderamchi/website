import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '../../lib/utils'

interface InteractiveCardProps {
  children: React.ReactNode
  className?: string
  glowEffect?: boolean
  tiltEffect?: boolean
  magneticEffect?: boolean
  onClick?: () => void
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className,
  glowEffect = true,
  tiltEffect = true,
  magneticEffect = false,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg'])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || !tiltEffect) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={cn(
        'relative bg-card border border-border rounded-xl overflow-hidden',
        'cursor-pointer transition-all duration-300',
        className
      )}
      style={tiltEffect ? {
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      } : undefined}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={magneticEffect ? { 
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      } : {
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow effect */}
      {glowEffect && isHovered && (
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-primary/20 to-accent/20 blur-lg rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ zIndex: -1 }}
        />
      )}

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ 
          background: `linear-gradient(
            135deg, 
            rgba(255,255,255,0.1) 0%, 
            rgba(255,255,255,0.05) 50%, 
            transparent 100%
          )`,
        }}
        animate={isHovered ? { opacity: 0.7 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Border glow */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['200% 0%', '-200% 0%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 p-6"
        style={tiltEffect ? { 
          transform: 'translateZ(20px)',
        } : undefined}
      >
        {children}
      </motion.div>

      {/* Interactive elements */}
      <motion.div
        className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full opacity-0"
        animate={isHovered ? { 
          opacity: [0, 1, 0],
          scale: [1, 1.5, 1],
        } : { opacity: 0 }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      <motion.div
        className="absolute bottom-4 left-4 w-1 h-1 bg-primary rounded-full opacity-0"
        animate={isHovered ? { 
          opacity: [0, 0.6, 0],
          scale: [1, 2, 1],
        } : { opacity: 0 }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />
    </motion.div>
  )
}

export default InteractiveCard
