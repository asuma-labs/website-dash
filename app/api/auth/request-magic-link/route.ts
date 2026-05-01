// app/api/auth/request-magic-link/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  const { phone_number, username } = await request.json()

  if (!phone_number && !username) {
    return NextResponse.json({ error: 'Nomor WhatsApp atau username diperlukan' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  let query = supabase.from('profiles').select('id, username, phone_number')

  if (phone_number) {
    const cleanPhone = phone_number.replace(/[^0-9]/g, '')
    query = query.eq('phone_number', cleanPhone)
  }
  if (username) {
    query = query.eq('username', username.toLowerCase().trim())
  }

  const { data: profile, error } = await query.single()

  if (error || !profile) {
    return NextResponse.json({ error: 'Akun tidak ditemukan. Ketik .daftar untuk membuat akun baru.' }, { status: 404 })
  }

  await supabase
    .from('magic_tokens')
    .update({ used: true })
    .eq('user_id', profile.id)
    .eq('used', false)

  const magicToken = crypto.randomBytes(32).toString('hex')

  const { error: tokenError } = await supabase
    .from('magic_tokens')
    .insert({
      user_id: profile.id,
      token: magicToken,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    })

  if (tokenError) {
    console.error('Token insert error:', tokenError)
    return NextResponse.json({ error: 'Gagal membuat link login' }, { status: 500 })
  }

  const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/magic?token=${magicToken}`

  return NextResponse.json({
    success: true,
    username: profile.username,
    phone_number: profile.phone_number,
    magic_link: magicLink,
  })
}
