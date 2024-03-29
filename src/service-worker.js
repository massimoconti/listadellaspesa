importScripts("/workbox-v3.6.3/workbox-sw.js");

workbox.setConfig({modulePathPrefix: "/workbox-v3.6.3"});

workbox.core.setCacheNameDetails({prefix: "listaspesajs"});

workbox.skipWaiting();

workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

workbox.googleAnalytics.initialize();
