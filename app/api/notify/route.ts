import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { order_id, customer_name, wilaya_name, total_price, items_count } = await req.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
    )

    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('*')

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ success: true, sent: 0 })
    }

    const payload = JSON.stringify({
      title: '🛍️ طلب جديد!',
      body: `${customer_name} — ${wilaya_name} | ${items_count} قطعة | ${Number(total_price).toLocaleString('ar-DZ')} دج`,
      url: '/admin',
    })

    const results = await Promise.allSettled(
      subscriptions.map(sub =>
        webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload
        )
      )
    )

    // Remove expired/invalid subscriptions
    const expiredEndpoints = results
      .map((r, i) => ({ r, sub: subscriptions[i] }))
      .filter(({ r }) => r.status === 'rejected')
      .map(({ sub }) => sub.endpoint)

    if (expiredEndpoints.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', expiredEndpoints)
    }

    return NextResponse.json({
      success: true,
      sent: results.filter(r => r.status === 'fulfilled').length,
    })
  } catch (err) {
    console.error('Push notification error:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
