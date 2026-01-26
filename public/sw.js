// Service Worker for Git Roaster PWA
const CACHE_NAME = "git-roaster-v1";
const urlsToCache = [
  "/",
  "/manifest.json",
  "/_next/static/css/app/layout.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "Git Roaster";
  const options = {
    body: data.body || "New update available",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
