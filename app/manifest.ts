import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: 'asuma-bot',
    name: 'Asuma Bot - WhatsApp Multi Device',
    short_name: 'Asuma Bot',
    description: 'Jadibot WhatsApp Premium • Pairing Code Instan • 1000+ Fitur • Selalu Online 24 Jam • Downloader IG, TikTok & YouTube',
    
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    orientation: 'portrait-primary',
    lang: 'id',
    dir: 'ltr',

    background_color: '#0f172a',
    theme_color: '#4f46e5',
    categories: ['productivity', 'utilities', 'communication', 'business', 'social'],

    icons: [
      {
        src: '/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
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
      {
        src: '/icons/icon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
    ],

    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        url: '/dashboard',
        description: 'Kelola semua bot Anda',
        icons: [{ src: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Jadibot Baru',
        short_name: 'Jadibot',
        url: '/jadibot',
        description: 'Buat bot WhatsApp dalam 10 detik',
        icons: [{ src: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Pricing & Paket',
        short_name: 'Pricing',
        url: '/pricing',
        description: 'Lihat paket premium',
        icons: [{ src: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Status Server',
        short_name: 'Status',
        url: '/status',
        description: 'Cek server & uptime',
        icons: [{ src: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
    ],

    prefer_related_applications: false,
    related_applications: [],
  }
}
