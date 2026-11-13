// Batimove Service Worker for PWA (v3 - Production Offline Support & Dev Bypass)
const isLocalhost = Boolean(
  self.location.hostname === 'localhost' ||
  self.location.hostname === '127.0.0.1' ||
  self.location.hostname === '[::1]'
);

if (isLocalhost) {
  // On localhost/dev: completely bypass service worker, delete all caches, and unregister
  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        .then(() => self.registration.unregister())
        .then(() => self.clients.claim())
    );
  });
} else {
  // Production PWA caching
  // v13: só /assets/ (nomes com hash) é servido do cache primeiro. O resto
  // (imagens de public/, sitemap, manifest) vai à rede primeiro, senão uma
  // imagem trocada mantendo o nome nunca chegava a quem já visitou o site.
  const CACHE_NAME = 'batimove-v13';
  const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/site.webmanifest',
    '/favicon-48x48.png',
    '/favicon-192x192.png',
    '/favicon-512x512.png',
    '/apple-touch-icon.png',
    '/batimove-logo.png'
  ];

  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      }).then(() => self.skipWaiting())
    );
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      }).then(() => self.clients.claim())
    );
  });

  self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Never intercept or cache Vite internals, TypeScript files, or Supabase API calls
    if (
      url.pathname.includes('/@vite') ||
      url.pathname.includes('/@fs') ||
      url.pathname.includes('/@id') ||
      url.pathname.endsWith('.ts') ||
      url.pathname.endsWith('.tsx') ||
      url.hostname.includes('supabase.co') ||
      url.pathname.startsWith('/api')
    ) {
      return;
    }

    // HTML navigations: network first, fallback to cached index.html
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request).catch(() => caches.match('/index.html'))
      );
      return;
    }

    // Outras origens (Google, EmailJS): não intercepta.
    if (url.origin !== self.location.origin) return;

    const guardar = (response) => {
      if (response && response.status === 200 && response.type === 'basic') {
        const copia = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
      }
      return response;
    };

    // /assets/: o nome muda a cada build, então o conteúdo de um nome nunca muda.
    if (url.pathname.startsWith('/assets/')) {
      event.respondWith(
        caches.match(event.request).then((cached) => cached || fetch(event.request).then(guardar))
      );
      return;
    }

    // Demais arquivos: rede primeiro, cache só quando estiver offline.
    event.respondWith(
      fetch(event.request)
        .then(guardar)
        .catch(() => caches.match(event.request))
    );
  });
}
