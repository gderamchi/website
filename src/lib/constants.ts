// Animation constants
export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  verySlow: 1.0
} as const

export const ANIMATION_EASE = {
  bouncy: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.23, 1, 0.32, 1],
  snappy: [0.4, 0, 0.2, 1],
  linear: [0, 0, 1, 1]
} as const

// Scroll animation offsets
export const SCROLL_OFFSETS = {
  start: ['start end', 'end start'],
  center: ['start center', 'end center'],
  viewport: ['start 0.8', 'start 0.2']
} as const

// Theme colors (referencing CSS variables)
export const THEME_COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  muted: 'hsl(var(--muted))',
  border: 'hsl(var(--border))'
} as const

// Responsive breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const

// Performance constants
export const PERFORMANCE = {
  throttleDelay: 16, // ~60fps
  debounceDelay: 300,
  animationFrameThrottle: true
} as const
