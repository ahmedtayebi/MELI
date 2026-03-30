'use client'

import { Package } from 'lucide-react'
import { EmptyState } from '@/components/ui'
import ProductCard from './ProductCard'
import type { Product } from '@/lib/types'

export default function ProductGrid({ products }: { products: Product[] }) {
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
    <>
      {/* Mobile: single column horizontal cards */}
      <div className="flex flex-col gap-4 lg:hidden">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Desktop: 3-column grid */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  )
}
