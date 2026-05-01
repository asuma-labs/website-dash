import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: 'asuma-bot',
    name: 'Asuma Bot - WhatsApp Multi Device',
    short_name: 'Asuma Bot',
    description: 'Bot WhatsApp Multi-Device dengan 100+ fitur premium. Selalu online, aman, dan cepat.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    lang: 'id',
    dir: 'ltr',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    categories: ['productivity', 'utilities', 'communication', 'business'],

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
    ],

    shortcuts: [
      {
        name: 'Dashboard',
        url: '/dashboard',
        description: 'Buka dashboard Asuma',
        icons: [{ src: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' }],
      },
      {
        name: 'Clone Bot',
        url: '/jadibot',
        description: 'Mulai cloning bot WhatsApp',
        icons: [{ src: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' }],
      },
    ],
  };
}
