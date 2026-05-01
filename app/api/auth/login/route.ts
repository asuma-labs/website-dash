// app/api/auth/login/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (!username || !password) {
    return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, password_hash, phone_number, email')
    .eq('username', username.toLowerCase().trim())
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Username tidak ditemukan' }, { status: 404 })
  }

  if (!profile.password_hash) {
    return NextResponse.json({ error: 'Akun ini belum memiliki password' }, { status: 400 })
  }

  const validPassword = await bcrypt.compare(password, profile.password_hash)

  if (!validPassword) {
    return NextResponse.json({ error: 'Password salah' }, { status: 401 })
  }

  const email = profile.email || `${profile.username}@asuma.local`

  const { data: existingUser } = await supabase.auth.admin.getUserById(profile.id)

  if (!existingUser?.user) {
    const { error: createError } = await supabase.auth.admin.createUser({
      id: profile.id,
      email,
      password,
      email_confirm: true,
      user_metadata: { username: profile.username, phone_number: profile.phone_number },
    })

    if (createError) {
      console.error('Create auth user error:', createError)
      return NextResponse.json({ error: 'Gagal membuat sesi' }, { status: 500 })
    }
  } else {
    await supabase.auth.admin.updateUserById(profile.id, { password })
  }

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError || !signInData?.session) {
    console.error('Sign in error:', signInError)
    return NextResponse.json({ error: 'Gagal login' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    username: profile.username,
    access_token: signInData.session.access_token,
    refresh_token: signInData.session.refresh_token,
  })
}
