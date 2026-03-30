'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const CartDrawer = dynamic(() => import('@/components/store/CartDrawer'), { ssr: false })

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header onCartClick={() => setCartOpen(true)} />
      <div className="flex-1">{children}</div>
      <Footer />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
