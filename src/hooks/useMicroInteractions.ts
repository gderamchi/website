import React, { useRef, useEffect, useCallback } from 'react'
import { animate, stagger, motion } from 'framer-motion'

// Utility to check if user prefers reduced motion
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Base animation options that respect reduced motion preferences
const getAnimationOptions = (options: any = {}) => {
  if (prefersReducedMotion()) {
    return {
      ...options,
      duration: 0.01,
      transition: { duration: 0.01 }
    }
  }
  return options
}

interface UseGlitchEffectOptions {
  intensity?: number
  duration?: number
  trigger?: 'hover' | 'click' | 'auto'
}

export const useGlitchEffect = (
  options: UseGlitchEffectOptions = {}
) => {
  const { intensity = 5, duration = 0.2, trigger = 'hover' } = options
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current

    const triggerGlitch = () => {
      // Create multiple glitch layers
      const glitchLayers: HTMLElement[] = []
      
      for (let i = 0; i < 3; i++) {
        const layer = element.cloneNode(true) as HTMLElement
        layer.style.position = 'absolute'
        layer.style.top = '0'
        layer.style.left = '0'
        layer.style.zIndex = `${-i - 1}`
        layer.style.pointerEvents = 'none'
        
        // Apply different glitch colors
        const colors = ['#ff0000', '#00ff00', '#0000ff']
        layer.style.color = colors[i] || '#ffffff'
        layer.style.mixBlendMode = 'multiply'
        
        element.parentNode?.insertBefore(layer, element)
        glitchLayers.push(layer)
      }

      // Animate the glitch effect
      const glitchAnimation = () => {
        glitchLayers.forEach((layer, index) => {
          const offsetX = (Math.random() - 0.5) * intensity
          const offsetY = (Math.random() - 0.5) * intensity * 0.5
          
          animate(layer, {
            x: offsetX,
            y: offsetY,
            opacity: Math.random() * 0.8 + 0.2,
          }, {
            duration: 0.05,
            ease: 'linear',
          })
        })
      }

      const interval = setInterval(glitchAnimation, 50)

      // Clean up after duration
      setTimeout(() => {
        clearInterval(interval)
        glitchLayers.forEach(layer => layer.remove())
      }, duration * 1000)
    }

    if (trigger === 'hover') {
      element.addEventListener('mouseenter', triggerGlitch)
      return () => element.removeEventListener('mouseenter', triggerGlitch)
    } else if (trigger === 'click') {
      element.addEventListener('click', triggerGlitch)
      return () => element.removeEventListener('click', triggerGlitch)
    } else if (trigger === 'auto') {
      const autoInterval = setInterval(triggerGlitch, 3000)
      return () => clearInterval(autoInterval)
    }
  }, [intensity, duration, trigger])

  return ref
}

interface UseTypewriterEffectOptions {
  text: string
  speed?: number
  cursor?: boolean
  loop?: boolean
  delay?: number
}

export const useTypewriterEffect = (
  options: UseTypewriterEffectOptions
) => {
  const { text, speed = 50, cursor = true, loop = false, delay = 0 } = options
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    let timeouts: NodeJS.Timeout[] = []

    const typeWriter = (targetText: string, startIndex = 0) => {
      element.textContent = ''
      
      if (cursor) {
        element.innerHTML = '<span class="typewriter-cursor">|</span>'
      }

      for (let i = 0; i <= targetText.length; i++) {
        const timeout = setTimeout(() => {
          const currentText = targetText.slice(0, i)
          const cursorSpan = cursor ? '<span class="typewriter-cursor animate-pulse">|</span>' : ''
          element.innerHTML = currentText + cursorSpan
          
          if (i === targetText.length && loop) {
            setTimeout(() => {
              // Reverse animation
              for (let j = targetText.length; j >= 0; j--) {
                const reverseTimeout = setTimeout(() => {
                  const currentText = targetText.slice(0, j)
                  const cursorSpan = cursor ? '<span class="typewriter-cursor animate-pulse">|</span>' : ''
                  element.innerHTML = currentText + cursorSpan
                  
                  if (j === 0) {
                    setTimeout(() => typeWriter(targetText), 1000)
                  }
                }, (targetText.length - j) * speed)
                timeouts.push(reverseTimeout)
              }
            }, 2000)
          }
        }, i * speed + delay)
        
        timeouts.push(timeout)
      }
    }

    typeWriter(text)

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout))
    }
  }, [text, speed, cursor, loop, delay])

  return ref
}

interface UseScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  animationType?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate'
  duration?: number
  delay?: number
  staggerChildren?: number
}

