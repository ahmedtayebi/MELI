'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [scrolled, setScrolled] = useState(false)
  const cartCount = useCartStore((state) => state.totalItems())

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? 'rgba(14,11,9,0.85)'
          : 'rgba(14,11,9,0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled
          ? '1px solid rgba(200,150,60,0.18)'
          : '1px solid rgba(255,255,255,0.06)',
        boxShadow: scrolled
          ? '0 4px 32px rgba(0,0,0,0.4)'
          : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* RIGHT — Logo */}
        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex items-center"
        >
          <Image
            src="/logo.png"
            alt="MELY•IMA"
            width={100}
            height={40}
            style={{ width: 'auto', height: '34px', filter: 'brightness(1.1)' }}
            className="object-contain select-none"
            priority
          />
        </motion.a>

        {/* CENTER — Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map(({ label, href }, i) => (
            <motion.a
              key={label}
              href={href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
              className="relative px-4 py-2 rounded-lg font-heading font-bold text-sm text-white/60
                         hover:text-white transition-colors duration-200 group"
            >
              {label}
              <span
                className="absolute bottom-0.5 right-4 left-4 h-px rounded-full opacity-0
                           group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: 'linear-gradient(90deg, transparent, #C8963C, transparent)' }}
              />
            </motion.a>
          ))}
        </nav>

        {/* LEFT — Cart + Mobile menu */}
        <div className="flex items-center gap-1">
          <motion.button
            type="button"
            onClick={onCartClick}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            className="relative p-3 rounded-xl text-white/70 hover:text-white transition-colors duration-200 cursor-pointer"
            aria-label="عربة التسوق"
          >
            <ShoppingBag size={22} />
            <AnimatePresence>
              {mounted && cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -left-0.5 min-w-[18px] h-[18px] px-1
                             text-[#0E0B09] text-[10px] font-bold font-heading
                             rounded-full flex items-center justify-center leading-none"
                  style={{ background: 'linear-gradient(135deg, #C8963C, #F0C060)' }}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mobile menu button */}
          <motion.button
            type="button"
            onClick={() => setMenuOpen(o => !o)}
            whileTap={{ scale: 0.93 }}
            className="lg:hidden p-2 rounded-xl text-white/70 hover:text-white transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? 'x' : 'menu'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{ rotate:    90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden"
            style={{ background: 'rgba(14,11,9,0.97)', borderTop: '1px solid rgba(200,150,60,0.15)' }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl font-heading font-bold text-sm
                             text-white/70 hover:text-white hover:bg-white/5
                             transition-all duration-200 text-right"
                >
                  {label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
