// app/faq/cara-jadibot/metadata.ts
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cara Jadibot',
  description:
    'Panduan lengkap cara membuat bot WhatsApp dengan Asuma MD. Daftar, pairing, sampai online dalam 4 langkah.',
  alternates: {
    canonical: 'https://asuma.my.id/faq/cara-jadibot',
  },
  openGraph: {
    title: 'Cara Jadibot - Panduan Lengkap | Asuma',
    description: 'Panduan lengkap cara membuat bot WhatsApp dengan Asuma MD.',
    url: 'https://asuma.my.id/faq/cara-jadibot',
    siteName: 'Asuma',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/icons/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'Asuma Bot WhatsApp Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cara Jadibot - Panduan Lengkap | Asuma',
    description: 'Panduan lengkap cara membuat bot WhatsApp dengan Asuma MD.',
    images: ['/icons/android-chrome-512x512.png'],
  },
}
