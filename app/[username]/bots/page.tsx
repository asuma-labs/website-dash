// app/[username]/bots/page.tsx
import { createServerSupabase } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function BotsPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: bots } = await supabase
    .from('bot_instances')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Bot Saya</h1>
        <Link
          href={`/${username}/bots/new`}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition text-sm"
        >
          + Tambah Bot
        </Link>
      </div>

      {bots?.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <p className="text-4xl mb-4">🤖</p>
          <p className="text-gray-400 mb-4">Belum ada bot terdaftar</p>
          <Link
            href={`/${username}/bots/new`}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition inline-block"
          >
            Tambah Bot Pertama
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {bots?.map((bot: any) => (
            <Link
              key={bot.id}
              href={`/${username}/bots/${bot.id}`}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-2xl">
                    🤖
                  </div>
                  <div>
                    <p className="font-medium text-lg">{bot.bot_name}</p>
                    <p className="text-gray-400">{bot.phone_number}</p>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    bot.status === 'connected'
                      ? 'bg-green-500/20 text-green-400'
                      : bot.status === 'pairing_code'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : bot.status === 'failed'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {bot.status === 'pairing_code' ? 'Menunggu Pairing' : bot.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
