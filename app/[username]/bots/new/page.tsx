// app/[username]/bots/new/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Copy, Check, Loader2, Key, Clock } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function NewBotPage() {
  const { username } = useParams() as { username: string }
  const router = useRouter()
  
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pairingCode, setPairingCode] = useState('')
  const [botId, setBotId] = useState('')
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [statusText, setStatusText] = useState('')
  
  const pollRef = useRef<NodeJS.Timeout | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startPolling = (id: string) => {
    let attempts = 0
    pollRef.current = setInterval(async () => {
      attempts++
      
      const res = await fetch(`/api/bots/${id}/status`)
      const data = await res.json()

      if (!res.ok) return

      if (data.status === 'pairing_code' && data.pairing_code) {
        setPairingCode(data.pairing_code)
        setLoading(false)
        setStatusText('')
        startCountdown()
        if (pollRef.current) clearInterval(pollRef.current)
      }

      if (data.status === 'connected') {
        setStatusText('Bot terhubung! Mengalihkan...')
        if (pollRef.current) clearInterval(pollRef.current)
        setTimeout(() => router.push(`/${username}/bots/${id}`), 1500)
      }

      if (data.status === 'failed') {
        setError('Gagal membuat pairing. Silakan coba lagi.')
        setLoading(false)
        if (pollRef.current) clearInterval(pollRef.current)
      }

      if (attempts > 30) {
        setError('Timeout. Silakan coba lagi.')
        setLoading(false)
        if (pollRef.current) clearInterval(pollRef.current)
      }
    }, 2000)
  }

  const startCountdown = () => {
    setTimeLeft(60)
    if (timerRef.current) clearInterval(timerRef.current)
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          setError('Kode pairing expired. Silakan request ulang.')
          setPairingCode('')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setPairingCode('')
    setStatusText('Mengirim request...')

    const cleanPhone = phone.replace(/[^0-9]/g, '')

    const res = await fetch('/api/bots/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: cleanPhone, bot_name: name || 'Asuma Bot' }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Gagal membuat bot')
      setLoading(false)
      return
    }

    setBotId(data.bot_instance_id)
    setStatusText('Menunggu kode pairing dari server bot...')
    startPolling(data.bot_instance_id)
  }

  const copyPairingCode = async () => {
    const rawCode = pairingCode.replace(/ - /g, '')
    await navigator.clipboard.writeText(rawCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const progressPercent = ((60 - timeLeft) / 60) * 100

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <Link
        href={`/${username}/bots`}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={20} />
        <span className="text-sm">Kembali</span>
      </Link>

      <h1 className="text-2xl font-bold mb-8">Tambah Bot Baru</h1>

      <AnimatePresence mode="wait">
        {!pairingCode ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nomor WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="6281234567890"
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Masukkan nomor dengan kode negara (62xxx)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nama Bot (opsional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Asuma Bot"
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl p-4 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {statusText || 'Memproses...'}
                </>
              ) : (
                <>
                  <Key size={20} />
                  Dapatkan Kode Pairing
                </>
              )}
            </button>

            {loading && !pairingCode && (
              <div className="text-center py-4 space-y-2">
                <p className="text-sm text-gray-400">{statusText}</p>
                <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                    animate={{ width: ['0%', '40%', '70%', '90%'] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            )}
          </motion.form>
        ) : (
          <motion.div
            key="pairing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/80 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="relative inline-block mb-6"
            >
              <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                <Key size={40} className="text-white" />
              </div>
            </motion.div>

            <h2 className="text-xl font-bold mb-2">Kode Pairing</h2>
            <p className="text-gray-400 mb-2 text-sm">Masukkan kode ini di WhatsApp kamu</p>

            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock size={16} className="text-amber-400" />
              <span className={`text-sm font-mono font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-amber-400'}`}>
                {timeLeft}s
              </span>
            </div>

            <div className="w-full bg-gray-800 rounded-full h-2 mb-6 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-red-500 rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 mb-4 relative group cursor-pointer"
              onClick={copyPairingCode}
            >
              <p className="text-5xl font-mono font-bold text-emerald-400 tracking-widest">
                {pairingCode}
              </p>
              <div className="absolute top-3 right-3">
                {copied ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check size={20} className="text-emerald-400" />
                  </motion.div>
                ) : (
                  <Copy size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                )}
              </div>
            </motion.div>

            <p className="text-xs text-gray-500">
              Klik kode untuk copy • Buka WhatsApp → Perangkat Tertaut → Tautkan Perangkat
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
