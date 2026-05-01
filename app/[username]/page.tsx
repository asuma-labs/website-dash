// app/[username]/page.tsx
import { createServerSupabase } from '@/lib/supabase/server'
import Link from 'next/link'

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Selamat Datang, @{username}</h1>
      <p className="text-gray-400 mb-8">Dashboard Overview</p>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Total Bot</p>
          <p className="text-3xl font-bold mt-2">{bots?.length || 0}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Bot Aktif</p>
          <p className="text-3xl font-bold mt-2 text-green-400">{activeBots}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Menunggu Pairing</p>
          <p className="text-3xl font-bold mt-2 text-yellow-400">{pairingBots}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Bot Saya</h2>
          <Link
            href={`/${username}/bots/new`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition text-sm"
          >
            + Tambah Bot
          </Link>
        </div>

        {bots?.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada bot. Klik Tambah Bot untuk memulai.</p>
        ) : (
          <div className="space-y-3">
            {bots?.map((bot: any) => (
              <Link
                key={bot.id}
                href={`/${username}/bots/${bot.id}`}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition"
              >
                <div>
                  <p className="font-medium">{bot.bot_name || 'Bot'}</p>
                  <p className="text-sm text-gray-400">{bot.phone_number}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    bot.status === 'connected'
                      ? 'bg-green-500/20 text-green-400'
                      : bot.status === 'pairing_code'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {bot.status === 'pairing_code' ? 'Pairing' : bot.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
