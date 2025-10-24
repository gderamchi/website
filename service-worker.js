// Service Worker for caching assets and enabling offline access

const CACHE_NAME = 'guillaume-deramchi-cache-v1';

// Resources to cache immediately on install
const PRECACHE_RESOURCES = [
  '/website/',
  '/website/index.html',
  '/website/projects.html',
  '/website/404.html',
  '/website/style.css',
  '/website/overscroll-fix.css',
  '/website/projects-page.css',
  '/website/common.js',
  '/website/script.js',
  '/website/projects-page.js',
  '/website/projects-data.js',
  '/website/images/profile-photo.webp',
  '/website/images/projects/default.webp',
  '/website/favicon.ico',
  '/website/site.webmanifest'
];

// Resources to cache when visited
const DYNAMIC_RESOURCES = [
  '/website/images/projects/'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching core assets');
        return cache.addAll(PRECACHE_RESOURCES);
      })
      .then(() => {
        console.log('Service Worker: Install completed');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Clearing old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation completed');
        return self.clients.claim();
      })
      .catch(error => {
        console.error('Service Worker: Activation failed:', error);
      })
  );
});

// Fetch event - serve from cache or network with dynamic caching
self.addEventListener('fetch', event => {
  // Skip non-GET requests and browser extensions
  if (event.request.method !== 'GET' || 
      event.request.url.startsWith('chrome-extension://') ||
      event.request.url.startsWith('http://localhost:') ||
      event.request.url.includes('/sockjs-node')) {
    return;
  }
  
  // Network-first strategy for HTML requests to ensure fresh content
  if (event.request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          let responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(cachedResponse => {
              return cachedResponse || caches.match('/website/404.html');
            });
        })
    );
    return;
  }
  
  // Cache-first strategy for assets
  let shouldCache = DYNAMIC_RESOURCES.some(urlPrefix => 
    event.request.url.includes(urlPrefix)
  );
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(response => {
            // Only cache valid responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response as it can only be consumed once
            let responseClone = response.clone();
            
            // Cache dynamic resources
            if (shouldCache) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            
            return response;
          })
          .catch(error => {
            console.error('Service Worker: Fetch failed:', error);
            
            // For image requests, return a fallback image
            if (event.request.url.match(/\.(jpe?g|png|gif|webp|svg)$/)) {
              return caches.match('/website/images/projects/default.webp');
            }
            
            // Return a previously cached response if available
            return caches.match(event.request);
          });
      })
  );
});

// Handle offline fallback
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/website/index.html');
        })
    );
  }
});

// Handle messages from the main thread
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
