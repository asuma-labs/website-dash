// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Asuma MD',
  description: 'WhatsApp Bot Multi-Device Dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-950 text-white antialiased">{children}</body>
    </html>
  )
}
