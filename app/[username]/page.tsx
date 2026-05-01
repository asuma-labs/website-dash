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
    { label: 'Total Bot', value: totalBots, icon: Bot, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Bot Aktif', value: activeBots, icon: Zap, color: 'from-green-500 to-green-600', bg: 'bg-green-500/10' },
    { label: 'Pairing', value: pairingBots, icon: Activity, color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-500/10' },
  ]

  return (
    <div className="max-w-full lg:max-w-6xl mx-auto">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Selamat Datang, @{username}!
        </h1>
        <p className="text-gray-500 mt-2 flex items-center gap-2 text-sm lg:text-base">
          <Activity size={16} className="text-green-400" />
          Dashboard Overview
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {statsCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className={`relative ${bg} border border-gray-800/50 backdrop-blur-sm rounded-2xl p-4 lg:p-6 hover:border-gray-700/50 transition-all`}>
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <p className="text-gray-400 text-xs lg:text-sm font-medium">{label}</p>
                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                  <Icon size={16} className="lg:size-20 text-white" />
                </div>
              </div>
              <p className="text-2xl lg:text-4xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl blur-xl" />
        <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div>
              <h2 className="text-lg lg:text-xl font-semibold flex items-center gap-2">
                <Bot size={20} className="lg:size-22 text-green-400" />
                Bot Saya
              </h2>
              <p className="text-xs lg:text-sm text-gray-500 mt-1">Kelola semua bot clone kamu</p>
            </div>
            <Link
              href={`/${username}/bots/new`}
              className="relative group px-3 lg:px-5 py-2 lg:py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-medium text-xs lg:text-sm hover:shadow-lg hover:shadow-green-500/25 transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-1 lg:gap-2">
                <Zap size={14} className="lg:size-16" />
                <span className="hidden sm:inline">Tambah Bot</span>
                <span className="sm:hidden">+</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {bots?.length === 0 ? (
            <div className="text-center py-12 lg:py-16">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bot size={32} className="lg:size-40 text-gray-500" />
              </div>
              <p className="text-gray-400 text-base lg:text-lg mb-2">Belum ada bot</p>
              <p className="text-gray-600 text-xs lg:text-sm">Klik "Tambah Bot" untuk memulai!</p>
            </div>
          ) : (
            <div className="space-y-2 lg:space-y-3">
              {bots?.map((bot: any) => (
                <Link
                  key={bot.id}
                  href={`/${username}/bots/${bot.id}`}
                  className="flex items-center justify-between p-3 lg:p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all group border border-transparent hover:border-gray-700/50"
                >
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-lg lg:text-2xl ${
                      bot.status === 'connected' ? 'bg-green-500/20' :
                      bot.status === 'pairing_code' ? 'bg-yellow-500/20' : 'bg-gray-500/20'
                    }`}>
                      🤖
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm lg:text-base truncate">{bot.bot_name || 'Bot'}</p>
                      <p className="text-xs lg:text-sm text-gray-400 truncate">{bot.phone_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
                    <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      bot.status === 'connected' ? 'bg-green-500/20 text-green-400' :
                      bot.status === 'pairing_code' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        bot.status === 'connected' ? 'bg-green-400 animate-pulse' :
                        bot.status === 'pairing_code' ? 'bg-yellow-400' : 'bg-gray-400'
                      }`} />
                      <span className="hidden sm:inline">
                        {bot.status === 'pairing_code' ? 'Pairing' : bot.status === 'connected' ? 'Online' : bot.status}
                      </span>
                    </span>
                    <TrendingUp size={14} className="lg:size-16 text-gray-600 group-hover:text-green-400 transition-colors hidden sm:block" />
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
