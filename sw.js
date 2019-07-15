const urlsToCache = [
  `/`,
  `/index.html`,
  `/css/flatpickr.min.css`,
  `/css/main.css`,
  `/css/normalize.css`,
  `/img/star--check.svg`,
  `/img/star.svg`,
  `/bundle.js`
];

const urlsToCacheMap = urlsToCache.reduce((acc, item) => {
  acc[item] = true;
  return acc;
}, {});

self.addEventListener(`install`, (event) => {
  const openCache = caches.open(`STATIC_V1.0`)
    .then((cache) => {
      return cache.addAll(urlsToCache);
    });
  event.waitUntil(openCache);
});

const isAllowedToCache = (event) => {
  return urlsToCacheMap[`/` + event.request.url.replace(event.request.referrer, ``)];
};

self.addEventListener(`fetch`, (event) => {

  if (!isAllowedToCache(event)) {
    return;
  }

  event.respondWith(async function () {
    try {
      const response = await fetch(event.request);
      await refreshCache(event.request, response);
      return response;
    } catch (err) {
      return caches.match(event.request);
    }
  }());
});

const refreshCache = async (request, response) => {
  const cache = await caches.open(`STATIC_V1.0`);
  return cache.put(request, response.clone());
};
