// app/api/auth/login/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

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
    .select('id, username, password_hash, phone_number, email')
    .eq('username', username.toLowerCase().trim())
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Username tidak ditemukan' }, { status: 404 })
  }

  const validPassword = await bcrypt.compare(password, profile.password_hash)

  if (!validPassword) {
    return NextResponse.json({ error: 'Password salah' }, { status: 401 })
  }

  const email = profile.email || `${profile.username}@asuma.local`

  const { data: existingUser } = await supabaseAdmin.auth.admin.getUserById(profile.id)

  if (!existingUser?.user) {
    await supabaseAdmin.auth.admin.createUser({
      id: profile.id,
      email,
      password,
      email_confirm: true,
      user_metadata: { username: profile.username, phone_number: profile.phone_number },
    })
  } else {
    await supabaseAdmin.auth.admin.updateUserById(profile.id, { password })
  }

  const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError || !signInData?.session) {
    console.error('Sign in error:', signInError)
    return NextResponse.json({ error: 'Gagal login ke Supabase Auth' }, { status: 500 })
  }

  const response = NextResponse.json({
    success: true,
    username: profile.username,
    redirect: `/${profile.username}`,
  })

  response.cookies.set('sb-access-token', signInData.session.access_token, {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  })

  response.cookies.set('sb-refresh-token', signInData.session.refresh_token, {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
