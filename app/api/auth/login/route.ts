// app/api/auth/login/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (!username || !password) {
    return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id, username, password_hash')
    .eq('username', username.toLowerCase().trim())
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Username tidak ditemukan' }, { status: 404 })
  }

  const validPassword = await bcrypt.compare(password, profile.password_hash)

  if (!validPassword) {
    return NextResponse.json({ error: 'Password salah' }, { status: 401 })
  }

  const loginToken = crypto.randomBytes(32).toString('hex')

  await supabaseAdmin.from('magic_tokens').insert({
    user_id: profile.id,
    token: loginToken,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  })

  return NextResponse.json({
    success: true,
    username: profile.username,
    token: loginToken,
  })
}
