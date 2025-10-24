import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate a beautiful project image using Puppeteer
 * @param {Object} project - Project object with name, description, topics
 * @returns {Promise<string>} Path to generated image
 */
export async function generateProjectImage(project) {
  console.log(`Generating image for: ${project.name}`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport for consistent image size (1200x630 for social media)
    await page.setViewport({ width: 1200, height: 630 });
    
    // Create HTML template
    const html = createImageTemplate(project);
    
    // Set content
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Ensure images directory exists
    const imagesDir = join(__dirname, '../images/projects');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    // Generate filename
    const filename = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.webp`;
    const imagePath = join(imagesDir, filename);
    
    // Take screenshot
    await page.screenshot({
      path: imagePath,
      type: 'webp',
      quality: 90
    });
    
    console.log(`✓ Generated: ${filename}`);
    
    return `images/projects/${filename}`;
  } finally {
    await browser.close();
  }
}

/**
 * Create HTML template for project image
 * @param {Object} project - Project object
 * @returns {string} HTML string
 */
function createImageTemplate(project) {
  // Choose gradient based on project topics
  const gradient = chooseGradient(project.topics || []);
  
  // Get icon based on topics
  const icon = chooseIcon(project.topics || []);
  
  // Truncate description
  const description = (project.description || 'A software project')
    .substring(0, 120) + (project.description?.length > 120 ? '...' : '');
  
  // Get top 4 topics
  const displayTopics = (project.topics || []).slice(0, 4);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          width: 1200px;
          height: 630px;
          background: ${gradient};
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }
        
        /* Animated background pattern */
        .pattern {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.1;
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255,255,255,0.2) 0%, transparent 40%);
        }
        
        /* Geometric shapes */
        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          filter: blur(40px);
        }
        
        .shape1 {
          width: 400px;
          height: 400px;
          top: -100px;
          right: -100px;
        }
        
        .shape2 {
          width: 300px;
          height: 300px;
          bottom: -80px;
          left: -80px;
        }
        
        /* Main content card */
        .content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 80px 100px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-radius: 40px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          max-width: 1000px;
          animation: fadeIn 0.6s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Icon */
        .icon {
          font-size: 80px;
          margin-bottom: 30px;
          filter: drop-shadow(0 4px 20px rgba(0,0,0,0.2));
        }
        
        /* Title */
        h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 72px;
          font-weight: 700;
          color: white;
          margin-bottom: 25px;
          text-shadow: 0 4px 30px rgba(0,0,0,0.3);
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        
        /* Description */
        .description {
          font-size: 26px;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 35px;
          line-height: 1.5;
          font-weight: 400;
          text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        
        /* Tags */
        .tags {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 35px;
        }
        
        .tag {
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 50px;
          font-size: 18px;
          color: white;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.3);
          text-shadow: 0 1px 3px rgba(0,0,0,0.2);
          letter-spacing: 0.02em;
        }
        
        /* Decorative line */
        .divider {
          width: 100px;
          height: 4px;
          background: rgba(255, 255, 255, 0.4);
          margin: 30px auto;
          border-radius: 2px;
        }
      </style>
    </head>
    <body>
      <div class="pattern"></div>
      <div class="shape shape1"></div>
      <div class="shape shape2"></div>
      
      <div class="content">
        <div class="icon">${icon}</div>
        <h1>${escapeHtml(project.name)}</h1>
        <div class="divider"></div>
        <div class="description">${escapeHtml(description)}</div>
        
        ${displayTopics.length > 0 ? `
          <div class="tags">
            ${displayTopics.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
}

/**
 * Choose gradient based on project topics
 * @param {Array} topics - Project topics
 * @returns {string} CSS gradient
 */
function chooseGradient(topics) {
  const topicsStr = topics.join(' ').toLowerCase();
  
  // AI/ML projects - Purple to Blue
  if (topicsStr.includes('ai') || topicsStr.includes('ml') || topicsStr.includes('machine learning')) {
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }
  
  // Web projects - Blue to Cyan
  if (topicsStr.includes('web') || topicsStr.includes('website') || topicsStr.includes('frontend')) {
    return 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)';
  }
  
  // Mobile projects - Pink to Orange
  if (topicsStr.includes('mobile') || topicsStr.includes('ios') || topicsStr.includes('android')) {
    return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
  }
  
  // Game projects - Green to Teal
  if (topicsStr.includes('game') || topicsStr.includes('gaming')) {
    return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
  }
  
  // Blockchain/Crypto - Gold to Orange
  if (topicsStr.includes('blockchain') || topicsStr.includes('crypto') || topicsStr.includes('web3')) {
    return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
  }
  
  // Data/Analytics - Teal to Blue
  if (topicsStr.includes('data') || topicsStr.includes('analytics')) {
    return 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)';
  }
  
  // Default - Purple to Cyan (brand colors)
  return 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)';
}

/**
 * Choose icon emoji based on project topics
 * @param {Array} topics - Project topics
 * @returns {string} Emoji icon
 */
function chooseIcon(topics) {
  const topicsStr = topics.join(' ').toLowerCase();
  
  if (topicsStr.includes('ai') || topicsStr.includes('ml')) return '🤖';
  if (topicsStr.includes('web') || topicsStr.includes('website')) return '🌐';
  if (topicsStr.includes('mobile') || topicsStr.includes('app')) return '📱';
  if (topicsStr.includes('game')) return '🎮';
  if (topicsStr.includes('blockchain') || topicsStr.includes('crypto')) return '⛓️';
  if (topicsStr.includes('data') || topicsStr.includes('analytics')) return '📊';
  if (topicsStr.includes('security') || topicsStr.includes('cyber')) return '🔒';
  if (topicsStr.includes('api')) return '🔌';
  if (topicsStr.includes('tool')) return '🛠️';
  if (topicsStr.includes('library') || topicsStr.includes('framework')) return '📚';
  if (topicsStr.includes('iot') || topicsStr.includes('hardware')) return '🔧';
  if (topicsStr.includes('cloud')) return '☁️';
  
  return '💻'; // Default
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
