#!/usr/bin/env node

/**
 * AI-Powered Portfolio Project Sync
 * 
 * This script:
 * 1. Fetches all repositories you own or contribute to
 * 2. Uses AI to analyze each repo for relevance
 * 3. Generates project descriptions and metadata
 * 4. Creates project images using AI
 * 5. Automatically updates projects-data.js
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');

// Configuration
const CONFIG = {
  GITHUB_USERNAME: process.env.GITHUB_USERNAME || 'gderamchi',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  PROJECTS_FILE: path.join(__dirname, '../projects-data.js'),
  IMAGES_DIR: path.join(__dirname, '../src/assets/images/projects'),
  MIN_STARS: 0,
  EXCLUDE_FORKS: false,
  RELEVANCE_THRESHOLD: 0.6, // AI relevance score threshold (0-1)
};

// AI Analysis Prompt
const RELEVANCE_PROMPT = `You are an AI assistant helping to curate a software engineering portfolio. 
Analyze the following GitHub repository and determine if it should be included in a professional portfolio.

Repository Information:
- Name: {name}
- Description: {description}
- Topics: {topics}
- Language: {language}
- Stars: {stars}
- Last Updated: {updated}
- README Preview: {readme}

Criteria for inclusion:
1. Demonstrates technical skills (coding, architecture, problem-solving)
2. Shows completed or substantial work (not just forks or trivial repos)
3. Relevant to software engineering, AI, web development, or related fields
4. Has meaningful commits and activity
5. Not a personal config/dotfiles repo unless exceptionally well-documented

Respond with a JSON object:
{
  "relevant": true/false,
  "score": 0.0-1.0,
  "reasoning": "brief explanation",
  "suggestedTitle": "improved title for portfolio",
  "suggestedDescription": "compelling 1-2 sentence description highlighting key achievements",
  "category": "ai|web|mobile|game|hackathon|backend|other"
}`;

/**
 * Make HTTPS request
 */
function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

/**
 * Fetch GitHub repositories
 */
async function fetchGitHubRepos() {
  console.log('📡 Fetching GitHub repositories...');
  
  const options = {
    headers: {
      'User-Agent': 'Portfolio-Sync-Bot',
      'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  };
  
  // Fetch owned repos
  const ownedRepos = await httpsRequest(
    `https://api.github.com/users/${CONFIG.GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
    options
  );
  
  // Fetch repos where user has contributed
  const contributedRepos = await httpsRequest(
    `https://api.github.com/search/repositories?q=committer:${CONFIG.GITHUB_USERNAME}&per_page=100&sort=updated`,
    options
  );
  
  const allRepos = [
    ...ownedRepos,
    ...(contributedRepos.items || [])
  ];
  
  // Remove duplicates
  const uniqueRepos = Array.from(
    new Map(allRepos.map(repo => [repo.id, repo])).values()
  );
  
  console.log(`✅ Found ${uniqueRepos.length} repositories`);
  return uniqueRepos;
}

/**
 * Fetch README content
 */
async function fetchReadme(repo) {
  try {
    const options = {
      headers: {
        'User-Agent': 'Portfolio-Sync-Bot',
        'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3.raw'
      }
    };
    
    const readme = await httpsRequest(
      `https://api.github.com/repos/${repo.full_name}/readme`,
      options
    );
    
    // Return first 1000 characters
    return typeof readme === 'string' ? readme.substring(0, 1000) : '';
  } catch (error) {
    return '';
  }
}

/**
 * Analyze repository with AI
 */
async function analyzeRepoWithAI(repo, readme) {
  console.log(`🤖 Analyzing: ${repo.name}...`);
  
  if (!CONFIG.OPENAI_API_KEY) {
    console.log('⚠️  No OpenAI API key found, using basic analysis');
    return basicAnalysis(repo);
  }
  
  const prompt = RELEVANCE_PROMPT
    .replace('{name}', repo.name)
    .replace('{description}', repo.description || 'No description')
    .replace('{topics}', repo.topics?.join(', ') || 'None')
    .replace('{language}', repo.language || 'Unknown')
    .replace('{stars}', repo.stargazers_count)
    .replace('{updated}', repo.updated_at)
    .replace('{readme}', readme || 'No README available');
  
  try {
    const response = await httpsRequest('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
      },
      body: {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a portfolio curation assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      }
    });
    
    const analysis = JSON.parse(response.choices[0].message.content);
    console.log(`   Score: ${analysis.score} | Relevant: ${analysis.relevant}`);
    return analysis;
  } catch (error) {
    console.error(`   ❌ AI analysis failed: ${error.message}`);
    return basicAnalysis(repo);
  }
}

/**
 * Basic analysis fallback (without AI)
 */
