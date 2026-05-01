// app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-950 text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-20 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 -right-20 w-[600px] h-[600px] bg-cyan-500/6 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-indigo-500/4 rounded-full blur-[180px]" />
      </div>

      <header className="relative border-b border-white/[0.06] backdrop-blur-xl bg-gray-950/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-lg group-hover:blur-xl transition-all" />
              <img
                src="/icons/icon.webp"
                alt="Asuma"
                className="relative w-10 h-10 rounded-xl object-cover border border-white/10"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Asuma MD
              </h1>
              <p className="text-[10px] text-gray-500 tracking-wide">Multi-Device Bot</p>
            </div>
          </Link>

          <Link
            href="/login"
            className="relative bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-5 py-2.5 rounded-xl transition text-sm font-medium hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105 active:scale-95 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative">Login Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400 mb-8">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            WhatsApp Multi-Device Platform
          </div>

          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            WhatsApp Bot{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Multi-Device
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Clone bot WhatsApp dengan fitur lengkap. Game economy, auto respond, anti call, dan masih banyak lagi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 text-white px-8 py-4 rounded-2xl transition font-semibold hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105 active:scale-95 text-lg"
            >
              Mulai Sekarang
            </Link>
            <a
              href="https://whatsapp.com/channel/0029VaN28lnGU3BROmG4Tx3j"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/[0.03] hover:bg-white/[0.06] text-white px-8 py-4 rounded-2xl transition font-semibold border border-white/[0.08] hover:border-blue-500/30 text-lg backdrop-blur-xl"
            >
              Channel WhatsApp
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            {
              emoji: '🔑',
              title: 'Pairing Code',
              desc: 'Hubungkan bot tanpa scan QR. Cukup masukkan kode pairing.',
              gradient: 'from-blue-500 to-cyan-500',
              glow: 'group-hover:shadow-blue-500/10',
            },
            {
              emoji: '🎮',
              title: 'Game Economy',
              desc: 'Level, money, inventory, daily rewards, dan berbagai mini games.',
              gradient: 'from-cyan-400 to-teal-500',
              glow: 'group-hover:shadow-cyan-500/10',
            },
            {
              emoji: '⚙️',
              title: 'Auto Features',
              desc: 'Auto read, auto typing, auto react story, anti call & spam.',
              gradient: 'from-sky-400 to-blue-600',
              glow: 'group-hover:shadow-sky-500/10',
            },
          ].map(({ emoji, title, desc, gradient, glow }) => (
            <div
              key={title}
              className={`relative bg-gray-900/60 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 text-center group hover:border-blue-500/20 transition-all duration-500 ${glow}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
              <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-3xl shadow-lg`}>
                {emoji}
              </div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="relative bg-gray-900/60 backdrop-blur-xl border border-white/[0.06] rounded-3xl p-8 md:p-12 text-center overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Cara{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Memulai
              </span>
            </h3>
            <p className="text-gray-500 mb-10">Tiga langkah mudah untuk mulai menggunakan Asuma MD</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Chat Bot Utama',
                  desc: 'Kirim .daftar username password ke nomor bot utama',
                },
                {
                  step: '2',
                  title: 'Klik Link Login',
                  desc: 'Buka magic link yang dikirim bot untuk akses dashboard',
                },
                {
                  step: '3',
                  title: 'Atur Bot Kamu',
                  desc: 'Tambah bot clone & setting semua fitur sesukamu',
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="relative group">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      {step}
                    </span>
                  </div>
                  <p className="font-semibold mb-2">{title}</p>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="relative border-t border-white/[0.06] backdrop-blur-xl bg-gray-950/50">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/icons/asuma.jpg"
              alt="Asuma Logo"
              className="w-8 h-8 rounded-lg object-cover opacity-80"
            />
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Asuma MD. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">Docs</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Support</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
