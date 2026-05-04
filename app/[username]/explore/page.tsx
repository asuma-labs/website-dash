// app/[username]/explore/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useMemo, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Activity, Users, Zap, Search, X, Waves } from 'lucide-react'

export default function ExplorePage() {
  const { username } = useParams() as { username: string }
  const supabase = createClient()
  const [myBots, setMyBots] = useState<any[]>([])
  const [otherBots, setOtherBots] = useState<any[]>([])
  const [allBots, setAllBots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchBots()

    const channel = supabase
      .channel('explore-bots')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bot_instances' },
        () => {
          if (debounceRef.current) clearTimeout(debounceRef.current)
          debounceRef.current = setTimeout(fetchBots, 5000)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const fetchBots = async () => {
    const { data: sessionData } = await supabase.auth.getSession()
    const uid = sessionData?.session?.user?.id
    setUserId(uid || null)

    const { data } = await supabase
      .from('bot_instances')
      .select('*')
      .eq('status', 'connected')
      .order('created_at', { ascending: false })

    if (data) {
      setAllBots(data)
      setMyBots(data.filter(b => b.user_id === uid))
      setOtherBots(data.filter(b => b.user_id !== uid))
    }
    setLoading(false)
  }

  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return allBots.filter(b =>
      b.bot_name?.toLowerCase().includes(q) ||
      b.phone_number?.includes(q)
    )
  }, [search, allBots])

  const isSearching = search.trim().length > 0

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

  const totalActive = allBots.length

  const BotCard = ({ bot, isMine }: { bot: any; isMine: boolean }) => (
    <Link
      href={isMine ? `/${username}/bots/${bot.id}` : '#'}
      onClick={e => { if (!isMine) e.preventDefault() }}
      className={`flex items-center justify-between p-3.5 rounded-2xl transition-all group ${
        isMine
          ? 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-blue-500/20 cursor-pointer'
          : 'bg-white/[0.01] border border-white/[0.04] opacity-60 hover:opacity-80 cursor-default'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          isMine
            ? 'bg-cyan-500/20 shadow-lg shadow-cyan-500/10'
            : 'bg-cyan-500/10'
        }`}>
          <Bot size={20} className={isMine ? 'text-cyan-400' : 'text-cyan-400/50'} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm">{bot.bot_name || 'Asuma Bot'}</p>
            {isMine && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-medium">
                Milikmu
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {bot.phone_number?.slice(0, 4)}****{bot.phone_number?.slice(-3)}
          </p>
        </div>
      </div>
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border ${
        isMine
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          : 'bg-emerald-500/5 text-emerald-400/70 border-emerald-500/10'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${
          isMine
            ? 'bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.5)]'
            : 'bg-emerald-400/50'
        }`} />
        Active
      </span>
    </Link>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Jelajahi Bot</h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <Zap size={16} className="text-cyan-400" />
            {totalActive} bot sedang aktif
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari bot..."
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl pl-12 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {searchResults.length === 0 ? (
              <div className="text-center py-20">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Search size={48} className="text-gray-600 mx-auto mb-4" />
                </motion.div>
                <p className="text-gray-400 text-lg">Tidak ditemukan</p>
                <p className="text-gray-600 text-sm mt-1">Coba kata kunci lain</p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((bot: any) => (
                  <BotCard key={bot.id} bot={bot} isMine={bot.user_id === userId} />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {totalActive === 0 ? (
              <div className="text-center py-20">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Bot size={48} className="text-gray-600 mx-auto mb-4" />
                </motion.div>
                <p className="text-gray-400 text-lg">Tidak ada bot yang sedang aktif</p>
                <p className="text-gray-600 text-sm mt-1">Bot akan muncul di sini saat sedang online</p>
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
                    <div className="space-y-2">
                      {myBots.map(bot => (
                        <BotCard key={bot.id} bot={bot} isMine={true} />
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
                    <div className="space-y-2">
                      {otherBots.map(bot => (
                        <BotCard key={bot.id} bot={bot} isMine={false} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
