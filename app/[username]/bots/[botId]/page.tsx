// app/[username]/bots/[botId]/page.tsx
import { createServerSupabase } from '@/lib/supabase/server'
import { createBotDB } from '@/lib/supabase/bot-db'
import Link from 'next/link'
import { ArrowLeft, Settings, Users, BarChart3 } from 'lucide-react'

export default async function BotDetailPage({
  params,
}: {
  params: { username: string; botId: string }
}) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  const supabase2 = createBotDB()

  const { data: bot } = await supabase
    .from('bot_instances')
    .select('*')
    .eq('id', params.botId)
    .eq('user_id', user?.id)
    .single()

  if (!bot) {
    return <p className="text-gray-400">Bot tidak ditemukan</p>
  }

  const { data: botStats } = await supabase2
    .from('users')
    .select('jid', { count: 'exact' })
    .eq('bot_number', bot.phone_number)

  return (
    <div>
      <Link
        href={`/${params.username}/bots`}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={20} />
        Kembali
      </Link>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-3xl">
              🤖
            </div>
            <div>
              <h1 className="text-2xl font-bold">{bot.bot_name}</h1>
              <p className="text-gray-400">{bot.phone_number}</p>
            </div>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              bot.status === 'connected'
                ? 'bg-green-500/20 text-green-400'
                : bot.status === 'pairing_code'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}
          >
            {bot.status === 'connected' ? 'Online' : bot.status === 'pairing_code' ? 'Pairing' : bot.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Link
            href={`/${params.username}/bots/${params.botId}/settings`}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition flex items-center gap-3"
          >
            <Settings size={24} className="text-blue-400" />
            <div>
              <p className="font-medium">Settings</p>
              <p className="text-sm text-gray-400">Auto read, typing, dll</p>
            </div>
          </Link>

          <Link
            href={`/${params.username}/bots/${params.botId}/users`}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition flex items-center gap-3"
          >
            <Users size={24} className="text-green-400" />
            <div>
              <p className="font-medium">Users</p>
              <p className="text-sm text-gray-400">{botStats?.length || 0} user terdaftar</p>
            </div>
          </Link>

          <Link
            href={`/${params.username}/bots/${params.botId}/stats`}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition flex items-center gap-3"
          >
            <BarChart3 size={24} className="text-yellow-400" />
            <div>
              <p className="font-medium">Statistik</p>
              <p className="text-sm text-gray-400">Command & aktivitas</p>
            </div>
          </Link>
        </div>
      </div>

      {bot.status === 'pairing_code' && bot.pairing_code && (
        <div className="bg-gray-900 border border-yellow-500/20 rounded-xl p-6 text-center">
          <p className="text-lg font-semibold text-yellow-400 mb-2">Kode Pairing</p>
          <p className="text-4xl font-mono font-bold text-green-400 tracking-widest mb-4">
            {bot.pairing_code}
          </p>
          <p className="text-sm text-gray-400">
            Masukkan kode ini di WhatsApp → Perangkat Tertaut → Tautkan Perangkat
          </p>
        </div>
      )}
    </div>
  )
}
