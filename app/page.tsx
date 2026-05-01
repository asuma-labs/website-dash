// app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-green-400">🤖 Asuma MD</h1>
          <Link
            href="/login"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition text-sm"
          >
            Login Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            WhatsApp Bot <span className="text-green-400">Multi-Device</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Clone bot WhatsApp dengan fitur lengkap. Game economy, auto respond, anti call, dan masih banyak lagi.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition font-medium"
            >
              Mulai Sekarang
            </Link>
            <a
              href="https://whatsapp.com/channel/0029VaN28lnGU3BROmG4Tx3j"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition font-medium border border-gray-700"
            >
              Channel WhatsApp
            </a>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-16">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-4xl mb-4">🔑</p>
            <h3 className="text-lg font-semibold mb-2">Pairing Code</h3>
            <p className="text-gray-400 text-sm">Hubungkan bot tanpa scan QR. Cukup masukkan kode pairing.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-4xl mb-4">🎮</p>
            <h3 className="text-lg font-semibold mb-2">Game Economy</h3>
            <p className="text-gray-400 text-sm">Level, money, inventory, daily rewards, dan berbagai mini games.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-4xl mb-4">⚙️</p>
            <h3 className="text-lg font-semibold mb-2">Auto Features</h3>
            <p className="text-gray-400 text-sm">Auto read, auto typing, auto react story, anti call & spam.</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Cara Memulai</h3>
          <div className="grid grid-cols-3 gap-8 mt-8">
            <div>
              <p className="text-3xl font-bold text-green-400 mb-2">1</p>
              <p className="font-medium">Chat Bot Utama</p>
              <p className="text-gray-400 text-sm mt-1">Kirim .daftar username password</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400 mb-2">2</p>
              <p className="font-medium">Klik Link Login</p>
              <p className="text-gray-400 text-sm mt-1">Buka magic link dari bot</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400 mb-2">3</p>
              <p className="font-medium">Atur Bot Kamu</p>
              <p className="text-gray-400 text-sm mt-1">Tambah bot clone & setting sesukamu</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Asuma MD. All rights reserved.</p>
      </footer>
    </div>
  )
}
