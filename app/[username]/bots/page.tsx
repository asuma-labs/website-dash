// app/[username]/bots/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bot, Plus, ArrowRight, Activity } from 'lucide-react'

export default function BotsPage() {
  const { username } = useParams() as { username: string }
  const supabase = createClient()
  const [bots, setBots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData?.session) {
        fetchMyBots()
      } else {
        setTimeout(init, 500)
      }
    }
    init()

    const channel = supabase
      .channel('my-bots')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bot_instances' }, fetchMyBots)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchMyBots = async () => {
    const { data: sessionData } = await supabase.auth.getSession()
    const uid = sessionData?.session?.user?.id
    if (!uid) return

    const { data } = await supabase
      .from('bot_instances')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })

    setBots(data || [])
    setLoading(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Bot Saya</h1><p className="text-gray-500 mt-2 flex items-center gap-2"><Activity size={16} className="text-emerald-400" /> Kelola semua bot clone kamu</p></div>
        <Link href={`/${username}/bots/new`} className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl font-semibold text-sm hover:shadow-2xl hover:shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"><Plus size={18} /> Tambah Bot</Link>
      </div>
      {bots.length === 0 ? (
        <div className="text-center py-20"><Bot size={48} className="text-gray-600 mx-auto mb-4" /><p className="text-gray-400 text-lg mb-2">Belum ada bot</p><Link href={`/${username}/bots/new`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl font-semibold text-sm"><Plus size={18} /> Buat Bot Pertama</Link></div>
      ) : (
        <div className="space-y-3">
          {bots.map((bot: any) => (
            <Link key={bot.id} href={`/${username}/bots/${bot.id}`} className="flex items-center justify-between p-4 bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl hover:bg-gray-800/50 transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${bot.status === 'connected' ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/20' : 'bg-gray-500/20'}`}>🤖</div>
                <div><p className="font-semibold">{bot.bot_name || 'Asuma Bot'}</p><p className="text-sm text-gray-400">{bot.phone_number.slice(0, 4)}****{bot.phone_number.slice(-3)}</p></div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 ${bot.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${bot.status === 'connected' ? 'bg-emerald-400 animate-pulse' : ''}`} />
                  {bot.status === 'connected' ? 'Active' : bot.status}
                </span>
                <ArrowRight size={18} className="text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  )
}
