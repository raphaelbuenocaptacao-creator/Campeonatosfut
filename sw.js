const CACHE = 'campeonato-foot-v2';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

function isSensitiveRequest(request, url) {
  if (request.method !== 'GET') return true;
  if (request.headers.has('authorization')) return true;
  const sensitive = ['/api/', '/auth', '/login', '/admin', '/session', '/token', '/logout'];
  return sensitive.some(part => url.pathname.toLowerCase().includes(part));
}

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin || isSensitiveRequest(request, url)) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put('./index.html', copy));
        return response;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(request, copy));
        return response;
      });
    })
  );
});
