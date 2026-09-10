const CACHE_VERSION = 'aureon-i30-v3-private-vary-range-safe-shell';
const SHELL_CACHE = CACHE_VERSION;
const SHELL = ['./', './index.html', './styles.css', './app.js', './offline.html', './icon-192.png', './icon-512.png', './icon-512-maskable.png'];
const PRIVATE_PATH = /\/(?:api|auth|login|logout|session|account|admin|private|me)(?:\/|$)/i;
const SENSITIVE_QUERY = /(?:token|access_token|refresh_token|password|senha|secret|key|session|auth)=/i;
function requestIsSensitive(request) {
  const url = new URL(request.url);
  if (request.method !== 'GET') return true;
  if (request.headers.has('authorization') || request.headers.has('cookie') || request.headers.has('range') || request.headers.has('if-range')) return true;
  if (PRIVATE_PATH.test(url.pathname) || SENSITIVE_QUERY.test(url.search.slice(1))) return true;
  return false;
}
function responseIsCacheSafe(response) {
  if (!response || !response.ok || response.type === 'opaque') return false;
  const cc = (response.headers.get('cache-control') || '').toLowerCase();
  const vary = (response.headers.get('vary') || '').toLowerCase().split(',').map(v => v.trim()).filter(Boolean);
  if (cc.includes('private') || cc.includes('no-store')) return false;
  if (response.headers.has('set-cookie') || response.headers.has('content-range')) return false;
  if (vary.includes('*') || vary.includes('cookie') || vary.includes('authorization') || vary.includes('range') || vary.includes('if-range')) return false;
  return true;
}
self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL_CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('aureon-i30-') && key !== SHELL_CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || requestIsSensitive(request)) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('./offline.html')));
    return;
  }
  const isShellAsset = SHELL.some(path => new URL(path, self.registration.scope).href === url.href);
  if (!isShellAsset) return;
  event.respondWith(caches.match(request).then(cached => {
    const network = fetch(request).then(response => {
      if (responseIsCacheSafe(response)) {
        const clone = response.clone();
        caches.open(SHELL_CACHE).then(cache => cache.put(request, clone));
      }
      return response;
    });
    return cached || network;
  }));
});
