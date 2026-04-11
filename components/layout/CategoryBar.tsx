'use client'

import { usePathname } from 'next/navigation'
import { TrendingUp, Sparkles, Percent } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Category } from '@/lib/types'

const SPECIAL_LINKS = [
  { label: 'التخفيضات',     href: '/discounts',    Icon: Percent,    hot: true  },
  { label: 'الأكثر مبيعاً', href: '/best-sellers', Icon: TrendingUp, hot: false },
  { label: 'الجديد',         href: '/new-arrivals',  Icon: Sparkles,   hot: false },
]

export default function CategoryBar({ categories }: { categories: Category[] }) {
  const pathname = usePathname()

  return (
    /*
      Header outer wrapper height: pt-3 (12px) + h-14 inner (56px) = 68px total.
      CategoryBar top must be 68px to sit flush below the floating pill.
    */
    <nav
      className="sticky z-40 overflow-x-auto"
      style={{
        top: '68px',
        background: 'rgba(255,251,244,0.94)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(232,221,208,0.85)',
        scrollbarWidth: 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-11 min-w-max lg:min-w-0">

          {/* RIGHT — Categories */}
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
                      ? '#1A1410'
                      : hot
                        ? '#B8872E'
                        : '#7A6A58',
                    backgroundColor: isActive ? 'rgba(26,20,16,0.06)' : 'transparent',
                    border: hot && !isActive ? '1px solid rgba(184,135,46,0.35)' : 'none',
                  }}
                >
                  <Icon size={12} />
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
        color: active ? '#1A1410' : '#7A6A58',
        backgroundColor: active ? 'rgba(26,20,16,0.07)' : 'transparent',
      }}
    >
      {label}
      {active && (
        <motion.span
          layoutId="cat-bar-active"
          className="absolute bottom-0 right-3 left-3 h-[1.5px] rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, #B8872E, transparent)' }}
        />
      )}
    </motion.a>
  )
}
