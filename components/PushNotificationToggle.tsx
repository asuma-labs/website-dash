// components/PushNotificationToggle.tsx
'use client'

import { Bell, BellOff, Loader2, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePushNotification } from '@/hooks/usePushNotification'
import { useState } from 'react'

export default function PushNotificationToggle() {
  const { isSubscribed, permission, loading, subscribe, unsubscribe } = usePushNotification()
  const [showPopup, setShowPopup] = useState(false)

  const handleToggle = async () => {
    if (isSubscribed) {
      await unsubscribe()
    } else {
      const success = await subscribe()
      if (success) {
        setShowPopup(true)
        setTimeout(() => setShowPopup(false), 4000)
      }
    }
  }

  if (permission === 'denied') {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
        <BellOff size={16} />
        Notifikasi diblokir
      </div>
    )
  }

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${
          isSubscribed
            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/15'
            : 'bg-white/[0.03] text-gray-400 border border-white/[0.08] hover:border-blue-500/20 hover:bg-white/[0.05]'
        }`}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : isSubscribed ? (
          <Bell size={16} />
        ) : (
          <BellOff size={16} />
        )}
        {loading
          ? isSubscribed
            ? 'Mematikan...'
            : 'Mengaktifkan...'
          : isSubscribed
          ? 'Notifikasi Aktif'
          : 'Aktifkan Notifikasi'}
      </motion.button>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute top-12 right-0 bg-gray-950/95 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-4 shadow-2xl shadow-black/40 z-50 w-72"
          >
            <div className="absolute -top-8 -right-8 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                <Bell size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  <CheckCircle size={14} className="text-cyan-400" />
                  Notifikasi Diaktifkan
                </p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Kamu akan dapat notifikasi saat bot terhubung atau ada update penting.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
