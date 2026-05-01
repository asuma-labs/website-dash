// app/api/auth/register/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function POST(request: Request) {
  const { username, password, phone_number } = await request.json()

  if (!username || !password || !phone_number) {
    return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
  }

  const usernameRegex = /^[a-z0-9_-]{3,20}$/
  if (!usernameRegex.test(username)) {
    return NextResponse.json({ error: 'Username: lowercase, angka, -, _ (3-20 karakter)' }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: existingUser } = await supabase
    .from('profiles')
    .select('username, phone_number')
    .or(`username.eq.${username},phone_number.eq.${phone_number}`)
    .single()

  if (existingUser) {
    if (existingUser.username === username) {
      return NextResponse.json({ error: 'Username sudah dipakai' }, { status: 409 })
    }
    if (existingUser.phone_number === phone_number) {
      return NextResponse.json({ error: 'Nomor sudah terdaftar' }, { status: 409 })
    }
  }

  const password_hash = await bcrypt.hash(password, 10)

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert({
      username,
      password_hash,
      phone_number,
      email: `${username}@asuma.local`,
    })
    .select('id')
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Gagal membuat akun' }, { status: 500 })
  }

  const magicToken = crypto.randomBytes(32).toString('hex')

  const { error: tokenError } = await supabase
    .from('magic_tokens')
    .insert({
      user_id: profile.id,
      token: magicToken,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    })

  if (tokenError) {
    return NextResponse.json({ error: 'Gagal generate token' }, { status: 500 })
  }

  const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/magic?token=${magicToken}`

  return NextResponse.json({
    success: true,
    username,
    magic_link: magicLink,
    message: `Akun @${username} berhasil dibuat! Klik link untuk login.`,
  })
}
