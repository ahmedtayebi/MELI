import type { Metadata } from 'next'
import AdminLayoutClient from '@/components/admin/AdminLayoutClient'

export const metadata: Metadata = {
  title: 'MELY•IMA — لوحة التحكم',
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
