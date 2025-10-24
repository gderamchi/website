// Projects Page JavaScript - Modern Version

// Configuration
const CONFIG = {
  animationDelay: 100,
  filterTransitionDuration: 300
};

// State
let currentFilter = 'all';
let allProjects = [];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Projects page initializing...');
  
  // Load and display projects
  loadProjects();
  
  // Setup filter buttons
  setupFilters();
  
  // Setup modal
  setupModal();
  
  // Note: updateStats() is called inside loadProjects(), no need to call it again here
});

/**
 * Load and display all projects
 */
function loadProjects() {
  console.log('Loading projects...');
  
  // Check if projects data is available
  if (typeof projects === 'undefined' || !Array.isArray(projects)) {
    console.error('Projects data not found!');
    showError();
    return;
  }
  
  allProjects = projects;
  console.log(`Found ${allProjects.length} projects`);
  console.log('Projects array:', allProjects);
  
  // Display projects
  displayProjects(allProjects);
  
  // Update filter counts
  updateFilterCounts();
  
  // Update stats
  updateStats();
}

/**
 * Display projects in the grid
 */
function displayProjects(projectsToDisplay) {
  const grid = document.getElementById('projects-grid');
  
  if (!grid) {
    console.error('Projects grid not found!');
    return;
  }
  
  // Clear loading state
  grid.innerHTML = '';
  
  if (projectsToDisplay.length === 0) {
    grid.innerHTML = `
      <div class="no-projects">
        <i class="fas fa-folder-open"></i>
        <p>No projects found for this filter.</p>
      </div>
    `;
    return;
  }
  
  // Create project cards
  projectsToDisplay.forEach((project, index) => {
    const card = createProjectCard(project, index);
    grid.appendChild(card);
  });
  
  // Make grid visible
  grid.classList.add('visible');
}

/**
 * Create a project card element
 */
function createProjectCard(project, index) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.style.animationDelay = `${index * 0.05}s`;
  
  // Get description
  const description = project.description || 'A software project';
  
  // Truncate description
  const shortDescription = description.length > 120 
    ? description.substring(0, 117) + '...'
    : description;
  
  // Create topics HTML
  const topicsHTML = project.topics && project.topics.length > 0
    ? project.topics.slice(0, 4).map(topic => 
        `<span class="project-tag">${escapeHtml(topic)}</span>`
      ).join('')
    : '';
  
  card.innerHTML = `
    <div class="project-image-container">
      <img 
        src="${project.image || 'src/assets/images/projects/default.webp'}" 
        alt="${escapeHtml(project.title || project.name)}"
        class="project-image"
        loading="lazy"
      />
      <div class="project-overlay">
        <span class="project-year">${project.date || '2024'}</span>
      </div>
    </div>
    
    <div class="project-content">
      <h3 class="project-title">${escapeHtml(project.title || project.name)}</h3>
      <p class="project-description">${escapeHtml(shortDescription)}</p>
      
      ${topicsHTML ? `<div class="project-tags">${topicsHTML}</div>` : ''}
      
      <div class="project-footer">
        <button class="project-btn project-btn-primary" data-project-index="${index}">
          <span>View Details</span>
          <i class="fas fa-arrow-right"></i>
        </button>
        ${project.html_url ? `
          <a href="${project.html_url}" target="_blank" rel="noopener" class="project-btn project-btn-secondary">
            <i class="fab fa-github"></i>
          </a>
        ` : ''}
      </div>
    </div>
  `;
  
  // Add click handler for "View Details" button
  const viewBtn = card.querySelector('.project-btn-primary');
  if (viewBtn) {
    viewBtn.addEventListener('click', () => openModal(project));
  }
  
  return card;
}

/**
 * Setup filter buttons
 */
function setupFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      // Update active state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Apply filter
      currentFilter = filter;
      filterProjects(filter);
    });
  });
}

/**
 * Filter projects based on category
 */
function filterProjects(filter) {
  let filtered = allProjects;
  
  if (filter !== 'all') {
    filtered = allProjects.filter(project => {
      const topics = (project.topics || []).map(t => t.toLowerCase());
      const description = (project.description?.en || '').toLowerCase();
      const name = (project.name || '').toLowerCase();
      
      switch(filter) {
        case 'ai':
          return topics.some(t => t.includes('ai') || t.includes('ml') || t.includes('machine learning')) ||
                 description.includes('ai') || description.includes('artificial intelligence');
        
        case 'web':
          return topics.some(t => t.includes('web') || t.includes('website') || t.includes('frontend') || t.includes('backend')) ||
                 description.includes('web');
        
        case 'mobile':
          return topics.some(t => t.includes('mobile') || t.includes('ios') || t.includes('android') || t.includes('flutter')) ||
                 description.includes('mobile');
        
        case 'hackathon':
          return topics.includes('hackathon') || 
                 name.includes('hackathon') ||
                 description.includes('hackathon');
        
        default:
          return true;
      }
    });
  }
  
  // Animate out current projects
  const grid = document.getElementById('projects-grid');
  grid.style.opacity = '0';
  
  setTimeout(() => {
    displayProjects(filtered);
    grid.style.opacity = '1';
  }, CONFIG.filterTransitionDuration);
}

/**
 * Update filter counts
 */
