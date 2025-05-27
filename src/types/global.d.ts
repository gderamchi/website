/// <reference types="react" />
/// <reference types="react-dom" />

import * as React from 'react'

declare global {
  namespace React {
    type FC<P = {}> = React.FunctionComponent<P>
    type ReactNode = React.ReactNode
    type ReactElement = React.ReactElement
    type CSSProperties = React.CSSProperties
    type HTMLProps<T> = React.HTMLProps<T>
    type ComponentProps<T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>> = React.ComponentProps<T>
  }

  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
    
    interface Element extends React.ReactElement<any, any> { }
    
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode
    }
    
    interface ElementAttributesProperty {
      props: {}
    }
    
    interface ElementChildrenAttribute {
      children: {}
    }
    
    type LibraryManagedAttributes<C, P> = React.LibraryManagedAttributes<C, P>
  }
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'motion' {
  export function scroll(
    onScroll: (progress: number) => void,
    options?: {
      target?: Element | string
      offset?: [string, string] | string[]
      axis?: 'x' | 'y'
    }
  ): () => void

  export function animate(
    target: Element | string,
    keyframes: Record<string, any>,
    options?: {
      duration?: number
      ease?: string | number[]
      delay?: number
      repeat?: number
      direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
    }
  ): {
    stop: () => void
    finished: Promise<void>
  }
}

// Lottie types
declare module 'lottie-react' {
  import { ComponentType } from 'react'
  
  interface LottieProps {
    animationData: any
    autoplay?: boolean
    loop?: boolean
    speed?: number
    direction?: 1 | -1
    onComplete?: () => void
    className?: string
    style?: React.CSSProperties
  }
  
  const Lottie: ComponentType<LottieProps>
  export default Lottie
}

export {}
