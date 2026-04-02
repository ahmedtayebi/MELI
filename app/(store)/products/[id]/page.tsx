import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/store/ProductDetail'
import type { Product } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select(`
      id, name, price, description, is_visible, category_id, created_at, updated_at,
      product_colors(
        id, product_id, name, hex_code, image_url, is_visible,
        product_color_images(id, color_id, image_url, sort_order)
      ),
      product_sizes(id, product_id, label, is_visible, sort_order)
    `)
    .eq('id', id)
    .eq('is_visible', true)
    .single()

  if (!data) notFound()

  const product: Product = {
    ...data,
    description: data.description ?? null,
    sales_count: (data as any).sales_count ?? 0,
    product_colors: (data.product_colors ?? [])
      .filter((c: any) => c.is_visible)
      .map((c: any) => ({
        ...c,
        images: (c.product_color_images ?? [])
          .sort((a: any, b: any) => a.sort_order - b.sort_order),
      })),
    product_sizes: (data.product_sizes ?? [])
      .filter((s: any) => s.is_visible)
      .sort((a: any, b: any) => a.sort_order - b.sort_order),
  }

  return <ProductDetail product={product} />
}
