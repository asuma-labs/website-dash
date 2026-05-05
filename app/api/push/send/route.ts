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
    const { user_id, title, body, url, image, tag, requireInteraction, broadcast } = await request.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    let subscriptions: any[] = []

    if (broadcast) {
      const { data } = await supabase.from('push_subscriptions').select('subscription')
      subscriptions = data || []
    } else if (user_id) {
      const { data } = await supabase.from('push_subscriptions').select('subscription').eq('user_id', user_id)
      subscriptions = data || []
    } else {
      return NextResponse.json({ error: 'user_id atau broadcast diperlukan' }, { status: 400 })
    }

    if (!subscriptions.length) {
      return NextResponse.json({ error: 'Tidak ada subscription' }, { status: 404 })
    }

    const payload = JSON.stringify({
      title: title || 'Asuma MD',
      body: body || 'Ada update baru!',
      url: url || '/',
      image: image || '/icons/android-chrome-512x512.png',
      tag: tag || 'asuma-notif',
      requireInteraction: requireInteraction || false,
    })

    const results = await Promise.allSettled(
      subscriptions.map(sub => webpush.sendNotification(sub.subscription, payload).catch(err => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          supabase.from('push_subscriptions').delete().eq('subscription', sub.subscription)
        }
      }))
    )

    const successCount = results.filter(r => r.status === 'fulfilled').length

    return NextResponse.json({ success: true, sent: successCount, total: subscriptions.length })
  } catch (error: any) {
    console.error('Push error:', error)
    return NextResponse.json({ error: 'Gagal kirim notifikasi' }, { status: 500 })
  }
}
