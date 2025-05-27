import { useState, useCallback, useRef, type RefObject } from 'react'
import { animate } from 'motion'

interface UseMouseInteractionOptions {
  tiltStrength?: number
  scaleOnHover?: number
  glowEffect?: boolean
  enabled?: boolean
}

export function useMouseInteraction(
  ref: RefObject<HTMLElement | null>,
  options: UseMouseInteractionOptions = {}
) {
  const {
    tiltStrength = 20,
    scaleOnHover = 1.05,
    glowEffect = true,
    enabled = true
  } = options

  const [isHovered, setIsHovered] = useState(false)
  const animationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!enabled || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height

    animationRef.current = { x, y }

    animate(ref.current, {
      transform: `perspective(1000px) rotateX(${-y * tiltStrength}deg) rotateY(${x * tiltStrength}deg) scale(${scaleOnHover})`,
      boxShadow: glowEffect 
        ? `0 0 ${Math.abs(x * 30)}px rgba(59, 130, 246, ${Math.abs(x * 0.3)}), 0 0 ${Math.abs(y * 30)}px rgba(168, 85, 247, ${Math.abs(y * 0.3)})`
        : undefined
    }, { duration: 0.1 })
  }, [enabled, tiltStrength, scaleOnHover, glowEffect])

  const handleMouseEnter = useCallback(() => {
    if (!enabled) return
    setIsHovered(true)
  }, [enabled])

  const handleMouseLeave = useCallback(() => {
    if (!enabled || !ref.current) return

    setIsHovered(false)
    
    animate(ref.current, {
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      boxShadow: '0 0 0px rgba(59, 130, 246, 0), 0 0 0px rgba(168, 85, 247, 0)'
    }, { duration: 0.3 })
  }, [enabled])

  return {
    isHovered,
    mouseHandlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave
    }
  }
}
