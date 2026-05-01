// app/[username]/page.tsx
import { createServerSupabase } from '@/lib/supabase/server'
import Link from 'next/link'
import { Zap, Bot, Activity, TrendingUp, Plus, ArrowRight, Sparkles, Users, MessageCircle } from 'lucide-react'

export default async function DashboardPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: bots } = await supabase
    .from('bot_instances')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  const activeBots = bots?.filter(b => b.status === 'connected').length || 0
  const pairingBots = bots?.filter(b => b.status === 'pairing_code').length || 0
  const totalBots = bots?.length || 0

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            Selamat Datang, @{username}
          </h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Dashboard Overview
          </p>
        </div>
        <Link
          href={`/${username}/bots/new`}
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl font-semibold text-sm hover:shadow-2xl hover:shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={18} />
          Tambah Bot
          <Sparkles size={16} className="ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Bot', value: totalBots, icon: Bot, gradient: 'from-blue-500 via-blue-400 to-cyan-400', bg: 'from-blue-500/10 to-cyan-500/5' },
          { label: 'Bot Aktif', value: activeBots, icon: Zap, gradient: 'from-emerald-500 via-green-400 to-teal-400', bg: 'from-emerald-500/10 to-teal-500/5' },
          { label: 'Menunggu Pairing', value: pairingBots, icon: Activity, gradient: 'from-amber-500 via-orange-400 to-yellow-400', bg: 'from-amber-500/10 to-yellow-500/5' },
        ].map(({ label, value, icon: Icon, gradient, bg }) => (
          <div key={label} className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-br ${bg} rounded-3xl blur-2xl group-hover:blur-3xl transition-all opacity-0 group-hover:opacity-100`} />
            <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6 hover:border-gray-700/50 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400 text-sm font-medium">{label}</p>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl`}>
                  <Icon size={22} className="text-white" />
                </div>
              </div>
              <p className="text-5xl font-bold tracking-tight">{value}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                <TrendingUp size={12} />
                <span>Updated real-time</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 rounded-3xl blur-2xl" />
        <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Bot size={24} className="text-emerald-400" />
                Bot Saya
              </h2>
              <p className="text-sm text-gray-500 mt-1">Kelola semua bot clone kamu</p>
            </div>
            {bots && bots.length > 0 && (
              <Link
                href={`/${username}/bots`}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition"
              >
                Lihat Semua
                <ArrowRight size={16} />
              </Link>
            )}
          </div>

          {!bots || bots.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full blur-2xl" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full flex items-center justify-center border-2 border-dashed border-gray-600">
                  <Bot size={40} className="text-gray-500" />
                </div>
              </div>
              <p className="text-gray-400 text-lg font-medium mb-2">Belum ada bot</p>
              <p className="text-gray-600 text-sm mb-6">Yuk buat bot pertama kamu sekarang!</p>
              <Link
                href={`/${username}/bots/new`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl font-semibold text-sm hover:shadow-xl hover:shadow-emerald-500/25 transition-all"
              >
                <Plus size={18} />
                Buat Bot Pertama
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bots?.map((bot: any) => (
                <Link
                  key={bot.id}
                  href={`/${username}/bots/${bot.id}`}
                  className="flex items-center justify-between p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-2xl transition-all group border border-transparent hover:border-gray-700/50"
                >
                  <div className="flex items-center gap-4">
                    <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl overflow-hidden ${
                      bot.status === 'connected' ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/20' :
                      bot.status === 'pairing_code' ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20' : 'bg-gray-500/20'
                    }`}>
                      <span className="relative z-10">🤖</span>
                      {bot.status === 'connected' && (
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{bot.bot_name || 'Asuma Bot'}</p>
                      <p className="text-sm text-gray-400">{bot.phone_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 ${
                      bot.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      bot.status === 'pairing_code' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        bot.status === 'connected' ? 'bg-emerald-400 animate-pulse' : ''
                      }`} />
                      {bot.status === 'pairing_code' ? 'Pairing' : bot.status === 'connected' ? 'Active' : bot.status}
                    </span>
                    <ArrowRight size={18} className="text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
