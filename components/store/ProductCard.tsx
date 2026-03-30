'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'
import { getImageUrl } from '@/lib/storage'
import type { Product, ProductColor } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const colors = product.product_colors ?? []
  const sizes = product.product_sizes ?? []

  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null)
  const [imageOpacity, setImageOpacity] = useState(1)
  const [addSuccess, setAddSuccess] = useState(false)

  const addItem = useCartStore((state) => state.addItem)
  const currentColor = colors[selectedColorIndex] as ProductColor | undefined

  const handleColorChange = useCallback(
    (index: number) => {
      if (index === selectedColorIndex) return
      setImageOpacity(0)
      setTimeout(() => {
        setSelectedColorIndex(index)
        setImageOpacity(1)
      }, 150)
    },
    [selectedColorIndex]
  )

  const handleAddToCart = () => {
    if (!selectedSizeId || !currentColor) return
    const selectedSize = sizes.find((s) => s.id === selectedSizeId)
    if (!selectedSize) return

    addItem({
      product_id: product.id,
      product_name: product.name,
      color_id: currentColor.id,
      color_name: currentColor.name,
      color_hex: currentColor.hex_code,
      color_image_url: currentColor.image_url,
      size_id: selectedSizeId,
      size_label: selectedSize.label,
      quantity: 1,
    })

    setAddSuccess(true)
    setTimeout(() => setAddSuccess(false), 1500)
  }

  const visibleColors = colors.slice(0, 6)
  const hiddenColorCount = Math.max(0, colors.length - 6)

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
      {/* ── Image (3:4 aspect ratio) ── */}
      <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
        <div
          className="absolute inset-0"
          style={{ opacity: imageOpacity, transition: 'opacity 0.3s ease' }}
        >
          {getImageUrl(currentColor?.image_url ?? null) ? (
            <Image
              src={getImageUrl(currentColor!.image_url)!}
              alt={`${product.name} — ${currentColor!.name}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-surface to-border flex items-center justify-center">
              <span className="font-heading font-black text-5xl text-border/60 select-none">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Color swatches ── */}
      {colors.length > 0 && (
        <div className="px-4 pt-3 flex items-center gap-1.5 flex-wrap">
          {visibleColors.map((color, index) => (
            <div key={color.id} className="relative group">
              <button
                onClick={() => handleColorChange(index)}
                className={cn(
                  'w-8 h-8 sm:w-7 sm:h-7 rounded-full border-2 transition-all duration-200',
                  selectedColorIndex === index
                    ? 'border-brand scale-110 shadow-sm'
                    : 'border-transparent hover:scale-105 hover:border-border'
                )}
                style={{ backgroundColor: color.hex_code }}
                aria-label={color.name}
                title={color.name}
              />
              {/* Tooltip */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {color.name}
              </span>
            </div>
          ))}
          {hiddenColorCount > 0 && (
            <span className="text-[11px] text-muted font-body leading-none">
              +{hiddenColorCount}
            </span>
          )}
        </div>
      )}

      {/* ── Product name ── */}
      <h3 className="font-heading font-bold text-lg text-brand px-4 pt-2 pb-1 leading-snug">
        {product.name}
      </h3>

      {/* ── Size pills ── */}
      {sizes.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {sizes.map((size) => (
            <button
              key={size.id}
              onClick={() =>
                setSelectedSizeId(size.id === selectedSizeId ? null : size.id)
              }
              className={cn(
                'px-3 py-1 rounded-full text-xs font-heading font-bold transition-all duration-200',
                selectedSizeId === size.id
                  ? 'bg-brand text-white'
                  : 'border border-border text-muted hover:border-brand hover:text-brand'
              )}
            >
              {size.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Add to cart button ── */}
      <button
        onClick={handleAddToCart}
        disabled={addSuccess || !selectedSizeId}
        className={cn(
          'mt-auto w-full min-h-[44px] py-3.5 font-heading font-bold text-sm',
          'flex items-center justify-center gap-2',
          'transition-all duration-200',
          addSuccess
            ? 'bg-green-600 text-white cursor-default'
            : selectedSizeId
            ? 'bg-brand text-white hover:bg-accent'
            : 'bg-surface text-muted cursor-not-allowed'
        )}
      >
        {addSuccess ? (
          <>
            <Check size={15} />
            <span>تمت الإضافة</span>
          </>
        ) : selectedSizeId ? (
          'أضيفي للسلة'
        ) : (
          'اختاري المقاس'
        )}
      </button>
    </div>
  )
}
