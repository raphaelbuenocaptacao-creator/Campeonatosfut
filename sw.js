const CACHE = 'campeonato-foot-shell-v3';
const APP_SHELL = new Set([
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './manifest.webmanifest',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './icons/icon-512-maskable.svg'
]);

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll([...APP_SHELL])));
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
  if (request.headers.has('authorization') || request.headers.has('cookie')) return true;
  const p = url.pathname.toLowerCase();
  const sensitive = ['/api/', '/auth', '/login', '/logout', '/admin', '/session', '/token', '/password', '/account', '/profile'];
  return sensitive.some(part => p.includes(part));
}

function shellKey(url) {
  const path = url.pathname.split('/').pop();
  if (!path) return './';
  if (path === 'index.html') return './index.html';
  if (path === 'styles.css') return './styles.css';
  if (path === 'app.js') return './app.js';
  if (path === 'manifest.json') return './manifest.json';
  if (path === 'manifest.webmanifest') return './manifest.webmanifest';
  if (url.pathname.includes('/icons/icon-192.svg')) return './icons/icon-192.svg';
  if (url.pathname.includes('/icons/icon-512.svg')) return './icons/icon-512.svg';
  if (url.pathname.includes('/icons/icon-512-maskable.svg')) return './icons/icon-512-maskable.svg';
  return null;
}

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin || isSensitiveRequest(request, url)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => response)
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  const key = shellKey(url);
  if (!key || !APP_SHELL.has(key)) return;

  event.respondWith(
    caches.match(key).then(cached => cached || fetch(request).then(response => {
      if (!response || response.status !== 200 || response.type !== 'basic') return response;
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(key, copy));
      return response;
    }))
  );
});
