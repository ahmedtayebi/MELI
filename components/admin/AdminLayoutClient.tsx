'use client'

import { usePathname } from 'next/navigation'
import AdminSidebar from './AdminSidebar'
import AdminBottomNav from './AdminBottomNav'

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#fffbf1]" dir="rtl">
      <AdminSidebar />
      <main className="lg:mr-64 min-h-screen p-5 lg:p-8 pb-24 lg:pb-8">
        {children}
      </main>
      <AdminBottomNav />
    </div>
  )
}
