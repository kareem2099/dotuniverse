const CACHE_NAME = 'dotuniverse-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './js/app.js',
  './js/modules/particle-system.js',
  './js/modules/math-eval.js',
  './js/modules/terminal-emulator.js',
  './js/modules/challenges.js',
  './js/modules/scroll-effects.js',
  './js/modules/theme-manager.js',
  './assets/icon.svg'
];

// Install Event - Pre-cache Static Assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Service Worker: Pre-caching static assets...');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Clearing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Cache-first with Network-fallback (safeguarding video requests)
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Skip video files to prevent range-request bugs on iOS Safari
  if (url.pathname.endsWith('.mp4')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Fetch from network and cache new dynamic resources (like external fonts)
      return fetch(e.request).then((networkResponse) => {
        if (!networkResponse) return networkResponse;

        const isSuccess = networkResponse.status === 200;
        const isOpaqueFont = networkResponse.status === 0 && (url.host.includes('fonts.googleapis.com') || url.host.includes('fonts.gstatic.com'));
        const isSameOrigin = networkResponse.type === 'basic';
        const isFont = url.host.includes('fonts.googleapis.com') || url.host.includes('fonts.gstatic.com');

        const shouldCache = (isSuccess && isSameOrigin) || ((isSuccess || isOpaqueFont) && isFont);

        if (!shouldCache) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Fallback offline behavior
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
