import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { ArrowRight, Mail } from 'lucide-react'
import { LottieAnimation } from '../animations/lottie'
import { useParallaxAnimation, useTextRevealAnimation, useScrollAnimation } from '../../hooks/useScrollAnimations'
import { useMouseInteraction } from '../../hooks/useMouseInteraction'
import { ANIMATION_DURATION, ANIMATION_EASE } from '../../lib/constants'
import { animate } from 'motion'
import heroAnimationData from '../../assets/hero-animation.json'

interface HeroSectionProps {
  title: string
  subtitle: string
  description: string
  ctaProjects: string
  ctaContact: string
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  ctaProjects,
  ctaContact,
}) => {
  const animationRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const floatingElementsRef = useRef<HTMLDivElement>(null)

  // Apply parallax animation to the main animation container
  useParallaxAnimation(animationRef, {
    scale: 0.15,
    rotation: 8,
    translateY: -60
  })

  // Apply text reveal animation
  useTextRevealAnimation(textRef, {
    opacity: 0.8,
    translateY: 40,
    translateX: -25,
    blur: 2
  })

  // Floating elements animation
  useScrollAnimation((progress) => {
    if (!floatingElementsRef.current) return

    const elements = floatingElementsRef.current.children
    Array.from(elements).forEach((element, index) => {
      const delay = index * 0.5
      const waveOffset = Math.sin(progress * Math.PI * 2 + delay) * 20
      const rotationOffset = progress * (45 + index * 15)
      
      animate(element as Element, {
        transform: `translateY(${waveOffset}px) rotate(${rotationOffset}deg)`,
        opacity: 0.3 + Math.abs(Math.sin(progress * Math.PI + delay)) * 0.7
      }, { duration: 0 })
    })
  }, {
    target: floatingElementsRef.current
  })

  // Mouse interaction for 3D tilt effect
  const { mouseHandlers } = useMouseInteraction(animationRef, {
    tiltStrength: 20,
    scaleOnHover: 1.05,
    glowEffect: true
  })

  // Framer Motion variants for entrance animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: ANIMATION_DURATION.slow,
        ease: ANIMATION_EASE.smooth,
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: ANIMATION_DURATION.normal,
        ease: ANIMATION_EASE.bouncy,
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: ANIMATION_DURATION.normal,
        ease: ANIMATION_EASE.bouncy,
        delay: 0.4,
      },
    },
    hover: { 
      scale: 1.05,
      transition: { 
        duration: ANIMATION_DURATION.fast,
        ease: ANIMATION_EASE.snappy 
      }
    },
    tap: { 
      scale: 0.95,
      transition: { 
        duration: ANIMATION_DURATION.fast 
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Background floating elements */}
      <div 
        ref={floatingElementsRef}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary/20 rounded-full blur-sm" />
        <div className="absolute top-40 right-20 w-6 h-6 bg-secondary/15 rounded-full blur-sm" />
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-accent/25 rounded-full blur-sm" />
        <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-primary/15 rounded-full blur-sm" />
        <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-secondary/30 rounded-full blur-sm" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column - Text Content */}
          <div ref={textRef} className="space-y-8 text-center lg:text-left">
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-muted-foreground">
                {subtitle}
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              {description}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button size="lg" className="group">
                  {ctaProjects}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>

              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button variant="outline" size="lg" className="group">
                  <Mail className="mr-2 h-5 w-5" />
                  {ctaContact}
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Animation */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <div
              ref={animationRef}
              className="relative mx-auto max-w-lg lg:max-w-xl"
              {...mouseHandlers}
            >
              <LottieAnimation
                animationData={heroAnimationData}
                className="w-full h-auto aspect-square"
                autoplay={true}
                loop={true}
                speed={1}
              />
              
              {/* Backdrop blur overlay for enhanced visual effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl backdrop-blur-sm pointer-events-none" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}

export default HeroSection
