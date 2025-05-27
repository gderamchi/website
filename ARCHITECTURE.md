# 🏗️ Code Architecture Documentation

## 📁 Project Structure

```
src/
├── assets/                 # Static assets (animations, images)
│   └── hero-animation.json  # Lottie animation data
├── components/             # React components organized by type
│   ├── animations/         # Animation-related components
│   │   ├── lottie.tsx     # Lottie animation wrapper
│   │   └── index.ts       # Animation exports
│   ├── cards/             # Card components
│   │   ├── ProjectCard.tsx
│   │   └── index.ts
│   ├── sections/          # Page section components
│   │   ├── HeroSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   └── index.ts
│   └── ui/               # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       └── index.ts
├── data/                 # Static data and content
│   └── projects.ts
├── hooks/               # Custom React hooks
│   ├── useMouseInteraction.ts
│   ├── useScrollAnimations.ts
│   └── index.ts
├── i18n/               # Internationalization
│   └── ui.ts
├── layouts/            # Astro layouts
│   └── Layout.astro
├── lib/               # Utilities and constants
│   ├── constants.ts
│   ├── utils.ts
│   └── index.ts
├── pages/             # Astro pages
│   └── index.astro
├── styles/            # Global styles
│   └── globals.css
└── types/             # TypeScript definitions
    └── global.d.ts
```

## 🧩 Architecture Principles

### Component Organization
- **`animations/`**: Components that handle complex animations (Lottie, custom animations)
- **`cards/`**: Card-based UI components for displaying structured data
- **`sections/`**: Large page sections that combine multiple components
- **`ui/`**: Basic, reusable UI components (buttons, cards, inputs)

### Custom Hooks Pattern
- **`useScrollAnimations`**: Provides scroll-based animation utilities
- **`useMouseInteraction`**: Handles mouse interaction effects (tilt, hover)
- Each hook is focused on a specific interaction pattern

### Barrel Exports
Each folder includes an `index.ts` file for clean imports:
```typescript
// Before
import { Button } from '../ui/button'
import { LottieAnimation } from '../animations/lottie'

// After
import { Button } from '../ui'
import { LottieAnimation } from '../animations'
```

## 🎭 Animation Architecture

### Motion Libraries
- **Framer Motion**: Declarative React animations, component mounting/unmounting
- **Motion One**: Imperative scroll-based animations, performance-critical effects

### Animation Hooks
```typescript
// Parallax effects
useParallaxAnimation(ref, {
  scale: 0.15,
  rotation: 8,
  translateY: -60
})

// Text reveal animations
useTextRevealAnimation(ref, {
  opacity: 0.8,
  translateY: 40,
  blur: 2
})

// Mouse interactions
const { mouseHandlers } = useMouseInteraction(ref, {
  tiltStrength: 20,
  scaleOnHover: 1.05,
  glowEffect: true
})
```

## 📐 Constants & Configuration

### Animation Constants
```typescript
export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  verySlow: 1.0
} as const

export const ANIMATION_EASE = {
  bouncy: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.23, 1, 0.32, 1],
  snappy: [0.4, 0, 0.2, 1]
} as const
```

### Performance Optimizations
- **Animation Frame Throttling**: Scroll animations use `requestAnimationFrame`
- **Cleanup Functions**: Proper cleanup to prevent memory leaks
- **Debouncing/Throttling**: Performance utilities for heavy operations

## 🔧 Development Guidelines

### Import Order
1. React and external libraries
2. Internal UI components
3. Hooks and utilities  
4. Constants and types
5. Assets and data

### Component Structure
```typescript
// 1. Imports
import React from 'react'
import { motion } from 'framer-motion'

// 2. Types
interface ComponentProps {
  // ...
}

// 3. Component
const Component: React.FC<ComponentProps> = (props) => {
  // 4. Hooks
  const ref = useRef(null)
  
  // 5. Animation variants
  const variants = {
    // ...
  }
  
  // 6. Render
  return (
    // JSX
  )
}

// 7. Export
export default Component
```

### Naming Conventions
- **Components**: PascalCase (`HeroSection`, `ProjectCard`)
- **Hooks**: camelCase with `use` prefix (`useScrollAnimations`)
- **Constants**: SCREAMING_SNAKE_CASE (`ANIMATION_DURATION`)
- **Files**: PascalCase for components, camelCase for utilities

## 📦 Dependencies Management

### Core Dependencies
- **Astro**: Static site generation framework
- **React**: UI library for interactive components
- **Framer Motion**: React animation library
- **Motion One**: High-performance animation library
- **Tailwind CSS**: Utility-first CSS framework

### Removed Dependencies
- ❌ `@lottiefiles/dotlottie-react`: Replaced with custom Lottie wrapper
- ❌ `motion-dom`: Redundant (included in `motion` package)

## 🚀 Performance Features

### Bundle Optimization
- Tree-shaking enabled for all libraries
- Barrel exports for better module bundling
- Component lazy loading where applicable

### Animation Performance
- Hardware acceleration for transforms
- Reduced paint/reflow operations
- Optimal animation timing functions

### Asset Optimization
- WebP images for projects
- JSON-based Lottie animations
- Compressed and optimized assets

## 🔍 Type Safety

### Global Types
- Motion One API declarations
- Lottie animation interfaces  
- React component prop types
- Animation variant types

### Hook Type Safety
```typescript
// Strict typing for hook parameters
useParallaxAnimation(
  ref: RefObject<HTMLElement | null>,
  options: ParallaxOptions
)
```

This architecture provides a scalable, maintainable, and performant foundation for the website with excellent developer experience and type safety throughout.