export const useScrollReveal = (
  options: UseScrollRevealOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    animationType = 'fadeUp',
    duration = 0.6,
    delay = 0,
    staggerChildren = 0.1
  } = options
  
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const children = Array.from(element.children) as HTMLElement[]

    // Set initial styles based on animation type
    const getInitialStyles = () => {
      switch (animationType) {
        case 'fadeUp':
          return { opacity: 0, y: 50 }
        case 'fadeIn':
          return { opacity: 0 }
        case 'slideLeft':
          return { opacity: 0, x: -50 }
        case 'slideRight':
          return { opacity: 0, x: 50 }
        case 'scale':
          return { opacity: 0, scale: 0.8 }
        case 'rotate':
          return { opacity: 0, rotate: -10 }
        default:
          return { opacity: 0, y: 50 }
      }
    }

    const getFinalStyles = () => {
      switch (animationType) {
        case 'fadeUp':
        case 'fadeIn':
        case 'slideLeft':
        case 'slideRight':
          return { opacity: 1, x: 0, y: 0 }
        case 'scale':
          return { opacity: 1, scale: 1 }
        case 'rotate':
          return { opacity: 1, rotate: 0 }
        default:
          return { opacity: 1, x: 0, y: 0 }
      }
    }

    // Apply initial styles
    animate(element, getInitialStyles(), { duration: 0 })
    children.forEach(child => {
      animate(child, getInitialStyles(), { duration: 0 })
    })

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            // Animate the main element
            animate(element, getFinalStyles(), {
              duration,
              ease: [0.25, 0.46, 0.45, 0.94],
            })

            // Animate children with stagger
            if (children.length > 0) {
              animate(children, getFinalStyles(), {
                duration,
                delay: stagger(staggerChildren),
                ease: [0.25, 0.46, 0.45, 0.94],
              })
            }
          }, delay * 1000)

          observer.unobserve(entry.target)
        }
      })
    }, { threshold, rootMargin })

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, rootMargin, animationType, duration, delay, staggerChildren])

  return ref
}

interface UseParallaxScrollOptions {
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  offset?: number
}

export const useParallaxScroll = (
  options: UseParallaxScrollOptions = {}
) => {
  const { speed = 0.5, direction = 'up', offset = 0 } = options
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current

    const handleScroll = () => {
      const scrolled = window.pageYOffset
      const rate = scrolled * speed

      let transform = ''
      switch (direction) {
        case 'up':
          transform = `translateY(${-rate + offset}px)`
          break
        case 'down':
          transform = `translateY(${rate + offset}px)`
          break
        case 'left':
          transform = `translateX(${-rate + offset}px)`
          break
        case 'right':
          transform = `translateX(${rate + offset}px)`
          break
      }

      element.style.transform = transform
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, direction, offset])

  return ref
}

// Magnetic Button Effect
interface UseMagneticEffectOptions {
  strength?: number
  threshold?: number
  restoreSpeed?: number
}

export const useMagneticEffect = <T extends HTMLElement = HTMLElement>(
  options: UseMagneticEffectOptions = {}
) => {
  const { strength = 0.3, threshold = 50, restoreSpeed = 0.6 } = options
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return

    const element = ref.current
    let isHovering = false

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering || !element) return

      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      if (distance < threshold) {
        const force = (threshold - distance) / threshold
        const moveX = deltaX * strength * force
        const moveY = deltaY * strength * force

        animate(element, {
          x: moveX,
          y: moveY,
        }, { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] })
      }
    }

    const handleMouseEnter = () => {
      isHovering = true
      animate(element, {
        scale: 1.05,
      }, { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] })
    }

    const handleMouseLeave = () => {
      isHovering = false
      animate(element, {
        x: 0,
        y: 0,
        scale: 1,
      }, { duration: restoreSpeed, ease: [0.25, 0.46, 0.45, 0.94] })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength, threshold, restoreSpeed])

  return ref
}

// Ripple Effect
export const useRippleEffect = () => {
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number; size: number }>>([])

  const triggerRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion()) return

    const rect = e.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const rippleId = Date.now()
    setRipples(prev => [...prev, { id: rippleId, x, y, size }])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId))
    }, 600)
  }, [])

  const rippleElements = React.createElement('div', { 
    className: 'absolute inset-0 pointer-events-none overflow-hidden' 
  }, ripples.map(ripple => 
    React.createElement('div', {
      key: ripple.id,
      className: 'absolute rounded-full bg-white/30 animate-ping',
      style: {
        width: ripple.size,
        height: ripple.size,
        left: ripple.x,
        top: ripple.y,
        animationDuration: '0.6s',
        animationFillMode: 'forwards'
      }
    })
  ))

  return { triggerRipple, ripples: rippleElements }
}

// Breathing Effect
interface BreathingEffectOptions {
  intensity?: number
  duration?: number
}

export const useBreathingEffect = (options: BreathingEffectOptions = {}) => {
  const { intensity = 0.05, duration = 2000 } = options
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return

    const element = ref.current

    animate(element, {
      scale: [1, 1 + intensity, 1],
    }, getAnimationOptions({
      duration: duration / 1000,
      repeat: Infinity,
      ease: 'easeInOut',
    }))

    return () => {
      animate(element, { scale: 1 }, { duration: 0.3 })
    }
  }, [intensity, duration])

  return ref
}

// Staggered Reveal Animation
interface StaggerRevealOptions {
  selector?: string
  delay?: number
}

export const useStaggerReveal = (
  selector: string = '.stagger-item',
  options: StaggerRevealOptions = {}
) => {
  const { delay = 0.1 } = options
  const ref = useRef<HTMLDivElement>(null)

  const triggerStagger = useCallback(() => {
    if (!ref.current || prefersReducedMotion()) return

    const elements = ref.current.querySelectorAll(selector)
    
    // Reset elements first
    animate(elements, {
      opacity: 0,
      y: 20,
    }, { duration: 0 })

    // Then animate them in
    animate(elements, {
      opacity: 1,
      y: 0,
    }, getAnimationOptions({
      delay: stagger(delay),
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    }))
  }, [selector, delay])

  return { ref, triggerStagger }
}

export default {
  useGlitchEffect,
  useTypewriterEffect,
  useScrollReveal,
  useParallaxScroll,
  useMagneticEffect,
  useRippleEffect,
  useBreathingEffect,
  useStaggerReveal,
}
