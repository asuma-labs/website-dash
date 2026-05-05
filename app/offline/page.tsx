// app/offline/page.tsx
'use client'

import { motion } from 'framer-motion'
import { WifiOff, RefreshCw, Home, Bot } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function OfflinePage() {
  const [reloading, setReloading] = useState(false)

  const handleReload = () => {
    setReloading(true)
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-950 flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="relative w-full max-w-md"
      >
        <div className="relative bg-gray-950/70 backdrop-blur-3xl border border-white/[0.08] rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/40 overflow-hidden text-center">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative inline-flex items-center justify-center mb-6"
            >
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center border-2 border-blue-500/30">
                <WifiOff size={40} className="text-cyan-400" />
              </div>
            </motion.div>

            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Tidak Ada Koneksi
            </h1>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Sepertinya kamu sedang offline. Periksa koneksi internet kamu dan coba lagi.
            </p>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleReload}
                disabled={reloading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl font-semibold text-sm text-white hover:shadow-2xl hover:shadow-blue-500/25 transition-all disabled:opacity-50"
              >
                {reloading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <RefreshCw size={18} />
                    </motion.div>
                    Menghubungkan...
                  </>
                ) : (
                  <>
                    <RefreshCw size={18} />
                    Coba Lagi
                  </>
                )}
              </motion.button>

              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl font-medium text-sm text-gray-300 hover:bg-white/[0.06] hover:border-blue-500/20 transition-all"
              >
                <Home size={18} />
                Kembali ke Beranda
              </Link>
            </div>

            <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Bot size={20} className="text-blue-400" />
                <p className="text-sm font-medium text-blue-400">Asuma MD</p>
              </div>
              <p className="text-xs text-gray-500 text-left">
                Beberapa fitur mungkin tetap bisa diakses dari cache. Dashboard dan pengaturan bot tetap tersedia saat offline.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
