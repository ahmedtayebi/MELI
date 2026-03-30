import { createClient } from '@/lib/supabase/server'
import ProductsClient from '@/components/admin/ProductsClient'
import type { Product } from '@/lib/types'

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select(
      `id, name, price, is_visible, created_at, updated_at,
       product_colors(id, product_id, name, hex_code, image_url, is_visible),
       product_sizes(id, product_id, label, is_visible, sort_order)`
    )
    .order('created_at', { ascending: false })

  return <ProductsClient initialProducts={(data ?? []) as Product[]} />
}
