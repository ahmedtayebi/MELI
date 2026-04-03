'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check } from 'lucide-react'

export default function SettingsClient({
  initialSettings,
}: {
  initialSettings: Record<string, string>
}) {
  const [policy, setPolicy] = useState(initialSettings.store_policy ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const supabase = createClient()

  const handleSave = async () => {
    setSaving(true)
    await supabase
      .from('store_settings')
      .upsert({ key: 'store_policy', value: policy }, { onConflict: 'key' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading font-black text-2xl text-brand">
        إعدادات المتجر
      </h1>

      <div className="bg-white rounded-xl border border-border p-6 space-y-4">
        <div>
          <label className="block font-heading font-bold text-sm text-brand mb-2 text-right">
            سياسة المتجر
          </label>
          <p className="text-xs text-muted font-body text-right mb-3">
            تظهر في صفحة كل منتج تحت معلومات الشحن والدفع
          </p>
          <textarea
            value={policy}
            onChange={e => setPolicy(e.target.value)}
            rows={4}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-brand placeholder:text-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 text-right resize-none"
            placeholder="أدخل سياسة المتجر..."
          />
        </div>

        <div className="flex justify-start">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading font-bold text-sm text-white transition-all"
            style={{ backgroundColor: saved ? '#16a34a' : '#8B1A2E' }}
          >
            {saved ? (
              <><Check size={16} /> تم الحفظ</>
            ) : saving ? (
              'جارٍ الحفظ...'
            ) : (
              'حفظ التغييرات'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
