// Constants and configuration
const CONFIG = {
  observerThreshold: 1.0,
  observerRootMargin: '0px 0px -50px 0px',
  initialProjectsToShow: 3,
  emailjsServiceId: "service_b3nl9bi",
  emailjsTemplateId: "template_ke9hrg9",
  emailjsPublicKey: "aN3NQG_4ipvqqgquR",
  imageLazyLoading: true, // Enable lazy loading for images
  metaDescription: {
    en: 'Software & AI Prompt Engineer specializing in building high-performance applications and crafting intelligent AI solutions',
    fr: 'Ingénieur logiciel et prompt IA spécialisé dans la création d\'applications performantes et de solutions IA intelligentes'
  },
  // Performance configurations
  debounceTime: 100, // Ms to wait before executing debounced functions
  batchProcessLimit: 5 // Process elements in batches for smoother animations
};

// Performance utilities
// Debounce function to limit expensive operations
function debounce(func, wait = CONFIG.debounceTime) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Language translations
const TRANSLATIONS = {
  en: {
    nav: {
      about: 'About',
      projects: 'Projects',
      contact: 'Contact'
    },
    hero: {
      title: 'Computer Science Student & AI Enthusiast',
      subtitle: 'I\'m a passionate student focusing on software development and AI prompt engineering, building projects that combine technical skills with creative problem-solving.',
      viewProjects: 'View Projects',
      getInTouch: 'Get in Touch'
    },
    about: {
      title: 'About Me',
      subtitle: 'I\'m combining my computer science education with practical projects to develop skills in software engineering and AI.',
      journey: {
        title: 'Education',
        content: 'Currently pursuing my degree in Computer Science, with a focus on software development and artificial intelligence. I\'m passionate about learning new technologies and applying them to real-world problems through hands-on projects.'
      },
      approach: {
        title: 'My Interests',
        content: 'I\'m particularly interested in how AI can enhance software applications and user experiences. My coursework and personal projects focus on creating clean, efficient code while exploring the capabilities of large language models through prompt engineering.'
      },
      toolkit: {
        title: 'Learning Path',
        content: 'I\'m constantly expanding my technical toolkit through coursework and self-study in modern JavaScript frameworks, backend technologies including Node.js and Python, and mobile development. I\'m also developing skills in AI prompt engineering to create more effective AI interactions.',
        frontend: 'Frontend Development',
        backend: 'Backend Engineering',
        ai: 'AI Prompt Engineering'
      },
      skills: 'Core Skills'
    },
    projects: {
      title: 'Academic & Personal Projects',
      subtitle: 'A collection of projects I\'ve developed during my studies and personal exploration, showcasing my technical skills and problem-solving approach.',
      showMore: 'Show More Projects',
      viewAll: 'View All Projects on GitHub',
      liveDemo: 'Live Demo',
      viewRepo: 'View Repository'
    },
    contact: {
      title: 'Get in Touch',
      subtitle: 'Let\'s discuss how we can work together on your next project.',
      formTitle: 'Send a Message',
      formSubtitle: 'I\'ll get back to you as soon as possible.',
      name: 'Your Name',
      email: 'Your Email',
      subject: 'Subject',
      message: 'Your Message',
      send: 'Send Message',
      success: 'Message sent successfully!',
      error: 'Failed to send message. Please try again.'
    },
    footer: {
      copyright: '© 2025 Guillaume Deramchi. All rights reserved.'
    }
  },
  fr: {
    nav: {
      about: 'À propos',
      projects: 'Projets',
      contact: 'Contact'
    },
    hero: {
      title: 'Étudiant en Informatique & Passionné d\'IA',
      subtitle: 'Je suis un étudiant passionné qui se concentre sur le développement logiciel et l\'ingénierie de prompts IA, créant des projets qui combinent compétences techniques et résolution créative de problèmes.',
      viewProjects: 'Voir les projets',
      getInTouch: 'Me contacter'
    },
    about: {
      title: 'À propos de moi',
      subtitle: 'Je combine mes études en informatique avec des projets pratiques pour développer mes compétences en ingénierie logicielle et en IA.',
      journey: {
        title: 'Formation',
        content: 'Je poursuis actuellement mes études en informatique, avec une spécialisation en développement logiciel et intelligence artificielle. Je suis passionné par l\'apprentissage de nouvelles technologies et leur application à des problèmes concrets à travers des projets pratiques.'
      },
      approach: {
        title: 'Mes intérêts',
        content: 'Je m\'intéresse particulièrement à la façon dont l\'IA peut améliorer les applications logicielles et les expériences utilisateur. Mes cours et projets personnels se concentrent sur la création de code propre et efficace tout en explorant les capacités des grands modèles de langage grâce à l\'ingénierie de prompts.'
      },
      toolkit: {
        title: 'Parcours d\'apprentissage',
        content: 'J\'enrichis constamment mes connaissances techniques à travers mes cours et mon auto-formation sur les frameworks JavaScript modernes, les technologies backend comme Node.js et Python, et le développement mobile. Je développe également mes compétences en ingénierie de prompts IA pour créer des interactions plus efficaces.',
        frontend: 'Développement frontend',
        backend: 'Ingénierie backend',
        ai: 'Prompt engineering'
      },
      skills: 'Compétences principales'
    },
    projects: {
      title: 'Projets académiques & personnels',
      subtitle: 'Une collection de projets que j\'ai développés pendant mes études et explorations personnelles, démontrant mes compétences techniques et mon approche de résolution de problèmes.',
      showMore: 'Voir plus de projets',
      viewAll: 'Voir tous les projets sur GitHub',
      liveDemo: 'Démo en ligne',
      viewRepo: 'Voir le repository'
    },
    contact: {
      title: 'Me contacter',
      subtitle: 'Discutons de comment nous pouvons travailler ensemble sur votre prochain projet.',
      formTitle: 'Envoyer un message',
      formSubtitle: 'Je vous répondrai dès que possible.',
      name: 'Votre nom',
      email: 'Votre email',
      subject: 'Sujet',
      message: 'Votre message',
      send: 'Envoyer le message',
      success: 'Message envoyé avec succès !',
      error: 'Échec de l\'envoi du message. Veuillez réessayer.'
    },
    footer: {
      copyright: '© 2025 Guillaume Deramchi. Tous droits réservés.'
    }
  }
};

