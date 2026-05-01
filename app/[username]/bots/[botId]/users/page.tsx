// app/[username]/bots/[botId]/users/page.tsx
import { createServerSupabase } from '@/lib/supabase/server'
import { createBotDB } from '@/lib/supabase/bot-db'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function BotUsersPage({
  params,
}: {
  params: { username: string; botId: string }
}) {
  const supabase = await createServerSupabase()
  const supabase2 = createBotDB()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: bot } = await supabase
    .from('bot_instances')
    .select('phone_number, bot_name')
    .eq('id', params.botId)
    .eq('user_id', user?.id)
    .single()

  if (!bot) {
    return <p className="text-gray-400">Bot tidak ditemukan</p>
  }

  const { data: users } = await supabase2
    .from('users')
    .select('jid, name, data, last_active, total_commands, vip, ban')
    .eq('bot_number', bot.phone_number)
    .order('last_active', { ascending: false })
    .limit(50)

  return (
    <div>
      <Link
        href={`/${params.username}/bots/${params.botId}`}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={20} />
        Kembali
      </Link>

      <h1 className="text-2xl font-bold mb-8">User Bot - {bot.bot_name}</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-4 text-sm text-gray-400">User</th>
                <th className="text-left p-4 text-sm text-gray-400">Status</th>
                <th className="text-left p-4 text-sm text-gray-400">Commands</th>
                <th className="text-left p-4 text-sm text-gray-400">Terakhir Aktif</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u: any) => (
                <tr key={u.jid} className="border-b border-gray-800 last:border-0">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{u.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-400">{u.jid?.split('@')[0]}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {u.vip && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">VIP</span>
                      )}
                      {u.ban && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Banned</span>
                      )}
                      {!u.vip && !u.ban && (
                        <span className="text-gray-400 text-sm">User</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm">{u.total_commands || 0}</td>
                  <td className="p-4 text-sm text-gray-400">
                    {u.last_active ? new Date(u.last_active).toLocaleDateString('id-ID') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users?.length === 0 && (
          <p className="text-center text-gray-500 py-8">Belum ada user</p>
        )}
      </div>
    </div>
  )
}
