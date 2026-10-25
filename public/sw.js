// Service worker: keeps the app itself available offline.
// It only ever stores and serves the app's own files (same origin).
// User images are never seen here: they are processed in the page and never requested over the network.

const VERSION = "v9";
const CACHE = `keeppix-${VERSION}`;
const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/icons/apple-touch-icon.png",
  "/icons/icon.svg",
  "/pdf-tools.js",
  "/vendor/pdf-lib.min.js",
  "/vendor/pdf.min.js",
  "/vendor/pdf.worker.min.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => (k.startsWith("eikones-") || k.startsWith("keeppix-")) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  // Page: try the network first (to pick up new versions), fall back to the cached copy offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok && !res.redirected) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put("/", copy));
          }
          return res;
        })
        .catch(() => caches.match("/"))
    );
    return;
  }

  // App files (icons, manifest, scripts): cache first. Bump VERSION to ship changes.
  event.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});
