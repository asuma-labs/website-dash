// app/api/bots/[botId]/settings/route.ts
import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request, { params }: { params: Promise<{ botId: string }> }) {
  const { botId } = await params
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: bot } = await supabase
    .from('bot_instances')
    .select('user_id')
    .eq('id', botId)
    .single()

  if (!bot || bot.user_id !== user.id) {
    return NextResponse.json({ error: 'Bot tidak ditemukan' }, { status: 404 })
  }

  const body = await request.json()

  const { data: settings, error } = await supabase
    .from('bot_settings')
    .upsert({ bot_instance_id: botId, ...body, updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Gagal menyimpan settings' }, { status: 500 })
  }

  await supabase.from('tasks').insert({
    bot_instance_id: botId,
    type: 'update_settings',
    payload: body,
    status: 'pending',
  })

  return NextResponse.json({ success: true, settings })
}
