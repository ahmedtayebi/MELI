import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      customer_name, phone, phone2, wilaya, wilaya_name, commune,
      delivery_type, delivery_price, products_total, total_price,
      address, notes, items,
    } = body

    // ── Validate ──────────────────────────────────────────────
    if (
      !customer_name?.trim() ||
      !phone?.trim() ||
      !wilaya ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: 'بيانات غير مكتملة' },
        { status: 400 }
      )
    }

    if (!['home', 'office'].includes(delivery_type)) {
      return NextResponse.json(
        { success: false, error: 'نوع التوصيل غير صحيح' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
    )

    // ── Insert order ──────────────────────────────────────────
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: String(customer_name).trim(),
        phone: String(phone).trim(),
        phone2: phone2 ? String(phone2).trim() : null,
        wilaya: String(wilaya),
        wilaya_name: String(wilaya_name ?? ''),
        delivery_type: String(delivery_type),
        delivery_price: Number(delivery_price),
        products_total: Number(products_total),
        total_price: Number(total_price),
        address: address ? String(address).trim() : null,
        commune: commune ? String(commune) : null,
        notes: notes ? String(notes).trim() : null,
        status: 'pending',
      })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error('Order insert error:', orderError)
      return NextResponse.json(
        { success: false, error: 'تعذّر إنشاء الطلب' },
        { status: 500 }
      )
    }

    // ── Insert order items ────────────────────────────────────
    const orderItems = (items as any[]).map((item) => ({
      order_id: order.id,
      product_id: item.product_id ?? null,
      product_name: String(item.product_name),
      color_name: String(item.color_name),
      color_hex: String(item.color_hex),
      color_image_url: item.color_image_url ?? null,
      size_label: String(item.size_label),
      quantity: Number(item.quantity),
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items insert error:', itemsError)
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        { success: false, error: 'تعذّر حفظ تفاصيل الطلب' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, order_id: order.id })
  } catch (err) {
    console.error('Unexpected error in POST /api/orders:', err)
    return NextResponse.json(
      { success: false, error: 'خطأ في الخادم، حاولي مجدداً' },
      { status: 500 }
    )
  }
}
