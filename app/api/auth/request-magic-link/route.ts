// app/api/auth/request-magic-link/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  const { phone_number, username } = await request.json()

  if (!phone_number && !username) {
    return NextResponse.json({ error: 'Nomor atau username diperlukan' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  let query = supabase.from('profiles').select('id, username, phone_number')

  if (phone_number) {
    query = query.eq('phone_number', phone_number)
  }
  if (username) {
    query = query.eq('username', username)
  }

  const { data: profile } = await query.single()

  if (!profile) {
    return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 404 })
  }

  const magicToken = crypto.randomBytes(32).toString('hex')

  await supabase.from('magic_tokens').insert({
    user_id: profile.id,
    token: magicToken,
    expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  })

  const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/magic?token=${magicToken}`

  return NextResponse.json({
    success: true,
    username: profile.username,
    magic_link: magicLink,
  })
}
