/**
 * 3D Tilt Effect for Cards
 * Adds interactive 3D tilt effect to elements on mouse move
 */

class TiltEffect {
  constructor(selector, options = {}) {
    this.elements = document.querySelectorAll(selector);
    this.config = {
      maxTilt: options.maxTilt || 15,
      perspective: options.perspective || 1000,
      scale: options.scale || 1.05,
      speed: options.speed || 400,
      glare: options.glare !== false,
      maxGlare: options.maxGlare || 0.3,
      ...options
    };
    
    this.init();
  }
  
  init() {
    this.elements.forEach(element => {
      this.setupElement(element);
    });
  }
  
  setupElement(element) {
    // Set initial styles
    element.style.transformStyle = 'preserve-3d';
    element.style.transition = `transform ${this.config.speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
    
    // Create glare element if enabled
    if (this.config.glare) {
      const glare = document.createElement('div');
      glare.className = 'tilt-glare';
      glare.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,${this.config.maxGlare}) 100%);
        opacity: 0;
        pointer-events: none;
        transition: opacity ${this.config.speed}ms ease;
        z-index: 1;
      `;
      element.appendChild(glare);
      element.style.position = element.style.position || 'relative';
      element.style.overflow = 'hidden';
    }
    
    // Event listeners
    element.addEventListener('mouseenter', (e) => this.onMouseEnter(e, element));
    element.addEventListener('mousemove', (e) => this.onMouseMove(e, element));
    element.addEventListener('mouseleave', (e) => this.onMouseLeave(e, element));
  }
  
  onMouseEnter(e, element) {
    element.style.transition = 'none';
    if (this.config.glare) {
      const glare = element.querySelector('.tilt-glare');
      if (glare) glare.style.opacity = '1';
    }
  }
  
  onMouseMove(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;
    
    const tiltX = percentY * this.config.maxTilt;
    const tiltY = -percentX * this.config.maxTilt;
    
    element.style.transform = `
      perspective(${this.config.perspective}px)
      rotateX(${tiltX}deg)
      rotateY(${tiltY}deg)
      scale3d(${this.config.scale}, ${this.config.scale}, ${this.config.scale})
    `;
    
    // Update glare position
    if (this.config.glare) {
      const glare = element.querySelector('.tilt-glare');
      if (glare) {
        const angle = Math.atan2(percentY, percentX) * (180 / Math.PI);
        glare.style.background = `
          linear-gradient(${angle}deg, 
            rgba(255,255,255,0) 0%, 
            rgba(255,255,255,${this.config.maxGlare}) 100%)
        `;
      }
    }
  }
  
  onMouseLeave(e, element) {
    element.style.transition = `transform ${this.config.speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
    element.style.transform = `
      perspective(${this.config.perspective}px)
      rotateX(0deg)
      rotateY(0deg)
      scale3d(1, 1, 1)
    `;
    
    if (this.config.glare) {
      const glare = element.querySelector('.tilt-glare');
      if (glare) glare.style.opacity = '0';
    }
  }
  
  // Method to refresh tilt on dynamically added elements
  refresh() {
    this.elements = document.querySelectorAll(this.selector);
    this.init();
  }
}

// Initialize tilt effects when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTiltEffects);
} else {
  initTiltEffects();
}

function initTiltEffects() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    // Apply to project cards
    new TiltEffect('.project-card', {
      maxTilt: 10,
      perspective: 1000,
      scale: 1.03,
      speed: 400,
      glare: true,
      maxGlare: 0.2
    });
    
    // Apply to bento items
    new TiltEffect('.bento-item', {
      maxTilt: 8,
      perspective: 1000,
      scale: 1.02,
      speed: 400,
      glare: true,
      maxGlare: 0.15
    });
    
    // Apply to glass cards
    new TiltEffect('.glass-card', {
      maxTilt: 8,
      perspective: 1000,
      scale: 1.02,
      speed: 400,
      glare: true,
      maxGlare: 0.15
    });
    
    // Re-initialize when new projects are loaded
    const observer = new MutationObserver(() => {
      initTiltEffects();
    });
    
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
      observer.observe(projectsGrid, { childList: true });
    }
  }
}

// Export for use in other scripts
window.TiltEffect = TiltEffect;
