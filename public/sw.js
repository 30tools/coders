// This is a basic service worker file for PWA functionality
// next-pwa will automatically generate a more comprehensive one

const CACHE_NAME = 'coders-pwa-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return the cached response or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Listen for push events
self.addEventListener('push', (event) => {
  console.log('Received a push notification', event);
});

// Listen for notification click events
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://coders.30tools.com')
  );
});