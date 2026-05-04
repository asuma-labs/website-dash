// lib/fetcher.ts
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export async function fetchAllBots() {
  const { data: sessionData } = await supabase.auth.getSession()
  const uid = sessionData?.session?.user?.id

  const { data } = await supabase
    .from('bot_instances')
    .select('*')
    .order('created_at', { ascending: false })

  if (!data) return []

  const myBots = data.filter(b => b.user_id === uid)
  const otherBots = data.filter(b => b.user_id !== uid)
  return [...myBots, ...otherBots]
}

export async function fetchMyBots() {
  const { data: sessionData } = await supabase.auth.getSession()
  const uid = sessionData?.session?.user?.id
  if (!uid) return []

  const { data } = await supabase
    .from('bot_instances')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false })

  return data || []
}

export async function fetchActiveBots() {
  const { data: sessionData } = await supabase.auth.getSession()
  const uid = sessionData?.session?.user?.id

  const { data } = await supabase
    .from('bot_instances')
    .select('*')
    .eq('status', 'connected')
    .order('created_at', { ascending: false })

  if (!data) return []

  const myBots = data.filter(b => b.user_id === uid)
  const otherBots = data.filter(b => b.user_id !== uid)
  return { myBots, otherBots, allBots: data }
}
