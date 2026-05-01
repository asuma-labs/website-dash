// app/[username]/page.tsx
import { createServerSupabase } from '@/lib/supabase/server'
import Link from 'next/link'
import { Zap, Bot, Activity, TrendingUp } from 'lucide-react'

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

  const statsCards = [
    { label: 'Total Bot', value: totalBots, icon: Bot, color: 'from-blue-500 to-blue-600' },
    { label: 'Bot Aktif', value: activeBots, icon: Zap, color: 'from-green-500 to-green-600' },
    { label: 'Pairing', value: pairingBots, icon: Activity, color: 'from-yellow-500 to-yellow-600' },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Selamat Datang, @{username}!</h1>
        <p className="text-gray-500 mt-2 flex items-center gap-2">
          <Activity size={16} className="text-green-400" />
          Dashboard Overview
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {statsCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900/80 border border-gray-800/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">{label}</p>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                <Icon size={20} className="text-white" />
              </div>
            </div>
            <p className="text-4xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900/80 border border-gray-800/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bot size={22} className="text-green-400" />
              Bot Saya
            </h2>
            <p className="text-sm text-gray-500 mt-1">Kelola semua bot clone kamu</p>
          </div>
          <Link
            href={`/${username}/bots/new`}
            className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-green-500/25 transition-all"
          >
            + Tambah Bot
          </Link>
        </div>

        {bots?.length === 0 ? (
          <div className="text-center py-16">
            <Bot size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">Belum ada bot</p>
            <p className="text-gray-600 text-sm">Klik Tambah Bot untuk memulai!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bots?.map((bot: any) => (
              <Link
                key={bot.id}
                href={`/${username}/bots/${bot.id}`}
                className="flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    bot.status === 'connected' ? 'bg-green-500/20' :
                    bot.status === 'pairing_code' ? 'bg-yellow-500/20' : 'bg-gray-500/20'
                  }`}>
                    🤖
                  </div>
                  <div>
                    <p className="font-medium">{bot.bot_name || 'Bot'}</p>
                    <p className="text-sm text-gray-400">{bot.phone_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    bot.status === 'connected' ? 'bg-green-500/20 text-green-400' :
                    bot.status === 'pairing_code' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      bot.status === 'connected' ? 'bg-green-400 animate-pulse' : ''
                    }`} />
                    {bot.status === 'pairing_code' ? 'Pairing' : bot.status === 'connected' ? 'Online' : bot.status}
                  </span>
                  <TrendingUp size={16} className="text-gray-600 group-hover:text-green-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
