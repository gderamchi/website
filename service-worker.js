// Service Worker for offline fallback and low-risk asset caching.

const CACHE_NAME = 'guillaume-deramchi-cache-v2';
const PRECACHE_RESOURCES = [
  './',
  './index.html',
  './projects.html',
  './404.html',
  './projects-data.js',
  './src/styles/style.css',
  './src/styles/overscroll-fix.css',
  './src/styles/projects-page.css',
  './src/styles/page-transitions.css',
  './src/styles/enhancements.css',
  './src/styles/browser-fixes.css',
  './src/styles/mobile-fixes.css',
  './src/scripts/common.js',
  './src/scripts/script.js',
  './src/scripts/projects-page.js',
  './src/scripts/page-transitions.js',
  './src/scripts/chat-widget.js',
  './images/profile-photo.webp',
  './images/projects/default.webp',
  './favicon.ico',
  './favicon.png',
  './site.webmanifest'
];

const IMAGE_FALLBACK = './images/projects/default.webp';
const PAGE_FALLBACK = './index.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_RESOURCES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const accepts = event.request.headers.get('accept') || '';

  if (event.request.mode === 'navigate' || accepts.includes('text/html')) {
    event.respondWith(networkFirst(event.request, PAGE_FALLBACK));
    return;
  }

  event.respondWith(cacheFirst(event.request));
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

async function networkFirst(request, fallbackUrl) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    if (response?.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return (await cache.match(request)) || cache.match(fallbackUrl);
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const response = await fetch(request);
    if (response?.ok && response.type === 'basic') {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    if (request.destination === 'image') {
      return caches.match(IMAGE_FALLBACK);
    }

    return caches.match(request);
  }
}
