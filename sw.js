// Service Worker desativado — limpa cache e passa tudo direto
self.addEventListener('install', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
    .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
    .then(() => self.clients.claim())
    .then(() => self.clients.matchAll().then(clients => clients.forEach(c => c.navigate(c.url))))
  );
});
self.addEventListener('fetch', e => e.respondWith(fetch(e.request)));
