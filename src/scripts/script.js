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
      education: {
        title: 'Education',
        content: 'Currently pursuing my degree in Computer Science at Algosup, Vierzon. I\'m passionate about learning new technologies and applying them to real-world problems through hands-on projects.'
      },
      interests: {
        title: 'My Interests',
        content: 'I\'m particularly interested in how AI can enhance software applications and user experiences. My coursework and personal projects focus on creating clean, efficient code while exploring the capabilities of LLM through prompt engineering.'
      },
      learning: {
        title: 'Learning Path',
        content: 'I\'m constantly expanding my technical toolkit through coursework and self-study in modern JavaScript frameworks, backend technologies including Node.js and Python, and mobile development.'
      },
      skills: 'Core Skills',
      expertise: 'Expertise'
    },
    projects: {
      title: 'Featured Projects',
      subtitle: 'Highlighted projects from my portfolio showcasing my technical skills and problem-solving approach.',
      viewAll: 'View All Projects',
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
      education: {
        title: 'Formation',
        content: 'Je poursuis actuellement mes études en informatique à Algosup, Vierzon. Je suis passionné par l\'apprentissage de nouvelles technologies et leur application à des problèmes concrets à travers des projets pratiques.'
      },
      interests: {
        title: 'Mes intérêts',
        content: 'Je m\'intéresse particulièrement à la façon dont l\'IA peut améliorer les applications logicielles et les expériences utilisateur. Mes cours et projets personnels se concentrent sur la création de code propre et efficace tout en explorant les capacités des LLM grâce au prompt engineering.'
      },
      learning: {
        title: 'Parcours d\'apprentissage',
        content: 'J\'enrichis constamment mes connaissances techniques à travers mes cours et mon auto-formation sur les frameworks JavaScript, les technologies backend comme Node.js et Python, et le développement mobile.'
      },
      skills: 'Compétences principales',
      expertise: 'Expertise'
    },
    projects: {
      title: 'Projets en vedette',
      subtitle: 'Projets sélectionnés de mon portfolio démontrant mes compétences techniques et mon approche de résolution de problèmes.',
      viewAll: 'Voir tous les projets',
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
    }
  }
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
    title: {
      en: 'Frontend',
      fr: 'Frontend'
    },
    description: {
      en: 'React, Vue, HTML/CSS',
      fr: 'React, Vue, HTML/CSS'
    }
  },
  {
    icon: '🔧',
    title: {
      en: 'Backend',
      fr: 'Backend'
    },
    description: {
      en: 'Node.js, Python, APIs',
      fr: 'Node.js, Python, APIs'
    }
  },
  {
    icon: '📱',
    title: {
      en: 'Mobile',
      fr: 'Mobile'
    },
    description: {
      en: 'React Native, Flutter',
      fr: 'React Native, Flutter'
    }
  },
  {
    icon: '🤖',
    title: {
      en: 'AI/Prompts',
      fr: 'IA/Prompts'
    },
    description: {
      en: 'LLM, Prompt Engineering',
      fr: 'LLM, Prompt Engineering'
    }
  }
];

