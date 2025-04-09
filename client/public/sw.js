
// This is the service worker with the Cache-first network
const CACHE = "solo-leveling-v1";



// Add list of files to cache here.
const precacheResources = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png"
];

// Install stage sets up the cache-array to configure pre-cache content
self.addEventListener("install", function(event) {
  console.log("Service Worker: Installing");

  event.waitUntil(
    caches
      .open(CACHE)
      .then(function(cache) {
        console.log("Service Worker: Caching Files");
        return cache.addAll(precacheResources);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

// Activate event
self.addEventListener("activate", function(event) {
  console.log("Service Worker: Activated");
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE) {
            console.log("Service Worker: Clearing Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event
self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(function(response) {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== "basic") {
              return response;
            }

            // Clone the response
            var responseToCache = response.clone();

            caches.open(CACHE)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(function() {
            // If fail, return offline page
            return caches.match('/offline.html');
          });
      })
  );
});
