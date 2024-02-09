// const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// // OfflineFallback allows a service worker to serve a web page, image, or font if there is 
// // a routing error for any of the three, for instance if a user is offline and there isn't a cache hit.
// offlineFallback();

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
registerRoute(
    // Callback function that filters the requests that are cached (in this case, JS and CSS files)
    ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
    new StaleWhileRevalidate({
      // Name of the cache storage.
      cacheName: 'asset-cache',
      plugins: [
        // This plugin caches responses with these headers to a maximum-age of 30 days
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
);
