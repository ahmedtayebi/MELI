'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/cart-store'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const visibleColors = product.product_colors?.filter(c => c.is_visible) ?? []
  const visibleSizes = product.product_sizes?.filter(s => s.is_visible) ?? []

  const [selectedColorId, setSelectedColorId] = useState<string>(
    visibleColors[0]?.id ?? ''
  )
  const [selectedSizeId, setSelectedSizeId] = useState<string>('')
  const [added, setAdded] = useState(false)

  const addItem = useCartStore((state) => state.addItem)

  const selectedColor = visibleColors.find(c => c.id === selectedColorId) ?? visibleColors[0]

  const handleAddToCart = () => {
    if (!selectedSizeId || !selectedColor) return
    const selectedSize = visibleSizes.find(s => s.id === selectedSizeId)
    if (!selectedSize) return

    addItem({
      product_id: product.id,
      product_name: product.name,
      color_id: selectedColor.id,
      color_name: selectedColor.name,
      color_hex: selectedColor.hex_code,
      color_image_url: selectedColor.image_url,
      size_id: selectedSize.id,
      size_label: selectedSize.label,
      quantity: 1,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      {/* IMAGE */}
      <div className="aspect-[3/4] relative overflow-hidden bg-surface">
        {selectedColor?.image_url ? (
          <img
            src={selectedColor.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-surface to-border">
            <span className="font-heading font-black text-4xl text-border">
              {product.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="px-4 pt-3 pb-4 flex flex-col gap-3">

        {/* NAME */}
        <p className="font-heading font-black text-lg text-brand text-right truncate">
          {product.name}
        </p>

        {/* COLORS */}
        <div>
          <p className="text-xs font-bold text-muted text-right mb-1">اللون</p>
          {selectedColor && (
            <p className="text-sm font-heading font-bold text-brand text-right mb-2">
              {selectedColor.name}
            </p>
          )}
          {visibleColors.length > 0 ? (
            <div className="flex flex-row-reverse gap-2 flex-wrap">
              {visibleColors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColorId(color.id)}
                  className={[
                    'w-7 h-7 rounded-full border-2 transition-all duration-200 cursor-pointer',
                    selectedColorId === color.id
                      ? 'border-brand scale-110 shadow-sm'
                      : 'border-transparent hover:border-muted'
                  ].join(' ')}
                  style={{ backgroundColor: color.hex_code }}
                  title={color.name}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted text-right">لا يوجد</p>
          )}
        </div>

        {/* SIZES */}
        <div>
          <p className="text-xs font-bold text-muted text-right mb-1">المقاس</p>
          {visibleSizes.length > 0 ? (
            <div className="flex flex-row-reverse flex-wrap gap-1">
              {visibleSizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelectedSizeId(size.id)}
                  className={[
                    'rounded-full px-3 py-1 text-xs font-heading font-bold transition-all duration-200 cursor-pointer',
                    selectedSizeId === size.id
                      ? 'bg-brand text-white'
                      : 'border border-border text-muted hover:border-brand hover:text-brand'
                  ].join(' ')}
                >
                  {size.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted text-right">لا يوجد</p>
          )}
        </div>

        {/* PRICE */}
        <p className="font-heading font-black text-xl text-accent text-right">
          {product.price.toLocaleString('ar-DZ')} دج
        </p>

        {/* ADD TO CART */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!selectedSizeId || added}
          className={[
            'w-full h-12 rounded-xl font-heading font-bold text-base transition-all duration-200 cursor-pointer',
            added
              ? 'bg-green-600 text-white'
              : selectedSizeId
                ? 'bg-brand text-white hover:bg-accent'
                : 'bg-muted/20 text-muted cursor-not-allowed'
          ].join(' ')}
        >
          {added ? '✓ تمت الإضافة' : selectedSizeId ? 'إضافة للسلة' : 'اختاري المقاس أولاً'}
        </button>

      </div>
    </div>
  )
}
