# Netlify Functions - Chat Backend

This directory contains serverless functions that run on Netlify's edge network.

## 📁 Functions

### `chat.js`
Secure proxy for BLACKBOX AI API requests.

**Endpoint**: `/.netlify/functions/chat` (or `/api/chat` via redirect)

**Method**: POST

**Request Body**:
```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are Guillaume..."
    },
    {
      "role": "user", 
      "content": "Tell me about your experience"
    }
  ],
  "model": "gpt-4o",
  "max_tokens": 500,
  "temperature": 0.7
}
```

**Response**:
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "I'm Guillaume, a computer science student..."
      }
    }
  ]
}
```

## 🔒 Environment Variables

Required:
- `BLACKBOX_API_KEY` - Your BLACKBOX API key

Set in Netlify Dashboard → Site Settings → Environment Variables

## 🧪 Local Testing

```bash
# Install dependencies
npm install

# Create .env file
echo "BLACKBOX_API_KEY=your-key-here" > .env

# Start local dev server
netlify dev

# Test the function
curl -X POST http://localhost:8888/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"model":"gpt-4o"}'
```

## 📊 Monitoring

View function logs in Netlify Dashboard:
- Site → Functions → chat → View logs

## 🚀 Deployment

Functions auto-deploy when you push to GitHub (if connected to Netlify).

## 🔧 Customization

To modify the function:
1. Edit `chat.js`
2. Commit and push
3. Netlify auto-deploys

## 💡 Tips

- Keep the API key in environment variables, never in code
- Monitor function invocations to stay within free tier
- Add rate limiting if needed
- Check logs regularly for errors