// Create reusable IntersectionObserver with improved performance
function createAnimationObserver(callback, options = {}) {
  // Process entries in batches to avoid layout thrashing
  const batchCallback = (entries, observer) => {
    // Create array of visible entries to process
    const visibleEntries = entries.filter(entry => entry.isIntersecting);
    
    // Process in smaller batches for smoother rendering
    const processEntryBatch = (entries, startIndex) => {
      const endIndex = Math.min(startIndex + CONFIG.batchProcessLimit, entries.length);
      const batch = entries.slice(startIndex, endIndex);
      
      // Process this batch
      callback(batch, observer);
      
      // Schedule next batch if there are more entries to process
      if (endIndex < entries.length) {
        requestAnimationFrame(() => {
          processEntryBatch(entries, endIndex);
        });
      }
    };
    
    // Start processing batches if there are any visible entries
    if (visibleEntries.length > 0) {
      processEntryBatch(visibleEntries, 0);
    }
  };

  return new IntersectionObserver(batchCallback, {
    threshold: options.threshold || CONFIG.observerThreshold,
    rootMargin: options.rootMargin || CONFIG.observerRootMargin
  });
}

// Navigation Scroll Effect - use passive event listener for better performance
const header = document.getElementById('header');
const handleScroll = debounce(() => {
  if (header && window.scrollY > 50) {
    header.classList.add('scrolled');
  } else if (header) {
    header.classList.remove('scrolled');
  }
});

if (header) {
  window.addEventListener('scroll', handleScroll, { passive: true });
}

// Mobile Menu Toggle - REMOVED (now handled by common.js)
// The code that was here is now in common.js to avoid duplication

// Standard animation observer for fade-in elements
const observer = createAnimationObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Use requestAnimationFrame for smoother animations
      requestAnimationFrame(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      });
      observer.unobserve(entry.target);
    }
  });
});

