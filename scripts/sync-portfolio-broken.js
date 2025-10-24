import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { fetchGitHubRepos, getRepoDetails, getProjectYear, generateTopics } from './fetch-repos.js';
import { generateProjectImage } from './generate-project-image.js';
import { enhanceProjectDescription, generateProjectImageAI } from './enhance-descriptions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Main function to sync portfolio with GitHub repositories
 */
async function syncPortfolio() {
  console.log('🚀 Starting portfolio sync...\n');
  
  // Get configuration from environment or use defaults
  const username = process.env.GITHUB_USERNAME || 'gderamchi';
  const token = process.env.GITHUB_TOKEN;
  const blackboxApiKey = process.env.BLACKBOX_API;
  
  // Organizations to check for contributions
  const organizations = process.env.GITHUB_ORGS 
    ? process.env.GITHUB_ORGS.split(',').map(org => org.trim())
    : ['algosup']; // Default to ALGOSUP
  
  if (!token) {
    console.warn('⚠️  No GITHUB_TOKEN found. API rate limits will be lower.');
    console.warn('   Set GITHUB_TOKEN environment variable for better performance.\n');
  }
  
  // AI features enabled with correct Blackbox API endpoints
  const useAI = true; // Blackbox API endpoints: /chat/completions
  
  if (!blackboxApiKey) {
    console.warn('⚠️  No BLACKBOX_API found. AI enhancements will be skipped.');
    console.warn('   Set BLACKBOX_API environment variable for AI-generated descriptions and images.\n');
  } else if (!useAI) {
    console.warn('ℹ️  AI features temporarily disabled - using fallback system.');
    console.warn('   Waiting for correct Blackbox API endpoint documentation.\n');
  }
  
  try {
    // Step 1: Fetch repositories
    console.log(`📦 Fetching repositories for ${username}...`);
    if (organizations.length > 0) {
      console.log(`   Including organizations: ${organizations.join(', ')}`);
    }
    const repos = await fetchGitHubRepos(username, token, organizations);
    console.log(`✓ Found ${repos.length} repositories\n`);
    
    if (repos.length === 0) {
      console.log('No repositories found. Make sure:');
      console.log('1. Your repositories are public');
      console.log('2. Add "portfolio" topic to repos you want to display');
      console.log('3. Or ensure repos have descriptions');
      return;
    }
    
    // Step 2: Process each repository
    const projects = [];
    let processedCount = 0;
    
    for (const repo of repos) {
      processedCount++;
      console.log(`[${processedCount}/${repos.length}] Processing: ${repo.name}`);
      
      try {
        // Get detailed information
        // Use repo owner for organization repos
        const repoOwner = repo.owner?.login || username;
        const details = await getRepoDetails(repoOwner, repo.name, token);
        
        // Use README description if available, otherwise use repo description
        let description = details.description || repo.description || 'A software project';
        
        // Generate topics
        const topics = generateTopics(repo, details.languages);
        
        // Create project object for enhancement
        const projectForEnhancement = {
          name: repo.name,
          description: description,
          topics: topics,
          language: repo.language
        };
        
        // Step 1: Check for existing AI-generated title/description to save API credits
        let title = repo.name;
        let hasExistingEnhancement = false;
        
        try {
          const projectsDataPath = path.join(__dirname, '../projects-data.js');
          if (fs.existsSync(projectsDataPath)) {
            const existingData = fs.readFileSync(projectsDataPath, 'utf8');
            // Look for this project in existing data
            const projectMatch = existingData.match(
              new RegExp(`"name":\\s*"${repo.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^}]*?"title":\\s*"([^"]+)"[^}]*?"description":\\s*\\{[^}]*?"en":\\s*"([^"]+)"`, 's')
            );
            
            if (projectMatch && projectMatch[1] && projectMatch[2]) {
              // Check if title looks AI-generated (not just formatted repo name)
              const existingTitle = projectMatch[1];
              const formattedName = formatTitle(repo.name);
              
              if (existingTitle !== formattedName && existingTitle.length > 10) {
                title = existingTitle;
                description = projectMatch[2];
                hasExistingEnhancement = true;
                console.log(`  ↻ Using existing AI title: "${title}"`);
              }
            }
          }
        } catch (error) {
          // Ignore errors, will generate new data
        }
        
        if (!hasExistingEnhancement && blackboxApiKey && useAI) {
          try {
            console.log(`  🤖 Generating AI title and description...`);
            const enhanced = await enhanceProjectDescription(projectForEnhancement, blackboxApiKey);
            title = enhanced.title;
            description = enhanced.description;
            console.log(`  ✓ AI enhancement complete`);
            console.log(`     Title: "${title}"`);
          } catch (enhanceError) {
            console.error(`  ⚠️  AI enhancement failed, using fallback`);
            title = formatTitle(repo.name);
          }
        } else if (!hasExistingEnhancement) {
          title = formatTitle(repo.name);
        }
        
        // Step 2: Generate project image with AI (if API key available and enabled)
        let imagePath;
        if (blackboxApiKey && useAI) {
          try {
            console.log(`  🎨 Generating AI image...`);
            const projectWithTitle = { ...projectForEnhancement, title, description };
            imagePath = await generateProjectImageAI(projectWithTitle, blackboxApiKey);
          } catch (imageError) {
            console.error(`  ⚠️  AI image generation failed, using fallback`);
            try {
              imagePath = await generateProjectImage(projectForEnhancement);
            } catch (fallbackError) {
              imagePath = 'images/projects/default.webp';
            }
          }
        } else {
          // Fallback to basic image generation
          try {
            imagePath = await generateProjectImage(projectForEnhancement);
            console.log(`  ✓ Image generated`);
          } catch (imageError) {
            console.error(`  ✗ Image generation failed:`, imageError.message);
            imagePath = 'images/projects/default.webp';
          }
        }
        
        // Create project object
        const project = {
          name: repo.name,
          title: title,
          description: {
            en: description,
            fr: description // TODO: Add translation support
          },
          date: getProjectYear(repo),
          image: imagePath,
          topics: topics,
          html_url: repo.html_url,
          homepage: repo.homepage || null,
          stars: repo.stargazers_count || 0,
          language: repo.language || 'Unknown',
          updated: repo.updated_at
        };
        
        projects.push(project);
        console.log(`  ✓ Processed successfully\n`);
        
        // Rate limiting: wait a bit between requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`  ✗ Error processing ${repo.name}:`, error.message);
        console.log('');
      }
    }
    
    // Step 3: Remove duplicates based on AI-generated titles (with fuzzy matching)
    console.log('\n🔍 Checking for duplicate projects...');
    const uniqueProjects = [];
    const seenTitles = new Map();
    
    for (const project of projects) {
      const normalizedTitle = project.title.toLowerCase().trim();
      
      // Check for exact match first
      let isDuplicate = false;
      let matchedTitle = null;
      
      if (seenTitles.has(normalizedTitle)) {
        isDuplicate = true;
        matchedTitle = normalizedTitle;
      } else {
        // Check for similar titles (fuzzy matching)
        for (const [existingTitle, existingProject] of seenTitles.entries()) {
          const similarity = calculateTitleSimilarity(normalizedTitle, existingTitle);
          if (similarity > 0.85) { // 85% similarity threshold
            isDuplicate = true;
            matchedTitle = existingTitle;
            break;
          }
        }
      }
      
      if (seenTitles.has(normalizedTitle)) {
        const existing = seenTitles.get(normalizedTitle);
        console.log(`  ⚠️  Duplicate detected: "${project.title}"`);
        console.log(`     Keeping: ${existing.name} (${existing.stars} stars, owned: ${!existing.html_url.includes('github.com') || existing.html_url.includes(username)})`);
        console.log(`     Removing: ${project.name} (${project.stars} stars, owned: ${!project.html_url.includes('github.com') || project.html_url.includes(username)})`);
=======
      if (isDuplicate) {
        const existing = seenTitles.get(matchedTitle);
        console.log(`  ⚠️  Duplicate detected: "${project.title}"`);
        console.log(`     Similar to: "${existing.title}"`);
        console.log(`     Keeping: ${existing.name} (${existing.stars} stars, owned: ${existing.html_url.includes(`github.com/${username}/`)})`);
        console.log(`     Removing: ${project.name} (${project.stars} stars, owned: ${project.html_url.includes(`github.com/${username}/`)})`);
=======
      if (seenTitles.has(normalizedTitle)) {
        const existing = seenTitles.get(normalizedTitle);
        console.log(`  ⚠️  Duplicate detected: "${project.title}"`);
        console.log(`     Keeping: ${existing.name} (${existing.stars} stars, owned: ${!existing.html_url.includes('github.com') || existing.html_url.includes(username)})`);
        console.log(`     Removing: ${project.name} (${project.stars} stars, owned: ${!project.html_url.includes('github.com') || project.html_url.includes(username)})`);
        
        // Keep the one with more stars, or if equal, keep owned repo
        if (project.stars > existing.stars) {
          // Replace with higher-starred project
          const index = uniqueProjects.findIndex(p => p.title === existing.title);
          if (index !== -1) {
            uniqueProjects[index] = project;
            seenTitles.set(normalizedTitle, project);
            console.log(`     → Replaced with higher-starred version`);
          }
        } else if (project.stars === existing.stars) {
          // If same stars, prefer owned repo
          const projectIsOwned = project.html_url.includes(`github.com/${username}/`);
          const existingIsOwned = existing.html_url.includes(`github.com/${username}/`);
          
          if (projectIsOwned && !existingIsOwned) {
            const index = uniqueProjects.findIndex(p => p.title === existing.title);
            if (index !== -1) {
              uniqueProjects[index] = project;
              seenTitles.set(normalizedTitle, project);
              console.log(`     → Replaced with owned version`);
            }
          }
        }
      } else {
        seenTitles.set(normalizedTitle, project);
        uniqueProjects.push(project);
      }
    }
    
    const duplicatesRemoved = projects.length - uniqueProjects.length;
    if (duplicatesRemoved > 0) {
      console.log(`✓ Removed ${duplicatesRemoved} duplicate project${duplicatesRemoved > 1 ? 's' : ''}\n`);
    } else {
      console.log(`✓ No duplicates found\n`);
    }
    
    // Step 4: Sort projects by date (newest first)
    uniqueProjects.sort((a, b) => {
      const dateA = parseInt(a.date);
      const dateB = parseInt(b.date);
      if (dateB !== dateA) return dateB - dateA;
      // If same year, sort by update date
      return new Date(b.updated) - new Date(a.updated);
    });
    
    // Step 5: Update projects-data.js
    console.log('📝 Updating projects-data.js...');
    const projectsDataPath = path.join(__dirname, '../projects-data.js');
    
    // Create backup of existing file
    if (fs.existsSync(projectsDataPath)) {
      const backupPath = path.join(__dirname, '../projects-data.backup.js');
      fs.copyFileSync(projectsDataPath, backupPath);
      console.log('  ✓ Backup created: projects-data.backup.js');
    }
    
    // Generate new file content
    const fileContent = generateProjectsDataFile(uniqueProjects);
    fs.writeFileSync(projectsDataPath, fileContent, 'utf8');
    console.log('  ✓ projects-data.js updated\n');
    
    // Step 6: Summary
    console.log('✨ Portfolio sync complete!\n');
    console.log('Summary:');
    console.log(`  • Total projects: ${uniqueProjects.length}`);
    if (duplicatesRemoved > 0) {
      console.log(`  • Duplicates removed: ${duplicatesRemoved}`);
    }
    console.log(`  • Projects by year:`);
    
    const projectsByYear = uniqueProjects.reduce((acc, p) => {
      acc[p.date] = (acc[p.date] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(projectsByYear)
      .sort(([a], [b]) => b.localeCompare(a))
      .forEach(([year, count]) => {
        console.log(`    - ${year}: ${count} project${count > 1 ? 's' : ''}`);
      });
    
    console.log(`\n  • Images generated: ${uniqueProjects.length}`);
    console.log(`  • Topics found: ${new Set(uniqueProjects.flatMap(p => p.topics)).size}`);
    
    console.log('\n🎉 Your portfolio is now up to date!');
    console.log('   Commit and push the changes to deploy.\n');
    
  } catch (error) {
    console.error('\n❌ Error during sync:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

/**
 * Calculate similarity between two titles (0-1)
 * @param {string} title1 - First title
 * @param {string} title2 - Second title
 * @returns {number} Similarity score (0-1)
 */
function calculateTitleSimilarity(title1, title2) {
  if (!title1 || !title2) return 0;
  if (title1 === title2) return 1;
  
  // Tokenize titles into words
  const words1 = title1.toLowerCase().split(/\s+/);
  const words2 = title2.toLowerCase().split(/\s+/);
  
  // Calculate Jaccard similarity (intersection / union)
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * Format a repository name into a readable title
 * @param {string} name - Repository name
 * @returns {string} Formatted title
 */
function formatTitle(name) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\d{4}\s*\d{4}/g, '') // Remove year ranges
    .replace(/project\s+\d+/gi, 'Project')
    .replace(/team\s+\d+/gi, '')
    .trim();
}

/**
 * Generate the content for projects-data.js file
 * @param {Array} projects - Array of project objects
 * @returns {string} File content
 */
function generateProjectsDataFile(projects) {
  const timestamp = new Date().toISOString();
  const projectsJson = JSON.stringify(projects, null, 2);
  
  return `// Projects data - Auto-generated by sync-portfolio.js
// Last updated: ${timestamp}
// Total projects: ${projects.length}

const projects = ${projectsJson};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { projects };
}
`;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncPortfolio().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { syncPortfolio };
