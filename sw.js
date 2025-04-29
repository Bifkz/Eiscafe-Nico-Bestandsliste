// 📦 Installation: Dateien in Cache speichern
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("eis-store").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./script.js",
        "./manifest.json",
        "./icons/icon-192.png", // optional: falls vorhanden
        "./icons/icon-512.png"  // optional: falls vorhanden
      ]);
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
