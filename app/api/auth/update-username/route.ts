// app/api/auth/update-username/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const reservedWords = [
  'admin', 'moderator', 'staff', 'owner', 'root', 'system', 'bot', 'asuma',
  'whatsapp', 'wa', 'wabot', 'api', 'auth', 'login', 'logout', 'register',
  'dashboard', 'settings', 'profile', 'account', 'test', 'demo', 'guest',
  'user', 'users', 'support', 'help', 'info', 'contact', 'about', 'privacy',
  'select', 'insert', 'update', 'delete', 'drop', 'create', 'alter',
  'script', 'alert', 'cookie', 'session', 'token', 'password',
  'explore', 'jadibot', 'pricing', 'status', 'offline', 'chat', 'stats',
  'sitemap', 'robots', 'manifest', 'new', 'edit', 'view', 'list', 'all',
  'anjing', 'bangsat', 'kontol', 'memek', 'ngentot', 'jancok', 'babi', 'tolol',
]

export async function PATCH(request: Request) {
  const cookieStore = request.headers.get('cookie') || ''
  const token = cookieStore.match(/auth_token=([^;]+)/)?.[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
    .single()

  if (!magicToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, username_changed_at')
    .eq('id', magicToken.user_id)
    .single()

  if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  if (profile.username_changed_at) {
    const lastChange = new Date(profile.username_changed_at)
    const nextAllowed = new Date(lastChange)
    nextAllowed.setMonth(nextAllowed.getMonth() + 1)

    if (new Date() < nextAllowed) {
      const daysLeft = Math.ceil((nextAllowed.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return NextResponse.json({
        error: `Kamu hanya bisa ganti username 1x per bulan. Coba lagi dalam ${daysLeft} hari.`
      }, { status: 429 })
    }
  }

  const { newUsername } = await request.json()
  if (!newUsername) return NextResponse.json({ error: 'Username baru diperlukan' }, { status: 400 })

  const trimmed = newUsername.toLowerCase().trim()

  if (trimmed.length < 3 || trimmed.length > 20) {
    return NextResponse.json({ error: 'Username harus 3-20 karakter' }, { status: 400 })
  }

  if (!/^[a-z0-9_-]+$/.test(trimmed)) {
    return NextResponse.json({ error: 'Username hanya boleh huruf kecil, angka, -, _' }, { status: 400 })
  }

  if (reservedWords.includes(trimmed)) {
    return NextResponse.json({ error: 'Username tidak tersedia' }, { status: 409 })
  }

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', trimmed)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 409 })
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      username: trimmed,
      username_changed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', magicToken.user_id)

  if (error) return NextResponse.json({ error: 'Gagal update' }, { status: 500 })

  return NextResponse.json({ success: true, username: trimmed })
}
