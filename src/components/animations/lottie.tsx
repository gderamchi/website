import React, { useState } from 'react'
import { cn } from '../../lib'

interface LottieAnimationProps {
  animationData?: any
  className?: string
  autoplay?: boolean
  loop?: boolean
  speed?: number
  direction?: 1 | -1
  onComplete?: () => void
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  className,
  autoplay = true,
  loop = true,
  speed = 1,
  direction = 1,
  onComplete,
}) => {
  const [error, setError] = useState<string | null>(null)

  const handleLoadError = () => {
    setError('Failed to load animation')
  }

  if (error) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/5 rounded-2xl", className)}>
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-full mx-auto flex items-center justify-center animate-pulse shadow-lg">
            <span className="text-3xl animate-bounce">⚡</span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">Interactive Animation</p>
        </div>
      </div>
    )
  }

  // For regular JSON animation data, we'll fallback to our enhanced placeholder
  return (
    <div className={cn("w-full h-full relative", className)}>
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 rounded-2xl overflow-hidden">
        <div className="text-center space-y-6 relative">
          {/* Main animated element */}
          <div className="w-32 h-32 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/25 rounded-full mx-auto flex items-center justify-center animate-pulse shadow-2xl border border-primary/20">
            <span className="text-5xl animate-bounce">⚡</span>
          </div>
          
          {/* Orbiting elements */}
          <div className="relative">
            <div className="absolute -top-4 -right-4 w-4 h-4 bg-primary/40 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-6 w-3 h-3 bg-secondary/50 rounded-full animate-pulse"></div>
            <div className="absolute top-2 -left-8 w-2 h-2 bg-accent/60 rounded-full animate-bounce"></div>
          </div>
          
          <p className="text-muted-foreground font-medium tracking-wide">Hero Animation</p>
        </div>
      </div>
    </div>
  )
}

export default LottieAnimation
