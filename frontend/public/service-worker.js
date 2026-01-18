const CACHE_VERSION = '2';
const CACHE_NAME = `ecoscan-dlh-v${CACHE_VERSION}`;
const STATIC_ASSETS = 'ecoscan-static-v' + CACHE_VERSION;

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing v' + CACHE_VERSION);
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        console.log('✅ Cache opened:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      }),
      caches.open(STATIC_ASSETS)
    ]).then(() => {
      console.log('✅ Service Worker installed');
      self.skipWaiting();
    }).catch(err => {
      console.error('❌ Cache failed:', err);
    })
  );
});

// Activate Service Worker - Clean old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old cache versions
          if (!cacheName.includes('v' + CACHE_VERSION)) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated and claimed clients');
      return self.clients.claim();
    })
  );
});

// Message Event - Handle update checks
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch Event - Smart caching strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const { request } = event;
  const url = new URL(request.url);

  // Handle API calls - Network First
  if (url.hostname.includes('localhost') && url.port === '5000') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Don't cache API responses
          return response;
        })
        .catch(() => {
          console.warn('⚠️ API offline:', request.url);
          return new Response(JSON.stringify({ 
            success: false, 
            message: 'Offline - Server tidak tersedia' 
          }), {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          });
        })
    );
    return;
  }

  // Handle HTML pages - Network First (untuk update langsung)
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return caches.match(request);
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Handle static assets - Cache First, then Network
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Update cache in background
          fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                caches.open(STATIC_ASSETS).then((cache) => {
                  cache.put(request, response.clone());
                });
              }
            })
            .catch(() => {});
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(STATIC_ASSETS).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        console.warn('⚠️ Offline:', request.url);
        return new Response('<h1>Offline</h1><p>Aplikasi sedang offline</p>', {
          status: 503,
          headers: new Headers({
            'Content-Type': 'text/html; charset=utf-8'
          })
        });
      })
  );
});

// Background Sync (untuk retry ketika online kembali)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      fetch('http://localhost:5000/api/scan/save')
        .then(response => {
          console.log('✅ Background Sync: Data synced');
        })
        .catch(err => {
          console.error('❌ Background Sync Error:', err);
        })
    );
  }
});

// Push Notification Handler
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.message || 'Notifikasi dari EcoScan DLH',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'ecoscan-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'EcoScan DLH', options)
  );
});

console.log('✅ Service Worker: Registered successfully');
