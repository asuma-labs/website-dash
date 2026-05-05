// app/manifest.ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: 'asuma-bot',
    name: 'Asuma MD - WhatsApp Multi Device',
    short_name: 'Asuma MD',
    description:
      'Bot WhatsApp Premium dengan Pairing Code Instan, 1000+ Fitur, Online 24 Jam, Downloader IG/TikTok/YouTube',

    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    orientation: 'portrait-primary',
    lang: 'id',
    dir: 'ltr',

    background_color: '#030712',
    theme_color: '#2563eb',
    categories: ['productivity', 'utilities', 'communication', 'business', 'social'],

    icons: [
      {
        src: '/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],

    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        url: '/login',
        description: 'Kelola semua bot Anda',
        icons: [{ src: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Buat Bot Baru',
        short_name: 'Buat Bot',
        url: '/login',
        description: 'Buat bot WhatsApp dalam 10 detik',
        icons: [{ src: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
    ],

    prefer_related_applications: false,
    related_applications: [],
  }
}
