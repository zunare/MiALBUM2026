var CACHE = 'mialbum2026-v1';
var OFFLINE_URLS = ['/'];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(OFFLINE_URLS).catch(function(){});
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  if (e.request.url.indexOf('supabase.co') >= 0) return;
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request).then(function(r){ return r || caches.match('/'); });
    })
  );
});
