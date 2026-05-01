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
    .select('id, username, email')
    .eq('id', magicToken.user_id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
  }

  await supabase.from('magic_tokens').update({ used: true }).eq('token', token)

  const { data: authUser, error: signInError } = await supabase.auth.admin.createUser({
    email: profile.email || `${profile.username}@asuma.local`,
    password: crypto.randomUUID(),
    email_confirm: true,
    user_metadata: { username: profile.username, phone_number: profile.phone_number },
  })

  if (signInError) {
    const { data: signInData, error: signInError2 } = await supabase.auth.signInWithPassword({
      email: profile.email || `${profile.username}@asuma.local`,
      password: 'temporary', 
    })
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: profile.email || `${profile.username}@asuma.local`,
  })

  const { data: finalSession, error: finalError } = await supabase.auth.signInWithPassword({
    email: profile.email || `${profile.username}@asuma.local`,
    password: 'temporary',
  })

  return NextResponse.json({
    success: true,
    username: profile.username,
    access_token: sessionData?.properties?.access_token || '',
    refresh_token: sessionData?.properties?.refresh_token || '',
  })
}
