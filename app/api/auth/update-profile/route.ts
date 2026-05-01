// app/api/auth/update-profile/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  const cookieStore = request.headers.get('cookie') || ''
  const token = cookieStore.match(/auth_token=([^;]+)/)?.[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: magicToken } = await supabase
    .from('magic_tokens')
    .select('user_id')
    .eq('token', token)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!magicToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const allowedFields = ['display_name', 'bio', 'avatar_url']
  const updates: any = { updated_at: new Date().toISOString() }

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field]
    }
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', magicToken.user_id)
    .select('id, username, phone_number, email, display_name, bio, avatar_url')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Gagal update profile' }, { status: 500 })
  }

  return NextResponse.json({ success: true, profile })
}
