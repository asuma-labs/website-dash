// app/[username]/bots/page.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bot, Plus, ArrowRight, Activity, Waves } from 'lucide-react'

export default function BotsPage() {
  const { username } = useParams() as { username: string }
  const [bots, setBots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchMyBots()
    intervalRef.current = setInterval(fetchMyBots, 10000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const fetchMyBots = async () => {
    const res = await fetch('/api/bots/list')
    const data = await res.json()
    setBots(data.bots || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-[2px]">
            <div className="w-full h-full rounded-2xl bg-gray-950 flex items-center justify-center">
              <Waves size={24} className="text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div className="absolute -inset-2 bg-blue-500/20 rounded-3xl blur-xl animate-pulse" />
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bot Saya</h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <Activity size={16} className="text-cyan-400" />
            Kelola semua bot clone kamu
          </p>
        </div>
        <Link href={`/${username}/bots/new`} className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl font-semibold text-sm hover:shadow-2xl hover:shadow-blue-500/25 transition-all hover:scale-105 active:scale-95">
          <Plus size={18} /> Tambah Bot
        </Link>
      </div>

      {bots.length === 0 ? (
        <div className="text-center py-20">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <Bot size={48} className="text-gray-600 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-400 text-lg mb-2">Belum ada bot</p>
          <p className="text-gray-600 text-sm mb-6">Buat bot WhatsApp pertamamu sekarang</p>
          <Link href={`/${username}/bots/new`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl font-semibold text-sm hover:shadow-2xl hover:shadow-blue-500/25 transition-all hover:scale-105 active:scale-95">
            <Plus size={18} /> Buat Bot Pertama
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bots.map((bot: any) => (
            <Link key={bot.id} href={`/${username}/bots/${bot.id}`} className="flex items-center justify-between p-4 bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl hover:bg-white/[0.05] hover:border-blue-500/20 transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bot.status === 'connected' ? 'bg-cyan-500/20 shadow-lg shadow-cyan-500/10' : bot.status === 'pairing_code' ? 'bg-sky-500/20 shadow-lg shadow-sky-500/10' : 'bg-gray-500/20'}`}>
                  <Bot size={28} className={bot.status === 'connected' ? 'text-cyan-400' : bot.status === 'pairing_code' ? 'text-sky-400' : 'text-gray-400'} />
                </div>
                <div>
                  <p className="font-semibold">{bot.bot_name || 'Asuma Bot'}</p>
                  <p className="text-sm text-gray-400">{bot.phone_number?.slice(0, 4)}****{bot.phone_number?.slice(-3)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border ${bot.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : bot.status === 'pairing_code' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                  <span className={`w-2 h-2 rounded-full ${bot.status === 'connected' ? 'bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.5)]' : bot.status === 'pairing_code' ? 'bg-sky-400' : 'bg-gray-500'}`} />
                  {bot.status === 'connected' ? 'Active' : bot.status === 'pairing_code' ? 'Pairing' : bot.status || 'Offline'}
                </span>
                <ArrowRight size={18} className="text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  )
}
