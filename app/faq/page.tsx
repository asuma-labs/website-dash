// app/faq/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ - Asuma MD',
  description: 'Pertanyaan yang sering diajukan tentang Asuma MD.',
}

const categories = [
  { title: 'Cara Jadibot', desc: 'Cara membuat bot, pairing code, clone nomor', href: '/faq/cara-jadibot' },
  { title: 'Pairing & Koneksi', desc: 'Masalah pairing, bot offline, reconnect', href: '/faq/pairing' },
  { title: 'Keamanan & Privasi', desc: 'Enkripsi, data, keamanan akun', href: '/faq/keamanan' },
  { title: 'Premium & Limit', desc: 'Upgrade, limit, fitur premium', href: '/faq/premium' },
]

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-emerald-400 text-sm hover:underline mb-8 inline-block">← Kembali</Link>
        <h1 className="text-4xl font-bold mb-4">FAQ</h1>
        <p className="text-gray-400 mb-10">Pilih kategori pertanyaan</p>

        <div className="space-y-4">
          {categories.map((cat) => (
            <Link key={cat.href} href={cat.href} className="bg-gray-900/80 border border-gray-800/50 rounded-2xl p-5 flex items-center justify-between hover:border-emerald-500/20 transition-all group">
              <div>
                <h3 className="font-semibold text-lg">{cat.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{cat.desc}</p>
              </div>
              <ArrowRight size={18} className="text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
