import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-sm">
        <p className="font-heading font-black text-8xl text-border select-none">404</p>
        <div>
          <h1 className="font-heading font-black text-2xl text-brand mb-2">
            الصفحة غير موجودة
          </h1>
          <p className="text-sm text-muted font-body">
            الرابط الذي زرتِه غير موجود أو تم نقله.
          </p>
        </div>
        <Link href="/">
          <Button size="lg">العودة للرئيسية</Button>
        </Link>
      </div>
    </div>
  )
}