// Fix for iOS vh units - use debounced version
const setVhUnit = debounce(() => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

window.addEventListener('resize', setVhUnit, { passive: true });
window.addEventListener('orientationchange', setVhUnit, { passive: true });
setVhUnit();

// Skills data
const skills = [
  {
    icon: '⚛️',
    title: {
      en: 'Front-End Development',
      fr: 'Développement Front-End'
    },
    description: {
      en: 'Crafting responsive, intuitive interfaces using modern frameworks like React and Vue.',
      fr: 'Création d\'interfaces réactives et intuitives à l\'aide de frameworks modernes comme React et Vue.'
    }
  },
  {
    icon: '🔧',
    title: {
      en: 'Back-End Engineering',
      fr: 'Back-End'
    },
    description: {
      en: 'Designing scalable APIs and robust server architectures with Node.js, Python, and cloud services.',
      fr: 'Conception d\'API évolutives et d\'architectures serveur robustes avec Node.js, Python et les services cloud.'
    }
  },
  {
    icon: '📱',
    title: {
      en: 'Mobile Development',
      fr: 'Développement Mobile'
    },
    description: {
      en: 'Developing cross-platform mobile applications with React Native and Flutter for seamless user experiences.',
      fr: 'Développement d\'applications mobiles multiplateformes avec React Native et Flutter pour des expériences utilisateur fluides.'
    }
  },
  {
    icon: '🤖',
    title: {
      en: 'Prompt Engineering',
      fr: 'Prompt Engineering'
    },
    description: {
      en: 'Creating effective AI prompts and fine-tuning language models to generate intelligent, context-aware responses.',
      fr: 'Création de prompts d\'IA efficaces et ajustement de modèles de langage pour générer des réponses intelligentes et contextuelles.'
    }
  }
];

// Function to render skills in the DOM with performance optimizations
function loadSkills() {
  const currentLang = localStorage.getItem('language') || 'en';
  const skillsContainer = document.getElementById('skills-container');
  if (!skillsContainer) return;
  
  // Create document fragment to batch DOM operations
  const fragment = document.createDocumentFragment();
  
  skills.forEach(skill => {
    const skillCard = document.createElement('div');
    skillCard.classList.add('skill-card');
    skillCard.innerHTML = `
      <div class="skill-icon">${skill.icon}</div>
      <h3>${skill.title[currentLang]}</h3>
      <p>${skill.description[currentLang]}</p>
    `;
    fragment.appendChild(skillCard);
  });
  
  // Single DOM update
  skillsContainer.appendChild(fragment);
  
  // Observe all skill cards after appending
  skillsContainer.querySelectorAll('.skill-card').forEach(card => {
    observer.observe(card);
  });
}

// Global state to track active project
let activeProjectIndex = 0;
let projectsArray = [];
let isAnimating = false;

// Function to create a project card in tree structure
function createProjectCard(project, index) {
  const currentLang = localStorage.getItem('language') || 'en';
  
  // Get description in current language or fallback to English
  const description = project.description && project.description[currentLang] ? 
    project.description[currentLang] : 
    (project.description && project.description.en ? project.description.en : 'A student project');

  // Ensure consistent description length - limit to exactly 80 chars for better consistency
  const shortDescription = description.length > 80 ? 
    description.substring(0, 80) + '...' : 
    description;

  // Extract topics as tags - limit to 3 for more consistent display
  const tagsHTML = project.topics && project.topics.length > 0 
    ? project.topics.slice(0, 3).map(tag => `<span class="project-tag-tree">${tag}</span>`).join('')
    : '<span class="project-tag-tree">Project</span>';

  const buttonTexts = {
    viewDetails: currentLang === 'fr' ? 'Voir les détails' : 'View details',
    viewRepo: TRANSLATIONS[currentLang].projects.viewRepo
  };

  const branch = document.createElement('div');
  branch.classList.add('project-branch');
  
  const node = document.createElement('div');
  node.classList.add('project-node');
  branch.appendChild(node);
  
  const card = document.createElement('div');
  card.classList.add('project-card-tree');
  card.dataset.projectId = project.name.replace(/\s+/g, '-').toLowerCase();
  card.dataset.index = index;
  
  // Ensure project name is also of consistent length
  const projectName = project.name.replace(/-/g, ' ');
  
  card.innerHTML = `
    <div class="project-image-container">
      <img src="${project.image || 'images/projects/default.webp'}" alt="${projectName} project screenshot" class="project-image-tree">
    </div>
    <div class="project-overlay">
      <h3 title="${projectName}">${projectName}</h3>
      <p title="${description}">${shortDescription}</p>
      <div class="project-tags-tree">${tagsHTML}</div>
      <div class="project-links-tree">
        <button class="view-details-btn" data-project-id="${project.name.replace(/\s+/g, '-').toLowerCase()}">
          ${buttonTexts.viewDetails} <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  `;
  
  branch.appendChild(card);
  
  // Add click event to open modal with project details
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.view-details-btn')) {
      openProjectModal(project);
    }
  });
  
  // Add separate handler for the view details button to prevent event bubbling issues
  const detailsBtn = card.querySelector('.view-details-btn');
  if (detailsBtn) {
    detailsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openProjectModal(project);
    });
  };
  
  return branch;
}

// Function to display projects in tree layout
function displayProjects(projects) {
  const projectsTree = document.getElementById('projects-tree');
  
  if (!projectsTree) {
    console.error("Projects tree element not found!");
    return;
  }

  projectsTree.innerHTML = '';
  
  // Create a document fragment for better performance
  const fragment = document.createDocumentFragment();

  // Create all project branches and cards
  projects.forEach((project, index) => {
    const branch = createProjectCard(project, index);
    fragment.appendChild(branch);
  });
  
  // Add all elements at once
  projectsTree.appendChild(fragment);
  
  // Add animation to make cards appear one by one
  const cards = document.querySelectorAll('.project-card-tree');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('visible');
    }, 200 * index);
  });
  
  // Set up modal functionality
  setupProjectModal();
}

