// app/[username]/explore/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bot, Activity, ArrowRight, Users } from 'lucide-react'

export default function ExplorePage() {
  const { username } = useParams() as { username: string }
  const supabase = createClient()
  const [allBots, setAllBots] = useState<any[]>([])
  const [myBots, setMyBots] = useState<any[]>([])
  const [otherBots, setOtherBots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBots = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const uid = sessionData?.session?.user?.id

      const { data } = await supabase
        .from('bot_instances')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        setAllBots(data)
        setMyBots(data.filter(b => b.user_id === uid))
        setOtherBots(data.filter(b => b.user_id !== uid))
      }
      setLoading(false)
    }
    fetchBots()

    const channel = supabase
      .channel('explore-bots')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bot_instances' }, fetchBots)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Jelajahi Bot</h1>
        <p className="text-gray-500 mt-2 flex items-center gap-2"><Activity size={16} className="text-emerald-400" /> Semua bot yang terhubung</p>
      </div>

      {myBots.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Bot size={20} className="text-emerald-400" /> Bot Anda</h2>
          <div className="space-y-3">
            {myBots.map((bot: any) => (
              <Link key={bot.id} href={`/${username}/bots/${bot.id}`} className="flex items-center justify-between p-4 bg-gray-900/80 border border-gray-800/50 rounded-2xl hover:bg-gray-800/50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${bot.status === 'connected' ? 'bg-emerald-500/20' : 'bg-gray-500/20'}`}>🤖</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{bot.bot_name || 'Asuma Bot'}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-medium">Milikmu</span>
                    </div>
                    <p className="text-sm text-gray-400">{bot.phone_number.slice(0, 4)}****{bot.phone_number.slice(-3)}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${bot.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${bot.status === 'connected' ? 'bg-emerald-400 animate-pulse' : ''}`} />
                  {bot.status === 'connected' ? 'Active' : bot.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {otherBots.length > 0 && (
        <div>
          {myBots.length > 0 && <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-6" />}
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Users size={20} className="text-gray-400" /> Bot Lainnya</h2>
          <div className="space-y-3">
            {otherBots.map((bot: any) => (
              <div key={bot.id} className="flex items-center justify-between p-4 bg-gray-900/60 border border-gray-800/30 rounded-2xl opacity-70">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${bot.status === 'connected' ? 'bg-emerald-500/10' : 'bg-gray-500/10'}`}>🤖</div>
                  <div>
                    <p className="font-semibold">{bot.bot_name || 'Asuma Bot'}</p>
                    <p className="text-sm text-gray-500">{bot.phone_number.slice(0, 4)}****{bot.phone_number.slice(-3)}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${bot.status === 'connected' ? 'bg-emerald-500/5 text-emerald-400/70' : 'bg-gray-500/5 text-gray-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${bot.status === 'connected' ? 'bg-emerald-400/50' : ''}`} />
                  {bot.status === 'connected' ? 'Active' : bot.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {allBots.length === 0 && (
        <div className="text-center py-20">
          <Bot size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Belum ada bot terdaftar</p>
        </div>
      )}
    </motion.div>
  )
}
