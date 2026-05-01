// app/[username]/page.tsx
import { createServerSupabase } from '@/lib/supabase/server'
import Link from 'next/link'
import { Zap, Bot, Activity, TrendingUp, Plus, ArrowRight, Sparkles } from 'lucide-react'
import DashboardContent from '@/components/DashboardContent'

export default async function DashboardPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: bots } = await supabase
    .from('bot_instances')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return <DashboardContent username={username} bots={bots || []} />
}
