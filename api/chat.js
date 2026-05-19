const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = 'gpt-5.4-mini';
const DEFAULT_MAX_OUTPUT_TOKENS = 500;

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
}

function extractResponseText(data) {
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

function normalizeMessages(messages) {
  const safeMessages = messages
    .filter(message => message && typeof message.content === 'string')
    .map(message => ({
      role: message.role === 'assistant' ? 'assistant' : message.role === 'system' ? 'system' : 'user',
      content: message.content.slice(0, 6000),
    }));

  const instructions = safeMessages
    .filter(message => message.role === 'system')
    .map(message => message.content)
    .join('\n\n');

  const input = safeMessages
    .filter(message => message.role !== 'system')
    .slice(-12)
    .map(message => ({
      role: message.role,
      content: message.content,
    }));

  return {
    instructions,
    input: input.length > 0 ? input : 'Hello',
  };
}

function normalizeMaxOutputTokens(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return DEFAULT_MAX_OUTPUT_TOKENS;
  return Math.min(Math.max(parsed, 100), 900);
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_CHAT_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    console.error('OPENAI_API_KEY is not configured');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { messages, max_tokens: maxTokens } = req.body || {};

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    const { instructions, input } = normalizeMessages(messages);

    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        instructions,
        input,
        max_output_tokens: normalizeMaxOutputTokens(maxTokens),
        store: false,
        text: {
          format: {
            type: 'text',
          },
        },
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error('OpenAI API error:', response.status, details);
      return res.status(response.status).json({
        error: 'API request failed',
        details,
      });
    }

    const data = await response.json();
    const content = extractResponseText(data);

    if (!content) {
      console.error('OpenAI response did not contain text output');
      return res.status(502).json({ error: 'Empty AI response' });
    }

    return res.status(200).json({
      id: data.id,
      model: data.model || model,
      choices: [
        {
          message: {
            role: 'assistant',
            content,
          },
        },
      ],
    });
  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
