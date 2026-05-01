// app/api/bots/create/route.ts
import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { phone_number, bot_name } = await request.json()
  if (!phone_number) return NextResponse.json({ error: 'Nomor wajib diisi' }, { status: 400 })

  const { data: existing } = await supabase
    .from('bot_instances')
    .select('id')
    .eq('user_id', user.id)
    .eq('phone_number', phone_number)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Bot dengan nomor ini sudah ada' }, { status: 409 })
  }

  const { data: bot, error } = await supabase
    .from('bot_instances')
    .insert({
      user_id: user.id,
      phone_number,
      bot_name: bot_name || 'Asuma Bot',
      status: 'pending',
    })
    .select()
    .single()

  if (error || !bot) {
    return NextResponse.json({ error: 'Gagal membuat bot' }, { status: 500 })
  }

  await supabase.from('bot_settings').insert({ bot_instance_id: bot.id })

  await supabase.from('tasks').insert({
    bot_instance_id: bot.id,
    type: 'start_session',
    payload: { phone_number, bot_name, bot_instance_id: bot.id },
    status: 'pending',
  })

  await supabase.from('pairing_queue').insert({
    bot_instance_id: bot.id,
    phone_number,
    source: 'web',
    status: 'pending',
  })

  return NextResponse.json({ success: true, bot_instance_id: bot.id })
}
