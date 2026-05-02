// app/[username]/bots/[botId]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Settings, Users, BarChart3, StopCircle, Trash2, Loader2 } from 'lucide-react'

export default function BotDetailPage() {
  const { username, botId } = useParams() as { username: string; botId: string }
  const router = useRouter()
  const [bot, setBot] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stopping, setStopping] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBot()
    const interval = setInterval(fetchBot, 5000)
    return () => clearInterval(interval)
  }, [botId])

  const fetchBot = async () => {
    try {
      const res = await fetch(`/api/bots/${botId}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Bot tidak ditemukan')
        setBot(null)
      } else {
        setBot(data.bot)
        setError('')
      }
    } catch (err) {
      setError('Gagal mengambil data bot')
    }
    setLoading(false)
  }

  const stopBot = async () => {
    setStopping(true)
    await fetch(`/api/bots/${botId}/stop`, { method: 'POST' })
    setTimeout(fetchBot, 1500)
    setStopping(false)
  }

  const deleteBot = async () => {
    if (!confirm('Yakin hapus bot ini?')) return
    setDeleting(true)
    const res = await fetch(`/api/bots/${botId}/delete`, { method: 'DELETE' })
    if (res.ok) router.push(`/${username}/bots`)
    setDeleting(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-emerald-400" />
      </div>
    )
  }

  if (error || !bot) {
    return (
      <div className="text-center py-20">
        <p className="text-6xl mb-4">🤷</p>
        <p className="text-gray-400 text-lg mb-2">{error || 'Bot tidak ditemukan'}</p>
        <Link href={`/${username}/bots`} className="text-emerald-400 hover:underline text-sm">
          ← Kembali ke daftar bot
        </Link>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <Link href={`/${username}/bots`} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
        <ArrowLeft size={20} />
        <span className="text-sm">Kembali</span>
      </Link>

      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
              bot.status === 'connected' ? 'bg-emerald-500/20' :
              bot.status === 'pairing_code' ? 'bg-amber-500/20' : 'bg-gray-500/20'
            }`}>
              🤖
            </div>
            <div>
              <h1 className="text-2xl font-bold">{bot.bot_name || 'Asuma Bot'}</h1>
              <p className="text-gray-400">{bot.phone_number}</p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 w-fit ${
            bot.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400' :
            bot.status === 'pairing_code' ? 'bg-amber-500/10 text-amber-400' : 'bg-gray-500/10 text-gray-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${bot.status === 'connected' ? 'bg-emerald-400 animate-pulse' : ''}`} />
            {bot.status === 'pairing_code' ? 'Pairing' : bot.status === 'connected' ? 'Online' : bot.status}
          </span>
        </div>

        {bot.status === 'pairing_code' && bot.pairing_code && (
          <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 mb-6 text-center">
            <p className="text-sm text-amber-400 mb-2">Kode Pairing</p>
            <p className="text-4xl font-mono font-bold text-emerald-400 tracking-widest">{bot.pairing_code}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Link href={`/${username}/bots/${botId}/settings`} className="bg-gray-800/50 hover:bg-gray-800 rounded-2xl p-4 text-center transition">
            <Settings size={24} className="mx-auto mb-2 text-blue-400" />
            <p className="text-sm font-medium">Settings</p>
          </Link>
          <Link href={`/${username}/bots/${botId}/users`} className="bg-gray-800/50 hover:bg-gray-800 rounded-2xl p-4 text-center transition">
            <Users size={24} className="mx-auto mb-2 text-emerald-400" />
            <p className="text-sm font-medium">Users</p>
          </Link>
          <Link href={`/${username}/bots/${botId}/stats`} className="bg-gray-800/50 hover:bg-gray-800 rounded-2xl p-4 text-center transition">
            <BarChart3 size={24} className="mx-auto mb-2 text-purple-400" />
            <p className="text-sm font-medium">Statistik</p>
          </Link>
        </div>

        <div className="flex gap-3">
          <button onClick={stopBot} disabled={stopping || bot.status !== 'connected'}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-2xl font-medium text-sm transition disabled:opacity-50">
            {stopping ? <Loader2 size={18} className="animate-spin" /> : <StopCircle size={18} />}
            Stop Bot
          </button>
          <button onClick={deleteBot} disabled={deleting}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl font-medium text-sm transition disabled:opacity-50">
            {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            Hapus Bot
          </button>
        </div>
      </div>
    </motion.div>
  )
}
