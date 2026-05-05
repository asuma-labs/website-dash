// app/api/push/subscribe/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookieStore = request.headers.get('cookie') || ''
  const token = cookieStore.match(/auth_token=([^;]+)/)?.[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: magicToken } = await supabase
    .from('magic_tokens')
    .select('user_id')
    .eq('token', token)
    .single()

  if (!magicToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const subscription = await request.json()

  await supabase.from('push_subscriptions').upsert({
    user_id: magicToken.user_id,
    subscription,
  })

  return NextResponse.json({ success: true })
}
