# Netlify Backend Proxy Setup Guide

This guide explains how to deploy your portfolio with a secure AI chatbot backend using Netlify.

## 🎯 What We've Built

- **Backend Proxy**: Netlify Function that securely calls BLACKBOX API
- **Frontend**: Chat interface that calls our proxy (not BLACKBOX directly)
- **Security**: API key stays secret on the server, never exposed to users
- **Fallback**: Smart keyword-based responses if API fails

## 📁 Files Created

1. **`netlify/functions/chat.js`** - Serverless function that proxies requests to BLACKBOX API
2. **`netlify.toml`** - Netlify configuration file
3. **`package.json`** - Updated with Netlify CLI dependency
4. **`src/scripts/chat.js`** - Updated to call our proxy instead of BLACKBOX directly

## 🚀 Deployment Steps

### Step 1: Connect to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and select your `website` repository
4. Netlify will auto-detect the configuration from `netlify.toml`

### Step 2: Configure Environment Variables

1. In your Netlify site dashboard, go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add:
   - **Key**: `BLACKBOX_API_KEY`
   - **Value**: Your BLACKBOX API key (from GitHub Secrets)
   - **Scopes**: Check both "Builds" and "Functions"
4. Click **"Create variable"**

### Step 3: Deploy

1. Click **"Deploy site"**
2. Netlify will:
   - Build your site
   - Deploy the serverless function
   - Set up the `/api/chat` endpoint
3. Your site will be live at `https://your-site-name.netlify.app`

### Step 4: Update GitHub Pages (Optional)

If you want to keep using GitHub Pages but with Netlify Functions:

1. Keep your GitHub Pages deployment
2. Update `src/scripts/chat.js` to point to your Netlify function URL:
   ```javascript
   const apiEndpoint = 'https://your-site-name.netlify.app/api/chat';
   ```

## 🧪 Local Testing

To test the backend proxy locally:

1. Install Netlify CLI:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root:
   ```
   BLACKBOX_API_KEY=your-api-key-here
   ```

3. Start the local dev server:
   ```bash
   netlify dev
   ```

4. Open `http://localhost:8888` in your browser
5. The chat will use `http://localhost:8888/api/chat` automatically

## 🔒 Security Features

✅ **API Key Protection**: Never exposed to the client
✅ **CORS Headers**: Configured to allow requests from your domain
✅ **Error Handling**: Graceful fallback to keyword-based responses
✅ **Rate Limiting**: Can be added in the Netlify function if needed

## 📊 How It Works

```
User Browser
    ↓
    ↓ POST /api/chat
    ↓
Netlify Function (chat.js)
    ↓
    ↓ Adds API key
    ↓ POST https://api.blackbox.ai/chat/completions
    ↓
BLACKBOX API
    ↓
    ↓ Response
    ↓
Netlify Function
    ↓
    ↓ Returns to user
    ↓
User Browser (displays AI response)
```

## 🎨 Features

- **Real AI Responses**: Uses GPT-4o via BLACKBOX API
- **Smart Fallback**: If API fails, uses intelligent keyword-based responses
- **Fast**: Serverless functions are quick and scalable
- **Free Tier**: Netlify offers generous free tier (125k function invocations/month)

## 🐛 Troubleshooting

### Function not working?
1. Check Netlify function logs: Site → Functions → chat → View logs
2. Verify `BLACKBOX_API_KEY` is set in environment variables
3. Check the function URL: `https://your-site.netlify.app/.netlify/functions/chat`

### API key not found?
1. Make sure you added it in Netlify dashboard (not just GitHub Secrets)
2. Redeploy the site after adding the environment variable

### CORS errors?
1. Check the `Access-Control-Allow-Origin` header in `netlify/functions/chat.js`
2. Update it to your specific domain if needed

## 📈 Monitoring

Monitor your function usage in Netlify:
- Dashboard → Functions → chat
- See invocation count, errors, and response times

## 💰 Costs

- **Netlify Free Tier**: 125,000 function invocations/month
- **BLACKBOX API**: Check their pricing (you already have a key)
- **Estimated**: For a portfolio site, likely stays within free tier

## 🔄 Updates

To update the function:
1. Edit `netlify/functions/chat.js`
2. Commit and push to GitHub
3. Netlify auto-deploys the changes

## ✅ Next Steps

After deployment:
1. Test the chat on your live site
2. Monitor function logs for any errors
3. Adjust the system prompt in `src/scripts/chat.js` if needed
4. Consider adding rate limiting if needed

## 🎉 You're Done!

Your AI chatbot is now:
- ✅ Secure (API key hidden)
- ✅ Scalable (serverless)
- ✅ Reliable (with fallback)
- ✅ Fast (edge functions)
- ✅ Free (within limits)
