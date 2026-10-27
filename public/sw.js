// Service worker: keeps the app itself available offline.
// It only ever stores and serves the app's own files (same origin).
// User images are never seen here: they are processed in the page and never requested over the network.

const VERSION = "v25";
const CACHE = `kratopix-${VERSION}`;
const APP_SHELL = [
  "/",
  "/el/",
  "/privacy/",
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

// KeepPix is now Kratopix. On the old address (keeppix.app) this worker retires itself:
// it deletes the old offline copy, unregisters, and reloads open tabs, which then
// get redirected to kratopix.app. Without this, installed copies would keep showing
// the old cached app forever.
const RETIRED = /(^|\.)keeppix\.app$/.test(self.location.hostname);
if (RETIRED) {
  self.addEventListener("install", () => self.skipWaiting());
  self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {
      for (const k of await caches.keys()) await caches.delete(k);
      await self.registration.unregister();
      for (const c of await self.clients.matchAll({ type: "window" })) c.navigate(c.url).catch(() => {});
    })());
  });
}

if (!RETIRED) {
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => (k.startsWith("eikones-") || k.startsWith("keeppix-") || k.startsWith("kratopix-")) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  // Page: try the network first (to pick up new versions), fall back to the cached copy offline.
  if (req.mode === "navigate") {
    // The app is "/" (English) or "/el/" (Greek); other pages (like /privacy/) are cached under their own address.
    const p = url.pathname;
    const page = /^\/el\/(index\.html)?$/.test(p) ? "/el/" : /^\/(index\.html)?$/.test(p) ? "/" : p;
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok && !res.redirected) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(page, copy));
          }
          return res;
        })
        .catch(() => caches.match(page).then((hit) => hit || caches.match("/")))
    );
    return;
  }

  // App files (icons, manifest, scripts): cache first. Bump VERSION to ship changes.
  event.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});
}
