// app/faq/cara-jadibot/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Smartphone, UserPlus, Bot, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cara Jadibot - Panduan Lengkap | Asuma MD',
  description: 'Panduan lengkap cara membuat bot WhatsApp dengan Asuma MD. Mulai dari daftar, pairing code, sampai bot online.',
  openGraph: {
    title: 'Cara Jadibot - Panduan Lengkap | Asuma MD',
    description: 'Panduan lengkap cara membuat bot WhatsApp dengan Asuma MD.',
  },
}

const steps = [
  {
    icon: UserPlus,
    title: 'Daftar Akun',
    desc: 'Kirim .daftar username|password ke bot utama Asuma. Contoh: .daftar ditss|rahasia123',
  },
  {
    icon: Smartphone,
    title: 'Tambah Bot Baru',
    desc: 'Login ke dashboard, klik "Tambah Bot", masukkan nomor WhatsApp yang ingin dijadikan bot.',
  },
  {
    icon: Bot,
    title: 'Dapatkan Pairing Code',
    desc: 'Sistem akan memberikan kode pairing 8 digit. Kode ini berlaku 60 detik.',
  },
  {
    icon: HelpCircle,
    title: 'Hubungkan ke WhatsApp',
    desc: 'Buka WhatsApp → Perangkat Tertaut → Tautkan Perangkat → Masukkan kode pairing → Selesai!',
  },
]

const faqs = [
  { q: 'Bagaimana cara daftar?', a: 'Kirim .daftar username|password ke bot utama Asuma. Contoh: .daftar ditss|rahasia123' },
  { q: 'Bagaimana cara buat bot?', a: 'Login ke dashboard → klik "Tambah Bot" → masukkan nomor WhatsApp → dapatkan kode pairing → masukkan di WhatsApp → selesai!' },
  { q: 'Berapa banyak bot yang bisa dibuat?', a: 'Free: 2 bot. Premium: unlimited.' },
  { q: 'Apakah bisa pakai WhatsApp Business?', a: 'Ya! WA Messenger & WA Business keduanya support.' },
  { q: 'Berapa lama pairing code berlaku?', a: '60 detik. Jika expired, klik "Dapatkan Kode Pairing" lagi.' },
  { q: 'Apakah nomor saya aman?', a: '100% aman. Data tersimpan terenkripsi dan tidak disebarluaskan.' },
]

export default function CaraJadibotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-950 text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/faq"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-8 text-sm"
        >
          <ArrowLeft size={16} />
          FAQ
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Cara Jadibot
          </h1>
          <p className="text-gray-400 text-lg">
            Panduan lengkap membuat bot WhatsApp dengan Asuma MD dalam 4 langkah mudah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-blue-500/20 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                  <step.icon size={20} className="text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded-full">
                      LANGKAH {i + 1}
                    </span>
                    <h3 className="font-semibold text-sm">{step.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <HelpCircle size={24} className="text-cyan-400" />
            Pertanyaan Umum
          </h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-blue-500/20 transition-all"
              >
                <h3 className="font-semibold text-sm mb-1.5">{f.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 text-center">
          <p className="text-gray-300 text-sm mb-3">Sudah siap membuat bot pertamamu?</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl font-semibold text-sm text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            <Bot size={18} />
            Mulai Sekarang
          </Link>
        </div>
      </div>
    </div>
  )
}
