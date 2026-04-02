import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

export async function sendPushNotification({
  customer_name,
  wilaya_name,
  total_price,
  items_count,
}: {
  customer_name: string
  wilaya_name: string
  total_price: number
  items_count: number
}) {
  try {
    const vapidEmail = process.env.VAPID_EMAIL
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY

    if (!vapidEmail || !vapidPublicKey || !vapidPrivateKey) {
      console.log('VAPID not configured — skipping push')
      return
    }

    webpush.setVapidDetails(
      vapidEmail.startsWith('mailto:') ? vapidEmail : `mailto:${vapidEmail}`,
      vapidPublicKey,
      vapidPrivateKey
    )

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
    )

    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('*')

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No push subscriptions found')
      return
    }

    console.log(`Sending push to ${subscriptions.length} subscription(s)`)

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

    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`Push failed for sub ${i}:`, r.reason)
      } else {
        console.log(`Push sent successfully to sub ${i}`)
      }
    })

    // Remove expired subscriptions
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
  } catch (err) {
    console.error('sendPushNotification error:', err)
  }
}
