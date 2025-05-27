import React from 'react'
import { cn } from '../../lib/utils'

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
  // For now, we'll use a beautiful placeholder instead of actual Lottie
  // This removes the dependency on @lottiefiles/dotlottie-react
  return (
    <div className={cn("w-full h-full relative", className)}>
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 rounded-2xl overflow-hidden">
        <div className="text-center space-y-6 relative">
          {/* Main animated element */}
          <div className="w-32 h-32 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/25 rounded-full mx-auto flex items-center justify-center animate-pulse shadow-2xl border border-primary/20">
            <span className="text-5xl animate-bounce">⚡</span>
          </div>
          
          {/* Text */}
          <div className="space-y-2">
            <p className="text-lg font-semibold text-foreground">Interactive Animation</p>
            <p className="text-sm text-muted-foreground">Hero Animation Placeholder</p>
          </div>
          
          {/* Orbiting elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary/40 rounded-full animate-ping"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-accent/60 rounded-full animate-pulse delay-150"></div>
            <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-secondary/30 rounded-full animate-bounce delay-300"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LottieAnimation