// Function to open project modal with detailed view
function openProjectModal(project) {
  const currentLang = localStorage.getItem('language') || 'en';
  
  // Get full description
  const description = project.description && project.description[currentLang] ? 
    project.description[currentLang] : 
    (project.description && project.description.en ? project.description.en : 'A student project');

  // Get all tags
  const tagsHTML = project.topics && project.topics.length > 0 
    ? project.topics.map(tag => `<span class="project-tag">${tag}</span>`).join('')
    : '<span class="project-tag">Project</span>';

  const buttonTexts = {
    liveDemo: TRANSLATIONS[currentLang].projects.liveDemo,
    viewRepo: TRANSLATIONS[currentLang].projects.viewRepo
  };

  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  
  if (!modal || !modalContent) return;
  
  // Create detailed project view
  modalContent.innerHTML = `
    <div class="project-detail-header">
      <img src="${project.image || 'images/projects/default.webp'}" alt="${project.name} project screenshot" class="project-detail-image">
      <div class="project-detail-info">
        <h3>${project.name.replace(/-/g, ' ')}</h3>
        <p>${description}</p>
        <div class="project-detail-tags">
          ${tagsHTML}
        </div>
        <div class="project-detail-actions">
          ${project.homepage ? `<a href="${project.homepage}" target="_blank" rel="noopener" class="btn btn-sm" aria-label="View live demo of ${project.name}">${buttonTexts.liveDemo}</a>` : ''}
          <a href="${project.html_url}" target="_blank" rel="noopener" class="btn btn-sm btn-outline" aria-label="View repository for ${project.name}">${buttonTexts.viewRepo}</a>
        </div>
      </div>
    </div>
    <div class="project-detail-content">
      <div class="project-feature">
        <h4>${currentLang === 'fr' ? 'Technologies utilisées' : 'Technologies Used'}</h4>
        <p>${project.topics ? project.topics.join(', ') : 'N/A'}</p>
      </div>
      <!-- Additional project content can be added here as needed -->
    </div>
  `;
  
  // Show modal with animation - explicitly set display property first
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Use requestAnimationFrame to ensure the display change has taken effect before adding the active class
  requestAnimationFrame(() => {
    modal.classList.add('active');
  });
  
  // Focus trap for accessibility
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
}

// Function to set up project modal functionality
function setupProjectModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = modal.querySelector('.close-modal');
  
  if (!modal || !closeBtn) return;
  
  // Close modal when clicking the close button
  closeBtn.addEventListener('click', () => {
    closeProjectModal();
  });
  
  // Close modal when clicking outside the content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });
  
  // Close modal when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeProjectModal();
    }
  });
}

// Function to close project modal
function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;
  
  modal.classList.remove('active');
  document.body.style.overflow = '';
  
  // Reset focus to previously focused element
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
}

// Load projects with progressive animation for the tree
function loadProjects() {
  try {
    const projectsTree = document.getElementById('projects-tree');
    if (!projectsTree) return;
    
    // Get only 3 featured projects for the main page
    const featuredProjects = projects.slice(0, 3);
    
    // Create a document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    // Create all project branches and cards
    featuredProjects.forEach((project, index) => {
      const branch = createProjectCard(project, index);
      fragment.appendChild(branch);
    });
    
    // Add all elements at once
    projectsTree.appendChild(fragment);
    
    // Set up scroll observer for progressive animation
    setupProjectScrollAnimation();
    
    // Set up modal functionality
    setupProjectModal();
  } catch (error) {
    console.error('Error loading projects:', error);
    const projectsTree = document.getElementById('projects-tree');
    if (projectsTree) {
      projectsTree.innerHTML = `<p>Failed to load projects. Please try again later.</p>`;
    }
  }
}

// Add progressive scroll animation for project tree
function setupProjectScrollAnimation() {
  const branches = document.querySelectorAll('.project-branch');
  if (!branches.length) return;
  
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target.querySelector('.project-card-tree');
        if (card) {
          setTimeout(() => {
            card.classList.add('visible');
          }, 200);
        }
        projectObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -100px 0px' });
  
  branches.forEach(branch => {
    projectObserver.observe(branch);
  });
}

