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
  console.log('=== sendPushNotification START ===')
  console.log('Params:', { customer_name, wilaya_name, total_price, items_count })

  try {
    const vapidEmail = process.env.VAPID_EMAIL
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY

    console.log('VAPID check:', {
      hasEmail: !!vapidEmail,
      hasPublicKey: !!vapidPublicKey,
      hasPrivateKey: !!vapidPrivateKey,
      emailValue: vapidEmail?.substring(0, 20),
    })

    if (!vapidEmail || !vapidPublicKey || !vapidPrivateKey) {
      console.error('VAPID NOT CONFIGURED — missing env vars')
      return
    }

    const subject = vapidEmail.startsWith('mailto:')
      ? vapidEmail
      : `mailto:${vapidEmail}`

    console.log('Setting VAPID details with subject:', subject)

    webpush.setVapidDetails(subject, vapidPublicKey, vapidPrivateKey)

    console.log('VAPID details set successfully')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
    )

    console.log('Fetching push subscriptions...')

    const { data: subscriptions, error: dbError } = await supabase
      .from('push_subscriptions')
      .select('*')

    if (dbError) {
      console.error('DB error fetching subscriptions:', dbError)
      return
    }

    console.log('Subscriptions found:', subscriptions?.length ?? 0)

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No subscriptions — nothing to send')
      return
    }

    const payload = JSON.stringify({
      title: '🛍️ طلب جديد!',
      body: `${customer_name} — ${wilaya_name} | ${items_count} قطعة | ${Number(total_price).toLocaleString('ar-DZ')} دج`,
      url: '/admin',
    })

    console.log('Payload prepared:', payload)
    console.log(`Sending to ${subscriptions.length} subscription(s)...`)

    const results = await Promise.allSettled(
      subscriptions.map((sub, index) => {
        console.log(`Sending to subscription ${index}:`, sub.endpoint.substring(0, 50))
        return webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload
        )
      })
    )

    results.forEach((r, i) => {
      if (r.status === 'fulfilled') {
        console.log(`✓ Push ${i} sent successfully:`, (r.value as any)?.statusCode)
      } else {
        console.error(`✗ Push ${i} failed:`, {
          message: (r.reason as any)?.message,
          statusCode: (r.reason as any)?.statusCode,
          body: (r.reason as any)?.body,
        })
      }
    })

    const expiredEndpoints = results
      .map((r, i) => ({ r, sub: subscriptions[i] }))
      .filter(({ r }) => r.status === 'rejected')
      .map(({ sub }) => sub.endpoint)

    if (expiredEndpoints.length > 0) {
      console.log('Removing expired subscriptions:', expiredEndpoints.length)
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', expiredEndpoints)
    }

    console.log('=== sendPushNotification END ===')
  } catch (err) {
    console.error('=== sendPushNotification FATAL ERROR ===', err)
  }
}
