// app/api/bots/create/route.ts
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

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
    .single()

  if (!magicToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { phone_number, bot_name } = await request.json()
  if (!phone_number) return NextResponse.json({ error: 'Nomor wajib diisi' }, { status: 400 })

  const { data: existing } = await supabase
    .from('bot_instances')
    .select('id')
    .eq('user_id', magicToken.user_id)
    .eq('phone_number', phone_number)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Bot dengan nomor ini sudah ada' }, { status: 409 })
  }

  const { data: bot, error } = await supabase
    .from('bot_instances')
    .insert({
      user_id: magicToken.user_id,
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

  await supabase.from('pairing_queue').insert({
    bot_instance_id: bot.id,
    phone_number,
    source: 'web',
    status: 'pending',
  })

  return NextResponse.json({ success: true, bot_instance_id: bot.id })
}
