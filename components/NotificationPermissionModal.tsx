// components/NotificationPermissionModal.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Sparkles } from 'lucide-react'
import { usePushNotification } from '@/hooks/usePushNotification'

export default function NotificationPermissionModal() {
  const { isSubscribed, permission, loading, subscribe } = usePushNotification()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isSubscribed || permission === 'denied') return

    const timer = setTimeout(() => setShow(true), 3000)
    return () => clearTimeout(timer)
  }, [isSubscribed, permission])

  const handleSubscribe = async () => {
    const success = await subscribe()
    if (success) {
      setShow(false)
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShow(false)}
          />

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-gray-950/95 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 shadow-2xl shadow-black/40 max-w-sm w-full z-10 overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/[0.06] rounded-xl transition text-gray-500 hover:text-white z-10"
            >
              <X size={18} />
            </button>

            <div className="relative text-center mb-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="relative inline-block mb-5"
              >
                <div className="absolute inset-0 bg-blue-500/25 rounded-2xl blur-xl animate-pulse" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/10">
                  <Bell size={30} className="text-white" />
                </div>
              </motion.div>

              <h3 className="text-lg font-bold mb-2">
                <Sparkles size={16} className="inline text-cyan-400 mr-1" />
                Aktifkan Notifikasi
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Dapatkan notifikasi real-time saat bot terhubung, update fitur, dan info penting lainnya.
              </p>
            </div>

            <div className="relative space-y-2.5">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl font-semibold text-sm text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles size={16} />
                    </motion.div>
                    Mengaktifkan...
                  </>
                ) : (
                  <>
                    <Bell size={16} />
                    Aktifkan Notifikasi
                  </>
                )}
              </motion.button>

              <button
                onClick={() => setShow(false)}
                className="w-full py-3 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] rounded-2xl font-semibold text-sm text-gray-400 hover:text-gray-200 transition-all"
              >
                Nanti Saja
              </button>
            </div>

            <p className="text-[10px] text-gray-600 text-center mt-4">
              Kamu bisa mengubahnya kapan saja di Settings.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
