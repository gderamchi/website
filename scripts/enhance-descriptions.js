import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const OPENAI_IMAGES_URL = 'https://api.openai.com/v1/images/generations';
const DEFAULT_TEXT_MODEL = process.env.OPENAI_MODEL || 'gpt-5.4-mini';
const DEFAULT_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';
const DEFAULT_IMAGE_SIZE = process.env.OPENAI_IMAGE_SIZE || '1024x1024';

/**
 * Enhance project title and description using OpenAI
 * @param {Object} project - Project object with name, description, topics
 * @param {string} apiKey - OpenAI API key
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
    const data = await createTextResponse(apiKey, {
      instructions: 'You are a technical writer. Respond ONLY with valid JSON, no markdown, no code blocks, no additional text.',
      input: prompt,
      temperature: 0.7,
      maxOutputTokens: 256,
    });
    let content = extractOutputText(data);

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
 * Generate project image using OpenAI Images API
 * @param {Object} project - Project object
 * @param {string} apiKey - OpenAI API key
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

  const prompt = `Create a simple, modern, minimalist illustration for: ${project.title || project.name}. ${project.description}. Technologies: ${project.topics?.slice(0, 3).join(', ') || 'software'}.

CRITICAL REQUIREMENTS:
- NO TEXT whatsoever (no letters, no words, no labels, no titles)
- NO numbers or characters
- ONLY visual elements: icons, shapes, gradients, symbols
- Pure illustration without any typography

Style: Clean geometric professional design, modern tech aesthetic, purple and cyan gradient background, simple icons or abstract shapes representing the technology/concept, minimalist composition, high contrast, suitable for developer portfolio card thumbnail.`;

  try {
    const response = await fetch(OPENAI_IMAGES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: DEFAULT_IMAGE_MODEL,
        prompt,
        n: 1,
        size: DEFAULT_IMAGE_SIZE
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Image API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // Extract image data from response
    const imageContent = data.data?.[0];

    if (!imageContent) {
      throw new Error('No image data in response');
    }

    // Check if it's a URL or base64 data
    let buffer;
    if (typeof imageContent.url === 'string' && imageContent.url.startsWith('http')) {
      // It's a URL - download it
      const imageResponse = await fetch(imageContent.url);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.status}`);
      }
      buffer = await imageResponse.arrayBuffer();
    } else if (typeof imageContent.b64_json === 'string') {
      // It's base64 data
      buffer = Buffer.from(imageContent.b64_json, 'base64');
    } else {
      throw new Error('Unknown image data format');
    }

    // Save to images/projects directory
    const projectsDir = path.join(__dirname, '..', 'images', 'projects');
    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir, { recursive: true });
    }

    const imagePath = path.join(projectsDir, `${project.name}.webp`);
    const webpBuffer = await sharp(Buffer.from(buffer)).webp({ quality: 88 }).toBuffer();
    fs.writeFileSync(imagePath, webpBuffer);

    console.log(`  ✓ Generated image: ${project.name}.webp`);
    return `images/projects/${project.name}.webp`;

  } catch (error) {
    console.error(`  ✗ Failed to generate image for ${project.name}:`, error.message);
    return 'images/projects/default.webp';
  }
}

async function createTextResponse(apiKey, { instructions, input, temperature, maxOutputTokens }) {
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: DEFAULT_TEXT_MODEL,
      instructions,
      input,
      temperature,
      max_output_tokens: maxOutputTokens
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

function extractOutputText(data) {
  if (typeof data.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === 'string') {
        chunks.push(content.text);
      }
    }
  }

  return chunks.join('\n').trim();
}
