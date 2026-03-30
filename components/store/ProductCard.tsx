'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/cart-store'
import type { Product } from '@/lib/types'

export default function ProductCard({ product }: { product: Product }) {
  const visibleColors = product.product_colors?.filter(c => c.is_visible) ?? []
  const visibleSizes = product.product_sizes
    ?.filter(s => s.is_visible)
    .filter((s, i, arr) => arr.findIndex(t => t.label === s.label) === i) ?? []

  const [selectedColorId, setSelectedColorId] = useState(visibleColors[0]?.id ?? '')
  const [selectedSizeId, setSelectedSizeId] = useState('')
  const [added, setAdded] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const selectedColor = visibleColors.find(c => c.id === selectedColorId) ?? visibleColors[0]

  const handleAdd = () => {
    if (!selectedSizeId || !selectedColor) return
    const size = visibleSizes.find(s => s.id === selectedSizeId)
    if (!size) return
    addItem({
      product_id: product.id,
      product_name: product.name,
      color_id: selectedColor.id,
      color_name: selectedColor.name,
      color_hex: selectedColor.hex_code,
      color_image_url: selectedColor.image_url,
      size_id: size.id,
      size_label: size.label,
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden
                    flex flex-row-reverse h-48 shadow-sm
                    hover:shadow-md transition-shadow duration-200">

      {/* RIGHT — Image (RTL: right side) */}
      <div className="w-[42%] shrink-0 relative bg-surface overflow-hidden">
        {selectedColor?.image_url ? (
          <img
            src={selectedColor.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-surface to-border">
            <span className="font-heading font-black text-5xl text-border/60">
              {product.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* LEFT — Content */}
      <div className="flex-1 flex flex-col justify-between p-3 overflow-hidden">

        {/* TOP: name + colors + sizes */}
        <div>
          <p className="font-heading font-black text-base text-brand text-right leading-tight line-clamp-2 mb-2">
            {product.name}
          </p>

          {/* Color swatches */}
          {visibleColors.length > 0 && (
            <div className="flex flex-row-reverse gap-1.5 mb-2">
              {visibleColors.slice(0, 5).map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColorId(color.id)}
                  className={[
                    'w-5 h-5 rounded-full border-2 transition-all duration-200',
                    selectedColorId === color.id
                      ? 'border-brand scale-110 shadow-sm'
                      : 'border-transparent hover:border-muted',
                  ].join(' ')}
                  style={{ backgroundColor: color.hex_code }}
                  title={color.name}
                />
              ))}
              {visibleColors.length > 5 && (
                <span className="text-[10px] text-muted self-center">
                  +{visibleColors.length - 5}
                </span>
              )}
            </div>
          )}

          {/* Size pills */}
          {visibleSizes.length > 0 && (
            <div className="flex flex-row-reverse flex-wrap gap-1">
              {visibleSizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelectedSizeId(size.id)}
                  className={[
                    'rounded-full px-2 py-0.5 text-[11px] font-heading font-bold',
                    'transition-all duration-200 border',
                    selectedSizeId === size.id
                      ? 'bg-brand text-white border-brand'
                      : 'border-border text-muted hover:border-brand hover:text-brand',
                  ].join(' ')}
                >
                  {size.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM: price + button */}
        <div className="flex flex-row-reverse items-center justify-between gap-2 mt-2">
          <p className="font-heading font-black text-base text-accent whitespace-nowrap">
            {product.price.toLocaleString('ar-DZ')} دج
          </p>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!selectedSizeId || added}
            className={[
              'rounded-xl px-3 h-9 text-xs font-heading font-bold',
              'transition-all duration-200 whitespace-nowrap',
              added
                ? 'bg-green-600 text-white'
                : selectedSizeId
                  ? 'bg-brand text-white hover:bg-accent'
                  : 'bg-muted/15 text-muted cursor-not-allowed',
            ].join(' ')}
          >
            {added ? '✓ تمت' : selectedSizeId ? 'أضيفي للسلة' : 'اختاري المقاس'}
          </button>
        </div>

      </div>
    </div>
  )
}
