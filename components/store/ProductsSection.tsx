'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Layers } from 'lucide-react'
import ProductGrid from './ProductGrid'
import type { Product, Category } from '@/lib/types'

export default function ProductsSection({
  products,
  categories,
}: {
  products: Product[]
  categories: Category[]
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category_id === activeCategory)

  return (
    <section
      ref={ref}
      id="products"
      className="w-full py-20 lg:py-24"
      style={{ background: '#FFFDF9' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-10 text-center"
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-6 bg-gradient-to-r from-transparent to-amber-600/50" />
            <Layers size={13} style={{ color: '#C8963C' }} />
            <span className="font-heading font-bold text-xs tracking-widest uppercase" style={{ color: '#C8963C' }}>
              التشكيلة
            </span>
            <div className="h-px w-6 bg-gradient-to-l from-transparent to-amber-600/50" />
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-4xl text-brand mb-2">
            اكتشفي مجموعاتنا
          </h2>
          <p className="text-muted font-body text-sm mb-8">
            أحدث العباءات العصرية بأناقة جزائرية أصيلة
          </p>

          {/* Category tabs */}
          {categories.length > 0 && (
            <div
              className="flex gap-2 overflow-x-auto pb-2 justify-center"
              style={{ scrollbarWidth: 'none', flexWrap: 'nowrap' }}
            >
              <CategoryTab
                label={`الكل (${products.length})`}
                active={activeCategory === 'all'}
                onClick={() => setActiveCategory('all')}
              />
              {categories.map((cat) => (
                <CategoryTab
                  key={cat.id}
                  label={`${cat.name} (${products.filter(p => p.category_id === cat.id).length})`}
                  active={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Product grid with animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <ProductGrid products={filtered} />
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}

function CategoryTab({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="relative flex-shrink-0 px-5 py-2 rounded-full text-sm font-heading font-bold
                 transition-colors duration-200"
      style={{
        background: active ? '#0E0B09' : '#FFFFFF',
        color: active ? '#FFFFFF' : '#8A7B6C',
        border: active ? '1.5px solid #0E0B09' : '1.5px solid #EAE0D4',
      }}
    >
      {label}
      {active && (
        <motion.span
          layoutId="cat-tab-active"
          className="absolute inset-0 rounded-full -z-10"
          style={{ background: '#0E0B09' }}
        />
      )}
    </motion.button>
  )
}
