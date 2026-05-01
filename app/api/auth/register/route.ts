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

  if (typeof username !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Format tidak valid' }, { status: 400 })
  }

  const trimmedUsername = username.toLowerCase().trim()
  const trimmedPhone = phone_number.replace(/[^0-9]/g, '')

  if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
    return NextResponse.json({ error: 'Username harus 3-20 karakter' }, { status: 400 })
  }

  const usernameRegex = /^[a-z0-9_-]+$/
  if (!usernameRegex.test(trimmedUsername)) {
    return NextResponse.json({ error: 'Username hanya boleh: huruf kecil, angka, -, _' }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 })
  }

  if (trimmedPhone.length < 10 || trimmedPhone.length > 15) {
    return NextResponse.json({ error: 'Nomor telepon tidak valid' }, { status: 400 })
  }

  const bannedWords = ['admin', 'root', 'bot', 'system', 'mod', 'owner', 'asuma', 'official', 'staff', 'ceo', 'founder']
  if (bannedWords.some(word => trimmedUsername.includes(word))) {
    return NextResponse.json({ error: 'Username mengandung kata terlarang' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: existingUser } = await supabase
    .from('profiles')
    .select('username, phone_number')
    .or(`username.eq.${trimmedUsername},phone_number.eq.${trimmedPhone}`)
    .maybeSingle()

  if (existingUser) {
    if (existingUser.username === trimmedUsername) {
      return NextResponse.json({ error: '❌ Username sudah digunakan. Silakan pilih username lain.' }, { status: 409 })
    }
    if (existingUser.phone_number === trimmedPhone) {
      return NextResponse.json({ error: '❌ Nomor WhatsApp ini sudah terdaftar. Gunakan .login untuk masuk.' }, { status: 409 })
    }
  }

  const password_hash = await bcrypt.hash(password, 10)

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert({
      username: trimmedUsername,
      password_hash,
      phone_number: trimmedPhone,
      email: `${trimmedUsername}@asuma.local`,
    })
    .select('id')
    .single()

  if (profileError || !profile) {
    console.error('Profile insert error:', profileError)
    return NextResponse.json({ error: 'Gagal membuat akun. Coba lagi nanti.' }, { status: 500 })
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
    console.error('Token insert error:', tokenError)
    return NextResponse.json({ error: 'Gagal generate token' }, { status: 500 })
  }

  const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/magic?token=${magicToken}`

  return NextResponse.json({
    success: true,
    username: trimmedUsername,
    magic_link: magicLink,
  })
}
