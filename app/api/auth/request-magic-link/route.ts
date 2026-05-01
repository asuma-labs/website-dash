// app/api/auth/request-magic-link/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  const { phone_number } = await request.json()
  if (!phone_number) return NextResponse.json({ error: 'Nomor wajib diisi' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('phone_number', phone_number)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Nomor tidak terdaftar' }, { status: 404 })
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
    magic_link: magicLink,
    message: `Login link untuk @${profile.username}: ${magicLink}`,
  })
}
