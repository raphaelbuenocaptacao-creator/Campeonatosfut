const CACHE = 'campeonato-foot-shell-v6-safe';
const OFFLINE = './index.html';
const APP_SHELL = new Set([
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './icons/icon-512-maskable.svg'
]);

const PRIVATE_PATH = /\/(api|auth|login|logout|admin|session|token|password|account|profile|user|me)(\/|$)/i;
const PRIVATE_QUERY = /(^|[?&])(token|access_token|refresh_token|password|passwd|secret|session|auth|authorization|api[_-]?key|code|credential|credentials)=/i;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll([...APP_SHELL]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function isSensitiveRequest(request, url) {
  if (request.method !== 'GET') return true;
  if (request.headers.has('authorization') || request.headers.has('cookie')) return true;
  if (PRIVATE_PATH.test(url.pathname)) return true;
  if (PRIVATE_QUERY.test(url.search)) return true;
  return false;
}

function shellKey(url) {
  if (url.search) return null;
  const path = url.pathname.split('/').pop();
  if (!path) return './';
  if (path === 'index.html') return './index.html';
  if (path === 'styles.css') return './styles.css';
  if (path === 'app.js') return './app.js';
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
      fetch(request, { cache: 'no-store' })
        .catch(() => caches.match(OFFLINE))
    );
    return;
  }

  const key = shellKey(url);
  if (!key || !APP_SHELL.has(key)) return;

  event.respondWith(
    caches.match(key).then(cached => cached || fetch(request, { cache: 'no-store' }))
  );
});
