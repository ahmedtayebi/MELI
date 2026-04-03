'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

interface HeaderProps {
  onCartClick?: () => void
}

const NAV_LINKS = [
  { label: 'الرئيسية',      href: '/'           },
  { label: 'الأكثر مبيعاً', href: '/#best'      },
  { label: 'التشكيلة',      href: '/#products'  },
  { label: 'آراء العملاء',  href: '/#reviews'   },
  { label: 'من نحن',        href: '/#statement' },
]

export default function Header({ onCartClick }: HeaderProps) {
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const cartCount = useCartStore((state) => state.totalItems())

  useEffect(() => { setMounted(true) }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* RIGHT — Logo */}
        <div className="flex items-center">
          <a href="/">
            <Image
              src="/logo.png"
              alt="MELY•IMA"
              width={110}
              height={44}
              style={{ width: 'auto', height: '38px' }}
              className="object-contain select-none"
              priority
            />
          </a>
        </div>

        {/* CENTER — Desktop nav only */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="px-4 py-2 rounded-xl font-heading font-bold text-sm text-muted hover:text-brand hover:bg-surface transition-all duration-200"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* LEFT — Cart + Mobile menu */}
        <div className="flex items-center gap-1">
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

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen(o => !o)}
            className="lg:hidden p-2 rounded-xl text-brand transition-colors"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-border px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl font-heading font-bold text-sm text-brand hover:bg-surface transition-all duration-200 text-right"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
