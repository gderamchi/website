/**
 * Animation Initialization Manager
 * Ensures all animations load in the correct order and initialize properly
 */

(function() {
  'use strict';
  
  // Debug mode - set to true to see console logs
  const DEBUG = true;
  
  function log(...args) {
    if (DEBUG) {
      console.log('[Animations]', ...args);
    }
  }
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    log('Reduced motion preferred - skipping animations');
    // Make all reveal elements visible immediately
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('active');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    });
    return;
  }
  
  // Animation initialization state
  const state = {
    particlesReady: false,
    tiltReady: false,
    scrollReady: false,
    pageTransitionsReady: false
  };
  
  /**
   * Initialize Particle System
   */
  function initParticles() {
    log('Initializing particles...');
    
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) {
      log('ERROR: Particles canvas not found!');
      return;
    }
    
    // Make sure canvas is visible
    canvas.style.display = 'block';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.6';
    
    try {
      if (typeof ParticleSystem !== 'undefined') {
        new ParticleSystem('particles-canvas', {
          particleCount: 80,
          particleSize: 2,
          particleSpeed: 0.3,
          connectionDistance: 120,
          mouseInteraction: true
        });
        state.particlesReady = true;
        log('✓ Particles initialized successfully');
      } else {
        log('ERROR: ParticleSystem class not found');
      }
    } catch (error) {
      log('ERROR initializing particles:', error);
    }
  }
  
  /**
   * Initialize 3D Tilt Effects
   */
  function initTilt() {
    log('Initializing tilt effects...');
    
    try {
      if (typeof TiltEffect !== 'undefined') {
        // Wait for elements to be in DOM
        setTimeout(() => {
          // Project cards
          const projectCards = document.querySelectorAll('.project-card');
          if (projectCards.length > 0) {
            new TiltEffect('.project-card', {
              maxTilt: 10,
              perspective: 1000,
              scale: 1.03,
              speed: 400,
              glare: true,
              maxGlare: 0.2
            });
            log(`✓ Tilt applied to ${projectCards.length} project cards`);
          }
          
          // Bento items
          const bentoItems = document.querySelectorAll('.bento-item');
          if (bentoItems.length > 0) {
            new TiltEffect('.bento-item', {
              maxTilt: 8,
              perspective: 1000,
              scale: 1.02,
              speed: 400,
              glare: true,
              maxGlare: 0.15
            });
            log(`✓ Tilt applied to ${bentoItems.length} bento items`);
          }
          
          state.tiltReady = true;
          log('✓ Tilt effects initialized successfully');
        }, 500);
      } else {
        log('ERROR: TiltEffect class not found');
      }
    } catch (error) {
      log('ERROR initializing tilt:', error);
    }
  }
  
  /**
   * Initialize Scroll Animations
   */
  function initScroll() {
    log('Initializing scroll animations...');
    
    try {
      if (typeof ScrollAnimations !== 'undefined') {
        const scrollAnimations = new ScrollAnimations({
          threshold: 0.1,
          rootMargin: '0px 0px -100px 0px',
          animationDelay: 100
        });
        
        // Setup smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
              e.preventDefault();
              const headerOffset = 80;
              const elementPosition = target.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          });
        });
        
        state.scrollReady = true;
        log('✓ Scroll animations initialized successfully');
      } else {
        log('ERROR: ScrollAnimations class not found');
      }
    } catch (error) {
      log('ERROR initializing scroll animations:', error);
    }
  }
  
  /**
   * Initialize Page Transitions
   */
  function initPageTransitions() {
    log('Initializing page transitions...');
    
    try {
      // Fade in page on load
      document.body.style.opacity = '0';
      setTimeout(() => {
        document.body.style.transition = 'opacity 0.4s ease';
        document.body.style.opacity = '1';
      }, 50);
      
      // Add ripple effect to buttons
      setTimeout(() => {
        const buttons = document.querySelectorAll('.btn, .btn-primary, .btn-secondary');
        buttons.forEach(button => {
          button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
              position: absolute;
              width: ${size}px;
              height: ${size}px;
              left: ${x}px;
              top: ${y}px;
              border-radius: 50%;
              background: rgba(255, 255, 255, 0.6);
              transform: scale(0);
              animation: ripple-animation 0.6s ease-out;
              pointer-events: none;
            `;
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
          });
        });
        
        log(`✓ Ripple effect added to ${buttons.length} buttons`);
      }, 100);
      
      state.pageTransitionsReady = true;
      log('✓ Page transitions initialized successfully');
    } catch (error) {
      log('ERROR initializing page transitions:', error);
    }
  }
  
  /**
   * Initialize all animations
   */
  function initAll() {
    log('Starting animation initialization...');
    
    // Initialize in sequence with delays to ensure proper loading
    setTimeout(initParticles, 100);
    setTimeout(initTilt, 300);
    setTimeout(initScroll, 500);
    setTimeout(initPageTransitions, 200);
    
    // Check status after all should be loaded
    setTimeout(() => {
      log('Animation Status:', state);
      if (state.particlesReady && state.tiltReady && state.scrollReady && state.pageTransitionsReady) {
        log('✓ All animations initialized successfully!');
      } else {
        log('⚠ Some animations failed to initialize:', state);
      }
    }, 2000);
  }
  
  // Start initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
  
  // Re-initialize tilt on dynamic content
  const observer = new MutationObserver(() => {
    if (state.tiltReady) {
      setTimeout(initTilt, 100);
    }
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
      observer.observe(projectsGrid, { childList: true });
    }
  });
  
})();
