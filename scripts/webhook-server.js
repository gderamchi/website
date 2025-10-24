#!/usr/bin/env node

/**
 * GitHub Webhook Server (Optional)
 * 
 * This server listens for GitHub webhook events and triggers
 * the portfolio sync immediately when you push to any repository.
 * 
 * This is more advanced and requires hosting, but provides
 * instant updates instead of waiting for GitHub Actions.
 */

const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const CONFIG = {
  PORT: process.env.WEBHOOK_PORT || 3000,
  SECRET: process.env.WEBHOOK_SECRET || 'your-webhook-secret',
  ALLOWED_EVENTS: ['push', 'repository'],
};

/**
 * Verify GitHub webhook signature
 */
function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

/**
 * Handle webhook event
 */
async function handleWebhook(event, payload) {
  console.log(`📨 Received ${event} event`);
  
  // Only process push events to main/master branch
  if (event === 'push') {
    const ref = payload.ref;
    const branch = ref.split('/').pop();
    
    if (branch === 'main' || branch === 'master') {
      console.log(`🚀 Push to ${branch} detected, triggering sync...`);
      
      try {
        // Run the sync script
        const { stdout, stderr } = await execAsync('node scripts/ai-sync-portfolio.js');
        console.log('✅ Sync completed successfully');
        console.log(stdout);
        
        if (stderr) {
          console.error('⚠️  Warnings:', stderr);
        }
        
        return { success: true, message: 'Portfolio synced successfully' };
      } catch (error) {
        console.error('❌ Sync failed:', error);
        return { success: false, error: error.message };
      }
    } else {
      console.log(`⏭️  Ignoring push to ${branch} branch`);
      return { success: true, message: 'Branch ignored' };
    }
  }
  
  // Handle repository events (created, deleted, etc.)
  if (event === 'repository') {
    const action = payload.action;
    console.log(`📦 Repository ${action}: ${payload.repository.name}`);
    
    if (action === 'created' || action === 'publicized') {
      console.log('🚀 New repository detected, triggering sync...');
      
      try {
        const { stdout } = await execAsync('node scripts/ai-sync-portfolio.js');
        console.log('✅ Sync completed successfully');
        console.log(stdout);
        return { success: true, message: 'Portfolio synced successfully' };
      } catch (error) {
        console.error('❌ Sync failed:', error);
        return { success: false, error: error.message };
      }
    }
  }
  
  return { success: true, message: 'Event processed' };
}

/**
 * Create HTTP server
 */
const server = http.createServer(async (req, res) => {
  // Only accept POST requests to /webhook
  if (req.method !== 'POST' || req.url !== '/webhook') {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }
  
  // Read request body
  let body = '';
  req.on('data', chunk => body += chunk);
  
  req.on('end', async () => {
    try {
      // Verify signature
      const signature = req.headers['x-hub-signature-256'];
      if (!signature || !verifySignature(body, signature, CONFIG.SECRET)) {
        console.error('❌ Invalid signature');
        res.writeHead(401);
        res.end('Unauthorized');
        return;
      }
      
      // Parse payload
      const payload = JSON.parse(body);
      const event = req.headers['x-github-event'];
      
      // Check if event is allowed
      if (!CONFIG.ALLOWED_EVENTS.includes(event)) {
        console.log(`⏭️  Ignoring ${event} event`);
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'Event ignored' }));
        return;
      }
      
      // Handle webhook
      const result = await handleWebhook(event, payload);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
      
    } catch (error) {
      console.error('❌ Error processing webhook:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  });
});

// Start server
server.listen(CONFIG.PORT, () => {
  console.log(`🎣 Webhook server listening on port ${CONFIG.PORT}`);
  console.log(`📍 Endpoint: http://localhost:${CONFIG.PORT}/webhook`);
  console.log(`🔐 Secret configured: ${CONFIG.SECRET ? 'Yes' : 'No'}`);
  console.log(`📨 Listening for events: ${CONFIG.ALLOWED_EVENTS.join(', ')}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 Shutting down webhook server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
