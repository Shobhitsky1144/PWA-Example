// Cache Version Name
var staticCacheName = "pwa";
var dynamicCacheName = "site-dynamic-v2";

// Files to cache
var assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/firebase-messaging-sw.js",
  //   "/js/app.js",
  //   "/images/coffee1.jpg",
];

// install
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(assets).catch((err) => {
        console.log("Error adding files to catch", err);
      });
    })
  );
  console.log("SW Installed");
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

// fetch
self.addEventListener("fetch", function (evt) {
  // console.log(evt.request.url);

  evt.respondWith(
    caches.match(evt.request).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(evt.request).then((fetchRes) => {
          return caches.open(dynamicCacheName).then((cache) => {
            cache.put(evt.request.url, fetchRes.clone());

            return fetchRes;
          });
        })
      );
    })
  );
});

//   Notification.requestPermission().then((result) => {
//     if (result === "granted") {
//       notification();
//     } else {
//       alert("You denied or dismissed permissions to notifications.");
//     }
//   });
