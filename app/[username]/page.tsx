// app/[username]/page.tsx
'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { fetchAllBots } from '@/lib/fetcher'
import { Zap, Bot, Activity, Plus, ArrowRight, Sparkles, Waves } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const { username } = useParams() as { username: string }
  const supabase = createClient()

  const {
    data: allBots = [],
    error,
    isLoading,
    mutate,
  } = useSWR('all-bots', fetchAllBots, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
    fallbackData: [],
  })

  useEffect(() => {
    const channel = supabase
      .channel('home-bots')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bot_instances' },
        () => mutate()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [mutate])

  const { data: session } = useSWR('session', () =>
    supabase.auth.getSession().then(d => d.data.session)
  )
  const userId = session?.user?.id

  const myBots = allBots.filter(b => b.user_id === userId)
  const activeBots = myBots.filter(b => b.status === 'connected').length
  const pairingBots = myBots.filter(b => b.status === 'pairing_code').length
  const totalBots = myBots.length

  if (isLoading && !allBots.length) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Selamat Datang,{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              @{username}
            </span>
          </h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            Dashboard Overview
          </p>
        </div>
        <Link
          href={`/${username}/bots/new`}
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl font-semibold text-sm hover:shadow-2xl hover:shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={18} />
          Tambah Bot
          <Sparkles size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Bot', value: totalBots, icon: Bot, gradient: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/20' },
          { label: 'Bot Aktif', value: activeBots, icon: Zap, gradient: 'from-cyan-400 to-teal-400', glow: 'shadow-cyan-500/20' },
          { label: 'Pairing', value: pairingBots, icon: Activity, gradient: 'from-sky-400 to-blue-500', glow: 'shadow-sky-500/20' },
        ].map(({ label, value, icon: Icon, gradient, glow }) => (
          <motion.div
            key={label}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative bg-gray-900/80 backdrop-blur-xl border border-white/[0.06] rounded-3xl p-6 overflow-hidden group cursor-default"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-medium">{label}</p>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${glow}`}>
                <Icon size={22} className="text-white" />
              </div>
            </div>
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-5xl font-bold"
            >
              {value}
            </motion.p>
          </motion.div>
        ))}
      </div>

      <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/[0.06] rounded-3xl p-6 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bot size={24} className="text-cyan-400" />
            Semua Bot
          </h2>
          {allBots.length > 0 && (
            <Link
              href={`/${username}/explore`}
              className="text-sm text-gray-400 hover:text-cyan-400 flex items-center gap-1 transition-colors group"
            >
              Lihat Semua
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {allBots.length === 0 ? (
          <div className="text-center py-16">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Bot size={48} className="text-gray-600 mx-auto mb-4" />
            </motion.div>
            <p className="text-gray-400 text-lg mb-2">Belum ada bot</p>
            <p className="text-gray-600 text-sm mb-6">Buat bot WhatsApp pertamamu sekarang</p>
            <Link
              href={`/${username}/bots/new`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl font-semibold text-sm hover:shadow-2xl hover:shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={18} />
              Buat Bot Pertama
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {allBots.slice(0, 10).map((bot: any) => {
              const isMine = bot.user_id === userId
              return (
                <Link
                  key={bot.id}
                  href={`/${username}/bots/${bot.id}`}
                  className={`flex items-center justify-between p-3.5 rounded-2xl transition-all group ${
                    isMine
                      ? 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-blue-500/20'
                      : 'bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isMine
                          ? bot.status === 'connected'
                            ? 'bg-cyan-500/20 shadow-lg shadow-cyan-500/10'
                            : 'bg-gray-500/20'
                          : 'bg-gray-500/10'
                      }`}
                    >
                      <Bot
                        size={20}
                        className={
                          isMine
                            ? bot.status === 'connected'
                              ? 'text-cyan-400'
                              : 'text-gray-400'
                            : 'text-gray-500'
                        }
                      />
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
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border ${
                        bot.status === 'connected'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : bot.status === 'pairing_code'
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                          : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          bot.status === 'connected'
                            ? 'bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.5)]'
                            : bot.status === 'pairing_code'
                            ? 'bg-sky-400'
                            : 'bg-gray-500'
                        }`}
                      />
                      {bot.status === 'connected'
                        ? 'Active'
                        : bot.status === 'pairing_code'
                        ? 'Pairing'
                        : bot.status || 'Offline'}
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all"
                    />
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