// Initialize EmailJS - with more robust checks
function initEmailJS() {
  // First check if contact form exists on this page
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) {
    console.log('Contact form not found on this page, skipping EmailJS initialization');
    return; // Exit early if form doesn't exist
  }
  
  // Then check if EmailJS is available
  if (typeof emailjs !== 'undefined') {
    try {
      emailjs.init(CONFIG.emailjsPublicKey);
      setupContactForm();
    } catch (error) {
      console.error('Error initializing EmailJS:', error);
    }
  } else {
    // EmailJS not loaded yet, set up a check for when it becomes available
    console.log('EmailJS not loaded yet, waiting for script to load...');
    
    // Check every 200ms if EmailJS has loaded (with a timeout)
    let attempts = 0;
    const maxAttempts = 20; // 4 seconds max wait time
    
    const checkEmailJSLoaded = setInterval(() => {
      attempts++;
      
      if (typeof emailjs !== 'undefined') {
        clearInterval(checkEmailJSLoaded);
        console.log('EmailJS now available, initializing...');
        try {
          emailjs.init(CONFIG.emailjsPublicKey);
          setupContactForm();
        } catch (error) {
          console.error('Error initializing EmailJS after wait:', error);
          showContactFormError('Service initialization failed. Please try again later.');
        }
      } else if (attempts >= maxAttempts) {
        clearInterval(checkEmailJSLoaded);
        console.error('EmailJS failed to load after multiple attempts');
        showContactFormError('Contact service unavailable. Please try again later or reach out directly via email.');
      }
    }, 200);
  }
}

// Setup contact form submission with improved feedback
function setupContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.innerHTML = '<span class="spinner"></span> Sending...';
    submitButton.disabled = true;
    
    // Hide any previous messages
    hideFormMessages();

    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value
    };

    // Send email using EmailJS
    emailjs.send(
      CONFIG.emailjsServiceId,
      CONFIG.emailjsTemplateId,
      formData
    ).then(
      function(response) {
        console.log("SUCCESS", response);
        showFormSuccess('Message sent successfully! I\'ll get back to you soon.');
        contactForm.reset();
      },
      function(error) {
        console.log("FAILED", error);
        showFormError('Failed to send message. Please try again or contact me directly.');
      }
    ).finally(() => {
      // Reset button state
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
    });
  });
}

// Helper functions for improved form feedback
function hideFormMessages() {
  // Remove any existing message elements
  const existingMessages = document.querySelectorAll('.form-message');
  existingMessages.forEach(msg => msg.remove());
}

function showFormSuccess(message) {
  const contactContent = document.querySelector('.contact-content');
  const formMessage = document.createElement('div');
  formMessage.className = 'form-message success-message';
  formMessage.innerHTML = `
    <div class="message-icon">✓</div>
    <div class="message-content">${message}</div>
  `;
  contactContent.appendChild(formMessage);
  
  // Animate the message
  setTimeout(() => formMessage.classList.add('visible'), 10);
  
  // Automatically remove after a delay
  setTimeout(() => {
    formMessage.classList.remove('visible');
    setTimeout(() => formMessage.remove(), 300);
  }, 5000);
}

function showFormError(message) {
  const contactContent = document.querySelector('.contact-content');
  const formMessage = document.createElement('div');
  formMessage.className = 'form-message error-message';
  formMessage.innerHTML = `
    <div class="message-icon">!</div>
    <div class="message-content">${message}</div>
    <button class="message-close" aria-label="Dismiss message">×</button>
  `;
  contactContent.appendChild(formMessage);
  
  // Animate the message
  setTimeout(() => formMessage.classList.add('visible'), 10);
  
  // Add event listener to close button
  formMessage.querySelector('.message-close').addEventListener('click', () => {
    formMessage.classList.remove('visible');
    setTimeout(() => formMessage.remove(), 300);
  });
}

// Display a persistent error for contact form when EmailJS fails to initialize
function showContactFormError(message) {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  
  const errorNotice = document.createElement('div');
  errorNotice.className = 'form-service-error';
  errorNotice.innerHTML = `
    <div class="error-icon">⚠️</div>
    <div class="error-message">${message}</div>
  `;
  
  contactForm.innerHTML = '';
  contactForm.appendChild(errorNotice);
}

