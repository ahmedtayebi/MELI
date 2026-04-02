import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import ProductCard from './ProductCard'
import type { Product } from '@/lib/types'

export default function BestSellersSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null

  return (
    <section className="w-full bg-[#fcf0d7] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={28} className="text-accent" />
            <h2 className="font-heading font-black text-3xl text-brand">
              الأكثر مبيعاً
            </h2>
          </div>
          <p className="text-muted font-body text-sm">
            المنتجات الأكثر طلباً من زبوناتنا
          </p>
          <Link
            href="/best-sellers"
            className="mt-3 font-heading font-bold text-sm text-accent hover:underline"
          >
            عرض الكل ←
          </Link>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  )
}
