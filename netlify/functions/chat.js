// Netlify Function - Chat Proxy
// This securely calls BLACKBOX API without exposing the API key

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get API key from environment variable
  const BLACKBOX_API_KEY = process.env.BLACKBOX_API_KEY;
  
  if (!BLACKBOX_API_KEY) {
    console.error('BLACKBOX_API_KEY not found in environment variables');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' })
    };
  }

  try {
    // Parse the request body
    const { messages, model = 'blackboxai/anthropic/claude-sonnet-4.5', max_tokens = 500, temperature = 0.7 } = JSON.parse(event.body);

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid messages format' })
      };
    }

    // Call BLACKBOX API
    const response = await fetch('https://api.blackbox.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BLACKBOX_API_KEY}`
      },
      body: JSON.stringify({
        messages,
        model,
        max_tokens,
        temperature,
        stream: false
      })
    });

    // Check if request was successful
    if (!response.ok) {
      const errorData = await response.text();
      console.error('BLACKBOX API Error:', response.status, errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: 'API request failed',
          details: errorData 
        })
      };
    }

    // Parse and return the response
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow requests from your domain
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
