'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

interface HeaderProps {
  onCartClick?: () => void
}

export default function Header({ onCartClick }: HeaderProps) {
  const [mounted, setMounted] = useState(false)
  const cartCount = useCartStore((state) => state.totalItems())

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="MELY•IMA"
            width={110}
            height={44}
            style={{ width: 'auto', height: '44px' }}
            className="object-contain select-none"
            priority
          />
        </div>

        <button
          type="button"
          onClick={onCartClick}
          style={{ WebkitTapHighlightColor: 'transparent' }}
          className="relative p-3 rounded-xl text-brand transition-colors duration-200 touch-manipulation cursor-pointer"
          aria-label="عربة التسوق"
        >
          <ShoppingBag size={22} />
          {mounted && cartCount > 0 && (
            <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 bg-accent text-white text-[10px] font-bold font-heading rounded-full flex items-center justify-center leading-none">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </button>

      </div>
    </header>
  )
}
