// HOME only: never intercept or cache other games, ROOM traffic, or Cloudflare API.
const CACHE_NAME = 'boardgame-home-pwa-v32-1';
const HOME_ASSETS = ['./', './index.html', './hub-client.js', './pwa-install.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(HOME_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('boardgame-home-pwa-') && key !== CACHE_NAME).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const scope = new URL(self.registration.scope);
  const isHome = url.pathname === scope.pathname || url.pathname === scope.pathname + 'index.html';
  const managed = new Set(HOME_ASSETS.map(a => new URL(a, scope).pathname));
  if (!isHome && !managed.has(url.pathname)) return;
  // Always obtain latest HOME/resources online, fall back to cache only on network errors.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request, {cache: 'no-store'});
      if (response.ok && response.type === 'basic') await cache.put(request, response.clone());
      return response;
    } catch (error) {
      const fallback = await cache.match(request, {ignoreSearch:true}) || (isHome ? await cache.match(new URL('./', scope).href) : undefined);
      if (fallback) return fallback;
      throw error;
    }
  })());
});