function basicAnalysis(repo) {
  const hasDescription = repo.description && repo.description.length > 10;
  const hasTopics = repo.topics && repo.topics.length > 0;
  const hasStars = repo.stargazers_count > 0;
  const notFork = !repo.fork || !CONFIG.EXCLUDE_FORKS;
  const recentlyUpdated = new Date(repo.updated_at) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  
  const score = (
    (hasDescription ? 0.3 : 0) +
    (hasTopics ? 0.2 : 0) +
    (hasStars ? 0.2 : 0) +
    (notFork ? 0.2 : 0) +
    (recentlyUpdated ? 0.1 : 0)
  );
  
  return {
    relevant: score >= CONFIG.RELEVANCE_THRESHOLD,
    score: score,
    reasoning: 'Basic heuristic analysis',
    suggestedTitle: repo.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    suggestedDescription: repo.description || 'A software project',
    category: categorizeRepo(repo)
  };
}

/**
 * Categorize repository
 */
function categorizeRepo(repo) {
  const topics = (repo.topics || []).map(t => t.toLowerCase());
  const name = repo.name.toLowerCase();
  const desc = (repo.description || '').toLowerCase();
  
  if (topics.some(t => t.includes('ai') || t.includes('ml')) || desc.includes('ai')) return 'ai';
  if (topics.some(t => t.includes('web') || t.includes('website')) || desc.includes('web')) return 'web';
  if (topics.some(t => t.includes('mobile') || t.includes('flutter')) || desc.includes('mobile')) return 'mobile';
  if (topics.some(t => t.includes('game')) || name.includes('game')) return 'game';
  if (topics.includes('hackathon') || name.includes('hackathon')) return 'hackathon';
  if (topics.some(t => t.includes('backend') || t.includes('api'))) return 'backend';
  
  return 'other';
}

/**
 * Generate project image using AI
 */
async function generateProjectImage(project) {
  const imagePath = path.join(CONFIG.IMAGES_DIR, `${project.name}.webp`);
  
  // Check if image already exists
  try {
    await fs.access(imagePath);
    console.log(`   ✓ Image already exists: ${project.name}.webp`);
    return `src/assets/images/projects/${project.name}.webp`;
  } catch {
    // Image doesn't exist, use default
    console.log(`   ℹ Using default image for: ${project.name}`);
    return 'src/assets/images/projects/default.webp';
  }
  
  // TODO: Implement AI image generation with DALL-E or similar
  // For now, return default image
}

/**
 * Load existing projects
 */
async function loadExistingProjects() {
  try {
    const content = await fs.readFile(CONFIG.PROJECTS_FILE, 'utf-8');
    const match = content.match(/const projects = (\[[\s\S]*?\]);/);
    if (match) {
      return JSON.parse(match[1]);
    }
  } catch (error) {
    console.log('⚠️  No existing projects file found');
  }
  return [];
}

/**
 * Save projects to file
 */
async function saveProjects(projects) {
  const timestamp = new Date().toISOString();
  const content = `// Projects data - Auto-generated by ai-sync-portfolio.js
// Last updated: ${timestamp}
// Total projects: ${projects.length}

const projects = ${JSON.stringify(projects, null, 2)};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { projects };
}`;
  
  await fs.writeFile(CONFIG.PROJECTS_FILE, content, 'utf-8');
  console.log(`✅ Saved ${projects.length} projects to ${CONFIG.PROJECTS_FILE}`);
}

/**
 * Main sync function
 */
async function main() {
  console.log('🚀 Starting AI-powered portfolio sync...\n');
  
  try {
    // Fetch all repositories
    const repos = await fetchGitHubRepos();
    
    // Load existing projects
    const existingProjects = await loadExistingProjects();
    const existingNames = new Set(existingProjects.map(p => p.name));
    
    // Analyze each repository
    const newProjects = [];
    
    for (const repo of repos) {
      // Skip if already in portfolio
      if (existingNames.has(repo.name)) {
        console.log(`⏭️  Skipping existing: ${repo.name}`);
        continue;
      }
      
      // Fetch README
      const readme = await fetchReadme(repo);
      
      // Analyze with AI
      const analysis = await analyzeRepoWithAI(repo, readme);
      
      // Add if relevant
      if (analysis.relevant && analysis.score >= CONFIG.RELEVANCE_THRESHOLD) {
        const image = await generateProjectImage({ name: repo.name });
        
        const project = {
          name: repo.name,
          title: analysis.suggestedTitle,
          description: analysis.suggestedDescription,
          date: new Date(repo.created_at).getFullYear().toString(),
          image: image,
          topics: [
            ...(repo.topics || []),
            repo.language
          ].filter(Boolean),
          html_url: repo.html_url,
          homepage: repo.homepage,
          stars: repo.stargazers_count,
          language: repo.language || 'Unknown',
          updated: repo.updated_at
        };
        
        newProjects.push(project);
        console.log(`   ✅ Added to portfolio!`);
      } else {
        console.log(`   ⏭️  Not relevant (score: ${analysis.score})`);
      }
    }
    
    // Merge with existing projects and sort by date
    const allProjects = [...existingProjects, ...newProjects]
      .sort((a, b) => {
        const dateA = new Date(a.updated || a.date);
        const dateB = new Date(b.updated || b.date);
        return dateB - dateA;
      });
    
    // Save updated projects
    await saveProjects(allProjects);
    
    console.log(`\n✨ Sync complete!`);
    console.log(`   New projects added: ${newProjects.length}`);
    console.log(`   Total projects: ${allProjects.length}`);
    
  } catch (error) {
    console.error('❌ Error during sync:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
