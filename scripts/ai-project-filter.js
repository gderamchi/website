import fetch from 'node-fetch';

/**
 * Use AI to determine if a project is relevant for a portfolio
 * Filters out non-portfolio items like profile READMEs, config repos, etc.
 * @param {Object} project - Project object with name, description, topics
 * @param {string} apiKey - Blackbox API key
 * @returns {Promise<Object>} { isRelevant: boolean, reason: string }
 */
export async function isProjectRelevant(project, apiKey) {
  const prompt = `You are a portfolio curator. Analyze this GitHub repository and determine if it should be included in a developer's portfolio.

Repository Information:
- Name: ${project.name}
- Description: ${project.description || 'No description'}
- Topics/Tags: ${project.topics?.join(', ') || 'None'}
- Language: ${project.language || 'Unknown'}
- Stars: ${project.stars || 0}

EXCLUDE ONLY these types of repositories:
- Profile README repositories (exactly matching username/username pattern)
- Pure configuration/dotfiles repositories (no actual code)
- Personal notes or documentation only
- Completely empty repositories

INCLUDE ALL of these (even if minimal description):
- ANY software projects with code
- Web applications (even simple ones)
- Mobile apps
- Games
- Tools and utilities
- Libraries and frameworks
- ALL hackathon projects (even if incomplete)
- ALL school/university projects (even if basic)
- Open source contributions
- Practice/learning projects with real code
- Projects with stars or activity

IMPORTANT: When in doubt, INCLUDE the project. Only exclude if it's clearly not a code project.

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "isRelevant": true or false,
  "reason": "Brief explanation (max 50 characters)"
}`;

  try {
    const response = await fetch('https://api.blackbox.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'blackboxai/openai/gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a portfolio curator. Respond ONLY with valid JSON, no markdown, no code blocks.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent filtering
        max_tokens: 100,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || data.response || '';
    
    // Clean up response
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const result = JSON.parse(content);
    
    return {
      isRelevant: result.isRelevant === true,
      reason: result.reason || 'No reason provided'
    };
    
  } catch (error) {
    console.error(`  ⚠️  AI filtering failed for ${project.name}:`, error.message);
    
    // Fallback: Use basic heuristics
    return fallbackRelevanceCheck(project);
  }
}

/**
 * Fallback relevance check using basic heuristics
 * @param {Object} project - Project object
 * @returns {Object} { isRelevant: boolean, reason: string }
 */
function fallbackRelevanceCheck(project) {
  const name = project.name.toLowerCase();
  const description = (project.description || '').toLowerCase();
  
  // Exclude profile READMEs (username/username pattern)
  if (name === project.name && description.includes('profile')) {
    return { isRelevant: false, reason: 'Profile README' };
  }
  
  // Exclude config repositories
  if (name.includes('config') || name.includes('dotfiles') || name.includes('settings')) {
    return { isRelevant: false, reason: 'Configuration repository' };
  }
  
  // Only exclude if BOTH no description AND no topics AND no stars
  if (!project.description && (!project.topics || project.topics.length === 0) && (!project.stars || project.stars === 0)) {
    return { isRelevant: false, reason: 'No description, topics, or activity' };
  }
  
  // Include everything else by default
  return { isRelevant: true, reason: 'Appears to be a project' };
}

/**
 * AI-powered duplicate detection
 * Uses AI to determine if two projects are actually the same
 * @param {Object} project1 - First project
 * @param {Object} project2 - Second project
 * @param {string} apiKey - Blackbox API key
 * @returns {Promise<Object>} { isDuplicate: boolean, confidence: number, reason: string }
 */
export async function areProjectsDuplicate(project1, project2, apiKey) {
  const prompt = `You are analyzing two GitHub repositories to determine if they are duplicates (same project, different repos).

Project 1:
- Name: ${project1.name}
- Title: ${project1.title}
- Description: ${project1.description}
- Topics: ${project1.topics?.join(', ') || 'None'}

Project 2:
- Name: ${project2.name}
- Title: ${project2.title}
- Description: ${project2.description}
- Topics: ${project2.topics?.join(', ') || 'None'}

Determine if these are the SAME project (duplicates). 

IMPORTANT CRITERIA:
- Nearly identical titles (e.g., "AI-Based Code Review Bot" vs "AI-Powered Code Review Tool")
- Same core functionality described
- Same main technologies/topics
- Very similar descriptions
- One is clearly a fork/copy of the other

Examples of DUPLICATES:
- "AI Code Review Bot" and "AI-Powered Code Review Tool" → DUPLICATE (same functionality)
- "Hackathon Project X" and "Hackathon X" → DUPLICATE (same event)

Examples of NOT duplicates:
- "Virtual Processor" and "FPGA Game" → NOT duplicate (different projects)
- "Flutter App" and "Web Portfolio" → NOT duplicate (different technologies)

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "isDuplicate": true or false,
  "confidence": 0.0 to 1.0,
  "reason": "Brief explanation (max 50 characters)"
}`;

  try {
    const response = await fetch('https://api.blackbox.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'blackboxai/openai/gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a duplicate detector. Respond ONLY with valid JSON, no markdown, no code blocks.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2, // Very low temperature for consistent duplicate detection
        max_tokens: 100,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || data.response || '';
    
    // Clean up response
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const result = JSON.parse(content);
    
    return {
      isDuplicate: result.isDuplicate === true && result.confidence > 0.8,
      confidence: result.confidence || 0,
      reason: result.reason || 'No reason provided'
    };
    
  } catch (error) {
    // Fallback to simple title comparison
    const similarity = calculateSimpleSimilarity(project1.title, project2.title);
    return {
      isDuplicate: similarity > 0.85,
      confidence: similarity,
      reason: 'Fallback: title similarity'
    };
  }
}

/**
 * Simple similarity calculation for fallback
 */
function calculateSimpleSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;
  
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}
