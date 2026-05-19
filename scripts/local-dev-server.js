import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chatHandler from '../api/chat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const port = Number(process.env.PORT || process.env.VERCEL_DEV_PORT || 3000);

await loadLocalEnv();

const server = http.createServer(async (req, res) => {
  try {
    if (req.url?.startsWith('/api/chat')) {
      await handleApiChat(req, res);
      return;
    }

    await serveStatic(req, res);
  } catch (error) {
    console.error('Local dev server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

server.listen(port, () => {
  console.log(`Local portfolio server running at http://localhost:${port}`);
});

async function loadLocalEnv() {
  const envPath = path.join(rootDir, '.env.local');

  try {
    const content = await fs.readFile(envPath, 'utf8');

    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();

      if (key && !(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // Local secrets are optional; the API route will return a clear error if absent.
  }
}

async function handleApiChat(req, res) {
  const body = await readJsonBody(req);

  const vercelLikeReq = {
    method: req.method,
    body,
  };

  const vercelLikeRes = {
    setHeader: (key, value) => res.setHeader(key, value),
    status(code) {
      res.statusCode = code;
      return this;
    },
    json(payload) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(payload));
      return this;
    },
    end(payload = '') {
      res.end(payload);
      return this;
    },
  };

  await chatHandler(vercelLikeReq, vercelLikeRes);
}

async function readJsonBody(req) {
  if (req.method !== 'POST') return undefined;

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  if (!rawBody) return undefined;

  return JSON.parse(rawBody);
}

async function serveStatic(req, res) {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(requestUrl.pathname);
  const filePath = resolveStaticPath(pathname);

  if (!filePath.startsWith(rootDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const data = await fs.readFile(filePath);
    res.writeHead(200, { 'Content-Type': getContentType(filePath) });
    res.end(data);
  } catch {
    const notFound = await fs.readFile(path.join(rootDir, '404.html'));
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(notFound);
  }
}

function resolveStaticPath(pathname) {
  if (pathname === '/') return path.join(rootDir, 'index.html');
  if (pathname === '/projects') return path.join(rootDir, 'projects.html');
  if (pathname === '/chat') return path.join(rootDir, 'chat.html');

  const normalized = pathname.replace(/^\/+/, '');
  const candidate = path.join(rootDir, normalized);

  if (!path.extname(candidate)) {
    return `${candidate}.html`;
  }

  return candidate;
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  const types = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.webp': 'image/webp',
    '.xml': 'application/xml; charset=utf-8',
  };

  return types[ext] || 'application/octet-stream';
}
