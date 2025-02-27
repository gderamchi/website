// Constants and configuration
const CONFIG = {
  observerThreshold: 0.1,
  observerRootMargin: '0px 0px -50px 0px',
  initialProjectsToShow: 3,
  emailjsServiceId: "service_b3nl9bi",
  emailjsTemplateId: "template_ke9hrg9",
  emailjsPublicKey: "aN3NQG_4ipvqqgquR"
};

// Create reusable IntersectionObserver
function createAnimationObserver(callback, options = {}) {
  return new IntersectionObserver(callback, {
    threshold: options.threshold || CONFIG.observerThreshold,
    rootMargin: options.rootMargin || CONFIG.observerRootMargin
  });
}

// Navigation Scroll Effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close menu when clicking on a link
navLinksItems.forEach(item => {
  item.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// Standard animation observer for fade-in elements
const observer = createAnimationObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 100);
      observer.unobserve(entry.target);
    }
  });
});

// Fix for iOS vh units
function setVhUnit() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setVhUnit);
window.addEventListener('orientationchange', setVhUnit);
setVhUnit();

// Skills data
const skills = [
  {
    icon: '⚛️',
    title: 'Front-End Development',
    description: 'Crafting responsive, intuitive interfaces using modern frameworks like React and Vue.'
  },
  {
    icon: '🔧',
    title: 'Back-End Engineering',
    description: 'Designing scalable APIs and robust server architectures with Node.js, Python, and cloud services.'
  },
  {
    icon: '📱',
    title: 'Mobile Development',
    description: 'Developing cross-platform mobile applications with React Native and Flutter for seamless user experiences.'
  },
  {
    icon: '🤖',
    title: 'Prompt Engineering',
    description: 'Creating effective AI prompts and fine-tuning language models to generate intelligent, context-aware responses.'
  }
];

// Projects data - static implementation for reliability
const projects = [
  {
    name: "Doctolib AI Hackathon",
    description: "AI chatbot which helps general health practitioners with prevention strategies",
    image: "images/projects/default.jpg",
    topics: ["AI", "Healthcare", "Python", "Chatbot"],
    html_url: "https://github.com/Guillaume18100/hackathon_doctolib"
  },
  {
    name: "Adopte un Candidat",
    description: "Flutter mobile/web application connecting job candidates with companies",
    image: "images/projects/default.jpg",
    topics: ["Flutter", "Dart", "Job Matching", "Mobile Development"],
    html_url: "https://github.com/algosup/2023-2024-project-5-flutter-team-1"
  },
  {
    name: "Sia GenAI Hackathon",
    description: "Generative AI hackathon project",
    image: "images/projects/default.jpg",
    topics: ["AI", "Hackathon", "Python"],
    html_url: "https://github.com/GuillotSamuel/GenAI_hackaton"
  },
  {
    name: "Blockchain Hackathon",
    description: "Blockchain hackathon Vierzon 2024",
    image: "images/projects/default.jpg",
    topics: ["Blockchain", "JavaScript", "Hackathon"],
    html_url: "https://github.com/0xBelnadris/hackaton-blockchain-vierzon-2024"
  },
  {
    name: "Virtual Processor",
    description: "Building a virtual processor with assembler and interpreter",
    image: "images/projects/default.jpg",
    topics: ["assembler", "interpreter", "virtual-processor", "c", "c++", "cmake"],
    html_url: "https://github.com/algosup/2023-2024-project-3-virtual-processor-team-2"
  },
  {
    name: "x86 Retrogaming",
    description: "Recreating Pac-Man in Assembly",
    image: "images/projects/default.jpg",
    topics: ["assembly", "x86", "retrogaming", "pacman", "dosbox"],
    html_url: "https://github.com/algosup/2023-2024-project-2-x86-retrogaming-team-5"
  }
];

// Function to render skills in the DOM
function loadSkills() {
  const skillsContainer = document.getElementById('skills-container');
  if (!skillsContainer) return;
  
  skills.forEach(skill => {
    const skillCard = document.createElement('div');
    skillCard.classList.add('skill-card');
    skillCard.innerHTML = `
      <div class="skill-icon">${skill.icon}</div>
      <h3>${skill.title}</h3>
      <p>${skill.description}</p>
    `;
    skillsContainer.appendChild(skillCard);
    observer.observe(skillCard);
  });
}

// Function to create a project card element
function createProjectCard(project) {
  const projectCard = document.createElement('div');
  projectCard.classList.add('project-card');

  // Extract topics as tags
  const tagsHTML = project.topics && project.topics.length > 0 
    ? project.topics.map(tag => `<span class="project-tag">${tag}</span>`).join('')
    : '<span class="project-tag">Project</span>';

  projectCard.innerHTML = `
    <img src="${project.image || 'images/projects/default.jpg'}" alt="${project.name}" class="project-image">
    <div class="project-content">
      <h3>${project.name.replace(/-/g, ' ')}</h3>
      <p>${project.description || 'A personal project'}</p>
      <div class="project-tags">${tagsHTML}</div>
    </div>
    <div class="project-links">
      ${project.homepage ? `<a href="${project.homepage}" target="_blank" class="btn btn-sm">Live Demo</a>` : ''}
      <a href="${project.html_url}" target="_blank" class="btn btn-sm btn-outline">View Repository</a>
    </div>
  `;

  return projectCard;
}

