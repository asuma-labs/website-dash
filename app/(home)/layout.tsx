// app/(home)/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  openGraph: {
    title: 'Asuma - Layanan Bot WhatsApp Premium',
    description:
      'Layanan bot WhatsApp terpercaya untuk bisnis & pribadi. Jadibot instan, pairing cepat, online 24 jam.',
    url: 'https://asuma.my.id',
    siteName: 'Asuma',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: 'https://asuma.my.id/og?title=Asuma%20-%20Bot%20WhatsApp%20Premium&desc=Jadibot%20instan%2C%20pairing%20cepat%2C%20online%2024%20jam&subtitle=asuma.my.id',
        width: 1200,
        height: 630,
        alt: 'Asuma - Bot WhatsApp Premium | Jadibot Instan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Asuma - Bot WhatsApp Premium',
    description:
      'Jadibot WhatsApp instan & premium. Pairing cepat, online 24 jam.',
    images: [
      'https://asuma.my.id/og?title=Asuma%20-%20Bot%20WhatsApp%20Premium&desc=Jadibot%20instan%2C%20pairing%20cepat%2C%20online%2024%20jam&subtitle=asuma.my.id',
    ],
  },
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
