'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import CategoryBar from '@/components/layout/CategoryBar'
import Footer from '@/components/layout/Footer'
import dynamic from 'next/dynamic'
import type { Category } from '@/lib/types'

const CartDrawer = dynamic(
  () => import('@/components/store/CartDrawer'),
  { ssr: false }
)

export default function StoreLayoutClient({
  children,
  categories,
}: {
  children: React.ReactNode
  categories: Category[]
}) {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FFFDF9' }}>
      <Header onCartClick={() => setCartOpen(true)} />
      <CategoryBar categories={categories} />
      <div className="flex-1">{children}</div>
      <Footer />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