// Animation for About Section - optimized for performance
function initAboutAnimations() {
  // Elements to animate
  const animatedElements = document.querySelectorAll('.reveal-text, .slide-in, .fade-in');

  // Expertise bars
  const expertiseBars = document.querySelectorAll('.expertise-progress');

  // Intersection Observer for text animations - with optimized batch processing
  const elementObserver = createAnimationObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Use requestAnimationFrame for smoother animations
        requestAnimationFrame(() => {
          entry.target.classList.add('visible');
        });
        elementObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  // Intersection Observer for expertise bars - with optimized batch processing
  const barObserver = createAnimationObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Use requestAnimationFrame for smoother animations
        requestAnimationFrame(() => {
          entry.target.classList.add('animate');
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  // Observe all animated elements - in smaller batches for better performance
  const observeElementsInBatches = (elements, observer, batchSize = 10) => {
    for (let i = 0; i < elements.length; i += batchSize) {
      setTimeout(() => {
        const batch = Array.from(elements).slice(i, i + batchSize);
        batch.forEach(element => observer.observe(element));
      }, 0);
    }
  };

  observeElementsInBatches(animatedElements, elementObserver);
  observeElementsInBatches(expertiseBars, barObserver);
}

// Section Divider Animations - optimized for performance
function initSectionDividers() {
  const dividerObserver = createAnimationObserver((entries) => {
    entries.forEach(entry => {
      // Only run animation if element is intersecting AND hasn't been animated yet
      if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
        // Mark this divider as already animated
        entry.target.setAttribute('data-animated', 'true');
        
        // Use requestAnimationFrame for smoother animations
        requestAnimationFrame(() => {
          // Animate the left line
          const leftLine = entry.target.querySelector('.divider-line-left');
          if (leftLine) leftLine.classList.add('animate');
          
          // Animate the right line
          const rightLine = entry.target.querySelector('.divider-line-right');
          if (rightLine) rightLine.classList.add('animate');
        });
        
        // Animate the circle with a slight delay using requestAnimationFrame for better performance
        const circle = entry.target.querySelector('.divider-circle');
        if (circle) {
          setTimeout(() => {
            requestAnimationFrame(() => {
              circle.classList.add('animate');
            });
          }, 300);
        }
      }
    });
  }, { threshold: 0.5 });
  
  // Observe all dividers
  document.querySelectorAll('.section-divider').forEach(divider => {
    dividerObserver.observe(divider);
  });
}

// Cache DOM references
const domCache = {};

// Performance-optimized function to get and cache DOM elements
function getElement(id) {
  if (!domCache[id]) {
    domCache[id] = document.getElementById(id);
  }
  return domCache[id];
}

// Initialize dark mode - with performance optimizations
function initDarkMode() {
  // We'll skip this since it's now handled by common.js
  // This avoids duplicate event listeners that might interfere with each other
  console.log('Dark mode initialization delegated to common.js');
  
  // The code below is commented out because common.js now handles it
  /*
  const themeToggle = getElement('theme-toggle');
  if (!themeToggle) return;
  
  // Check for saved user preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // Toggle dark/light mode
  themeToggle.addEventListener('click', function() {
    // Use requestAnimationFrame for smoother class updates
    requestAnimationFrame(() => {
      document.body.classList.toggle('dark-mode');

      // Save user preference
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  });
  */
}

// Enhanced function to initialize contact card with better animation handling
function initContactCard() {
  const contactCard = document.getElementById('contact-card');
  if (!contactCard) return;
  
  // Create a dedicated observer for the contact card with a larger root margin
  // This will trigger the animation earlier as the user scrolls down
  const contactCardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Use requestAnimationFrame for smoother animation
        requestAnimationFrame(() => {
          contactCard.style.opacity = '1';
          contactCard.style.transform = 'translateY(0)';
        });
        // Once animated, disconnect the observer
        contactCardObserver.disconnect();
      }
    });
  }, { 
    threshold: 0.1, // Lower threshold to trigger animation earlier
    rootMargin: '0px 0px 100px 0px' // Larger bottom margin to detect earlier when scrolling
  });
  
  // Set initial styles to ensure animation works properly
  contactCard.style.opacity = '0';
  contactCard.style.transform = 'translateY(30px)';
  contactCard.style.transition = 'opacity 0.8s ease, transform 0.8s var(--animation-curve)';
  
  // Start observing the contact card
  contactCardObserver.observe(contactCard);
}

// Initialize page scroll position on refresh
function initScrollPosition() {
  if (window.location.hash) {
    history.replaceState("", document.title, window.location.pathname);
    window.scrollTo(0, 0);
  }
}

// Main initialization function - with performance optimizations
function init() {
  // Initialize preloader
  handlePreloader();  
  
  // Initialize immediate UI requirements
  initScrollPosition();
  
  // Initialize scroll to top button
  initScrollToTop();
  
  // Core functionality   
  setTimeout(() => {
    loadSkills();
    loadProjects();
    // Initialize contact card earlier in the process
    initContactCard();
  }, 0);
  
  // Non-critical animations with slight delay
  setTimeout(() => {
    initAboutAnimations();
    initSectionDividers();
    enhanceImageLoading();
    // Moved initContactCard() from here to the block above
  }, 10);
  
  // Remaining functionality with longer delay
  setTimeout(() => {
    initEmailJS();
    initLanguageSwitcher();
  }, 20);
  
  // Add event listener for skip to content link
  const skipLink = document.querySelector('.skip-to-content');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.querySelector('#main-content');
      if (mainContent) {
        mainContent.tabIndex = -1;
        mainContent.focus();
      }
    });
  }
}

// Initialize intersection observer for lazy loading images
function initLazyImages() {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '200px' // Start loading images when they are 200px from viewport
  });
  
  // Find all images with data-src attribute
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Detect when page is visible and prioritize work accordingly
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    // Prioritize any pending work when page becomes visible
  } else {
    // Deprioritize work when page is not visible
  }
});

