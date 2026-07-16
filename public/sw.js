// Service worker: enables installation and offline use.
// Strategy: network-first for pages (so content stays fresh), cache-first for
// static assets (fonts, icons, built JS/CSS), with a cached fallback when the
// network is unavailable. Progress lives in localStorage, so practice keeps
// working offline once the app shell is cached.

const CACHE_NAME = "arabic-amar-v1";
const PRECACHE_URLS = ["/", "/practice", "/vocabulary", "/topics", "/grammar"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

const isStaticAsset = (url) =>
  url.pathname.startsWith("/_next/static/") ||
  url.pathname.startsWith("/fonts/") ||
  url.pathname.startsWith("/audio/") ||
  /\.(png|svg|ico|ttf|woff2?|mp3|ogg)$/.test(url.pathname);

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isStaticAsset(url)) {
    // Cache-first: hashed/static assets never change under the same URL.
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return response;
          })
      )
    );
    return;
  }

  if (request.mode === "navigate" || request.destination === "document") {
    // Network-first: prefer fresh pages, fall back to cache when offline.
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match("/practice"))
        )
    );
  }
});
