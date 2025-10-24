import fetch from 'node-fetch';

/**
 * Fetch all repositories from a GitHub user (owned + contributed)
 * @param {string} username - GitHub username
 * @param {string} token - GitHub personal access token (optional but recommended)
 * @returns {Promise<Array>} Array of repository objects
 */
export async function fetchGitHubRepos(username, token = null, organizations = []) {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-Sync'
  };
  
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  
  try {
    console.log('Fetching owned repositories...');
    // Fetch owned repositories
    const ownedResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      { headers }
    );
    
    if (!ownedResponse.ok) {
      throw new Error(`GitHub API error: ${ownedResponse.status} ${ownedResponse.statusText}`);
    }
    
    const ownedRepos = await ownedResponse.json();
    console.log(`Found ${ownedRepos.length} owned repositories`);
    
    // Fetch repositories from specified organizations
    let orgRepos = [];
    if (organizations.length > 0) {
      console.log(`Fetching repositories from ${organizations.length} organizations...`);
      
      for (const org of organizations) {
        try {
          const orgResponse = await fetch(
            `https://api.github.com/orgs/${org}/repos?per_page=100`,
            { headers }
          );
          
          if (orgResponse.ok) {
            const repos = await orgResponse.json();
            console.log(`Found ${repos.length} repositories in ${org}`);
            
            // Check which repos the user has contributed to
            for (const repo of repos) {
              try {
                // Check if user has commits in this repo
                const contributorsResponse = await fetch(
                  `https://api.github.com/repos/${repo.full_name}/contributors?per_page=100`,
                  { headers }
                );
                
                if (contributorsResponse.ok) {
                  const contributors = await contributorsResponse.json();
                  const userContributed = contributors.some(c => c.login === username);
                  
                  if (userContributed) {
                    orgRepos.push({
                      ...repo,
                      contributed: true,
                      organization: org
                    });
                  }
                }
              } catch (error) {
                console.warn(`Failed to check contributions for ${repo.full_name}:`, error.message);
              }
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch repos from ${org}:`, error.message);
        }
      }
      
      console.log(`Found ${orgRepos.length} organization repositories with contributions`);
    }
    
    // Fetch repositories user has contributed to (via commit search)
    console.log('Fetching other contributed repositories...');
    let contributedRepos = [];
    
    // Search for repositories where user has commits (fetch multiple pages)
    const repoUrls = new Set();
    let page = 1;
    const maxPages = 3; // Fetch up to 300 commits (3 pages * 100)
    let searchSuccessful = false;
    
    while (page <= maxPages) {
      const searchResponse = await fetch(
        `https://api.github.com/search/commits?q=author:${username}&sort=author-date&order=desc&per_page=100&page=${page}`,
        { 
          headers: {
            ...headers,
            'Accept': 'application/vnd.github.cloak-preview+json' // Required for commit search
          }
        }
      );
      
      if (searchResponse.ok) {
        searchSuccessful = true;
        const searchData = await searchResponse.json();
        
        if (page === 1) {
          console.log(`Found ${searchData.total_count} commits by user`);
        }
        
        // Extract unique repositories from commits
        searchData.items.forEach(item => {
          if (item.repository && item.repository.full_name) {
            repoUrls.add(item.repository.full_name);
          }
        });
        
        // Stop if we got fewer than 100 results (last page)
        if (searchData.items.length < 100) {
          break;
        }
        
        page++;
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.warn(`Could not fetch commits page ${page}`);
        break;
      }
    }
    
    console.log(`Found ${repoUrls.size} unique contributed repositories`);
    
    if (searchSuccessful && repoUrls.size > 0) {
      // Fetch details for each contributed repo
      for (const repoFullName of repoUrls) {
        try {
          const repoResponse = await fetch(
            `https://api.github.com/repos/${repoFullName}`,
            { headers }
          );
          
          if (repoResponse.ok) {
            const repo = await repoResponse.json();
            // Only add if not already in owned or org repos
            if (!ownedRepos.find(r => r.id === repo.id) && 
                !orgRepos.find(r => r.id === repo.id)) {
              contributedRepos.push({
                ...repo,
                contributed: true
              });
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch details for ${repoFullName}:`, error.message);
        }
      }
    } else {
      console.warn('Could not fetch contributed repositories (may need authentication)');
    }
    
    console.log(`Found ${contributedRepos.length} other contributed repositories`);
    
    // Combine all repos
    const allRepos = [...ownedRepos, ...orgRepos, ...contributedRepos];
    console.log(`Total repositories found: ${allRepos.length}`);
    
    // Filter repos with 'portfolio' topic or that have descriptions
    const filtered = allRepos.filter(repo => {
      // Always include repos with 'portfolio' topic
      if (repo.topics && repo.topics.includes('portfolio')) {
        return true;
      }
      
      // Include organization repos with contributions
      if (repo.organization) {
        return true;
      }
      
      // Include repos with descriptions (exclude forks unless contributed)
      if (repo.description) {
        return !repo.fork || repo.contributed;
      }
      
      // Include contributed repos even without description
      if (repo.contributed) {
        return true;
      }
      
      // Include owned repos even without description (they likely have README)
      if (!repo.fork && repo.owner?.login === username) {
        return true;
      }
      
      return false;
    });
    
    console.log(`Filtered to ${filtered.length} portfolio-relevant repositories`);
    
    // Remove duplicates, prioritizing owned repos
    const deduplicated = removeDuplicateProjects(filtered);
    console.log(`After deduplication: ${deduplicated.length} unique projects (removed ${filtered.length - deduplicated.length} duplicates)`);
    
    return deduplicated;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
}

/**
 * Get detailed information about a repository including README
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} token - GitHub personal access token
 * @returns {Promise<Object>} Repository details with README
 */
export async function getRepoDetails(owner, repo, token = null) {
  const headers = {
    'Accept': 'application/vnd.github.v3.raw',
    'User-Agent': 'Portfolio-Sync'
  };
  
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  
  try {
    // Fetch README
    const readmeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { headers }
    );
    
    let readme = '';
    if (readmeResponse.ok) {
      readme = await readmeResponse.text();
    }
    
    // Extract description from README
    const description = extractDescription(readme);
    
    // Fetch languages
    const languagesResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      { headers: { ...headers, 'Accept': 'application/vnd.github.v3+json' } }
    );
    
    let languages = {};
    if (languagesResponse.ok) {
      languages = await languagesResponse.json();
    }
    
    return {
      readme,
      description,
      languages: Object.keys(languages)
    };
  } catch (error) {
    console.error(`Error fetching details for ${owner}/${repo}:`, error);
    return {
      readme: '',
      description: '',
      languages: []
    };
  }
}

/**
 * Extract a meaningful description from README content
 * @param {string} readme - README content
 * @returns {string} Extracted description
 */
function extractDescription(readme) {
  if (!readme) return '';
  
  const lines = readme.split('\n');
  let description = '';
  
  // Skip title lines (starting with #)
  // Find first substantial paragraph
  for (let line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines, titles, and badges
    if (!trimmed || 
        trimmed.startsWith('#') || 
        trimmed.startsWith('[![') ||
        trimmed.startsWith('![') ||
        trimmed.startsWith('---')) {
      continue;
    }
    
    // Found a description
    if (trimmed.length > 20) {
      description = trimmed;
      break;
    }
  }
  
  // Clean up markdown formatting
  description = description
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links
    .replace(/[*_`]/g, '') // Remove formatting
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // Limit length
  if (description.length > 200) {
    description = description.substring(0, 197) + '...';
  }
  
  return description;
}

/**
 * Determine project year from repository data
 * @param {Object} repo - Repository object
 * @returns {string} Year as string
 */
export function getProjectYear(repo) {
  // Use pushed_at for most recent activity, or created_at as fallback
  const date = new Date(repo.pushed_at || repo.created_at);
  return date.getFullYear().toString();
}

/**
 * Generate topics/tags for a project
 * @param {Object} repo - Repository object
 * @param {Array} languages - Programming languages used
 * @returns {Array} Array of topic strings
 */
export function generateTopics(repo, languages = []) {
  const topics = new Set();
  
  // Add repository topics
  if (repo.topics && repo.topics.length > 0) {
    repo.topics.forEach(topic => topics.add(topic));
  }
  
  // Add primary language
  if (repo.language) {
    topics.add(repo.language);
  }
  
  // Add other languages
  languages.slice(0, 3).forEach(lang => topics.add(lang));
  
  // Add common keywords from description
  const description = (repo.description || '').toLowerCase();
  const keywords = ['ai', 'web', 'mobile', 'api', 'app', 'game', 'tool', 'library', 'framework'];
  keywords.forEach(keyword => {
    if (description.includes(keyword)) {
      topics.add(keyword);
    }
  });
  
  return Array.from(topics).slice(0, 8); // Limit to 8 topics
}

/**
 * Remove duplicate projects, prioritizing owned repos over contributed ones
 * Uses similarity detection to find duplicates based on name, description, and topics
 * @param {Array} repos - Array of repository objects
 * @returns {Array} Deduplicated array of repositories
 */
export function removeDuplicateProjects(repos) {
  const seen = new Map();
  const result = [];
  
  // Sort repos: owned first, then by stars, then by update date
  const sorted = repos.sort((a, b) => {
    // Prioritize owned repos
    const aOwned = a.owner?.login === a.contributed ? 0 : 1;
    const bOwned = b.owner?.login === b.contributed ? 0 : 1;
    if (aOwned !== bOwned) return bOwned - aOwned;
    
    // Then by stars
    if (a.stargazers_count !== b.stargazers_count) {
      return b.stargazers_count - a.stargazers_count;
    }
    
    // Then by update date
    return new Date(b.updated_at) - new Date(a.updated_at);
  });
  
  for (const repo of sorted) {
    // Create a normalized key for similarity detection
    const normalizedName = repo.name.toLowerCase()
      .replace(/[-_]/g, '')
      .replace(/\d+/g, '') // Remove numbers
      .replace(/team\d+/g, '') // Remove team numbers
      .replace(/project\d+/g, ''); // Remove project numbers
    
    const normalizedDesc = (repo.description || '').toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .slice(0, 10) // First 10 words
      .join(' ');
    
    // Check for similar projects
    let isDuplicate = false;
    for (const [key, existingRepo] of seen.entries()) {
      const [existingName, existingDesc] = key.split('|||');
      
      // Check name similarity
      const nameSimilarity = calculateSimilarity(normalizedName, existingName);
      const descSimilarity = calculateSimilarity(normalizedDesc, existingDesc);
      
      // If names are very similar (>70%) or descriptions are very similar (>80%), it's a duplicate
      if (nameSimilarity > 0.7 || descSimilarity > 0.8) {
        isDuplicate = true;
        console.log(`  ⚠️  Skipping duplicate: ${repo.name} (similar to ${existingRepo.name})`);
        break;
      }
    }
    
    if (!isDuplicate) {
      const key = `${normalizedName}|||${normalizedDesc}`;
      seen.set(key, repo);
      result.push(repo);
    }
  }
  
  return result;
}

/**
 * Calculate similarity between two strings (0-1)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score (0-1)
 */
function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;
  
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  // Check if shorter is contained in longer
  if (longer.includes(shorter)) {
    return shorter.length / longer.length;
  }
  
  // Calculate Levenshtein distance
  const editDistance = levenshteinDistance(str1, str2);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}
