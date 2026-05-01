// app/[username]/layout.tsx
import { createServerSupabase } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/app/dashboard/nav'

export default async function UsernameLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { username: string }
}) {
  const supabase = await createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const sessionUsername = session.user.user_metadata?.username
  if (sessionUsername !== params.username) {
    redirect(`/${sessionUsername}`)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <DashboardNav user={session.user} username={params.username} />
      <main className="flex-1 p-8 ml-64">{children}</main>
    </div>
  )
}
