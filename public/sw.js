// public/sw.js
const CACHE_NAME = 'asuma-bot-v2'
const OFFLINE_URL = '/offline'

const STATIC_ASSETS = [
  '/',
  '/login',
  '/jadibot',
  '/offline.html',
  '/icons/android-chrome-192x192.png',
  '/icons/android-chrome-512x512.png',
]

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  )
  self.clients.claim()
})

// Fetch
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(r => { caches.open(CACHE_NAME).then(c => c.put(event.request, r.clone())); return r })
        .catch(() => caches.match(event.request))
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request).then(networkResponse => {
        caches.open(CACHE_NAME).then(c => c.put(event.request, networkResponse.clone()))
        return networkResponse
      }).catch(() => {
        if (event.request.destination === 'document') return caches.match(OFFLINE_URL)
      })
      return cached || fetched
    })
  )
})
