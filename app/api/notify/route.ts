import { NextRequest, NextResponse } from 'next/server'
import { sendPushNotification } from '@/lib/send-push-notification'

export async function POST(req: NextRequest) {
  try {
    const { customer_name, wilaya_name, total_price, items_count } = await req.json()
    await sendPushNotification({ customer_name, wilaya_name, total_price, items_count })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Notify route error:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
