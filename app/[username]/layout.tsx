// app/[username]/layout.tsx
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import DashboardNav from '@/app/dashboard/nav'

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

  if (!token) {
    redirect('/login')
  }

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
    <div className="min-h-screen bg-gray-950 text-white flex">
      <DashboardNav user={{ user_metadata: { username: profile.username } }} username={profile.username} />
      <main className="flex-1 p-8 ml-64">{children}</main>
    </div>
  )
}
