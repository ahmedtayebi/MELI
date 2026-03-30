import type { Metadata } from 'next'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminBottomNav from '@/components/admin/AdminBottomNav'

export const metadata: Metadata = {
  title: 'MELY•IMA — لوحة التحكم',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface" dir="rtl">
      <AdminSidebar />
      {/* mr-64 → clears the right-side sidebar in RTL */}
      <main className="lg:mr-64 min-h-screen p-5 lg:p-8 pb-24 lg:pb-8">
        {children}
      </main>
      <AdminBottomNav />
    </div>
  )
}
