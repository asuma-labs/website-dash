// public/sw.js
const CACHE_NAME = 'asuma-bot-v3'
const OFFLINE_URL = '/offline'

const STATIC_ASSETS = [
  '/',
  '/login',
  '/jadibot',
  '/offline',
  '/icons/android-chrome-192x192.png',
  '/icons/android-chrome-512x512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((r) => {
          caches.open(CACHE_NAME).then((c) => c.put(event.request, r.clone()))
          return r
        })
        .catch(() => caches.match(event.request))
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request)
        .then((networkResponse) => {
          caches.open(CACHE_NAME).then((c) => c.put(event.request, networkResponse.clone()))
          return networkResponse
        })
        .catch(() => {
          if (event.request.destination === 'document') return caches.match(OFFLINE_URL)
        })
      return cached || fetched
    })
  )
})

self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()

const options = {
  body: data.body || 'Notifikasi dari Asuma MD',
  icon: '/icons/android-chrome-192x192.png',
  badge: '/icons/android-chrome-192x192.png',
  image: data.image || '/icons/android-chrome-512x512.png', // ← TAMBAH
  vibrate: [200, 100, 200],
  tag: data.tag || 'asuma-notif',
  renotify: true,
  requireInteraction: data.requireInteraction || false,
  data: { url: data.url || '/' },
  actions: data.actions || [],
}

  event.waitUntil(self.registration.showNotification(data.title || 'Asuma MD', options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(urlToOpen)
    })
  )
})
