// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    default: 'Asuma - Layanan Bot WhatsApp Premium',
    template: '%s | Asuma',
  },
  description: 'Layanan bot WhatsApp terpercaya untuk bisnis & pribadi. Jadibot instan, pairing cepat, online 24 jam.',
  keywords: [
    'whatsapp bot', 'jadibot whatsapp', 'bot wa indonesia', 'asuma bot',
    'pairing code whatsapp', 'jadibot clone',
  ],
  authors: [{ name: 'Asuma Team' }],
  creator: 'Asuma Team',
  alternates: {
    canonical: 'https://asuma.my.id',
  },
  openGraph: {
    title: 'Asuma - Layanan Bot WhatsApp Premium',
    description: 'Jasa jadibot WhatsApp cepat, aman, dan stabil.',
    url: 'https://asuma.my.id',
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
    title: 'Asuma Bot WhatsApp',
    description: 'Jadibot WhatsApp instan & premium',
    images: ['/icons/android-chrome-512x512.png'],
  },
  icons: {
    icon: [
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4f46e5' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Asuma Bot" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Asuma Bot" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
