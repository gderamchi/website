// Smooth page load transitions and enhanced interactions

// Smooth page load transition
document.addEventListener('DOMContentLoaded', () => {
  // Fade in page on load
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.4s ease';
    document.body.style.opacity = '1';
  }, 50);
});

// Add ripple effect to buttons
function addRippleEffect() {
  const buttons = document.querySelectorAll('.btn, .btn-primary, .btn-secondary, .project-btn-primary, .modal-btn-primary');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Create ripple element
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      
      // Calculate position
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      // Set ripple styles
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      // Add to button
      this.appendChild(ripple);
      
      // Remove after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Add bounce effect to social icons
function addIconAnimations() {
  const socialLinks = document.querySelectorAll('.social-link');
  
  socialLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      const icon = this.querySelector('i');
      if (icon) {
        icon.style.animation = 'bounce 0.5s ease';
      }
    });
    
    link.addEventListener('animationend', function() {
      const icon = this.querySelector('i');
      if (icon) {
        icon.style.animation = '';
      }
    });
  });
}

// Add loading skeleton for images
function addImageLoadingStates() {
  const projectImages = document.querySelectorAll('.project-image, .project-image-full');
  
  projectImages.forEach(img => {
    // Add loading class initially
    const container = img.closest('.project-image-container, .project-card-full');
    if (container) {
      container.classList.add('image-loading');
    }
    
    // Remove loading class when image loads
    img.addEventListener('load', function() {
      if (container) {
        container.classList.remove('image-loading');
        container.classList.add('image-loaded');
      }
    });
    
    // Handle error case
    img.addEventListener('error', function() {
      if (container) {
        container.classList.remove('image-loading');
        container.classList.add('image-error');
      }
    });
  });
}

// Add smooth hover transitions to cards
function enhanceCardHovers() {
  const cards = document.querySelectorAll('.project-card, .project-card-full, .bento-item');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });
}

// Initialize all enhancements
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    addRippleEffect();
    addIconAnimations();
    addImageLoadingStates();
    enhanceCardHovers();
  }, 100);
});

// Add page transition on navigation
window.addEventListener('beforeunload', () => {
  document.body.style.opacity = '0';
});
