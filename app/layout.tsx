// app/layout.tsx
import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Asuma - Layanan Bot WhatsApp Premium',
    template: '%s | Asuma',
  },
  description:
    'Layanan bot WhatsApp terpercaya untuk bisnis & pribadi. Jadibot instan, pairing cepat, online 24 jam.',
  keywords: [
    'whatsapp bot', 'jadibot whatsapp', 'bot wa indonesia', 'asuma bot',
    'pairing code whatsapp', 'jadibot clone', 'downloader instagram',
    'downloader tiktok', 'bot whatsapp premium',
  ],
  authors: [{ name: 'Asuma Team' }],
  creator: 'Asuma Team',
  publisher: 'Asuma',
  metadataBase: new URL('https://asuma.my.id'),
  alternates: { canonical: 'https://asuma.my.id' },

  // ✅ manifest dipindah ke sini
  manifest: '/manifest.webmanifest',

  // ✅ PWA meta via appLinks / other
  applicationName: 'Asuma Bot',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Asuma Bot',
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
    title: 'Asuma - Bot WhatsApp Premium',
    description: 'Jadibot WhatsApp instan & premium',
    images: ['/icons/android-chrome-512x512.png'],
  },
  verification: {
    google: 'hMmtzBFUiEDI1-fsDioUzB0VgKiARhdFCaAwKIBmEJw',
  },

  // ✅ robots dipisah lebih proper
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },

  icons: {
    icon: [
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon.ico' },
    ],
    shortcut: '/icons/favicon.ico',
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  category: 'technology',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4f46e5' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* ✅ Hanya tag yang belum bisa di-handle Metadata API */}
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {})
                })
              }
            `,
          }}
        />
      </head>

      <body className={`${inter.variable} font-sans antialiased bg-gray-950 text-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="asuma-theme"
        >
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
/*
// app/layout.tsx
import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Asuma - Layanan Bot WhatsApp Premium',
    template: '%s | Asuma',
  },
  description:
    'Layanan bot WhatsApp terpercaya untuk bisnis & pribadi. Jadibot instan, pairing cepat, online 24 jam.',
  keywords: [
    'whatsapp bot',
    'jadibot whatsapp',
    'bot wa indonesia',
    'asuma bot',
    'pairing code whatsapp',
    'jadibot clone',
    'downloader instagram',
    'downloader tiktok',
    'bot whatsapp premium',
  ],
  authors: [{ name: 'Asuma Team' }],
  creator: 'Asuma Team',
  publisher: 'Asuma',
  metadataBase: new URL('https://asuma.my.id'),
  alternates: {
    canonical: 'https://asuma.my.id',
  },
  manifest: '/manifest.webmanifest',
  applicationName: 'Asuma Bot',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Asuma Bot',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  icons: {
    icon: [
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon.ico' },
    ],
    shortcut: '/icons/favicon.ico',
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  verification: {
    google: 'hMmtzBFUiEDI1-fsDioUzB0VgKiARhdFCaAwKIBmEJw',
  },
  category: 'technology',
}

// ❌ JANGAN SET openGraph & twitter di sini!
// ❌ JANGAN SET openGraph & twitter di sini!
// ❌ JANGAN SET openGraph & twitter di sini!

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4f46e5' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {})
                })
              }
            `,
          }}
        />
      </head>

      <body
        className={`${inter.variable} font-sans antialiased bg-gray-950 text-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="asuma-theme"
        >
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}*/
