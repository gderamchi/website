// Constants and configuration
const CONFIG = {
  observerThreshold: 0.1,
  observerRootMargin: '0px 0px -100px 0px',
  initialProjectsToShow: 3,
  emailjsServiceId: "service_b3nl9bi",
  emailjsTemplateId: "template_ke9hrg9",
  emailjsPublicKey: "aN3NQG_4ipvqqgquR",
  debounceTime: 100,
  batchProcessLimit: 5
};

// Utility functions
function debounce(func, wait = CONFIG.debounceTime) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Intersection Observer for scroll animations
function createScrollObserver() {
  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: CONFIG.observerThreshold,
    rootMargin: CONFIG.observerRootMargin
  });
}

// Initialize scroll animations
function initScrollAnimations() {
  const observer = createScrollObserver();
  const elements = document.querySelectorAll('.reveal, .bento-item');
  
  elements.forEach(el => observer.observe(el));
}

// Header scroll effect
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  
  const handleScroll = debounce(() => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  window.addEventListener('scroll', handleScroll, { passive: true });
}

// Skills data
const skills = [
  {
    icon: '⚛️',
    title: 'Frontend',
    description: 'React, Vue, HTML/CSS'
  },
  {
    icon: '🔧',
    title: 'Backend',
    description: 'Node.js, Python, APIs'
  },
  {
    icon: '📱',
    title: 'Mobile',
    description: 'React Native, Flutter'
  },
  {
    icon: '🤖',
    title: 'AI/Prompts',
    description: 'LLM, Prompt Engineering'
  }
];

// Load skills
function loadSkills() {
  const skillsContainer = document.getElementById('skills-container');
  if (!skillsContainer) return;
  
  const fragment = document.createDocumentFragment();
  
  skills.forEach(skill => {
    const skillItem = document.createElement('div');
    skillItem.classList.add('skill-item');
    skillItem.innerHTML = `
      <div class="skill-icon">${skill.icon}</div>
      <div class="skill-name">${skill.title}</div>
    `;
    fragment.appendChild(skillItem);
  });
  
  skillsContainer.appendChild(fragment);
}

// Load projects
function loadProjects() {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) {
    console.error('Projects grid container not found');
    return;
  }
  
  // Check if projects data is available
  if (typeof projects === 'undefined' || !projects || projects.length === 0) {
    console.error('Projects data not available');
    projectsGrid.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">No projects available at the moment.</p>';
    return;
  }
  
  const featuredProjects = projects.slice(0, CONFIG.initialProjectsToShow);
  
  console.log(`Loading ${featuredProjects.length} featured projects`);
  
  // Clear existing content
  projectsGrid.innerHTML = '';
  
  const fragment = document.createDocumentFragment();
  
  featuredProjects.forEach((project, index) => {
    const card = createProjectCard(project);
    card.style.animationDelay = `${index * 0.1}s`;
    fragment.appendChild(card);
  });
  
  projectsGrid.appendChild(fragment);
  
  console.log('Projects loaded successfully');
}

// Create project card
function createProjectCard(project) {
  const card = document.createElement('div');
  card.classList.add('project-card');
  
  const description = project.description || 'A student project';
  
  const shortDescription = description.length > 120 ? 
    description.substring(0, 120) + '...' : 
    description;
  
  const tagsHTML = project.topics && project.topics.length > 0 
    ? project.topics.slice(0, 3).map(tag => `<span class="project-tag">${tag}</span>`).join('')
    : '<span class="project-tag">Project</span>';
  
  card.innerHTML = `
    <div class="project-image-container">
      ${project.date ? `<div class="project-overlay-badge">${project.date}</div>` : ''}
      <img src="${project.image || 'src/assets/images/projects/default.webp'}" alt="${project.title || project.name}" class="project-image">
    </div>
    <div class="project-content">
      <h3 class="project-title">${project.title || project.name.replace(/-/g, ' ')}</h3>
      <p class="project-description">${shortDescription}</p>
      <div class="project-tags">${tagsHTML}</div>
      <div class="project-links">
        ${project.homepage ? `<a href="${project.homepage}" target="_blank" rel="noopener" class="project-link">
          <i class="fas fa-external-link-alt"></i> Live Demo
        </a>` : ''}
        <a href="${project.html_url}" target="_blank" rel="noopener" class="project-link">
          <i class="fab fa-github"></i> View Repository
        </a>
      </div>
    </div>
  `;
  
  return card;
}

// Animate expertise bars
function animateExpertiseBars() {
  const bars = document.querySelectorAll('.expertise-fill');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
          bar.style.width = width;
        }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  
  bars.forEach(bar => observer.observe(bar));
}

// Initialize EmailJS
function initEmailJS() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  
  if (typeof emailjs !== 'undefined') {
    try {
      emailjs.init(CONFIG.emailjsPublicKey);
      setupContactForm();
    } catch (error) {
      console.error('Error initializing EmailJS:', error);
    }
  } else {
    let attempts = 0;
    const maxAttempts = 20;
    
    const checkEmailJSLoaded = setInterval(() => {
      attempts++;
      
      if (typeof emailjs !== 'undefined') {
        clearInterval(checkEmailJSLoaded);
        try {
          emailjs.init(CONFIG.emailjsPublicKey);
          setupContactForm();
        } catch (error) {
          console.error('Error initializing EmailJS:', error);
        }
      } else if (attempts >= maxAttempts) {
        clearInterval(checkEmailJSLoaded);
        console.error('EmailJS failed to load');
      }
    }, 200);
  }
}

// Setup contact form
function setupContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitButton = contactForm.querySelector('.form-submit');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner"></span> Sending...';
    submitButton.disabled = true;
    
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value
    };
    
    emailjs.send(
      CONFIG.emailjsServiceId,
      CONFIG.emailjsTemplateId,
      formData
    ).then(
      function(response) {
        showFormMessage('Message sent successfully!', 'success');
        contactForm.reset();
      },
      function(error) {
        showFormMessage('Failed to send message. Please try again.', 'error');
      }
    ).finally(() => {
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
    });
  });
}

// Show form message
function showFormMessage(message, type) {
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  const messageEl = document.createElement('div');
  messageEl.className = `form-message ${type}`;
  messageEl.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  
  const form = document.getElementById('contact-form');
  form.insertAdjacentElement('beforebegin', messageEl);
  
  setTimeout(() => {
    messageEl.remove();
  }, 5000);
}

// Initialize everything
function init() {
  initHeaderScroll();
  initScrollAnimations();
  loadSkills();
  loadProjects();
  animateExpertiseBars();
  initEmailJS();
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', init);
