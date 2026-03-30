'use client'

import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/cart-store'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { wilayas } from '@/lib/wilayas'
import { cn } from '@/lib/utils'

interface OrderFormProps {
  onSuccess: () => void
}

interface FormData {
  customer_name: string
  phone: string
  wilaya: string
}

interface FormErrors {
  customer_name?: string
  phone?: string
  wilaya?: string
}

export default function OrderForm({ onSuccess }: OrderFormProps) {
  const items = useCartStore((state) => state.items)
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  const [formData, setFormData] = useState<FormData>({
    customer_name: '',
    phone: '',
    wilaya: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [summaryOpen, setSummaryOpen] = useState(false)

  const validate = (): boolean => {
    const next: FormErrors = {}

    if (!formData.customer_name.trim()) {
      next.customer_name = 'الاسم الكامل مطلوب'
    }

    const phone = formData.phone.replace(/\s+/g, '')
    if (!phone) {
      next.phone = 'رقم الهاتف مطلوب'
    } else if (!/^0[567]\d{8}$/.test(phone)) {
      next.phone = 'رقم غير صحيح — يبدأ بـ 05، 06 أو 07 ويحتوي 10 أرقام'
    }

    if (!formData.wilaya) {
      next.wilaya = 'يرجى اختيار الولاية'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.customer_name.trim(),
          phone: formData.phone.replace(/\s+/g, ''),
          wilaya: formData.wilaya,
          items,
        }),
      })

      const result = await res.json()

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'حدث خطأ، حاولي مجدداً')
      }

      setOrderId(result.order_id)
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'حدث خطأ في الاتصال، حاولي مجدداً'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success screen ──────────────────────────────────────────
  if (orderId) {
    return (
      <div className="flex flex-col items-center text-center gap-5 py-2">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
        >
          <Check size={30} className="text-green-600" strokeWidth={2.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="font-heading font-black text-xl text-brand mb-1.5">
            تم استلام طلبك بنجاح!
          </h3>
          <p className="text-muted font-body text-sm">
            سنتصل بكِ قريباً على الرقم المُدخل
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-surface rounded-xl px-8 py-3 border border-border"
        >
          <p className="text-xs text-muted font-body mb-1">رقم الطلب</p>
          <p className="font-heading font-black text-lg text-accent tracking-widest">
            #{orderId.slice(-8).toUpperCase()}
          </p>
        </motion.div>

        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <Button fullWidth size="lg" onClick={onSuccess}>
            العودة للمتجر
          </Button>
        </motion.div>
      </div>
    )
  }

  // ── Order form ──────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <p className="text-sm text-muted font-body -mt-1 mb-1">
        سنتواصل معكِ في أقرب وقت
      </p>

      {/* Collapsible order summary */}
      <div>
        <button
          type="button"
          onClick={() => setSummaryOpen((o) => !o)}
          className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-surface border border-border font-heading font-bold text-sm text-brand hover:border-brand transition-colors"
        >
          {/* Text — right side in RTL (first child) */}
          <span>ملخص الطلب ({totalItems} قطعة)</span>
          {/* Chevron — left side in RTL (last child) */}
          <ChevronDown
            size={16}
            className={cn(
              'text-muted transition-transform duration-200 flex-shrink-0',
              summaryOpen && 'rotate-180'
            )}
          />
        </button>

        {summaryOpen && (
          <div className="mt-2 rounded-xl bg-surface border border-border divide-y divide-border">
            {items.map((item) => (
              <div
                key={`${item.product_id}-${item.color_id}-${item.size_id}`}
                className="py-2 px-3 flex items-center gap-2"
              >
                {/* Product name — right (first child in RTL) */}
                <span className="font-heading font-bold text-sm text-brand flex-1 truncate">
                  {item.product_name}
                </span>
                {/* Details — middle */}
                <span className="text-xs text-muted font-body flex-shrink-0">
                  {item.color_name} / {item.size_label}
                </span>
                {/* Qty — left (last child in RTL) */}
                <span className="text-xs text-muted font-body flex-shrink-0 tabular-nums">
                  ×{item.quantity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Field: Full name */}
      <Input
        label="الاسم الكامل"
        placeholder="احمد الطيبي"
        value={formData.customer_name}
        onChange={(e) =>
          setFormData((d) => ({ ...d, customer_name: e.target.value }))
        }
        error={errors.customer_name}
        autoComplete="name"
      />

      {/* Field: Phone — ltr for numeric readability */}
      <Input
        label="رقم الهاتف"
        type="tel"
        placeholder="0699596108"
        value={formData.phone}
        onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
        error={errors.phone}
        dir="ltr"
        className="text-left placeholder:text-right"
        autoComplete="tel"
        inputMode="numeric"
      />

      {/* Field: Wilaya */}
      <Select
        label="الولاية"
        options={wilayas}
        placeholder="اختاري الولاية"
        value={formData.wilaya}
        onChange={(e) => setFormData((d) => ({ ...d, wilaya: e.target.value }))}
        error={errors.wilaya}
      />

      {/* API error */}
      {submitError && (
        <p className="text-sm text-red-500 font-body bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-right">
          {submitError}
        </p>
      )}

      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={submitting}
        disabled={submitting}
      >
        {submitting ? 'جارٍ الإرسال...' : 'إرسال الطلب'}
      </Button>
    </form>
  )
}
