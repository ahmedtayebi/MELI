'use client'

import { useState } from 'react'
import { Star, Check } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function ReviewForm() {
  const [formData, setFormData] = useState({
    customer_name: '',
    rating: 0,
    comment: '',
  })
  const [hoveredRating, setHoveredRating] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.customer_name.trim()) next.customer_name = 'الاسم مطلوب'
    if (!formData.rating) next.rating = 'يرجى اختيار تقييم'
    if (!formData.comment.trim()) next.comment = 'الرأي مطلوب'
    else if (formData.comment.trim().length < 10) next.comment = 'الرأي قصير جداً'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await res.json()
      if (!res.ok || !result.success) throw new Error(result.error)
      setSubmitted(true)
    } catch {
      setErrors({ submit: 'حدث خطأ، حاولي مجدداً' })
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <Check size={28} className="text-green-600" strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-heading font-black text-lg text-brand mb-1">
            شكراً على رأيك!
          </p>
          {/* <p className="font-body text-muted text-sm">
            سيظهر تقييمك بعد مراجعته
          </p> */}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

      {/* Name */}
      <div>
        <label className="block font-heading font-bold text-sm text-brand mb-2 text-right">
          الاسم
        </label>
        <input
          value={formData.customer_name}
          onChange={e => setFormData(d => ({ ...d, customer_name: e.target.value }))}
          placeholder="فاطمة بن علي"
          className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm text-brand placeholder:text-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 text-right"
        />
        {errors.customer_name && (
          <p className="text-xs text-red-500 mt-1 text-right">{errors.customer_name}</p>
        )}
      </div>

      {/* Rating stars */}
      <div>
        <label className="block font-heading font-bold text-sm text-brand mb-2 text-right">
          التقييم
        </label>
        <div className="flex flex-row-reverse gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData(d => ({ ...d, rating: star }))}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform duration-100 hover:scale-110"
            >
              <Star
                size={32}
                fill={(hoveredRating || formData.rating) >= star ? '#8B1A2E' : 'none'}
                stroke={(hoveredRating || formData.rating) >= star ? '#8B1A2E' : '#E8E4DF'}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="text-xs text-red-500 mt-1 text-right">{errors.rating}</p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label className="block font-heading font-bold text-sm text-brand mb-2 text-right">
          رأيك
        </label>
        <textarea
          value={formData.comment}
          onChange={e => setFormData(d => ({ ...d, comment: e.target.value }))}
          placeholder="شاركينا تجربتك مع MELY•IMA..."
          rows={4}
          className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm text-brand placeholder:text-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 text-right resize-none"
        />
        {errors.comment && (
          <p className="text-xs text-red-500 mt-1 text-right">{errors.comment}</p>
        )}
      </div>

      {errors.submit && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-right">
          {errors.submit}
        </p>
      )}

      <Button type="submit" fullWidth size="lg" loading={submitting} disabled={submitting}>
        {submitting ? 'جارٍ الإرسال...' : 'إرسال التقييم'}
      </Button>

    </form>
  )
}
