// app/api/push/send/route.ts
import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'
import { NextResponse } from 'next/server'

webpush.setVapidDetails(
  'mailto:admin@asuma.my.id',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(request: Request) {
  try {
    const { user_id, title, body, url, image, tag, requireInteraction } = await request.json()

    if (!user_id) {
      return NextResponse.json({ error: 'user_id diperlukan' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: sub } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', user_id)
      .single()

    if (!sub) {
      return NextResponse.json({ error: 'User belum subscribe' }, { status: 404 })
    }

    const payload = JSON.stringify({
      title: title || 'Asuma MD',
      body: body || 'Ada update baru!',
      url: url || '/',
      image,
      tag: tag || 'asuma-notif',
      requireInteraction: requireInteraction || false,
      actions: [
        { action: 'open', title: 'Buka' },
        { action: 'close', title: 'Tutup' },
      ],
    })

    await webpush.sendNotification(sub.subscription, payload)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Push error:', error)
    return NextResponse.json({ error: 'Gagal kirim notifikasi' }, { status: 500 })
  }
}