// Function to display projects with "Show More" button
function displayProjects(projects) {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) {
    console.error("Projects grid element not found in displayProjects!");
    return;
  }

  projectsGrid.innerHTML = '';
  
  const initialProjects = projects.slice(0, CONFIG.initialProjectsToShow);
  const remainingProjects = projects.slice(CONFIG.initialProjectsToShow);

  // Render initial projects
  initialProjects.forEach(project => {
    const projectCard = createProjectCard(project);
    projectsGrid.appendChild(projectCard);
    observer.observe(projectCard);
  });

  // Add "Show More" button if there are more projects
  if (remainingProjects.length > 0) {
    addShowMoreButton(projectsGrid, remainingProjects);
  }
}

// Function to add the "Show More" button
function addShowMoreButton(projectsGrid, remainingProjects) {
  const showMoreWrapper = document.createElement('div');
  showMoreWrapper.classList.add('show-more-wrapper');

  const showMoreBtn = document.createElement('button');
  showMoreBtn.classList.add('btn', 'show-more-btn');
  showMoreBtn.textContent = 'Show More Projects';

  showMoreBtn.addEventListener('click', function() {
    // Render remaining projects
    remainingProjects.forEach(project => {
      const projectCard = createProjectCard(project);
      projectsGrid.appendChild(projectCard);
      observer.observe(projectCard);
    });
    
    // Remove the show more button
    showMoreWrapper.remove();
    
    // Add GitHub link after showing all projects
    addGitHubLink(projectsGrid.parentNode);
  });

  showMoreWrapper.appendChild(showMoreBtn);
  projectsGrid.parentNode.insertBefore(showMoreWrapper, projectsGrid.nextSibling);
}

// Function to add GitHub link
function addGitHubLink(container) {
  const githubLinkWrapper = document.createElement('div');
  githubLinkWrapper.classList.add('github-link-wrapper');

  const githubLink = document.createElement('a');
  githubLink.href = 'https://github.com/Guillaume18100';
  githubLink.className = 'github-link btn btn-outline';
  githubLink.target = '_blank';
  githubLink.innerHTML = '<i class="fab fa-github"></i> View All Projects on GitHub';

  githubLinkWrapper.appendChild(githubLink);
  container.appendChild(githubLinkWrapper);
}

// Load projects from the static data
function loadProjects() {
  try {
    displayProjects(projects);
  } catch (error) {
    console.error('Error loading projects:', error);
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
      projectsGrid.innerHTML = `<p>Failed to load projects. Please try again later.</p>`;
    }
  }
}

// Initialize EmailJS
function initEmailJS() {
  try {
    emailjs.init(CONFIG.emailjsPublicKey);
    setupContactForm();
  } catch (error) {
    console.error('Error initializing EmailJS:', error);
  }
}

// Setup contact form submission
function setupContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

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
        alert('Message sent successfully!');
        contactForm.reset();
      },
      function(error) {
        console.log("FAILED", error);
        alert('Failed to send message. Please try again.');
      }
    ).finally(() => {
      // Reset button state
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    });
  });
}

// Animation for About Section
function initAboutAnimations() {
  // Elements to animate
  const animatedElements = document.querySelectorAll('.reveal-text, .slide-in, .fade-in');

  // Expertise bars
  const expertiseBars = document.querySelectorAll('.expertise-progress');

  // Intersection Observer for text animations
  const elementObserver = createAnimationObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        elementObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  // Intersection Observer for expertise bars
  const barObserver = createAnimationObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  // Observe all animated elements
  animatedElements.forEach(element => {
    elementObserver.observe(element);
  });

  // Observe expertise bars
  expertiseBars.forEach(bar => {
    barObserver.observe(bar);
  });
}

// Section Divider Animations
function initSectionDividers() {
  const dividerObserver = createAnimationObserver((entries) => {
    entries.forEach(entry => {
      // Only run animation if element is intersecting AND hasn't been animated yet
      if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
        // Mark this divider as already animated
        entry.target.setAttribute('data-animated', 'true');
        
        // Animate the left line
        const leftLine = entry.target.querySelector('.divider-line-left');
        if (leftLine) leftLine.classList.add('animate');
        
        // Animate the right line
        const rightLine = entry.target.querySelector('.divider-line-right');
        if (rightLine) rightLine.classList.add('animate');
        
        // Animate the circle with a slight delay
        const circle = entry.target.querySelector('.divider-circle');
        if (circle) {
          setTimeout(() => {
            circle.classList.add('animate');
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

// Initialize dark mode
function initDarkMode() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  // Check for saved user preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // Toggle dark/light mode
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');

    // Save user preference
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
}

// Observe contact card for animation
function initContactCard() {
  const contactCard = document.getElementById('contact-card');
  if (contactCard) {
    observer.observe(contactCard);
  }
}

// Initialize page scroll position on refresh
function initScrollPosition() {
  if (window.location.hash) {
    history.replaceState("", document.title, window.location.pathname);
    window.scrollTo(0, 0);
  }
}

// Main initialization function
function init() {
  initScrollPosition();
  loadSkills();
  loadProjects();
  initDarkMode();
  initAboutAnimations();
  initSectionDividers();
  initContactCard();
  initEmailJS();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);