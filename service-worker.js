// Service Worker for caching assets and enabling offline access on Vercel.

const CACHE_NAME = 'guillaume-deramchi-cache-v2';

const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/projects.html',
  '/chat.html',
  '/404.html',
  '/src/styles/style.css',
  '/src/styles/overscroll-fix.css',
  '/src/styles/projects-page.css',
  '/src/styles/chat.css',
  '/src/scripts/common.js',
  '/src/scripts/script.js',
  '/src/scripts/projects-page.js',
  '/src/scripts/chat.js',
  '/src/scripts/chat-widget.js',
  '/projects-data.js',
  '/images/profile-photo.webp',
  '/images/projects/default.webp',
  '/favicon.ico',
  '/site.webmanifest',
];

const DYNAMIC_RESOURCE_PATHS = [
  '/images/projects/',
  '/src/assets/images/projects/',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_RESOURCES))
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error('Service Worker: Install failed:', error);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return null;
        })
      ))
      .then(() => self.clients.claim())
      .catch(error => {
        console.error('Service Worker: Activation failed:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  if (
    event.request.method !== 'GET' ||
    requestUrl.origin !== self.location.origin ||
    requestUrl.pathname.startsWith('/api/') ||
    requestUrl.pathname.includes('/_vercel/')
  ) {
    return;
  }

  if (event.request.mode === 'navigate' || event.request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(networkFirst(event.request, '/index.html'));
    return;
  }

  event.respondWith(cacheFirst(event.request));
});

async function networkFirst(request, fallbackPath) {
  try {
    const response = await fetch(request);
    const responseClone = response.clone();
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, responseClone);
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || caches.match(fallbackPath);
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const response = await fetch(request);

    if (response && response.status === 200 && response.type === 'basic') {
      const shouldCache = DYNAMIC_RESOURCE_PATHS.some(path => new URL(request.url).pathname.startsWith(path));

      if (shouldCache) {
        const responseClone = response.clone();
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, responseClone);
      }
    }

    return response;
  } catch (error) {
    if (request.url.match(/\.(jpe?g|png|gif|webp|svg)$/)) {
      return caches.match('/images/projects/default.webp');
    }

    return caches.match(request);
  }
}

self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
