import { createClient } from '@/lib/supabase/server'
import StoreLayoutClient from '@/components/store/StoreLayoutClient'
import type { Category } from '@/lib/types'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('id, name, sort_order, is_visible, created_at')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  const categories = (data ?? []) as Category[]

  return (
    <StoreLayoutClient categories={categories}>
      {children}
    </StoreLayoutClient>
  )
}
