// app/[username]/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Zap, Bot, Activity, Plus, ArrowRight, Sparkles, Waves } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const { username } = useParams() as { username: string }
  const supabase = createClient()
  const [allBots, setAllBots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData?.session?.user?.id) {
        setUserId(sessionData.session.user.id)
        fetchAll()
      } else {
        setTimeout(init, 500)
      }
    }
    init()

    const channel = supabase
      .channel('home-bots')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bot_instances' }, fetchAll)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchAll = async () => {
    const { data: sessionData } = await supabase.auth.getSession()
    const uid = sessionData?.session?.user?.id

    const { data: all } = await supabase.from('bot_instances').select('*').order('created_at', { ascending: false })

    if (all) {
      const myBots = all.filter(b => b.user_id === uid)
      const otherBots = all.filter(b => b.user_id !== uid)
      setAllBots([...myBots, ...otherBots])
    }
    setLoading(false)
  }

  const myBots = allBots.filter(b => b.user_id === userId)
  const activeBots = myBots.filter(b => b.status === 'connected').length
  const pairingBots = myBots.filter(b => b.status === 'pairing_code').length
  const totalBots = myBots.length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-[2px]">
            <div className="w-full h-full rounded-2xl bg-gray-950 flex items-center justify-center"><Waves size={24} className="text-cyan-400 animate-pulse" /></div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Selamat Datang, <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">@{username}</span></h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2"><span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" /> Dashboard Overview</p>
        </div>
        <Link href={`/${username}/bots/new`} className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl font-semibold text-sm hover:shadow-2xl hover:shadow-blue-500/25 transition-all hover:scale-105"><Plus size={18} /> Tambah Bot <Sparkles size={16} /></Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Bot', value: totalBots, icon: Bot, gradient: 'from-blue-500 to-cyan-500' },
          { label: 'Bot Aktif', value: activeBots, icon: Zap, gradient: 'from-cyan-400 to-teal-400' },
          { label: 'Pairing', value: pairingBots, icon: Activity, gradient: 'from-sky-400 to-blue-500' },
        ].map(({ label, value, icon: Icon, gradient }) => (
          <motion.div key={label} whileHover={{ y: -4 }} className="bg-gray-900/80 backdrop-blur-xl border border-white/[0.06] rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4"><p className="text-gray-400 text-sm">{label}</p><div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center`}><Icon size={22} className="text-white" /></div></div>
            <p className="text-5xl font-bold">{value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-900/80 backdrop-blur-xl border border-white/[0.06] rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><Bot size={24} className="text-cyan-400" /> Semua Bot</h2>
          <Link href={`/${username}/bots`} className="text-sm text-gray-400 hover:text-cyan-400 flex items-center gap-1">Lihat Semua <ArrowRight size={16} /></Link>
        </div>

        {allBots.length === 0 ? (
          <div className="text-center py-16">
            <Bot size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">Belum ada bot</p>
            <Link href={`/${username}/bots/new`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl font-semibold text-sm"><Plus size={18} /> Buat Bot Pertama</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {allBots.slice(0, 10).map((bot: any) => {
              const isMine = bot.user_id === userId
              return (
                <Link key={bot.id} href={`/${username}/bots/${bot.id}`} className={`flex items-center justify-between p-3.5 rounded-2xl transition-all group ${isMine ? 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05]' : 'bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] opacity-70'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${isMine ? (bot.status === 'connected' ? 'bg-cyan-500/20' : 'bg-gray-500/20') : 'bg-gray-500/10'}`}>🤖</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{bot.bot_name || 'Asuma Bot'}</p>
                        {isMine && <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 font-medium">Milikmu</span>}
                      </div>
                      <p className="text-xs text-gray-500">{bot.phone_number.slice(0, 4)}****{bot.phone_number.slice(-3)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${bot.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1 ${bot.status === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
                      {bot.status === 'connected' ? 'Active' : bot.status}
                    </span>
                    <ArrowRight size={16} className="text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}
