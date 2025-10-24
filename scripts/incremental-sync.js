import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getRepoDetails, getProjectYear, generateTopics } from './fetch-repos.js';
import { enhanceProjectDescription, generateProjectImageAI } from './enhance-descriptions.js';
import { isProjectRelevant } from './ai-project-filter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Incremental sync - Only process the specific repository that was pushed
 * This is much more efficient than re-analyzing all repositories
 * 
 * @param {string} repoFullName - Full repository name (e.g., "username/repo-name")
 * @param {string} repoOwner - Repository owner username
 * @param {string} repoName - Repository name
 */
async function incrementalSync(repoFullName, repoOwner, repoName) {
  console.log('🚀 Starting incremental portfolio sync...\n');
  console.log(`📦 Processing repository: ${repoFullName}\n`);
  
  const token = process.env.GITHUB_TOKEN;
  const blackboxApiKey = process.env.BLACKBOX_API;
  const username = process.env.GITHUB_USERNAME || repoOwner;
  
  if (!token) {
    console.warn('⚠️  No GITHUB_TOKEN found. API rate limits will be lower.\n');
  }
  
  if (!blackboxApiKey) {
    console.warn('⚠️  No BLACKBOX_API found. AI enhancements will be skipped.\n');
  }
  
  try {
    // Step 1: Load existing projects data
    console.log('📂 Loading existing projects data...');
    const projectsDataPath = path.join(__dirname, '../projects-data.js');
    let existingProjects = [];
    let existingProject = null;
    
    if (fs.existsSync(projectsDataPath)) {
      const existingData = fs.readFileSync(projectsDataPath, 'utf8');
      const projectsMatch = existingData.match(/const projects = (\[[\s\S]*?\]);/);
      
      if (projectsMatch) {
        existingProjects = JSON.parse(projectsMatch[1]);
        existingProject = existingProjects.find(p => p.name === repoName);
        
        if (existingProject) {
          console.log(`  ✓ Found existing project: "${existingProject.title || repoName}"`);
        } else {
          console.log(`  ℹ️  New project - not found in existing data`);
        }
      }
    }
    console.log('');
    
    // Step 2: Fetch repository details
    console.log(`🔍 Fetching repository details...`);
    const details = await getRepoDetails(repoOwner, repoName, token);
    
    // Basic repo info from API
    const repoInfo = {
      name: repoName,
      description: details.description || '',
      topics: details.topics || [],
      language: details.language || 'Unknown',
      stargazers_count: details.stars || 0,
      html_url: `https://github.com/${repoFullName}`,
      homepage: details.homepage || null,
      updated_at: details.updated_at || new Date().toISOString(),
      owner: { login: repoOwner }
    };
    
    console.log(`  ✓ Repository: ${repoName}`);
    console.log(`  ✓ Language: ${repoInfo.language}`);
    console.log(`  ✓ Stars: ${repoInfo.stargazers_count}`);
    console.log(`  ✓ Topics: ${repoInfo.topics.join(', ') || 'none'}`);
    console.log('');
    
    // Step 3: Check if repo only contains README (no actual code)
    if (details.isReadmeOnly) {
      console.log(`🚫 Repository is README-only (no code files)`);
      
      // If it exists in portfolio, remove it
      if (existingProject) {
        console.log(`  → Removing from portfolio...`);
        const updatedProjects = existingProjects.filter(p => p.name !== repoName);
        updateProjectsDataFile(updatedProjects);
        console.log(`  ✓ Removed successfully\n`);
      } else {
        console.log(`  ℹ️  Not in portfolio, nothing to do\n`);
      }
      
      return;
    }
    
    // Step 4: If project exists, just update the date to bring it to top
    if (existingProject) {
      console.log(`♻️  Project already exists in portfolio`);
      console.log(`  → Updating timestamp to bring to top...`);
      
      // Update the project's updated_at timestamp
      existingProject.updated = repoInfo.updated_at;
      existingProject.date = getProjectYear(repoInfo);
      
      // Update stars count
      existingProject.stars = repoInfo.stargazers_count;
      
      // Re-sort projects by date (newest first)
      existingProjects.sort((a, b) => {
        const dateA = parseInt(a.date);
        const dateB = parseInt(b.date);
        if (dateB !== dateA) return dateB - dateA;
        return new Date(b.updated) - new Date(a.updated);
      });
      
      updateProjectsDataFile(existingProjects);
      console.log(`  ✓ Project moved to top of portfolio\n`);
      
      console.log('✨ Incremental sync complete!\n');
      console.log(`📊 Summary:`);
      console.log(`  • Action: Updated existing project`);
      console.log(`  • Project: "${existingProject.title}"`);
      console.log(`  • New position: Top of portfolio`);
      console.log(`  • Total projects: ${existingProjects.length}\n`);
      
      return;
    }
    
    // Step 5: New project - Check relevance with AI
    console.log(`🆕 New project detected - checking relevance...`);
    
    if (blackboxApiKey) {
      const relevanceCheck = await isProjectRelevant({
        name: repoInfo.name,
        description: repoInfo.description,
        topics: repoInfo.topics,
        language: repoInfo.language,
        stars: repoInfo.stargazers_count
      }, blackboxApiKey);
      
      if (!relevanceCheck.isRelevant) {
        console.log(`  🚫 Not relevant: ${relevanceCheck.reason}`);
        console.log(`  ℹ️  Skipping portfolio addition\n`);
        return;
      }
      
      console.log(`  ✓ Relevant: ${relevanceCheck.reason}`);
    } else {
      // Fallback: Rule-based filtering
      const repoNameLower = repoName.toLowerCase();
      const description = (repoInfo.description || '').toLowerCase();
      
      // Filter profile README
      if (repoNameLower === username.toLowerCase()) {
        console.log(`  🚫 Not relevant: Profile README`);
        return;
      }
      
      // Filter config/dotfiles
      if (repoNameLower.includes('config') || repoNameLower.includes('dotfiles') || 
          description.includes('my personal') || description.includes('configuration')) {
        console.log(`  🚫 Not relevant: Configuration/personal repo`);
        return;
      }
      
      console.log(`  ✓ Relevant: Appears to be a project`);
    }
    console.log('');
    
    // Step 6: Generate project card with AI
    console.log(`🎨 Generating project card...`);
    
    // Use README description if available
    let description = details.description || repoInfo.description || 'A software project';
    let title = formatTitle(repoName);
    
    // Generate topics
    const topics = generateTopics(repoInfo, details.languages);
    
    // AI enhancement for title and description
    if (blackboxApiKey) {
      try {
        console.log(`  🤖 Generating AI title and description...`);
        const projectForEnhancement = {
          name: repoName,
          description: description,
          topics: topics,
          language: repoInfo.language
        };
        
        const enhanced = await enhanceProjectDescription(projectForEnhancement, blackboxApiKey);
        title = enhanced.title;
        description = enhanced.description;
        console.log(`  ✓ AI enhancement complete`);
        console.log(`     Title: "${title}"`);
      } catch (error) {
        console.error(`  ⚠️  AI enhancement failed, using fallback`);
      }
    }
    
    // Generate AI image
    let imagePath = 'src/assets/images/projects/default.webp';
    
    if (blackboxApiKey) {
      try {
        console.log(`  🎨 Generating AI image...`);
        const projectWithTitle = {
          name: repoName,
          title,
          description,
          topics,
          language: repoInfo.language
        };
        
        imagePath = await generateProjectImageAI(projectWithTitle, blackboxApiKey);
        console.log(`  ✓ Image generated: ${imagePath}`);
      } catch (error) {
        console.error(`  ⚠️  AI image generation failed, using default`);
      }
    }
    console.log('');
    
    // Step 7: Create new project object
    const newProject = {
      name: repoName,
      title: title,
      description: description,
      date: getProjectYear(repoInfo),
      image: imagePath,
      topics: topics,
      html_url: repoInfo.html_url,
      homepage: repoInfo.homepage,
      stars: repoInfo.stargazers_count,
      language: repoInfo.language,
      updated: repoInfo.updated_at
    };
    
    // Step 8: Add to portfolio and sort
    console.log(`📝 Adding to portfolio...`);
    existingProjects.unshift(newProject); // Add to beginning
    
    // Sort by date
    existingProjects.sort((a, b) => {
      const dateA = parseInt(a.date);
      const dateB = parseInt(b.date);
      if (dateB !== dateA) return dateB - dateA;
      return new Date(b.updated) - new Date(a.updated);
    });
    
    updateProjectsDataFile(existingProjects);
    console.log(`  ✓ Project added successfully\n`);
    
    // Step 9: Summary
    console.log('✨ Incremental sync complete!\n');
    console.log(`📊 Summary:`);
    console.log(`  • Action: Added new project`);
    console.log(`  • Project: "${title}"`);
    console.log(`  • Language: ${repoInfo.language}`);
    console.log(`  • Topics: ${topics.join(', ')}`);
    console.log(`  • Total projects: ${existingProjects.length}\n`);
    
  } catch (error) {
    console.error('\n❌ Error during incremental sync:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

/**
 * Format a repository name into a readable title
 */
function formatTitle(name) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\d{4}\s*\d{4}/g, '')
    .replace(/project\s+\d+/gi, 'Project')
    .replace(/team\s+\d+/gi, '')
    .trim();
}

/**
 * Update the projects-data.js file
 */
function updateProjectsDataFile(projects) {
  const projectsDataPath = path.join(__dirname, '../projects-data.js');
  
  // Create backup
  if (fs.existsSync(projectsDataPath)) {
    const backupPath = path.join(__dirname, '../projects-data.backup.js');
    fs.copyFileSync(projectsDataPath, backupPath);
  }
  
  const timestamp = new Date().toISOString();
  const projectsJson = JSON.stringify(projects, null, 2);
  
  const fileContent = `// Projects data - Auto-generated by incremental-sync.js
// Last updated: ${timestamp}
// Total projects: ${projects.length}

const projects = ${projectsJson};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { projects };
}
`;
  
  fs.writeFileSync(projectsDataPath, fileContent, 'utf8');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Usage: node incremental-sync.js <repo-full-name>');
    console.error('Example: node incremental-sync.js gderamchi/my-project');
    process.exit(1);
  }
  
  const repoFullName = args[0];
  const [repoOwner, repoName] = repoFullName.split('/');
  
  if (!repoOwner || !repoName) {
    console.error('Invalid repository format. Use: owner/repo-name');
    process.exit(1);
  }
  
  incrementalSync(repoFullName, repoOwner, repoName).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { incrementalSync };
