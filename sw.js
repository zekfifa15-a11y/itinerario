/* İstanbul · A dois — service worker (offline-first) */
const CORE = 'ist-core-5d1d568096';
const MAP = 'ist-map-v1';           // filled by the app's "offline map" download; kept across updates
const ASSETS = [
 "./",
 "./index.html",
 "./app.css",
 "./app.js",
 "./data.js",
 "./manifest.webmanifest",
 "./favicon.svg",
 "./vendor/maplibre-gl.js",
 "./vendor/maplibre-gl.css",
 "./vendor/pmtiles.js",
 "./fonts/fraunces-latin-ext-wght-normal.woff2",
 "./fonts/fraunces-latin-wght-italic.woff2",
 "./fonts/fraunces-latin-wght-normal.woff2",
 "./fonts/manrope-latin-ext-wght-normal.woff2",
 "./fonts/manrope-latin-wght-normal.woff2",
 "./icons/apple-touch-icon.png",
 "./icons/icon-192.png",
 "./icons/icon-512.png",
 "./icons/icon-96.png",
 "./icons/icon-maskable-512.png",
 "./img/akaretler.webp",
 "./img/antoine.webp",
 "./img/arasta.webp",
 "./img/balat.webp",
 "./img/beyazit.webp",
 "./img/beyzade.webp",
 "./img/blue.webp",
 "./img/buyukada.webp",
 "./img/camondo.webp",
 "./img/carrefour.webp",
 "./img/cistern.webp",
 "./img/cisterna-food.webp",
 "./img/crimean.webp",
 "./img/cruise.webp",
 "./img/dogaciyiz.webp",
 "./img/dolma.webp",
 "./img/draperis.webp",
 "./img/emek-borek.webp",
 "./img/galataport.webp",
 "./img/george-fener.webp",
 "./img/grand.webp",
 "./img/gulhane.webp",
 "./img/hafiz.webp",
 "./img/hagia.webp",
 "./img/hamam.webp",
 "./img/hovhannes.webp",
 "./img/iron.webp",
 "./img/istiklal.webp",
 "./img/kadikoy.webp",
 "./img/kalender.webp",
 "./img/kumkapi-church.webp",
 "./img/kuzguncuk.webp",
 "./img/lades-menemen.webp",
 "./img/laleli.webp",
 "./img/macro.webp",
 "./img/mivan.webp",
 "./img/moda.webp",
 "./img/modern.webp",
 "./img/moise.webp",
 "./img/namli.webp",
 "./img/oakberry.webp",
 "./img/ortakoy.webp",
 "./img/panagia-pera.webp",
 "./img/patata.webp",
 "./img/pera-antakya.webp",
 "./img/sahaf.webp",
 "./img/sahan.webp",
 "./img/saint.webp",
 "./img/salacak.webp",
 "./img/sehzade.webp",
 "./img/semolina.webp",
 "./img/spice.webp",
 "./img/suleymaniye.webp",
 "./img/tahta.webp",
 "./img/takavor.webp",
 "./img/tomtom.webp",
 "./img/topkapi.webp",
 "./img/triada-kadikoy.webp",
 "./img/triada-taksim.webp",
 "./img/university.webp",
 "./img/uskudar.webp",
 "./img/valens.webp",
 "./img/vefa.webp",
 "./img/walton.webp",
 "./img/yesim.webp"
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CORE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))));
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CORE && k !== MAP) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });
async function rangeFrom(resp, range) {
  const blob = await resp.blob(); const m = /bytes=(\d+)-(\d*)/.exec(range || '');
  if (!m) return new Response(blob, { status: 200 });
  const start = +m[1], end = m[2] ? Math.min(+m[2], blob.size - 1) : blob.size - 1;
  return new Response(blob.slice(start, end + 1), { status: 206, headers: { 'Content-Range': `bytes ${start}-${end}/${blob.size}`, 'Content-Length': String(end - start + 1), 'Content-Type': 'application/octet-stream' } });
}
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  const range = req.headers.get('range');
  if (range) {
    e.respondWith((async () => { const hit = await caches.match(url.href, { ignoreSearch: true }); return hit ? rangeFrom(hit, range) : fetch(req); })());
    return;
  }
  if (url.pathname.includes('/map/')) {               // map pack: cache only, else network (no auto-store; the app stores it)
    e.respondWith(caches.match(url.href, { ignoreSearch: true }).then(r => r || fetch(req)));
    return;
  }
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cached = await caches.match('./index.html', { ignoreSearch: true }) || await caches.match('./', { ignoreSearch: true });
      const net = fetch(req).then(r => { if (r.ok) caches.open(CORE).then(c => c.put('./index.html', r.clone())); return r; }).catch(() => null);
      return cached || (await net) || new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    })());
    return;
  }
  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try { const r = await fetch(req); if (r.ok && r.type === 'basic') { const c = await caches.open(CORE); c.put(req, r.clone()); } return r; }
    catch (err) { return new Response('', { status: 504 }); }
  })());
});
