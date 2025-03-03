// Common JavaScript functionality shared between all pages

// Theme toggle functionality
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  // Check for saved user preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // Remove any existing event listeners to prevent duplicates
  themeToggle.removeEventListener('click', toggleTheme);
  
  // Toggle dark/light mode
  themeToggle.addEventListener('click', toggleTheme);
  
  // Separate function to allow for easier removal of event listener
  function toggleTheme() {
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      document.body.classList.toggle('dark-mode');

      // Save user preference
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  }
}

// Handle preloader
function handlePreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;
  
  // Hide preloader after content has loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }, 500);
  });
}

// Scroll to top functionality
function initScrollToTop() {
  const scrollTopBtn = document.getElementById('scroll-to-top');
  if (!scrollTopBtn) return;
  
  // Show/hide button based on scroll position
  const toggleScrollTopBtn = () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  };
  
  // Scroll to top when button clicked
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  window.addEventListener('scroll', toggleScrollTopBtn, { passive: true });
}

// Enhanced language switcher functionality
function initSharedLanguageSwitcher() {
  const langOptions = document.querySelectorAll('.lang-option');
  if (!langOptions.length) return;
  
  // Get saved language preference
  let currentLang = localStorage.getItem('language') || 'en';
  
  // Set initial active state
  langOptions.forEach(option => {
    if (option.dataset.lang === currentLang) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });
  
  // Update HTML lang attribute
  document.documentElement.setAttribute('lang', currentLang);
  
  // Set up click handlers for language options - with proper event removal
  langOptions.forEach(option => {
    // Remove any existing listeners to prevent duplicates
    option.removeEventListener('click', handleLanguageSwitch);
    // Add fresh listener
    option.addEventListener('click', handleLanguageSwitch);
  });
  
  // Handle language switch consistently
  function handleLanguageSwitch(event) {
    const newLang = this.dataset.lang;
    const currentLang = localStorage.getItem('language') || 'en';
    
    // Only proceed if this is a different language
    if (newLang !== currentLang) {
      // Update active states
      langOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      
      // Save preference
      localStorage.setItem('language', newLang);
      
      // Update HTML lang attribute
      document.documentElement.setAttribute('lang', newLang);
      
      // Trigger a custom event that specific pages can listen for
      const languageChangeEvent = new CustomEvent('languageChanged', { detail: { language: newLang, previousLanguage: currentLang }});
      document.dispatchEvent(languageChangeEvent);
    }
  }
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', () => {
  handlePreloader();
  initThemeToggle();
  initScrollToTop();
  initSharedLanguageSwitcher();
});
