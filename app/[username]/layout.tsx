// app/[username]/layout.tsx
import { createServerSupabase } from '@/lib/supabase/server'
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
  const supabase = await createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/login?redirect=/${username}`)
    return null
  }

  const sessionUsername = session.user.user_metadata?.username
  if (sessionUsername !== username) {
    redirect(`/${sessionUsername}`)
    return null
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <DashboardNav user={session.user} username={username} />
      <main className="flex-1 p-8 ml-64">{children}</main>
    </div>
  )
}
