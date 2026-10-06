// Service worker do Sim Sim.
// - Navegação: rede primeiro; sem internet, mostra /offline (ou a home em cache).
// - Assets estáticos (/_next/static, ícones): cache primeiro.
// - NUNCA toca em /api (dados e respostas são sempre em tempo real).
const VERSION = 'v1';
const STATIC = `simsim-static-${VERSION}`;
const PAGES = `simsim-pages-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((c) => c.addAll(['/offline', '/']))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => ![STATIC, PAGES].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (url.pathname === '/' && res.ok) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put('/', copy));
          }
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(PAGES);
          return (url.pathname === '/' && (await cache.match('/'))) || (await cache.match('/offline'));
        }),
    );
    return;
  }

  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/pwa-icon/')) {
    event.respondWith(
      caches.open(STATIC).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      }),
    );
  }
});
