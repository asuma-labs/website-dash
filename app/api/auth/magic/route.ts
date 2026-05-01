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
    return NextResponse.json({ error: 'Token sudah digunakan. Silakan minta link baru.' }, { status: 401 })
  }

  if (new Date(magicToken.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Token kadaluarsa. Silakan minta link baru.' }, { status: 401 })
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
      console.error('Create auth user error:', createError)
      return NextResponse.json({ error: 'Gagal membuat sesi' }, { status: 500 })
    }
  } else {
    const { error: updateError } = await supabase.auth.admin.updateUserById(profile.id, {
      password,
    })

    if (updateError) {
      console.error('Update auth user error:', updateError)
    }
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
