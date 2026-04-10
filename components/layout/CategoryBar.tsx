'use client'

import { usePathname } from 'next/navigation'
import { TrendingUp, Sparkles, Percent } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Category } from '@/lib/types'

const SPECIAL_LINKS = [
  { label: 'التخفيضات',     href: '/discounts',    Icon: Percent,    hot: true  },
  { label: 'الأكثر مبيعاً', href: '/best-sellers', Icon: TrendingUp, hot: false },
  { label: 'الجديد',         href: '/new-arrivals',  Icon: Sparkles,  hot: false },
]

export default function CategoryBar({ categories }: { categories: Category[] }) {
  const pathname = usePathname()

  return (
    <nav
      className="sticky top-16 z-40 overflow-x-auto"
      style={{
        background: 'rgba(14,11,9,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(200,150,60,0.14)',
        scrollbarWidth: 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-11 min-w-max lg:min-w-0">

          {/* RIGHT — Category pills */}
          <div className="flex items-center gap-0.5">
            <NavPill label="الكل" href="/#products" active={false} />
            {categories.map((cat) => (
              <NavPill
                key={cat.id}
                label={cat.name}
                href={`/category/${cat.id}`}
                active={pathname === `/category/${cat.id}`}
              />
            ))}
          </div>

          {/* LEFT — Special links */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-4">
            {SPECIAL_LINKS.map(({ label, href, Icon, hot }) => {
              const isActive = pathname === href
              return (
                <motion.a
                  key={href}
                  href={href}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                             font-heading font-bold whitespace-nowrap transition-all duration-200"
                  style={{
                    color: isActive
                      ? '#C8963C'
                      : hot
                        ? '#E8A840'
                        : 'rgba(255,255,255,0.55)',
                    backgroundColor: isActive ? 'rgba(200,150,60,0.12)' : 'transparent',
                    border: hot && !isActive ? '1px solid rgba(200,150,60,0.35)' : 'none',
                  }}
                >
                  <Icon size={13} />
                  {label}
                </motion.a>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavPill({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="relative px-3 py-1.5 rounded-lg text-xs font-heading font-bold
                 whitespace-nowrap transition-colors duration-200"
      style={{
        color: active ? '#C8963C' : 'rgba(255,255,255,0.55)',
        backgroundColor: active ? 'rgba(200,150,60,0.12)' : 'transparent',
      }}
    >
      {label}
      {active && (
        <motion.span
          layoutId="cat-active"
          className="absolute bottom-0 right-3 left-3 h-px rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, #C8963C, transparent)' }}
        />
      )}
    </motion.a>
  )
}
