// app/dashboard/layout.tsx
import { createServerSupabase } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from './nav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <DashboardNav user={session.user} />
      <main className="flex-1 p-8 ml-64">{children}</main>
    </div>
  )
}
