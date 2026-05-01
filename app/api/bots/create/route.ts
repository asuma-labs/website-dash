// app/api/bots/create/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
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

  const { phone_number, bot_name } = await request.json()
  if (!phone_number) return NextResponse.json({ error: 'Nomor wajib diisi' }, { status: 400 })

  // Cek existing bot
  const { data: existing } = await supabase
    .from('bot_instances')
    .select('id, status')
    .eq('user_id', magicToken.user_id)
    .eq('phone_number', phone_number)
    .single()

  // Kalo ada dan statusnya failed/stopped/logged_out, reuse aja
  if (existing) {
    if (['failed', 'stopped', 'logged_out', 'expired'].includes(existing.status)) {
      // Reset status bot lama
      await supabase
        .from('bot_instances')
        .update({ status: 'pending', pairing_code: null, updated_at: new Date().toISOString() })
        .eq('id', existing.id)

      // Bikin pairing queue baru
      await supabase.from('pairing_queue').insert({
        bot_instance_id: existing.id,
        phone_number,
        source: 'web',
        status: 'pending',
      })

      return NextResponse.json({ success: true, bot_instance_id: existing.id })
    }

    if (existing.status === 'connected') {
      return NextResponse.json({ error: 'Bot dengan nomor ini sudah aktif' }, { status: 409 })
    }

    if (existing.status === 'pairing_code' || existing.status === 'processing') {
      return NextResponse.json({ success: true, bot_instance_id: existing.id })
    }
  }

  // Bikin bot baru
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

  await supabase.from('bot_settings').insert({ bot_instance_id: bot.id }).select().single().catch(() => {})

  await supabase.from('pairing_queue').insert({
    bot_instance_id: bot.id,
    phone_number,
    source: 'web',
    status: 'pending',
  })

  return NextResponse.json({ success: true, bot_instance_id: bot.id })
}
