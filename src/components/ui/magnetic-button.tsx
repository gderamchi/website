import React, { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '../../lib/utils'

interface MagneticButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  children: React.ReactNode
  strength?: number
  range?: number
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost'
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.3,
  range = 100,
  className,
  variant = 'primary',
  ...props
}) => {
  const ref = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 300, damping: 30 })
  const springY = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(springY, [-range, range], [15, -15])
  const rotateY = useTransform(springX, [-range, range], [-15, 15])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = e.clientX - centerX
    const deltaY = e.clientY - centerY

    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)

    if (distance < range) {
      x.set(deltaX * strength)
      y.set(deltaY * strength)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  const rippleVariants = {
    hidden: { scale: 0, opacity: 0.8 },
    visible: { 
      scale: 4, 
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    },
  }

  const baseClasses = cn(
    'relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'overflow-hidden',
    {
      'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary shadow-lg': variant === 'primary',
      'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary': variant === 'secondary',
      'hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent': variant === 'ghost',
    }
  )

  return (
    <motion.button
      ref={ref}
      className={cn(baseClasses, className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        x: springX,
        y: springY,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: variant === 'primary' 
          ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
          : '0 5px 15px rgba(0, 0, 0, 0.1)'
      }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {/* Ripple effect */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-lg"
          variants={rippleVariants}
          initial="hidden"
          animate="visible"
          style={{ transformOrigin: 'center' }}
        />
      )}

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ 
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
          transform: 'translateX(-100%)',
        }}
        animate={isHovered ? { transform: 'translateX(100%)' } : { transform: 'translateX(-100%)' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex items-center gap-2"
        style={{ 
          transform: 'translateZ(20px)',
        }}
      >
        {children}
      </motion.div>

      {/* Glow effect for primary variant */}
      {variant === 'primary' && isHovered && (
        <motion.div
          className="absolute inset-0 bg-primary/50 blur-xl rounded-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1.2 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{ zIndex: -1 }}
        />
      )}
    </motion.button>
  )
}

export default MagneticButton
