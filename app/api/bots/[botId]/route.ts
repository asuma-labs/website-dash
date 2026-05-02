// app/api/bots/[botId]/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: Promise<{ botId: string }> }) {
  const { botId } = await params

  const cookieStore = request.headers.get('cookie') || ''
  const token = cookieStore.match(/auth_token=([^;]+)/)?.[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
    return NextResponse.json({ error: 'Token expired' }, { status: 401 })
  }

  const { data: bot } = await supabase
    .from('bot_instances')
    .select('*')
    .eq('id', botId)
    .single()

  if (!bot) {
    return NextResponse.json({ error: 'Bot tidak ditemukan' }, { status: 404 })
  }

  if (bot.user_id !== magicToken.user_id) {
    return NextResponse.json({ error: 'Bukan bot milikmu' }, { status: 403 })
  }

  return NextResponse.json({ bot })
}
