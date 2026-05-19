const BLACKBOX_API_URL = 'https://api.blackbox.ai/chat/completions';
const DEFAULT_MODEL = 'blackboxai/google/gemini-2.5-flash-preview-05-20';

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

  const apiKey = process.env.BLACKBOX_API_KEY || process.env.BLACKBOX_API;

  if (!apiKey) {
    console.error('BLACKBOX_API_KEY or BLACKBOX_API is not configured');
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

    const response = await fetch(BLACKBOX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages,
        model,
        max_tokens,
        temperature,
        stream: false,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error('BLACKBOX API error:', response.status, details);
      return res.status(response.status).json({
        error: 'API request failed',
        details,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
