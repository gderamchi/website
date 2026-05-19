const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-5.4-mini';

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.BLACKBOX_API || process.env.BLACKBOX_API_KEY;

  if (!apiKey) {
    console.error('OPENAI_API_KEY is not configured');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const {
      messages,
      model = DEFAULT_MODEL,
      max_tokens = 500,
      temperature = 0.7,
    } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
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
        max_output_tokens: max_tokens,
        temperature,
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
    const assistantMessage = extractOutputText(data);

    if (!assistantMessage) {
      console.error('OpenAI API returned no text output:', JSON.stringify(data));
      return res.status(502).json({ error: 'No response text returned' });
    }

    return res.status(200).json({
      id: data.id,
      model: data.model,
      usage: data.usage,
      choices: [
        {
          message: {
            role: 'assistant',
            content: assistantMessage,
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

function normalizeMessages(messages) {
  const systemMessages = [];
  const conversation = [];

  for (const message of messages) {
    if (!message || typeof message.content !== 'string') {
      continue;
    }

    const content = message.content.trim();
    if (!content) {
      continue;
    }

    if (message.role === 'system' || message.role === 'developer') {
      systemMessages.push(content);
      continue;
    }

    const role = message.role === 'assistant' ? 'Assistant' : 'User';
    conversation.push(`${role}: ${content}`);
  }

  return {
    instructions: systemMessages.join('\n\n'),
    input: conversation.join('\n\n') || 'Hello',
  };
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
