import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { scroll, animate } from 'motion'
import { Button } from './ui/button'
import { ArrowRight, Mail } from 'lucide-react'
import { LottieAnimation } from './ui/lottie'
import heroAnimationData from '../assets/hero-animation.json'

interface HeroSectionProps {
  title: string
  subtitle: string
  description: string
  ctaProjects: string
  ctaContact: string
  lang: string
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  ctaProjects,
  ctaContact,
  lang
}) => {
  const animationRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const floatingElementsRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Mouse move handler for interactive effects
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (animationRef.current) {
      const rect = animationRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      setMousePosition({ x, y })
    }
  }
  
  useEffect(() => {
    let animationFrameId: number
    
    if (animationRef.current && textRef.current) {
      // Throttled parallax effect for the animation
      const unsubscribeAnimation = scroll((progress) => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }
        
        animationFrameId = requestAnimationFrame(() => {
          if (animationRef.current) {
            const scale = 1 + progress * 0.15
            const rotation = progress * 8
            const translateY = progress * -60
            
            animate(animationRef.current, {
              transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotation}deg)`,
              filter: `brightness(${1 + progress * 0.2}) contrast(${1 + progress * 0.1})`
            }, { duration: 0 })
          }
        })
      }, {
        target: animationRef.current,
        offset: ['start end', 'end start']
      })

      // Enhanced text reveal animation with staggered effect
      const unsubscribeText = scroll((progress) => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }
        
        animationFrameId = requestAnimationFrame(() => {
          if (textRef.current) {
            const opacity = Math.max(0.2, 1 + progress * -0.8)
            const translateY = progress * 40
            const translateX = progress * -25
            
            animate(textRef.current, {
              opacity,
              transform: `translateY(${translateY}px) translateX(${translateX}px)`,
              filter: `blur(${progress * 2}px)`
            }, { duration: 0 })
          }
        })
      }, {
        target: textRef.current,
        offset: ['start end', 'end start']
      })

      // Enhanced floating elements with wave motion
      if (floatingElementsRef.current) {
        const unsubscribeFloating = scroll((progress) => {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId)
          }
          
          animationFrameId = requestAnimationFrame(() => {
            if (floatingElementsRef.current) {
              const elements = floatingElementsRef.current.children
              Array.from(elements).forEach((element, index) => {
                const delay = index * 0.2
                const amplitude = (index + 1) * 25
                const frequency = 1.5 + index * 0.5
                const waveY = Math.sin(progress * Math.PI * frequency + delay) * amplitude
                const waveX = Math.cos(progress * Math.PI * frequency * 0.7 + delay) * (amplitude * 0.3)
                const rotation = progress * 270 + index * 90
                const scale = 1 + Math.sin(progress * Math.PI * 2 + delay) * 0.3
                
                animate(element as Element, {
                  transform: `translateY(${waveY}px) translateX(${waveX}px) rotate(${rotation}deg) scale(${scale})`,
                  opacity: 0.3 + Math.abs(Math.sin(progress * Math.PI + delay)) * 0.7
                }, { duration: 0 })
              })
            }
          })
        }, {
          target: floatingElementsRef.current,
          offset: ['start end', 'end start']
        })

        return () => {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId)
          }
          unsubscribeAnimation()
          unsubscribeText()
          unsubscribeFloating()
        }
      }

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }
        unsubscribeAnimation()
        unsubscribeText()
      }
    }
  }, [])
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects')
    projectsSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 hero-gradient">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Text Content */}
          <div className="space-y-8" ref={textRef}>
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                {title}
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground font-medium">
                {subtitle}
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground text-pretty leading-relaxed max-w-2xl"
            >
              {description}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={scrollToProjects}
                className="inline-flex items-center gap-2 group"
              >
                {ctaProjects}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                asChild
                className="inline-flex items-center gap-2"
              >
                <a href="mailto:guillaume.deramchi@viacesi.fr">
                  <Mail className="h-4 w-4" />
                  {ctaContact}
                </a>
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                Available for new opportunities
              </div>
            </motion.div>
          </div>

          {/* Lottie Animation */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center lg:justify-end"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="relative w-full max-w-lg aspect-square cursor-pointer" 
              ref={animationRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onMouseMove={handleMouseMove}
              style={{
                transform: isHovered ? `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * 10}deg) rotateY(${(mousePosition.x - 0.5) * 10}deg)` : 'none',
                transition: 'transform 0.1s ease-out'
              }}
            >
              {/* Lottie Animation with Motion One scroll effects */}
              <LottieAnimation
                animationData={heroAnimationData}
                className="w-full h-full drop-shadow-2xl"
                autoplay={true}
                loop={true}
                speed={0.8}
              />
              
              {/* Floating elements with enhanced scroll animations and mouse interaction */}
              <div ref={floatingElementsRef}>
                <motion.div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full backdrop-blur-sm"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 180, 360],
                    scale: isHovered ? [1, 1.3, 1] : [1, 1.1, 1],
                  }}
                  transition={{
                    duration: isHovered ? 2 : 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    x: isHovered ? (mousePosition.x - 0.5) * 20 : 0,
                    y: isHovered ? (mousePosition.y - 0.5) * 20 : 0,
                  }}
                />
                
                <motion.div
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary/30 rounded-full backdrop-blur-sm"
                  animate={{
                    y: [0, 10, 0],
                    x: [0, 5, 0],
                    scale: isHovered ? [1, 1.4, 1] : [1, 1.2, 1],
                  }}
                  transition={{
                    duration: isHovered ? 2.5 : 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  style={{
                    x: isHovered ? (mousePosition.x - 0.5) * -15 : 0,
                    y: isHovered ? (mousePosition.y - 0.5) * -15 : 0,
                  }}
                />
                
                <motion.div
                  className="absolute top-1/2 -left-8 w-4 h-4 bg-accent/40 rounded-full backdrop-blur-sm"
                  animate={{
                    scale: isHovered ? [1, 1.6, 1] : [1, 1.2, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: isHovered ? 2 : 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  style={{
                    x: isHovered ? (mousePosition.x - 0.5) * 25 : 0,
                    y: isHovered ? (mousePosition.y - 0.5) * 25 : 0,
                  }}
                />
                
                {/* Additional interactive particle when hovered */}
                {isHovered && (
                  <motion.div
                    className="absolute w-3 h-3 bg-primary/50 rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0, 1.5, 0],
                      x: mousePosition.x * 300 - 150,
                      y: mousePosition.y * 300 - 150,
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-foreground/30 rounded-full mt-2"></div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection
