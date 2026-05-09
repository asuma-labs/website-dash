// app/faq/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ - Asuma MD',
  description: 'Pertanyaan yang sering diajukan tentang Asuma MD.',
}

const faqs = [
  {
    q: 'Apa itu Asuma MD?',
    a: 'Asuma MD adalah layanan bot WhatsApp multi-device yang bisa kamu clone ke nomor pribadimu. Dilengkapi fitur auto read, auto typing, game economy, dan masih banyak lagi.',
  },
  {
    q: 'Bagaimana cara membuat bot?',
    a: 'Ketik .daftar username|password ke bot utama Asuma, lalu login ke dashboard dan klik "Tambah Bot". Masukkan nomor WhatsApp yang ingin dijadikan bot, dapatkan kode pairing, dan masukkan di WhatsApp kamu.',
  },
  {
    q: 'Apakah gratis?',
    a: 'Ya! Asuma MD gratis dengan limit tertentu. Kamu bisa upgrade ke premium untuk fitur lebih banyak dan limit lebih besar.',
  },
  {
    q: 'Apakah aman?',
    a: '100% aman. Session bot terenkripsi end-to-end. Kami tidak menyimpan pesan pribadi kamu. Data hanya digunakan untuk keperluan bot.',
  },
  {
    q: 'Berapa lama kode pairing berlaku?',
    a: 'Kode pairing berlaku 1 menit. Jika expired, kamu bisa request ulang dari dashboard.',
  },
  {
    q: 'Bagaimana cara stop bot?',
    a: 'Buka dashboard → pilih bot → klik "Stop Bot". Atau dari WhatsApp: Pengaturan → Perangkat Tertaut → klik Logout pada perangkat bot.',
  },
  {
    q: 'Apakah bisa banyak bot dalam 1 akun?',
    a: 'Ya! Kamu bisa membuat beberapa bot clone dengan nomor berbeda dari 1 akun dashboard.',
  },
]

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-emerald-400 text-sm hover:underline mb-8 inline-block">← Kembali</Link>
        <h1 className="text-4xl font-bold mb-4">FAQ</h1>
        <p className="text-gray-400 mb-10">Pertanyaan yang sering diajukan</p>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-gray-900/80 border border-gray-800/50 rounded-2xl p-5">
              <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
              <p className="text-gray-400 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