// Initialize when DOM is ready - use JavaScript module pattern for better performance
document.addEventListener('DOMContentLoaded', function() {
  // Initialize critical functionality immediately
  init();
  
  // Initialize lazy loading after a slight delay
  setTimeout(initLazyImages, 100);
});

// Language switching functionality
function initLanguageSwitcher() {
  // Add event listener for language change events from common.js
  document.addEventListener('languageChanged', function(e) {
    e.preventDefault(); // Prevent default reload behavior
    const newLang = e.detail.language;
    applyTranslations(newLang);
  });
  
  // Apply translations on page load
  const currentLang = localStorage.getItem('language') || 'en';
  applyTranslations(currentLang);
}

// Apply translations to the page - More complete version to cover all elements
function applyTranslations(lang) {
  const translations = TRANSLATIONS[lang];
  if (!translations) return;
  
  // Update navigation links
  const aboutNavLink = document.querySelector('.nav-links li:nth-child(1) a');
  const projectsNavLink = document.querySelector('.nav-links li:nth-child(2) a');
  const contactNavLink = document.querySelector('.nav-links li:nth-child(3) a');
  
  if (aboutNavLink) aboutNavLink.textContent = translations.nav.about;
  if (projectsNavLink) projectsNavLink.textContent = translations.nav.projects;
  if (contactNavLink) contactNavLink.textContent = translations.nav.contact;
  
  // Update hero section
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroProjectsBtn = document.querySelector('.hero-buttons .btn:first-child');
  const heroContactBtn = document.querySelector('.hero-buttons .btn-outline');
  
  if (heroTitle) heroTitle.textContent = translations.hero.title;
  if (heroSubtitle) heroSubtitle.textContent = translations.hero.subtitle;
  if (heroProjectsBtn) heroProjectsBtn.textContent = translations.hero.viewProjects;
  if (heroContactBtn) heroContactBtn.textContent = translations.hero.getInTouch;
  
  // Update about section
  const aboutTitle = document.querySelector('#about .section-title');
  const aboutSubtitle = document.querySelector('#about .section-subtitle');
  if (aboutTitle) aboutTitle.textContent = translations.about.title;
  if (aboutSubtitle) aboutSubtitle.textContent = translations.about.subtitle;
  
  // Update about sections
  const aboutSections = document.querySelectorAll('#about .about-section');
  if (aboutSections.length >= 1) {
    const journeyTitle = aboutSections[0].querySelector('h3');
    const journeyContent = aboutSections[0].querySelector('p');
    if (journeyTitle) journeyTitle.textContent = translations.about.journey.title;
    if (journeyContent) journeyContent.textContent = translations.about.journey.content;
  }
  
  if (aboutSections.length >= 2) {
    const approachTitle = aboutSections[1].querySelector('h3');
    const approachContent = aboutSections[1].querySelector('p');
    if (approachTitle) approachTitle.textContent = translations.about.approach.title;
    if (approachContent) approachContent.textContent = translations.about.approach.content;
  }
  
  if (aboutSections.length >= 3) {
    const toolkitTitle = aboutSections[2].querySelector('h3');
    const toolkitContent = aboutSections[2].querySelector('p');
    if (toolkitTitle) toolkitTitle.textContent = translations.about.toolkit.title;
    if (toolkitContent) toolkitContent.textContent = translations.about.toolkit.content;
  }
  
  // Update expertise labels
  const expertiseLabels = document.querySelectorAll('.expertise-area .expertise-label');
  if (expertiseLabels.length >= 1) expertiseLabels[0].textContent = translations.about.toolkit.frontend;
  if (expertiseLabels.length >= 2) expertiseLabels[1].textContent = translations.about.toolkit.backend;
  if (expertiseLabels.length >= 3) expertiseLabels[2].textContent = translations.about.toolkit.ai;
  
  // Update skills title
  const skillsTitle = document.querySelector('.skills-title');
  if (skillsTitle) skillsTitle.textContent = translations.about.skills;
  
  // Update projects section
  const projectsTitle = document.querySelector('#projects .section-title');
  const projectsSubtitle = document.querySelector('#projects .section-subtitle');
  if (projectsTitle) projectsTitle.textContent = translations.projects.title;
  if (projectsSubtitle) projectsSubtitle.textContent = translations.projects.subtitle;
  
  // Update CTA button
  const projectsCtaBtn = document.querySelector('.projects-cta-btn span');
  if (projectsCtaBtn) projectsCtaBtn.textContent = lang === 'fr' ? 'Voir tous les projets' : 'View All Projects';
  
  // Update contact section
  const contactTitle = document.querySelector('#contact .section-title');
  const contactSubtitle = document.querySelector('#contact .section-subtitle');
  if (contactTitle) contactTitle.textContent = translations.contact.title;
  if (contactSubtitle) contactSubtitle.textContent = translations.contact.subtitle;
  
  // Update contact form
  const contactFormTitle = document.querySelector('.contact-title');
  const contactFormSubtitle = document.querySelector('.contact-header p');
  if (contactFormTitle) contactFormTitle.textContent = translations.contact.formTitle;
  if (contactFormSubtitle) contactFormSubtitle.textContent = translations.contact.formSubtitle;
  
  // Update form placeholders
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const submitButton = document.querySelector('.contact-form button');
  
  if (nameInput) nameInput.placeholder = translations.contact.name;
  if (emailInput) emailInput.placeholder = translations.contact.email;
  if (subjectInput) subjectInput.placeholder = translations.contact.subject;
  if (messageInput) messageInput.placeholder = translations.contact.message;
  if (submitButton) submitButton.textContent = translations.contact.send;
  
  // Update footer
  const copyright = document.querySelector('.copyright');
  if (copyright) copyright.textContent = translations.footer.copyright;
  
  // Update tagline in footer
  const footerTagline = document.querySelector('.footer-tagline');
  if (footerTagline) {
    footerTagline.textContent = lang === 'fr' ? 
      'Étudiant en Informatique & Passionné d\'IA' : 
      'Computer Science Student & AI Enthusiast';
  }
  
  // Update skill cards
  updateSkillsWithCurrentLanguage(lang);
  
  // Update project cards
  updateProjectsWithCurrentLanguage(lang);
  
  // Update meta description
  updateMetaDescription(lang);
}