// Load skills
function loadSkills() {
  const currentLang = localStorage.getItem('language') || 'en';
  const skillsContainer = document.getElementById('skills-container');
  if (!skillsContainer) return;
  
  const fragment = document.createDocumentFragment();
  
  skills.forEach(skill => {
    const skillItem = document.createElement('div');
    skillItem.classList.add('skill-item');
    skillItem.innerHTML = `
      <div class="skill-icon">${skill.icon}</div>
      <div class="skill-name">${skill.title[currentLang]}</div>
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
  
  const currentLang = localStorage.getItem('language') || 'en';
  const featuredProjects = projects.slice(0, CONFIG.initialProjectsToShow);
  
  console.log(`Loading ${featuredProjects.length} featured projects`);
  
  // Clear existing content
  projectsGrid.innerHTML = '';
  
  const fragment = document.createDocumentFragment();
  
  featuredProjects.forEach((project, index) => {
    const card = createProjectCard(project, currentLang);
    card.style.animationDelay = `${index * 0.1}s`;
    fragment.appendChild(card);
  });
  
  projectsGrid.appendChild(fragment);
  
  console.log('Projects loaded successfully');
}

// Create project card
function createProjectCard(project, lang) {
  const card = document.createElement('div');
  card.classList.add('project-card');
  
  const description = project.description && project.description[lang] ? 
    project.description[lang] : 
    (project.description && project.description.en ? project.description.en : 'A student project');
  
  const shortDescription = description.length > 120 ? 
    description.substring(0, 120) + '...' : 
    description;
  
  const tagsHTML = project.topics && project.topics.length > 0 
    ? project.topics.slice(0, 3).map(tag => `<span class="project-tag">${tag}</span>`).join('')
    : '<span class="project-tag">Project</span>';
  
  const buttonTexts = {
    viewRepo: TRANSLATIONS[lang].projects.viewRepo,
    liveDemo: TRANSLATIONS[lang].projects.liveDemo
  };
  
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
          <i class="fas fa-external-link-alt"></i> ${buttonTexts.liveDemo}
        </a>` : ''}
        <a href="${project.html_url}" target="_blank" rel="noopener" class="project-link">
          <i class="fab fa-github"></i> ${buttonTexts.viewRepo}
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
        const currentLang = localStorage.getItem('language') || 'en';
        showFormMessage(TRANSLATIONS[currentLang].contact.success, 'success');
        contactForm.reset();
      },
      function(error) {
        const currentLang = localStorage.getItem('language') || 'en';
        showFormMessage(TRANSLATIONS[currentLang].contact.error, 'error');
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

// Language switcher
function initLanguageSwitcher() {
  document.addEventListener('languageChanged', function(e) {
    const newLang = e.detail.language;
    applyTranslations(newLang);
  });
  
  const currentLang = localStorage.getItem('language') || 'en';
  applyTranslations(currentLang);
}

// Apply translations
function applyTranslations(lang) {
  const t = TRANSLATIONS[lang];
  if (!t) return;
  
  // Update navigation
  const navLinks = document.querySelectorAll('.nav-link');
  if (navLinks[0]) navLinks[0].textContent = t.nav.about;
  if (navLinks[1]) navLinks[1].textContent = t.nav.projects;
  if (navLinks[2]) navLinks[2].textContent = t.nav.contact;
  
  // Update hero
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroTitle) {
    heroTitle.innerHTML = `<span class="gradient-text">${t.hero.title.split('&')[0]}</span> & ${t.hero.title.split('&')[1]}`;
  }
  if (heroSubtitle) heroSubtitle.textContent = t.hero.subtitle;
  
  // Update buttons
  const viewProjectsBtn = document.querySelector('.hero-buttons .btn-primary span');
  const getInTouchBtn = document.querySelector('.hero-buttons .btn-outline');
  if (viewProjectsBtn) viewProjectsBtn.textContent = t.hero.viewProjects;
  if (getInTouchBtn) getInTouchBtn.textContent = t.hero.getInTouch;
  
  // Update section titles
  const aboutTitle = document.querySelector('#about .section-title');
  const aboutSubtitle = document.querySelector('#about .section-subtitle');
  if (aboutTitle) aboutTitle.textContent = t.about.title;
  if (aboutSubtitle) aboutSubtitle.textContent = t.about.subtitle;
  
  const projectsTitle = document.querySelector('#projects .section-title');
  const projectsSubtitle = document.querySelector('#projects .section-subtitle');
  if (projectsTitle) projectsTitle.textContent = t.projects.title;
  if (projectsSubtitle) projectsSubtitle.textContent = t.projects.subtitle;
  
  const contactTitle = document.querySelector('#contact .section-title');
  const contactSubtitle = document.querySelector('#contact .section-subtitle');
  if (contactTitle) contactTitle.textContent = t.contact.title;
  if (contactSubtitle) contactSubtitle.textContent = t.contact.subtitle;
  
  // Update contact form
  const contactFormTitle = document.querySelector('.contact-header h3');
  const contactFormSubtitle = document.querySelector('.contact-header p');
  if (contactFormTitle) contactFormTitle.textContent = t.contact.formTitle;
  if (contactFormSubtitle) contactFormSubtitle.textContent = t.contact.formSubtitle;
  
  // Update form labels
  const nameLabel = document.querySelector('label[for="name"]');
  const emailLabel = document.querySelector('label[for="email"]');
  const subjectLabel = document.querySelector('label[for="subject"]');
  const messageLabel = document.querySelector('label[for="message"]');
  const submitBtn = document.querySelector('.form-submit span');
  
  if (nameLabel) nameLabel.textContent = t.contact.name;
  if (emailLabel) emailLabel.textContent = t.contact.email;
  if (subjectLabel) subjectLabel.textContent = t.contact.subject;
  if (messageLabel) messageLabel.textContent = t.contact.message;
  if (submitBtn) submitBtn.textContent = t.contact.send;
  
  // Reload skills with new language
  const skillsContainer = document.getElementById('skills-container');
  if (skillsContainer) {
    skillsContainer.innerHTML = '';
    loadSkills();
  }
  
  // Reload projects with new language
  const projectsGrid = document.getElementById('projects-grid');
  if (projectsGrid) {
    projectsGrid.innerHTML = '';
    loadProjects();
  }
}

// Initialize everything
function init() {
  initHeaderScroll();
  initScrollAnimations();
  loadSkills();
  loadProjects();
  animateExpertiseBars();
  initEmailJS();
  initLanguageSwitcher();
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', init);
