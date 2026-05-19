import fetch from 'node-fetch';

export const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
export const OPENAI_IMAGES_URL = 'https://api.openai.com/v1/images/generations';
export const DEFAULT_TEXT_MODEL = 'gpt-5.4-mini';
export const DEFAULT_IMAGE_MODEL = 'gpt-image-1.5';

export function getOpenAITextModel() {
  return process.env.OPENAI_SYNC_MODEL || DEFAULT_TEXT_MODEL;
}

export function getOpenAIImageModel() {
  return process.env.OPENAI_IMAGE_MODEL || DEFAULT_IMAGE_MODEL;
}

export function extractResponseText(data) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const textParts = [];

  for (const item of data?.output || []) {
    if (item?.type !== 'message') continue;

    for (const content of item.content || []) {
      if (content?.type === 'output_text' && typeof content.text === 'string') {
        textParts.push(content.text);
      } else if (content?.type === 'text' && typeof content.text === 'string') {
        textParts.push(content.text);
      } else if (content?.type === 'refusal' && typeof content.refusal === 'string') {
        textParts.push(content.refusal);
      }
    }
  }

  return textParts.join('\n').trim();
}

export async function createOpenAIResponse({
  apiKey,
  model = getOpenAITextModel(),
  instructions,
  input,
  maxOutputTokens = 512,
  temperature = 0.4,
  textFormat = { type: 'text' },
}) {
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const payload = {
    model,
    input,
    max_output_tokens: maxOutputTokens,
    store: false,
    text: {
      format: textFormat,
    },
  };

  if (instructions) {
    payload.instructions = instructions;
  }

  if (typeof temperature === 'number') {
    payload.temperature = temperature;
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI Responses API error ${response.status}: ${details}`);
  }

  return response.json();
}
