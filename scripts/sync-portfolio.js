import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { fetchGitHubRepos, getRepoDetails, getProjectYear, generateTopics } from './fetch-repos.js';
// import { generateProjectImage } from './generate-project-image.js'; // Disabled: requires puppeteer
import { enhanceProjectDescription, generateProjectImageAI } from './enhance-descriptions.js';
import { isProjectRelevant, areProjectsDuplicate } from './ai-project-filter.js';

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
  
  // AI features: Using premium models (GPT-4 + DALL-E 3) for best quality
  const useAI = true; // Enabled: Using paid models for optimal results
  
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
    
    // Step 2: Process each repository with AI filtering
    const projects = [];
    let processedCount = 0;
    let filteredCount = 0;
    
    for (const repo of repos) {
      processedCount++;
      console.log(`[${processedCount}/${repos.length}] Processing: ${repo.name}`);
      
      try {
        // AI-powered relevance check (if API key available)
        if (blackboxApiKey && useAI) {
          const relevanceCheck = await isProjectRelevant({
            name: repo.name,
            description: repo.description,
            topics: repo.topics,
            language: repo.language,
            stars: repo.stargazers_count
          }, blackboxApiKey);
          
          if (!relevanceCheck.isRelevant) {
            console.log(`  🚫 Filtered out: ${relevanceCheck.reason}`);
            console.log('');
            filteredCount++;
            continue; // Skip this project
          } else {
            console.log(`  ✓ Relevant: ${relevanceCheck.reason}`);
          }
        } else {
          // Fallback: Rule-based filtering when AI is disabled
          const repoName = repo.name.toLowerCase();
          const description = (repo.description || '').toLowerCase();
          
          // Filter 1: Profile README (matches username)
          if (repoName === username.toLowerCase()) {
            console.log(`  🚫 Filtered out: Profile README`);
            console.log('');
            filteredCount++;
            continue;
          }
          
          // Filter 2: Config/dotfiles repos
          if (repoName.includes('config') || repoName.includes('dotfiles') || 
              description.includes('my personal') || description.includes('configuration')) {
            console.log(`  🚫 Filtered out: Configuration/personal repo`);
            console.log('');
            filteredCount++;
            continue;
          }
          
          // Filter 3: Only filter if COMPLETELY empty (no description, no topics, no stars)
          if (!repo.description && (!repo.topics || repo.topics.length === 0) && 
              (!repo.stargazers_count || repo.stargazers_count === 0)) {
            console.log(`  🚫 Filtered out: No description, topics, or activity`);
            console.log('');
            filteredCount++;
            continue;
          }
          
          console.log(`  ✓ Relevant: Appears to be a project`);
        }
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
            console.error(`  ⚠️  AI image generation failed, using default`);
            imagePath = 'src/assets/images/projects/default.webp';
          }
        } else {
          // Use default image when AI is not available
          imagePath = 'src/assets/images/projects/default.webp';
          console.log(`  ℹ️  Using default image`);
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
    
    // Step 3: AI-powered duplicate detection
    console.log('\n🔍 Checking for duplicate projects with AI...');
    const uniqueProjects = [];
    const processedProjects = [];
    
    for (const project of projects) {
      let isDuplicate = false;
      let duplicateOf = null;
      
      // Check against all previously processed projects
      for (const existing of processedProjects) {
        if (blackboxApiKey && useAI) {
          // Use AI to detect duplicates
          const duplicateCheck = await areProjectsDuplicate(project, existing, blackboxApiKey);
          
          if (duplicateCheck.isDuplicate) {
            isDuplicate = true;
            duplicateOf = existing;
            console.log(`  ⚠️  AI detected duplicate: "${project.title}"`);
            console.log(`     Same as: "${existing.title}"`);
            console.log(`     Confidence: ${(duplicateCheck.confidence * 100).toFixed(0)}%`);
            console.log(`     Reason: ${duplicateCheck.reason}`);
            break;
          }
        } else {
          // Fallback to simple title matching
          const normalizedTitle1 = project.title.toLowerCase().trim();
          const normalizedTitle2 = existing.title.toLowerCase().trim();
          const similarity = calculateTitleSimilarity(normalizedTitle1, normalizedTitle2);
          
          if (similarity > 0.85) {
            isDuplicate = true;
            duplicateOf = existing;
            console.log(`  ⚠️  Duplicate detected: "${project.title}"`);
            console.log(`     Similar to: "${existing.title}"`);
            break;
          }
        }
      }
      
      if (isDuplicate && duplicateOf) {
        const projectUpdated = new Date(project.updated);
        const existingUpdated = new Date(duplicateOf.updated);
        
        console.log(`     Keeping: ${duplicateOf.name} (${duplicateOf.stars} stars, updated: ${existingUpdated.toLocaleDateString()})`);
        console.log(`     Removing: ${project.name} (${project.stars} stars, updated: ${projectUpdated.toLocaleDateString()})`);
        
        // Decide which to keep based on priority:
        // 1. Most recently updated (more active project)
        // 2. More stars (more popular)
        // 3. Owned repo (if tied)
        
        let shouldReplace = false;
        let reason = '';
        
        if (projectUpdated > existingUpdated) {
          shouldReplace = true;
          reason = 'more recently updated';
        } else if (projectUpdated.getTime() === existingUpdated.getTime() && project.stars > duplicateOf.stars) {
          shouldReplace = true;
          reason = 'higher-starred';
        } else if (projectUpdated.getTime() === existingUpdated.getTime() && project.stars === duplicateOf.stars) {
          const projectIsOwned = project.html_url.includes(`github.com/${username}/`);
          const existingIsOwned = duplicateOf.html_url.includes(`github.com/${username}/`);
          
          if (projectIsOwned && !existingIsOwned) {
            shouldReplace = true;
            reason = 'owned version';
          }
        }
        
        if (shouldReplace) {
          const index = uniqueProjects.findIndex(p => p.name === duplicateOf.name);
          if (index !== -1) {
            uniqueProjects[index] = project;
            processedProjects[processedProjects.findIndex(p => p.name === duplicateOf.name)] = project;
            console.log(`     → Replaced with ${reason}`);
          }
        }
      } else {
        processedProjects.push(project);
        uniqueProjects.push(project);
      }
      
      // Small delay to avoid rate limiting
      if (blackboxApiKey && useAI) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    const duplicatesRemoved = projects.length - uniqueProjects.length;
    console.log(`\n✓ Filtering complete:`);
    if (filteredCount > 0) {
      console.log(`  • Filtered out ${filteredCount} irrelevant project${filteredCount > 1 ? 's' : ''}`);
    }
    if (duplicatesRemoved > 0) {
      console.log(`  • Removed ${duplicatesRemoved} duplicate project${duplicatesRemoved > 1 ? 's' : ''}`);
    }
    if (filteredCount === 0 && duplicatesRemoved === 0) {
      console.log(`  • No projects filtered or removed`);
    }
    console.log('');
    
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
    if (filteredCount > 0) {
      console.log(`  • Irrelevant projects filtered: ${filteredCount}`);
    }
    if (duplicatesRemoved > 0) {
      console.log(`  • Duplicate projects removed: ${duplicatesRemoved}`);
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
 * Calculate similarity between two titles using Jaccard similarity
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
