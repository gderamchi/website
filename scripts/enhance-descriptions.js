import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Enhance project title and description using Blackbox AI
 * @param {Object} project - Project object with name, description, topics
 * @param {string} apiKey - Blackbox API key
 * @returns {Promise<Object>} Enhanced project with title and description
 */
export async function enhanceProjectDescription(project, apiKey) {
  const prompt = `You are a technical writer creating portfolio content. Given this project information:

Project Name: ${project.name}
Original Description: ${project.description || 'No description'}
Technologies: ${project.topics?.join(', ') || 'None'}
Language: ${project.language || 'Unknown'}

Create:
1. A CLEAR, CONCISE title (max 50 characters):
   - Remove technical jargon like "2023-2024-project-3-virtual-processor-team-2"
   - Make it human-readable and professional
   - Focus on WHAT the project does, not the repo name
   - Examples: "Virtual Processor Simulator" instead of "2023-2024-project-3-virtual-processor-team-2"
   - Examples: "AI Code Review Bot" instead of "hackathonblackbox42"

2. A brief, clear description (1-2 sentences, max 120 characters):
   - Explain WHAT it does and WHY it matters
   - Be specific and actionable
   - Avoid generic phrases like "A software project"

Format your response ONLY as valid JSON with no additional text:
{
  "title": "Clear Project Title",
  "description": "Brief explanation of what this project does."
}`;

  try {
    // Use correct Blackbox API endpoint with required model parameter
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
            content: 'You are a technical writer. Respond ONLY with valid JSON, no markdown, no code blocks, no additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 256,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || data.response || '';
    
    // Clean up response - remove markdown code blocks if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse JSON response
    const enhanced = JSON.parse(content);
    
    return {
      title: enhanced.title || formatTitle(project.name),
      description: enhanced.description || project.description || `A ${project.language || 'software'} project`
    };
  } catch (error) {
    console.error(`  ⚠️  Failed to enhance description for ${project.name}:`, error.message);
    
    // Fallback: Create basic enhanced version
    return {
      title: formatTitle(project.name),
      description: project.description || `A ${project.language || 'software'} project focusing on ${project.topics?.slice(0, 2).join(' and ') || 'development'}`
    };
  }
}

/**
 * Format project name into a readable title
 * @param {string} name - Project name
 * @returns {string} Formatted title
 */
function formatTitle(name) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
    .replace(/\d{4}-\d{4}-project-\d+-/gi, '')
    .replace(/-team-\d+/gi, '')
    .trim();
}

/**
 * Generate project image using Blackbox AI FLUX model
 * @param {Object} project - Project object
 * @param {string} apiKey - Blackbox API key
 * @returns {Promise<string>} Path to generated image
 */
export async function generateProjectImageAI(project, apiKey) {
  // Check if image already exists to save API credits
  const projectsDir = path.join(__dirname, '..', 'images', 'projects');
  const imagePath = path.join(projectsDir, `${project.name}.webp`);
  
  if (fs.existsSync(imagePath)) {
    console.log(`  ↻ Using existing image: ${project.name}.webp`);
    return `images/projects/${project.name}.webp`;
  }

  const prompt = `Create a simple, modern, minimalist illustration for: ${project.title || project.name}. ${project.description}. Technologies: ${project.topics?.slice(0, 3).join(', ') || 'software'}. Style: Clean geometric professional design, modern tech aesthetic, purple and cyan gradient background, simple icons or abstract shapes, minimalist composition, no text, high contrast, suitable for developer portfolio.`;

  try {
    // Use Blackbox AI with OpenJourney model for image generation
    const response = await fetch('https://api.blackbox.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'blackboxai/black-forest-labs/flux-pro',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Image API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    // Extract image data from response
    const imageContent = data.choices?.[0]?.message?.content;
    
    if (!imageContent) {
      throw new Error('No image data in response');
    }
    
    // Check if it's a URL or base64 data
    let buffer;
    if (typeof imageContent === 'string' && imageContent.startsWith('http')) {
      // It's a URL - download it
      const imageResponse = await fetch(imageContent);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.status}`);
      }
      buffer = await imageResponse.arrayBuffer();
    } else if (typeof imageContent === 'string' && imageContent.includes('base64')) {
      // It's base64 data
      const base64Data = imageContent.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(base64Data, 'base64');
    } else {
      throw new Error('Unknown image data format');
    }
    
    // Save to images/projects directory
    const projectsDir = path.join(__dirname, '..', 'images', 'projects');
    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir, { recursive: true });
    }
    
    const imagePath = path.join(projectsDir, `${project.name}.webp`);
    fs.writeFileSync(imagePath, Buffer.from(buffer));
    
    console.log(`  ✓ Generated image: ${project.name}.webp`);
    return `images/projects/${project.name}.webp`;
    
  } catch (error) {
    console.error(`  ✗ Failed to generate image for ${project.name}:`, error.message);
    return 'images/projects/default.webp';
  }
}
