// ============================================
//  SERVICE WORKER - PWA Offline Support
//  Niraj With Mehndi
// ============================================

const CACHE_NAME = 'niraj-mehndi-v1';
const urlsToCache = [
  '/mehndi/',
  '/mehndi/index.html',
  '/mehndi/about.html',
  '/mehndi/reviews.html',
  '/mehndi/contact.html',
  '/mehndi/faq.html',
  '/mehndi/policy.html',
  '/mehndi/404.html',
  '/mehndi/css/style.css',
  '/mehndi/css/home.css',
  '/mehndi/css/gallery.css',
  '/mehndi/css/about.css',
  '/mehndi/css/reviews.css',
  '/mehndi/css/contact.css',
  '/mehndi/css/faq.css',
  '/mehndi/css/policy.css',
  '/mehndi/js/main.js',
  '/mehndi/js/gallery.js',
  '/mehndi/js/booking.js',
  '/mehndi/js/reviews.js',
  '/mehndi/js/faq.js',
  '/mehndi/data/config.json',
  '/mehndi/data/designs.json',
  '/mehndi/data/reviews.json',
  '/mehndi/data/bookings.json'
];

// Install Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('✅ Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch from cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Update cache
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});