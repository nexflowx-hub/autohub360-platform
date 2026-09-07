/* AutoHub360 Store — safe PWA service worker.
 * Cache-first only for static assets; never caches checkout/account/api responses. */
const VERSION = 'ah-store-v1';
const STATIC_CACHE = `${VERSION}-static`;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((c) => c.addAll(['/icons/icon-192.png', '/icons/icon-512.png'])));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;

  // Never intercept sensitive or dynamic flows.
  const noCachePaths = ['/api/', '/checkout', '/conta', '/pedido', '/carrinho'];
  if (noCachePaths.some((p) => url.pathname.startsWith(p))) return;

  // Cache-first for same-origin static assets.
  const isStatic =
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/'));
  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then(
        (hit) =>
          hit ||
          fetch(event.request).then((res) => {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(event.request, copy));
            return res;
          }),
      ),
    );
  }
});
