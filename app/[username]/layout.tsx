// app/[username]/layout.tsx
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import DashboardNav from '@/app/dashboard/nav'

export default async function UsernameLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('username', username)
    .single()

  if (!profile) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <DashboardNav user={{ user_metadata: { username: profile.username } }} username={profile.username} />
      <main className="flex-1 p-8 ml-64">{children}</main>
    </div>
  )
}
