// app/faq/cara-jadibot/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cara Jadibot - Asuma MD',
}

const faqs = [
  { q: 'Bagaimana cara daftar?', a: 'Kirim .daftar username|password ke bot utama Asuma. Contoh: .daftar ditss|rahasia123' },
  { q: 'Bagaimana cara buat bot?', a: 'Login ke dashboard → klik "Tambah Bot" → masukkan nomor WhatsApp → dapatkan kode pairing → masukkan di WhatsApp → selesai!' },
  { q: 'Berapa banyak bot yang bisa dibuat?', a: 'Free: 2 bot. Premium: unlimited.' },
  { q: 'Apakah bisa pakai WhatsApp Business?', a: 'Ya! WA Messenger & WA Business keduanya support.' },
]

export default function CaraJadibotPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/faq" className="text-emerald-400 text-sm hover:underline mb-8 inline-block">← FAQ</Link>
        <h1 className="text-4xl font-bold mb-4">Cara Jadibot</h1>
        <div className="space-y-4 mt-8">
          {faqs.map((f, i) => (
            <div key={i} className="bg-gray-900/80 border border-gray-800/50 rounded-2xl p-5">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="text-gray-400 text-sm mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
