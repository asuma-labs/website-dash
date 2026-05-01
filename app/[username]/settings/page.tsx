// app/[username]/settings/page.tsx
import { createServerSupabase } from '@/lib/supabase/server'

export default async function UserSettingsPage({ params }: { params: { username: string } }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Pengaturan Akun</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
          <input
            type="text"
            value={profile?.username || ''}
            disabled
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white opacity-60 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Nomor WhatsApp</label>
          <input
            type="text"
            value={profile?.phone_number || ''}
            disabled
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white opacity-60 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
          <input
            type="text"
            value={user?.email || '-'}
            disabled
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white opacity-60 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">ID User</label>
          <input
            type="text"
            value={user?.id || ''}
            disabled
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white opacity-60 cursor-not-allowed text-sm"
          />
        </div>
      </div>
    </div>
  )
}
