'use client'

import { usePathname } from 'next/navigation'
import { TrendingUp, Sparkles, Percent } from 'lucide-react'
import type { Category } from '@/lib/types'

export default function CategoryBar({ categories }: { categories: Category[] }) {
  const pathname = usePathname()

  return (
    <nav
      className="sticky top-16 z-40 border-b overflow-x-auto"
      style={{ backgroundColor: '#eae3c5ff', borderColor: 'rgba(255,255,255,0.08)', scrollbarWidth: 'none' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-11 min-w-max lg:min-w-0">

          
          {/* RIGHT — Categories */}
          <div className="flex items-center gap-0.5">
            <a
              href="/#products"
              className="px-3 py-1.5 rounded-lg text-xs font-heading font-bold whitespace-nowrap transition-all duration-200"
              style={{ color: 'rgba(11, 10, 10, 0.75)' }}
            >
              الكل
            </a>
            {categories.map((cat) => {
              const isActive = pathname === `/category/${cat.id}`
              return (
                <a
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-heading font-bold whitespace-nowrap transition-all duration-200"
                  style={{
                    color: isActive ? '#1a1a1a' : 'rgba(10, 9, 9, 0.75)',
                    backgroundColor: isActive ? '#F5EDD9' : 'transparent',
                  }}
                >
                  {cat.name}
                </a>
              )
            })}
          </div>
{/* LEFT — Special links with icons */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-4">
            {[
              { label: 'التخفيضات',    href: '/discounts',    Icon: Percent    },
              { label: 'الأكثر مبيعاً', href: '/best-sellers', Icon: TrendingUp },
              { label: 'الجديد',        href: '/new-arrivals',  Icon: Sparkles  },
            ].map(({ label, href, Icon }) => {
              const isActive = pathname === href
              const isDiscounts = href === '/discounts'
              return (
                <a
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all duration-200 whitespace-nowrap"
                  style={{
                    color: isActive ? '#1a1a1a' : isDiscounts ? '#8B1A2E' : 'rgba(23, 23, 23, 0.75)',
                    backgroundColor: isActive ? '#F5EDD9' : 'transparent',
                    border: isDiscounts && !isActive ? '1px solid rgba(139,26,46,0.4)' : 'none',
                  }}
                >
                  <Icon size={13} />
                  {label}
                </a>
              )
            })}
          </div>


        </div>
      </div>
    </nav>
  )
}
