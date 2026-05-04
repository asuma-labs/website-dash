// app/[username]/explore/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bot, Activity, Users, Zap, Waves } from 'lucide-react'

export default function ExplorePage() {
  const { username } = useParams() as { username: string }
  const supabase = createClient()
  const [myBots, setMyBots] = useState<any[]>([])
  const [otherBots, setOtherBots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBots()

    const channel = supabase
      .channel('explore-bots')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bot_instances' }, fetchBots)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchBots = async () => {
    const { data: sessionData } = await supabase.auth.getSession()
    const uid = sessionData?.session?.user?.id

    const { data } = await supabase
      .from('bot_instances')
      .select('*')
      .eq('status', 'connected')
      .order('created_at', { ascending: false })

    if (data) {
      setMyBots(data.filter(b => b.user_id === uid))
      setOtherBots(data.filter(b => b.user_id !== uid))
    }
    setLoading(false)
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
              <Waves size={24} className="text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div className="absolute -inset-2 bg-blue-500/20 rounded-3xl blur-xl animate-pulse" />
        </motion.div>
      </div>
    )
  }

  const totalActive = myBots.length + otherBots.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold">Jelajahi Bot</h1>
        <p className="text-gray-500 mt-2 flex items-center gap-2">
          <Zap size={16} className="text-cyan-400" />
          {totalActive} bot sedang aktif
        </p>
      </div>

      {totalActive === 0 ? (
        <div className="text-center py-20">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative inline-block mb-6"
          >
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl" />
            <div className="relative w-24 h-24 bg-white/[0.03] rounded-full flex items-center justify-center border-2 border-dashed border-white/[0.08]">
              <Bot size={40} className="text-gray-600" />
            </div>
          </motion.div>
          <p className="text-gray-400 text-lg font-medium mb-2">Tidak ada bot yang sedang aktif</p>
          <p className="text-gray-600 text-sm">Bot akan muncul di sini saat sedang online</p>
        </div>
      ) : (
        <>
          {myBots.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Bot size={20} className="text-cyan-400" />
                Bot Anda
                <span className="text-xs text-gray-500 font-normal ml-2">{myBots.length} bot</span>
              </h2>
              <div className="space-y-3">
                {myBots.map((bot: any) => (
                  <Link
                    key={bot.id}
                    href={`/${username}/bots/${bot.id}`}
                    className="flex items-center justify-between p-4 bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl hover:bg-white/[0.05] hover:border-blue-500/20 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/10">
                        <Bot size={24} className="text-cyan-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{bot.bot_name || 'Asuma Bot'}</p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-medium">
                            Milikmu
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          {bot.phone_number?.slice(0, 4)}****{bot.phone_number?.slice(-3)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                        Active
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {otherBots.length > 0 && (
            <div>
              {myBots.length > 0 && (
                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent my-6" />
              )}
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Users size={20} className="text-gray-400" />
                Bot Lainnya
                <span className="text-xs text-gray-500 font-normal ml-2">{otherBots.length} bot</span>
              </h2>
              <div className="space-y-3">
                {otherBots.map((bot: any) => (
                  <div
                    key={bot.id}
                    className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/[0.04] rounded-2xl opacity-60"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                        <Bot size={24} className="text-cyan-400/50" />
                      </div>
                      <div>
                        <p className="font-semibold">{bot.bot_name || 'Asuma Bot'}</p>
                        <p className="text-sm text-gray-500">
                          {bot.phone_number?.slice(0, 4)}****{bot.phone_number?.slice(-3)}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/5 text-emerald-400/70 border border-emerald-500/10 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400/50 rounded-full" />
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
