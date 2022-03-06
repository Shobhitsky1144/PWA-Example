var staticCacheName = "pwa";
var dynamicCacheName = "site-dynamic-v2";
// var staticCacheName = "pwa";
var assets = [
  "/",
  "/index.html",
  "/css/style.css",
  //   "/js/app.js",
  //   "/images/coffee1.jpg",
];
// window.addEventListener("load", () => {
//   registerSW();
// });

// Register the Service Worker
// async function registerSW() {
//   if ("serviceWorker" in navigator) {
//     try {
//       let swReg = await navigator.serviceWorker.register("serviceworker.js");
//     } catch (e) {
//       console.log("SW registration failed");
//     }
//   }
// }
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", function (evt) {
  console.log(evt.request.url);

  evt.respondWith(
    caches.match(evt.request).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(evt.request).then((fetchRes) => {
          return caches.open(dynamicCacheName).then((cache) => {
            cache.put(evt.request.url, fetchRes.clone());
            // check cached items size
            limitCacheSize(dynamicCacheName, 15);
            return fetchRes;
          });
        })
      );
    })
  );
});
// });

// async function networkFirst(req) {
//   const cache = await caches.open("dynamic-content");
//   try {
//     const res = await fetch(req);
//     cache.put(req, res.clone());
//     return res;
//   } catch (err) {
//     const cachedResponse = await cache.match(req);
//     return cachedResponse || caches.match("./fallback.json");
//   }
// }
