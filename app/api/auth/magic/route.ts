// app/api/auth/magic/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { token } = await request.json()
  if (!token) return NextResponse.json({ error: 'Token diperlukan' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: magicToken, error: tokenError } = await supabase
    .from('magic_tokens')
    .select('user_id, expires_at, used')
    .eq('token', token)
    .single()

  if (tokenError || !magicToken) {
    return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 })
  }

  if (magicToken.used) {
    return NextResponse.json({ error: 'Token sudah digunakan' }, { status: 401 })
  }

  if (new Date(magicToken.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Token kadaluarsa' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, email, phone_number')
    .eq('id', magicToken.user_id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
  }

  await supabase.from('magic_tokens').update({ used: true }).eq('token', token)

  const email = profile.email || `${profile.username}@asuma.local`
  const password = crypto.randomUUID()

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
    return NextResponse.json({ error: 'Gagal login' }, { status: 500 })
  }

  const loginToken = crypto.randomUUID()

  await supabase.from('magic_tokens').insert({
    user_id: profile.id,
    token: loginToken,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  })

  const response = NextResponse.json({
    success: true,
    username: profile.username,
  })

  response.cookies.set('auth_token', loginToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
