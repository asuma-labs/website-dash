// app/auth/magic/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, LogIn, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function MagicContent() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [message, setMessage] = useState('Memverifikasi token...')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token tidak ditemukan')
      return
    }

    const verifyToken = async () => {
      try {
        const res = await fetch('/api/auth/magic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        const data = await res.json()

        if (!res.ok) {
          setStatus('error')
          setMessage(data.error || 'Token tidak valid')
          return
        }

        if (!data.access_token) {
          setStatus('error')
          setMessage('Gagal mendapatkan session')
          return
        }

        await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        })

        setStatus('success')
        setMessage('Login berhasil! Mengalihkan...')

        setTimeout(() => {
          window.location.href = `/${data.username}`
        }, 1000)
      } catch (err) {
        setStatus('error')
        setMessage('Gagal menghubungi server')
      }
    }

    verifyToken()
  }, [token])

  return (
    <div className="text-center">
      {status === 'loading' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="relative inline-block mb-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-[2px]">
              <div className="w-full h-full rounded-2xl bg-gray-950 flex items-center justify-center">
                <Loader2 size={32} className="text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div className="absolute -inset-3 bg-blue-500/20 rounded-3xl blur-xl animate-pulse" />
          </motion.div>
          <p className="text-white text-lg font-medium">{message}</p>
          <p className="text-gray-500 text-sm mt-2">Mohon tunggu sebentar</p>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="relative inline-block mb-6"
          >
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl" />
            <div className="relative w-20 h-20 bg-red-500/10 border-2 border-red-500/30 rounded-full flex items-center justify-center">
              <XCircle size={40} className="text-red-400" />
            </div>
          </motion.div>
          <p className="text-white text-lg font-medium mb-2">{message}</p>
          <p className="text-gray-500 text-sm mb-6">Silakan coba login ulang atau minta token baru</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl font-semibold text-sm text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            <ArrowLeft size={16} />
            Kembali ke Login
          </Link>
        </motion.div>
      )}

      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="relative inline-block mb-6"
          >
            <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-2xl" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25">
              <CheckCircle size={40} className="text-white" />
            </div>
          </motion.div>
          <p className="text-white text-lg font-medium">{message}</p>
          <div className="flex justify-center mt-4">
            <motion.div
              className="w-32 h-1 bg-white/[0.06] rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default function MagicPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-slate-950 to-gray-950 p-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="w-full max-w-md relative"
      >
        <div className="relative bg-gray-950/70 backdrop-blur-3xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl shadow-black/40 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="relative inline-flex items-center justify-center mb-5"
              >
                <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-xl" />
                <div className="relative w-14 h-14 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 border border-white/15 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent" />
                  <LogIn size={28} className="text-white relative z-10" />
                </div>
              </motion.div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Asuma MD
              </h1>
              <p className="text-gray-500 text-sm mt-1">Magic Link Verification</p>
            </div>

            <Suspense
              fallback={
                <div className="text-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"
                  />
                  <p className="text-gray-400 text-sm">Loading...</p>
                </div>
              }
            >
              <MagicContent />
            </Suspense>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
