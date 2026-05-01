// app/[username]/layout.tsx
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import DashboardNav from '@/components/DashboardNav'

export default async function UsernameLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) redirect('/login')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: magicToken } = await supabase
    .from('magic_tokens')
    .select('user_id, expires_at')
    .eq('token', token)
    .eq('used', false)
    .single()

  if (!magicToken || new Date(magicToken.expires_at) < new Date()) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('id', magicToken.user_id)
    .single()

  if (!profile || profile.username !== username) {
    redirect('/login')
  }

  await supabase.from('magic_tokens').update({
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }).eq('token', token)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="fixed inset-0 bg-[url('/icons/android-chrome-192x192.png')] bg-fixed opacity-[0.02] pointer-events-none" />
      <DashboardNav username={profile.username} />
      <div className="lg:ml-72 min-h-screen">
        <div className="fixed top-0 left-72 right-0 h-32 bg-gradient-to-b from-gray-950/80 to-transparent pointer-events-none z-30" />
        <main className="relative p-4 pt-20 lg:p-8 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  )
}
