'use client'

import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

interface HeaderProps {
  onCartClick?: () => void
}

export default function Header({ onCartClick }: HeaderProps) {
  const cartCount = useCartStore((state) => state.totalItems())
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo — right side in RTL (first child) */}
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="MELY•IMA"
            width={110}
            height={44}
            className="h-11 w-auto object-contain select-none"
            priority
          />
        </div>

        {/* Cart — left side in RTL (last child) */}
        <button
          type="button"
          onClick={onCartClick}
          style={{ WebkitTapHighlightColor: 'transparent' }}
          className="relative p-3 rounded-xl text-brand transition-colors duration-200 touch-manipulation cursor-pointer"
          aria-label={`عربة التسوق${cartCount > 0 ? ` — ${cartCount} عناصر` : ''}`}
        >
          <ShoppingBag size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 bg-accent text-white text-[10px] font-bold font-heading rounded-full flex items-center justify-center leading-none">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}

