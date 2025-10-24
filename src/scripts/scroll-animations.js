/**
 * Smooth Scroll Animations
 * Implements intersection observer for scroll-triggered animations and parallax effects
 */

class ScrollAnimations {
  constructor(options = {}) {
    this.config = {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px 0px -100px 0px',
      animationDelay: options.animationDelay || 100,
      ...options
    };
    
    this.observers = new Map();
    this.init();
  }
  
  init() {
    this.setupRevealAnimations();
    this.setupStaggeredAnimations();
    this.setupParallaxEffects();
    this.setupCounterAnimations();
  }
  
  /**
   * Reveal animations for elements with .reveal class
   */
  setupRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: this.config.threshold,
      rootMargin: this.config.rootMargin
    });
    
    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
    
    this.observers.set('reveal', revealObserver);
  }
  
  /**
   * Staggered animations for grid items
   */
  setupStaggeredAnimations() {
    const grids = document.querySelectorAll('.projects-grid, .skills-grid, .bento-grid');
    
    grids.forEach(grid => {
      const items = grid.children;
      
      const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const items = Array.from(entry.target.children);
            items.forEach((item, index) => {
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              }, index * this.config.animationDelay);
            });
            staggerObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px'
      });
      
      // Set initial state
      Array.from(items).forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      });
      
      staggerObserver.observe(grid);
      this.observers.set(`stagger-${grid.className}`, staggerObserver);
    });
  }
  
  /**
   * Parallax scrolling effects
   */
  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrolled;
        const elementHeight = rect.height;
        
        // Only apply parallax when element is in viewport
        if (scrolled + window.innerHeight > elementTop && scrolled < elementTop + elementHeight) {
          const yPos = (scrolled - elementTop) * speed;
          element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        }
      });
    };
    
    // Throttle scroll event for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
    
    // Initial call
    handleScroll();
  }
  
  /**
   * Counter animations for statistics
   */
  setupCounterAnimations() {
    const counters = document.querySelectorAll('.stat-value, .stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const finalValue = parseInt(target.textContent.replace(/\D/g, '')) || 0;
          const suffix = target.textContent.replace(/[0-9]/g, '');
          
          this.animateCounter(target, 0, finalValue, 2000, suffix);
          counterObserver.unobserve(target);
        }
      });
    }, {
      threshold: 0.5
    });
    
    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
    
    this.observers.set('counter', counterObserver);
  }
  
  /**
   * Animate counter from start to end value
   */
  animateCounter(element, start, end, duration, suffix = '') {
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + suffix;
    }, 16);
  }
  
  /**
   * Add fade-in animation to sections
   */
  addFadeInAnimation(selector, delay = 0) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, delay + (index * 100));
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      observer.observe(element);
    });
  }
  
  /**
   * Cleanup observers
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Smooth scroll behavior for anchor links
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#" or empty
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
}

// Scroll progress indicator
function setupScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #6366f1 0%, #06b6d4 100%);
    z-index: 9999;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

// Export ScrollAnimations class and helper functions for external initialization
// Auto-initialization removed - handled by init-animations.js
window.ScrollAnimations = ScrollAnimations;
window.setupSmoothScroll = setupSmoothScroll;
window.setupScrollProgress = setupScrollProgress;
