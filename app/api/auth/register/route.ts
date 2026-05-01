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

  const trimmedUsername = username.toLowerCase().trim()
  const trimmedPhone = phone_number.replace(/[^0-9]/g, '')

  if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
    return NextResponse.json({ error: 'Username harus 3-20 karakter' }, { status: 400 })
  }

  if (!/^[a-z0-9_-]+$/.test(trimmedUsername)) {
    return NextResponse.json({ error: 'Username hanya boleh: huruf kecil, angka, -, _' }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('username, phone_number, id')
    .or(`username.eq.${trimmedUsername},phone_number.eq.${trimmedPhone}`)
    .maybeSingle()

  if (existingProfile) {
    if (existingProfile.username === trimmedUsername) {
      return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 409 })
    }
    if (existingProfile.phone_number === trimmedPhone) {
      return NextResponse.json({ error: 'Nomor sudah terdaftar' }, { status: 409 })
    }
  }

  const password_hash = await bcrypt.hash(password, 10)
  const email = `${trimmedUsername}@asuma.local`
  const userId = crypto.randomUUID()

  const { data: existingAuth, error: checkError } = await supabase.auth.admin.getUserById(userId)

  if (existingAuth?.user) {
    return NextResponse.json({ error: 'Akun sudah terdaftar, gunakan .login untuk masuk' }, { status: 409 })
  }

  const { error: authError } = await supabase.auth.admin.createUser({
    id: userId,
    email,
    password,
    email_confirm: true,
    user_metadata: { username: trimmedUsername, phone_number: trimmedPhone },
  })

  if (authError) {
    if (authError.message?.includes('already been registered') || authError.message?.includes('already exists')) {
      try {
        const { data: existingProfile2 } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', trimmedUsername)
          .single()

        if (!existingProfile2) {
          const { data: authUser } = await supabase.auth.admin.listUsers()
          const matched = authUser?.users?.find(u => u.email === email)
          if (matched) {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: matched.id,
                username: trimmedUsername,
                password_hash,
                phone_number: trimmedPhone,
                email,
              })
            if (insertError) {
              console.error('Fallback insert error:', insertError)
            } else {
              const magicToken = crypto.randomBytes(32).toString('hex')
              await supabase.from('magic_tokens').insert({
                user_id: matched.id,
                token: magicToken,
                expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
              })
              const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/magic?token=${magicToken}`
              return NextResponse.json({
                success: true,
                username: trimmedUsername,
                magic_link: magicLink,
              })
            }
          }
        }
        return NextResponse.json({ error: 'Akun sudah terdaftar, gunakan .login untuk masuk' }, { status: 409 })
      } catch (fallbackError) {
        return NextResponse.json({ error: 'Akun sudah terdaftar, gunakan .login untuk masuk' }, { status: 409 })
      }
    }
    console.error('Auth create error:', authError)
    return NextResponse.json({ error: 'Gagal membuat akun' }, { status: 500 })
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      username: trimmedUsername,
      password_hash,
      phone_number: trimmedPhone,
      email,
    }, { onConflict: 'id' })

  if (profileError) {
    console.error('Profile upsert error:', profileError)
    return NextResponse.json({ error: 'Gagal menyimpan profil' }, { status: 500 })
  }

  const magicToken = crypto.randomBytes(32).toString('hex')

  await supabase.from('magic_tokens').insert({
    user_id: userId,
    token: magicToken,
    expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  })

  const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/magic?token=${magicToken}`

  return NextResponse.json({
    success: true,
    username: trimmedUsername,
    magic_link: magicLink,
  })
}
