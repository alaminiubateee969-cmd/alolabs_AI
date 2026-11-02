// Keep page navigations network-only: never replay a cached authenticated shell
// or a stale version of the homepage after logout or deployment.
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    // Remove only caches created by the old AgentOS worker; leave unrelated
    // application caches alone. This also removes the legacy cached '/' page.
    await Promise.all(keys.filter((key) => key.startsWith('alo-agentos-')).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

// No fetch handler: navigation, API and asset requests go directly to the
// network, where the server validates each private-page session.
