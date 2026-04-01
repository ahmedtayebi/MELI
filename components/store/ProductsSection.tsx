'use client'

import { useState } from 'react'
import ProductGrid from './ProductGrid'
import type { Product, Category } from '@/lib/types'

export default function ProductsSection({
  products,
  categories,
}: {
  products: Product[]
  categories: Category[]
}) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category_id === activeCategory)

  return (
    <section id="products" className="relative z-10 pointer-events-auto bg-[#FFFDF9] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">

        <div className="mb-8">
          <h2 className="font-heading font-black text-3xl text-brand mb-2">التشكيلة</h2>
          <p className="text-muted font-body text-sm">
            اكتشفي أحدث مجموعاتنا من العباءات العصرية
          </p>
        </div>

        {/* Category tabs */}
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
            <button
              onClick={() => setActiveCategory('all')}
              className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-heading font-bold transition-all duration-200"
              style={{
                backgroundColor: activeCategory === 'all' ? '#1a1a1a' : '#ffffff',
                color: activeCategory === 'all' ? '#ffffff' : '#6B6B6B',
                border: activeCategory === 'all' ? '2px solid #1a1a1a' : '2px solid #E8E4DF',
              }}
            >
              الكل ({products.length})
            </button>
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-heading font-bold transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? '#1a1a1a' : '#ffffff',
                    color: isActive ? '#ffffff' : '#6B6B6B',
                    border: isActive ? '2px solid #1a1a1a' : '2px solid #E8E4DF',
                  }}
                >
                  {cat.name} ({products.filter(p => p.category_id === cat.id).length})
                </button>
              )
            })}
          </div>
        )}

        <ProductGrid products={filtered} />
      </div>
    </section>
  )
}
