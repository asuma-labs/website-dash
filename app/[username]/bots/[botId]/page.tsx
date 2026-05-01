// app/[username]/bots/[botId]/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Settings, Users, BarChart3, StopCircle, Trash2, Loader2 } from 'lucide-react'

export default function BotDetailPage() {
  const { username, botId } = useParams() as { username: string; botId: string }
  const router = useRouter()
  const supabase = createClient()
  const [bot, setBot] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stopping, setStopping] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

    return () => { supabase.removeChannel(channel) }
  }, [botId])

  const fetchBot = async () => {
    const { data } = await supabase
      .from('bot_instances')
      .select('*')
      .eq('id', botId)
      .single()
    setBot(data)
    setLoading(false)
  }

  const stopBot = async () => {
    setStopping(true)
    await fetch(`/api/bots/${botId}/stop`, { method: 'POST' })
    setStopping(false)
  }

  const deleteBot = async () => {
    if (!confirm('Yakin hapus bot ini? Data tidak bisa dikembalikan.')) return
    setDeleting(true)
    await fetch(`/api/bots/${botId}/delete`, { method: 'DELETE' })
    router.push(`/${username}/bots`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-emerald-400" />
      </div>
    )
  }

  if (!bot) {
    return <p className="text-gray-400 text-center py-20">Bot tidak ditemukan</p>
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <Link href={`/${username}/bots`} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
        <ArrowLeft size={20} />
        <span className="text-sm">Kembali</span>
      </Link>

      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
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
          <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
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
          {[
            { icon: Settings, label: 'Settings', href: `/${username}/bots/${botId}/settings`, color: 'text-blue-400' },
            { icon: Users, label: 'Users', href: `/${username}/bots/${botId}/users`, color: 'text-emerald-400' },
            { icon: BarChart3, label: 'Statistik', href: `/${username}/bots/${botId}/stats`, color: 'text-purple-400' },
          ].map(({ icon: Icon, label, href, color }) => (
            <Link key={label} href={href} className="bg-gray-800/50 hover:bg-gray-800 rounded-2xl p-4 text-center transition">
              <Icon size={24} className={`mx-auto mb-2 ${color}`} />
              <p className="text-sm font-medium">{label}</p>
            </Link>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={stopBot}
            disabled={stopping || bot.status !== 'connected'}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-2xl font-medium text-sm transition disabled:opacity-50"
          >
            {stopping ? <Loader2 size={18} className="animate-spin" /> : <StopCircle size={18} />}
            Stop Bot
          </button>
          <button
            onClick={deleteBot}
            disabled={deleting}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl font-medium text-sm transition disabled:opacity-50"
          >
            {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            Hapus Bot
          </button>
        </div>
      </div>
    </motion.div>
  )
}