function updateFilterCounts() {
  const counts = {
    all: allProjects.length,
    ai: 0,
    web: 0,
    mobile: 0,
    hackathon: 0
  };
  
  allProjects.forEach(project => {
    const topics = (project.topics || []).map(t => t.toLowerCase());
    const description = (project.description?.en || '').toLowerCase();
    const name = (project.name || '').toLowerCase();
    
    if (topics.some(t => t.includes('ai') || t.includes('ml')) || description.includes('ai')) {
      counts.ai++;
    }
    if (topics.some(t => t.includes('web') || t.includes('website')) || description.includes('web')) {
      counts.web++;
    }
    if (topics.some(t => t.includes('mobile') || t.includes('flutter')) || description.includes('mobile')) {
      counts.mobile++;
    }
    if (topics.includes('hackathon') || name.includes('hackathon')) {
      counts.hackathon++;
    }
  });
  
  // Update count badges
  Object.keys(counts).forEach(key => {
    const countEl = document.getElementById(`count-${key}`);
    if (countEl) {
      countEl.textContent = counts[key];
    }
  });
}

/**
 * Update statistics
 */
function updateStats() {
  // Total projects
  const totalEl = document.getElementById('total-projects');
  if (totalEl && !totalEl.dataset.animated) {
    totalEl.dataset.animated = 'true';
    animateNumber(totalEl, 0, allProjects.length, 1000);
  }
  
  // Total technologies
  const techEl = document.getElementById('total-technologies');
  if (techEl && !techEl.dataset.animated) {
    techEl.dataset.animated = 'true';
    const uniqueTechs = new Set();
    allProjects.forEach(p => {
      if (p.topics) {
        p.topics.forEach(t => uniqueTechs.add(t));
      }
    });
    animateNumber(techEl, 0, uniqueTechs.size, 1000);
  }
  
  // Calculate years active
  const yearsEl = document.getElementById('years-active');
  if (yearsEl) {
    const years = calculateYearsActive();
    yearsEl.textContent = years;
  }
}

/**
 * Calculate years active based on project dates
 */
function calculateYearsActive() {
  const currentYear = new Date().getFullYear();
  let earliestYear = currentYear;
  
  allProjects.forEach(project => {
    if (project.date && project.date !== 'NaN') {
      const year = parseInt(project.date);
      if (!isNaN(year) && year < earliestYear) {
        earliestYear = year;
      }
    }
  });
  
  const yearsActive = currentYear - earliestYear + 1;
  return yearsActive > 1 ? `${yearsActive}+` : '1';
}

/**
 * Animate number counting
 */
function animateNumber(element, start, end, duration) {
  // Clear any existing animation timer on this element
  if (element._animationTimer) {
    clearInterval(element._animationTimer);
  }
  
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  element._animationTimer = setInterval(() => {
    current += increment;
    if (current >= end) {
      current = end;
      clearInterval(element._animationTimer);
      element._animationTimer = null;
    }
    element.textContent = Math.floor(current);
  }, 16);
}

/**
 * Setup modal functionality
 */
function setupModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = modal?.querySelector('.modal-close');
  const overlay = modal?.querySelector('.modal-overlay');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  if (overlay) {
    overlay.addEventListener('click', closeModal);
  }
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * Open project modal
 */
function openModal(project) {
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  
  if (!modal || !modalBody) return;
  
  // Get description
  const description = project.description || 'A software project';
  
  // Create modal content
  modalBody.innerHTML = `
    <div class="modal-header">
      <img 
        src="${project.image || 'src/assets/images/projects/default.webp'}" 
        alt="${escapeHtml(project.title || project.name)}"
        class="modal-image"
      />
      <div class="modal-header-content">
        <span class="modal-year">${project.date || '2024'}</span>
        <h2 class="modal-title">${escapeHtml(project.title || project.name)}</h2>
        <p class="modal-description">${escapeHtml(description)}</p>
      </div>
    </div>
    
    ${project.topics && project.topics.length > 0 ? `
      <div class="modal-section">
        <h3>Technologies</h3>
        <div class="modal-tags">
          ${project.topics.map(topic => 
            `<span class="modal-tag">${escapeHtml(topic)}</span>`
          ).join('')}
        </div>
      </div>
    ` : ''}
    
    ${project.language ? `
      <div class="modal-section">
        <h3>Primary Language</h3>
        <p>${escapeHtml(project.language)}</p>
      </div>
    ` : ''}
    
    <div class="modal-actions">
      ${project.html_url ? `
        <a href="${project.html_url}" target="_blank" rel="noopener" class="modal-btn modal-btn-primary">
          <i class="fab fa-github"></i>
          <span>View on GitHub</span>
        </a>
      ` : ''}
      ${project.homepage ? `
        <a href="${project.homepage}" target="_blank" rel="noopener" class="modal-btn modal-btn-secondary">
          <i class="fas fa-external-link-alt"></i>
          <span>Live Demo</span>
        </a>
      ` : ''}
    </div>
  `;
  
  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Close modal
 */
function closeModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Show error message
 */
function showError() {
  const grid = document.getElementById('projects-grid');
  if (grid) {
    grid.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Oops! Something went wrong</h3>
        <p>Unable to load projects. Please try refreshing the page.</p>
      </div>
    `;
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadProjects,
    filterProjects,
    openModal,
    closeModal
  };
}
