'use client'

import { Package } from 'lucide-react'
import { EmptyState } from '@/components/ui'
import ProductCard from './ProductCard'
import type { Product } from '@/lib/types'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="لا توجد منتجات بعد"
        description="سيتم إضافة التشكيلة قريباً، تابعينا!"
      />
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
