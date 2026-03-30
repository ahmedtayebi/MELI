import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'
import type { Product } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select(
      `id, name, is_visible, created_at, updated_at,
       product_colors(id, product_id, name, hex_code, image_url, is_visible),
       product_sizes(id, product_id, label, is_visible, sort_order)`
    )
    .eq('id', id)
    .single()

  if (!data) notFound()

  return <ProductForm productId={id} initialData={data as Product} />
}
