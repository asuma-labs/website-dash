// app/[username]/bots/new/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Copy, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function NewBotPage() {
  const { username } = useParams() as { username: string }
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pairingCode, setPairingCode] = useState('')
  const [botId, setBotId] = useState('')
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  const startPolling = (id: string) => {
    let attempts = 0
    pollRef.current = setInterval(async () => {
      attempts++
      
      const { data: bot } = await supabase
        .from('bot_instances')
        .select('status, pairing_code')
        .eq('id', id)
        .single()

      if (!bot) return

      if (bot.status === 'pairing_code' && bot.pairing_code) {
        setPairingCode(bot.pairing_code)
        setLoading(false)
        if (pollRef.current) clearInterval(pollRef.current)
      }

      if (bot.status === 'connected') {
        if (pollRef.current) clearInterval(pollRef.current)
        router.push(`/${username}/bots/${id}`)
      }

      if (bot.status === 'failed') {
        setError('Gagal membuat pairing. Coba lagi.')
        setLoading(false)
        if (pollRef.current) clearInterval(pollRef.current)
      }

      if (attempts > 30) {
        setError('Timeout. Coba lagi.')
        setLoading(false)
        if (pollRef.current) clearInterval(pollRef.current)
      }
    }, 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setPairingCode('')

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
    startPolling(data.bot_instance_id)
  }

  const copyPairingCode = () => {
    navigator.clipboard.writeText(pairingCode.replace(/ - /g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
                placeholder="6281513607731"
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
                  Menunggu pairing code...
                </>
              ) : (
                'Buat Bot'
              )}
            </button>

            {loading && (
              <div className="text-center py-4 space-y-2">
                <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  Bot server sedang memproses...
                </div>
                <p className="text-xs text-gray-600">Mengambil kode pairing dari server bot...</p>
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
              className="text-7xl mb-6"
            >
              🔑
            </motion.div>

            <h2 className="text-xl font-bold mb-2">Kode Pairing</h2>
            <p className="text-gray-400 mb-6 text-sm">
              Masukkan kode ini di WhatsApp kamu
            </p>

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
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                {copied ? (
                  <Check size={18} className="text-emerald-400" />
                ) : (
                  <Copy size={18} className="text-gray-400" />
                )}
              </div>
            </motion.div>

            <p className="text-xs text-gray-500 mt-2">
              Klik kode untuk copy • Buka WhatsApp → Perangkat Tertaut → Tautkan Perangkat
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
