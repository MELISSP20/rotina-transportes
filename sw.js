const CACHE = 'rotina-transportes-v2';
const ASSETS = [
  '/rotina-transportes/',
  '/rotina-transportes/index.html',
  '/rotina-transportes/madrugadao.html',
  '/rotina-transportes/tutorial-report-gerencial.html',
  '/rotina-transportes/ml-logo.png',
  '/rotina-transportes/rank-leader.png',
  '/rotina-transportes/manifest.json',
  '/rotina-transportes/icon-192.png',
  '/rotina-transportes/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Never cache Firebase requests — let them go to network
  if (e.request.url.includes('firebaseio.com') || e.request.url.includes('firebase')) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/rotina-transportes/')))
  );
});
