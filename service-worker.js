// ============================================
//  SERVICE WORKER - Auto Update Cache
//  Niraj With Mehndi
// ============================================

const CACHE_NAME = 'niraj-mehndi-v2';

// Install - Skip waiting to activate immediately
self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll([
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
                '/mehndi/js/main.js',
                '/mehndi/js/gallery.js',
                '/mehndi/js/booking.js',
                '/mehndi/data/designs.json',
                '/mehndi/data/reviews.json',
                '/mehndi/data/config.json'
            ]);
        })
    );
});

// Activate - Delete old cache
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

// Fetch - Network first, then cache
self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request)
            .then(function(response) {
                // Update cache with new version
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(function() {
                // Offline - serve from cache
                return caches.match(event.request);
            })
    );
});