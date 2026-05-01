// app/api/bots/count/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { phone_number } = await request.json()

  if (!phone_number) {
    return NextResponse.json({ error: 'Nomor diperlukan' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('phone_number', phone_number)
    .single()

  if (!profile) {
    return NextResponse.json({ active: 0 })
  }

  const { count, error } = await supabase
    .from('bot_instances')
    .select('id', { count: 'exact' })
    .eq('user_id', profile.id)
    .eq('status', 'connected')

  if (error) {
    return NextResponse.json({ active: 0 })
  }

  return NextResponse.json({ active: count || 0 })
}
