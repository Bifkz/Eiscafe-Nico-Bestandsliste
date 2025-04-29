// 📦 Installation: Dateien in Cache speichern
self.addEventListener("install", event => {
  self.skipWaiting(); // sofort aktivieren
  event.waitUntil(
    caches.open("eis-store").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./script.js",
        "./manifest.json",
        "./icons/icon-192.png",
        "./icons/icon-512.png"
      ]);
    })
  );
});

// 🧹 Aktivierung: Alte Caches bereinigen
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== "eis-store")
          .map(name => caches.delete(name))
      );
    })
  );
});

// 🌐 Fetch: Versuche Cache → sonst Netzwerk
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
