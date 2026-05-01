// app/api/bots/[botId]/delete/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request, { params }: { params: Promise<{ botId: string }> }) {
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
    .select('user_id')
    .eq('token', token)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!magicToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: bot } = await supabase
    .from('bot_instances')
    .select('id, user_id')
    .eq('id', botId)
    .single()

  if (!bot) {
    return NextResponse.json({ error: 'Bot tidak ditemukan' }, { status: 404 })
  }

  if (bot.user_id !== magicToken.user_id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await supabase.from('bot_stats').delete().eq('bot_instance_id', botId)
  await supabase.from('tasks').delete().eq('bot_instance_id', botId)
  await supabase.from('pairing_queue').delete().eq('bot_instance_id', botId)
  await supabase.from('bot_settings').delete().eq('bot_instance_id', botId)
  await supabase.from('bot_instances').delete().eq('id', botId)

  return NextResponse.json({ success: true, message: 'Bot dihapus' })
}
