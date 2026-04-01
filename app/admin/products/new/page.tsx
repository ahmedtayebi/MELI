import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  const supabase = await createClient()
  const productId = crypto.randomUUID()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('sort_order')

  return <ProductForm productId={productId} categories={categories ?? []} />
}
