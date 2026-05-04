// app/[username]/bots/[botId]/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Settings, Users, BarChart3, StopCircle, Trash2, Loader2, Bot, Copy, Check, Key } from 'lucide-react'

export default function BotDetailPage() {
  const { username, botId } = useParams() as { username: string; botId: string }
  const router = useRouter()
  const supabase = createClient()
  const [bot, setBot] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stopping, setStopping] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchBot()

    const channel = supabase
      .channel('bot-detail-' + botId)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bot_instances', filter: `id=eq.${botId}` },
        (payload: any) => setBot(payload.new)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
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

  const copyPairingCode = async () => {
    if (!bot?.pairing_code) return
    const rawCode = bot.pairing_code.replace(/ - /g, '')
    await navigator.clipboard.writeText(rawCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="relative"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-[2px]">
            <div className="w-full h-full rounded-2xl bg-gray-950 flex items-center justify-center">
              <Bot size={24} className="text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div className="absolute -inset-2 bg-blue-500/20 rounded-3xl blur-xl animate-pulse" />
        </motion.div>
      </div>
    )
  }

  if (error || !bot) {
    return (
      <div className="text-center py-20">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative inline-block mb-6"
        >
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl" />
          <div className="relative w-24 h-24 bg-white/[0.03] rounded-full flex items-center justify-center border-2 border-dashed border-white/[0.08]">
            <Bot size={40} className="text-gray-600" />
          </div>
        </motion.div>
        <p className="text-gray-400 text-lg mb-2">{error || 'Bot tidak ditemukan'}</p>
        <Link href={`/${username}/bots`} className="text-cyan-400 hover:underline text-sm">Kembali ke daftar bot</Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <Link
        href={`/${username}/bots`}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition"
      >
        <ArrowLeft size={20} />
        <span className="text-sm">Kembali</span>
      </Link>

      <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/[0.06] rounded-3xl p-6 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              bot.status === 'connected'
                ? 'bg-cyan-500/20 shadow-lg shadow-cyan-500/10'
                : bot.status === 'pairing_code'
                ? 'bg-sky-500/20 shadow-lg shadow-sky-500/10'
                : 'bg-gray-500/20'
            }`}>
              <Bot size={32} className={
                bot.status === 'connected'
                  ? 'text-cyan-400'
                  : bot.status === 'pairing_code'
                  ? 'text-sky-400'
                  : 'text-gray-400'
              } />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{bot.bot_name || 'Asuma Bot'}</h1>
              <p className="text-gray-400">{bot.phone_number?.slice(0, 4)}****{bot.phone_number?.slice(-3)}</p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 w-fit border ${
            bot.status === 'connected'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : bot.status === 'pairing_code'
              ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
              : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              bot.status === 'connected'
                ? 'bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.5)]'
                : bot.status === 'pairing_code'
                ? 'bg-sky-400'
                : 'bg-gray-500'
            }`} />
            {bot.status === 'pairing_code' ? 'Pairing' : bot.status === 'connected' ? 'Online' : bot.status || 'Offline'}
          </span>
        </div>

        {bot.status === 'pairing_code' && bot.pairing_code && (
          <div className="bg-sky-500/5 border border-sky-500/10 rounded-2xl p-4 mb-6 text-center">
            <p className="text-sm text-sky-400 mb-2 flex items-center justify-center gap-2">
              <Key size={14} />
              Kode Pairing
            </p>
            <div
              className="inline-flex items-center gap-3 cursor-pointer group/code"
              onClick={copyPairingCode}
            >
              <p className="text-4xl font-mono font-bold text-cyan-400 tracking-widest">
                {bot.pairing_code}
              </p>
              {copied ? (
                <Check size={20} className="text-cyan-400" />
              ) : (
                <Copy size={18} className="text-gray-500 group-hover/code:text-white transition-colors" />
              )}
            </div>
          </div>
        )}

        <div className="relative grid grid-cols-3 gap-4 mb-6">
          <Link
            href={`/${username}/bots/${botId}/settings`}
            className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-blue-500/20 rounded-2xl p-4 text-center transition-all group"
          >
            <Settings size={24} className="mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium">Settings</p>
          </Link>
          <Link
            href={`/${username}/bots/${botId}/users`}
            className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-cyan-500/20 rounded-2xl p-4 text-center transition-all group"
          >
            <Users size={24} className="mx-auto mb-2 text-cyan-400 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium">Users</p>
          </Link>
          <Link
            href={`/${username}/bots/${botId}/stats`}
            className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-sky-500/20 rounded-2xl p-4 text-center transition-all group"
          >
            <BarChart3 size={24} className="mx-auto mb-2 text-sky-400 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium">Statistik</p>
          </Link>
        </div>

        <div className="relative flex gap-3">
          <button
            onClick={stopBot}
            disabled={stopping || bot.status !== 'connected'}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-2xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {stopping ? <Loader2 size={18} className="animate-spin" /> : <StopCircle size={18} />}
            Stop Bot
          </button>
          <button
            onClick={deleteBot}
            disabled={deleting}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-2xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            Hapus Bot
          </button>
        </div>
      </div>
    </motion.div>
  )
}
