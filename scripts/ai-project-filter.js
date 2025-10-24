import fetch from 'node-fetch';

/**
 * Use AI to determine if a project is relevant for a portfolio
 * Filters out non-portfolio items like profile READMEs, config repos, etc.
 * @param {Object} project - Project object with name, description, topics
 * @param {string} apiKey - Blackbox API key
 * @returns {Promise<Object>} { isRelevant: boolean, reason: string }
 */
export async function isProjectRelevant(project, apiKey) {
  const prompt = `You are an expert portfolio curator analyzing GitHub repositories for a professional developer portfolio.

Repository Information:
- Name: ${project.name}
- Description: ${project.description || 'No description'}
- Topics/Tags: ${project.topics?.join(', ') || 'None'}
- Language: ${project.language || 'Unknown'}
- Stars: ${project.stars || 0}

STRICT EXCLUSION CRITERIA (ONLY exclude these):
1. Profile README repositories (username/username pattern with just profile info)
2. Pure configuration/dotfiles repositories (ONLY configs, no actual projects)
3. Personal notes, bookmarks, or documentation-only repos
4. Completely empty repositories with no code at all
5. Test/practice repos with trivial code (like "hello world" only)

MUST INCLUDE (even with minimal description):
✓ ANY real software projects with actual code
✓ Web applications (frontend, backend, fullstack)
✓ Mobile applications (iOS, Android, Flutter, React Native)
✓ Games and interactive projects
✓ Tools, utilities, and CLI applications
✓ Libraries, frameworks, and packages
✓ ALL hackathon projects (even incomplete - they show initiative)
✓ ALL school/university projects (demonstrate learning)
✓ Open source contributions (any size)
✓ Practice projects with substantial code
✓ Projects with ANY stars or forks
✓ Projects with active commits
✓ Contributed projects (shows collaboration)

CRITICAL: Be VERY INCLUSIVE. When in doubt, INCLUDE the project. Only exclude if it's clearly NOT a real code project.

Analyze carefully and respond ONLY with valid JSON (no markdown, no code blocks):
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
        temperature: 0.2, // Very low temperature for strict, consistent filtering
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
  const prompt = `You are an expert at detecting duplicate projects in a developer portfolio. Analyze these two GitHub repositories to determine if they represent the SAME project.

Project 1:
- Repository Name: ${project1.name}
- Title: ${project1.title}
- Description: ${project1.description}
- Topics/Tags: ${project1.topics?.join(', ') || 'None'}
- Language: ${project1.language || 'Unknown'}
- URL: ${project1.html_url || 'N/A'}

Project 2:
- Repository Name: ${project2.name}
- Title: ${project2.title}
- Description: ${project2.description}
- Topics/Tags: ${project2.topics?.join(', ') || 'None'}
- Language: ${project2.language || 'Unknown'}
- URL: ${project2.html_url || 'N/A'}

DUPLICATE DETECTION CRITERIA (mark as duplicate if 3+ match):
1. ✓ Nearly identical titles (>80% similar)
   - "AI Code Review Bot" ≈ "AI-Powered Code Review Tool"
   - "Hackathon Blockchain 2024" ≈ "Blockchain Hackathon Vierzon 2024"
2. ✓ Same core functionality/purpose described
3. ✓ Same main technologies (Python+Flask vs Python+Flask)
4. ✓ Very similar descriptions (>70% content overlap)
5. ✓ One is clearly a fork/mirror of the other
6. ✓ Same event/hackathon/school project (check dates, team numbers)
7. ✓ Repository names are variations (project-x-team-1 vs project-x-team-2 for SAME project)

EXAMPLES OF DUPLICATES:
✓ "AI Code Review Bot" + "AI-Powered Code Review Tool" → DUPLICATE (same functionality)
✓ "2023-2024-project-3-virtual-processor-team-2" + "Virtual Processor Simulator" → DUPLICATE (same project, different naming)
✓ "hackathon-blockchain-vierzon-2024" + "Blockchain Hackathon 2024" → DUPLICATE (same event)
✓ "portfolio-website" + "personal-website" → DUPLICATE (same purpose)

EXAMPLES OF NOT DUPLICATES:
✗ "Virtual Processor" + "FPGA Game" → NOT duplicate (completely different projects)
✗ "Flutter Mobile App" + "React Web App" → NOT duplicate (different tech stacks)
✗ "AI Chatbot" + "AI Image Generator" → NOT duplicate (different AI applications)
✗ "Hackathon 2023" + "Hackathon 2024" → NOT duplicate (different years/events)

CRITICAL: Be STRICT about duplicates. Only mark as duplicate if you're >85% confident they're the same project.

Analyze thoroughly and respond ONLY with valid JSON (no markdown, no code blocks):
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
        temperature: 0.1, // Extremely low temperature for strict, consistent duplicate detection
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
      isDuplicate: result.isDuplicate === true && result.confidence > 0.85,
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