// Update skill cards with current language
function updateSkillsWithCurrentLanguage(lang) {
  const skillCards = document.querySelectorAll('.skill-card');
  if (!skillCards.length) return;
  
  skillCards.forEach((card, index) => {
    if (index >= skills.length) return;
      
    const skill = skills[index];
    const titleElement = card.querySelector('h3');
    const descriptionElement = card.querySelector('p');
    
    if (titleElement && skill.title && skill.title[lang]) {
      titleElement.textContent = skill.title[lang];
    }
    
    if (descriptionElement && skill.description && skill.description[lang]) {
      descriptionElement.textContent = skill.description[lang];
    }
  });
}

// Update project cards with current language
function updateProjectsWithCurrentLanguage(lang) {
  const projectCards = document.querySelectorAll('.project-card');
  if (!projectCards.length) return;
  
  projectCards.forEach(card => {
    const projectId = card.dataset.projectId;
    if (!projectId) return;
    
    // Find matching project
    const project = projects.find(p => p.name.replace(/\s+/g, '-').toLowerCase() === projectId);
    if (!project) return;
    
    // Update description
    const descriptionEl = card.querySelector('.project-content p');
    if (descriptionEl && project.description) {
      descriptionEl.textContent = project.description[lang] || project.description.en;
    }
    
    // Update button texts
    const liveDemo = card.querySelector('.project-links .btn:not(.btn-outline)');
    const viewRepo = card.querySelector('.project-links .btn.btn-outline');
    
    if (liveDemo) {
      liveDemo.textContent = TRANSLATIONS[lang].projects.liveDemo;
    }
    
    if (viewRepo) {
      viewRepo.textContent = TRANSLATIONS[lang].projects.viewRepo;
    }
  });
}

// Function to update meta description based on language
function updateMetaDescription(lang) {
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && CONFIG.metaDescription[lang]) {
    metaDescription.setAttribute('content', CONFIG.metaDescription[lang]);
  }
  
  // Also update Open Graph and Twitter descriptions
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  
  if (ogDescription && CONFIG.metaDescription[lang]) {
    ogDescription.setAttribute('content', CONFIG.metaDescription[lang]);
  }
  
  if (twitterDescription && CONFIG.metaDescription[lang]) {
    twitterDescription.setAttribute('content', CONFIG.metaDescription[lang]);
  }
}

// Add preloader functionality
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

// Add scroll-to-top button functionality
function initScrollToTop() {
  const scrollTopBtn = document.getElementById('scroll-to-top');
  if (!scrollTopBtn) return;
  
  // Show/hide button based on scroll position
  const toggleScrollTopBtn = debounce(() => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, 100);
  
  // Scroll to top when button clicked
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  window.addEventListener('scroll', toggleScrollTopBtn, { passive: true });
}

// Enhanced image loading with placeholder
function enhanceImageLoading() {
  const projectImages = document.querySelectorAll('.project-image');
  
  projectImages.forEach(image => {
    // Add class for fade-in animation
    image.classList.add('lazy-load');
    
    // Create a simple image loading observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px'  // Start loading when 100px away from viewport
    });
    
    imageObserver.observe(image);
  });
}