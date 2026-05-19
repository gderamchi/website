import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import {
  OPENAI_IMAGES_URL,
  createOpenAIResponse,
  extractResponseText,
  getOpenAIImageModel,
  getOpenAITextModel,
} from './openai-api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const data = await createOpenAIResponse({
      apiKey,
      model: getOpenAITextModel(),
      instructions: 'You are a technical writer. Respond ONLY with valid JSON, no markdown, no code blocks, no additional text.',
      input: prompt,
      temperature: 0.5,
      maxOutputTokens: 256,
      textFormat: { type: 'json_object' },
    });

    let content = extractResponseText(data);

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
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: getOpenAIImageModel(),
        prompt,
        n: 1,
        size: '1024x1024',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Image API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    const imageContent = data.data?.[0]?.b64_json;

    if (!imageContent) {
      throw new Error('No image data in response');
    }

    // Save to images/projects directory
    const projectsDir = path.join(__dirname, '..', 'images', 'projects');
    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir, { recursive: true });
    }

    const imagePath = path.join(projectsDir, `${project.name}.webp`);
    const buffer = Buffer.from(imageContent, 'base64');
    await sharp(buffer).webp({ quality: 86 }).toFile(imagePath);

    console.log(`  ✓ Generated image: ${project.name}.webp`);
    return `images/projects/${project.name}.webp`;

  } catch (error) {
    console.error(`  ✗ Failed to generate image for ${project.name}:`, error.message);
    return 'images/projects/default.webp';
  }
}
