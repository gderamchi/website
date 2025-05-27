import { useEffect, useRef, type RefObject } from 'react'
import { scroll, animate } from 'motion'
import { PERFORMANCE } from '../lib/constants'

interface UseScrollAnimationOptions {
  target?: Element | null
  offset?: [string, string]
  enabled?: boolean
}

export function useScrollAnimation(
  callback: (progress: number) => void,
  options: UseScrollAnimationOptions = {}
) {
  const {
    target,
    offset = ['start end', 'end start'],
    enabled = true
  } = options

  useEffect(() => {
    if (!enabled || !target) return

    let animationFrameId: number

    const unsubscribe = scroll((progress) => {
      if (PERFORMANCE.animationFrameThrottle) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }
        
        animationFrameId = requestAnimationFrame(() => {
          callback(progress)
        })
      } else {
        callback(progress)
      }
    }, {
      target,
      offset
    })

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      unsubscribe()
    }
  }, [target, enabled, callback, offset])
}

export function useParallaxAnimation(
  ref: RefObject<HTMLElement | null>,
  options: {
    scale?: number
    rotation?: number
    translateY?: number
    enabled?: boolean
  } = {}
) {
  const {
    scale = 0.15,
    rotation = 8,
    translateY = -60,
    enabled = true
  } = options

  useScrollAnimation((progress) => {
    if (!ref.current) return

    const scaleValue = 1 + progress * scale
    const rotationValue = progress * rotation
    const translateYValue = progress * translateY

    animate(ref.current, {
      transform: `translateY(${translateYValue}px) scale(${scaleValue}) rotate(${rotationValue}deg)`,
      filter: `brightness(${1 + progress * 0.2}) contrast(${1 + progress * 0.1})`
    }, { duration: 0 })
  }, {
    target: ref.current,
    enabled
  })
}

export function useTextRevealAnimation(
  ref: RefObject<HTMLElement | null>,
  options: {
    opacity?: number
    translateY?: number
    translateX?: number
    blur?: number
    enabled?: boolean
  } = {}
) {
  const {
    opacity = 0.8,
    translateY = 40,
    translateX = -25,
    blur = 2,
    enabled = true
  } = options

  useScrollAnimation((progress) => {
    if (!ref.current) return

    const opacityValue = Math.max(0.2, 1 + progress * -opacity)
    const translateYValue = progress * translateY
    const translateXValue = progress * translateX
    const blurValue = progress * blur

    animate(ref.current, {
      opacity: opacityValue,
      transform: `translateY(${translateYValue}px) translateX(${translateXValue}px)`,
      filter: `blur(${blurValue}px)`
    }, { duration: 0 })
  }, {
    target: ref.current,
    enabled
  })
}
