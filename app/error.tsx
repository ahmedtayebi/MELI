'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-sm">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
          <span className="text-3xl">⚠️</span>
        </div>
        <div>
          <h1 className="font-heading font-black text-2xl text-brand mb-2">
            حدث خطأ ما
          </h1>
          <p className="text-sm text-muted font-body">
            عذراً، حدث خطأ غير متوقع. يرجى المحاولة مجدداً.
          </p>
        </div>
        <Button onClick={reset} size="lg">
          حاولي مجدداً
        </Button>
      </div>
    </div>
  )
}
