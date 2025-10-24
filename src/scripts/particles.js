/**
 * Interactive Particle System
 * Creates a dynamic particle background that responds to mouse movement
 */

class ParticleSystem {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas with id "${canvasId}" not found`);
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    
    // Configuration
    this.config = {
      particleCount: options.particleCount || 80,
      particleSize: options.particleSize || 2,
      particleSpeed: options.particleSpeed || 0.5,
      connectionDistance: options.connectionDistance || 120,
      mouseInteraction: options.mouseInteraction !== false,
      colors: options.colors || ['#6366f1', '#06b6d4', '#10b981', '#ec4899'],
      ...options
    };
    
    this.init();
  }
  
  init() {
    this.resizeCanvas();
    this.createParticles();
    this.setupEventListeners();
    this.setupDarkModeListener();
    this.animate();
  }
  
  setupDarkModeListener() {
    // Update colors when dark mode changes
    const observer = new MutationObserver(() => {
      this.updateParticleColors();
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
  
  updateParticleColors() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const colors = isDarkMode 
      ? ['#a5b4fc', '#67e8f9', '#6ee7b7', '#f9a8d4'] // Much brighter colors for dark mode
      : ['#6366f1', '#06b6d4', '#10b981', '#ec4899']; // Original colors for light mode
    
    this.particles.forEach(particle => {
      particle.color = colors[Math.floor(Math.random() * colors.length)];
    });
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    this.particles = [];
    const area = this.canvas.width * this.canvas.height;
    const particleCount = Math.min(
      this.config.particleCount,
      Math.floor(area / 15000) // Adjust density based on screen size
    );
    
    // Use appropriate colors based on current mode
    const isDarkMode = document.body.classList.contains('dark-mode');
    this.config.colors = isDarkMode 
      ? ['#a5b4fc', '#67e8f9', '#6ee7b7', '#f9a8d4'] // Much brighter colors for dark mode
      : ['#6366f1', '#06b6d4', '#10b981', '#ec4899']; // Original colors for light mode
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this));
    }
  }
  
  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles();
    });
    
    if (this.config.mouseInteraction) {
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
      });
      
      window.addEventListener('mouseout', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    this.particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    // Draw connections
    this.connectParticles();
    
    requestAnimationFrame(() => this.animate());
  }
  
  connectParticles() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const lineColor = isDarkMode ? '165, 180, 252' : '99, 102, 241'; // Much brighter blue in dark mode
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.connectionDistance) {
          const opacity = 1 - (distance / this.config.connectionDistance);
          this.ctx.strokeStyle = `rgba(${lineColor}, ${opacity * 0.5})`;
          this.ctx.lineWidth = 1.5;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
}

class Particle {
  constructor(system) {
    this.system = system;
    this.x = Math.random() * system.canvas.width;
    this.y = Math.random() * system.canvas.height;
    this.size = Math.random() * system.config.particleSize + 1;
    this.speedX = (Math.random() - 0.5) * system.config.particleSpeed;
    this.speedY = (Math.random() - 0.5) * system.config.particleSpeed;
    this.color = system.config.colors[Math.floor(Math.random() * system.config.colors.length)];
    this.baseX = this.x;
    this.baseY = this.y;
  }
  
  update() {
    // Mouse interaction
    if (this.system.mouse.x != null && this.system.mouse.y != null) {
      const dx = this.system.mouse.x - this.x;
      const dy = this.system.mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.system.mouse.radius) {
        const force = (this.system.mouse.radius - distance) / this.system.mouse.radius;
        const directionX = dx / distance;
        const directionY = dy / distance;
        
        // Push particles away from mouse
        this.x -= directionX * force * 3;
        this.y -= directionY * force * 3;
      }
    }
    
    // Return to base position
    const dx = this.baseX - this.x;
    const dy = this.baseY - this.y;
    this.x += dx * 0.05;
    this.y += dy * 0.05;
    
    // Move base position
    this.baseX += this.speedX;
    this.baseY += this.speedY;
    
    // Bounce off edges
    if (this.baseX < 0 || this.baseX > this.system.canvas.width) {
      this.speedX *= -1;
      this.baseX = Math.max(0, Math.min(this.system.canvas.width, this.baseX));
    }
    if (this.baseY < 0 || this.baseY > this.system.canvas.height) {
      this.speedY *= -1;
      this.baseY = Math.max(0, Math.min(this.system.canvas.height, this.baseY));
    }
  }
  
  draw() {
    // Draw particle with stronger visibility
    const isDarkMode = document.body.classList.contains('dark-mode');
    this.system.ctx.fillStyle = this.color;
    this.system.ctx.shadowBlur = isDarkMode ? 25 : 15; // Stronger glow in dark mode
    this.system.ctx.shadowColor = this.color;
    this.system.ctx.beginPath();
    this.system.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.system.ctx.fill();
    this.system.ctx.shadowBlur = 0;
  }
}

// Export ParticleSystem class for external initialization
// Auto-initialization removed - handled by init-animations.js
window.ParticleSystem = ParticleSystem;
