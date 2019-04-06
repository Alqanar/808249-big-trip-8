self.addEventListener(`install`, (event) => {
  const openCache = caches.open(`STATIC_V1.0`)
    .then((cache) => {
      return cache.addAll([
        `/`,
        `/index.html`,
        `/css/flatpickr.min.css`,
        `/css/main.css`,
        `/css/normalize.css`,
        `/img/star--check.svg`,
        `/img/star.svg`,
        `/bundle.js`
      ]);
    });
  event.waitUntil(openCache);
});

self.addEventListener(`fetch`, (event) => {
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
  if (request.method !== `PUT`) {
    const cache = await caches.open(`STATIC_V1.0`);
    return cache.put(request, response.clone());
  }
  return Promise.resolve();
};
