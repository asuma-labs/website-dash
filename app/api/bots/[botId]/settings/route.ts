// app/api/bots/[botId]/settings/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: Promise<{ botId: string }> }) {
  const { botId } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: settings } = await supabase
    .from('bot_settings')
    .select('*')
    .eq('bot_instance_id', botId)
    .single()

  return NextResponse.json({ settings })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ botId: string }> }) {
  const { botId } = await params
  const body = await request.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: settings, error } = await supabase
    .from('bot_settings')
    .upsert({ bot_instance_id: botId, ...body, updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Gagal menyimpan' }, { status: 500 })
  }

  await supabase.from('tasks').insert({
    bot_instance_id: botId,
    type: 'update_settings',
    payload: body,
    status: 'pending',
  })

  return NextResponse.json({ success: true, settings })
}
