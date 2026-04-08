'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { usePushNotifications } from '@/lib/use-push-notifications'

export default function NotificationToggle() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { permission, subscribed, loading, subscribe, unsubscribe } = usePushNotifications()

  if (!mounted) return null

  if (permission === 'denied') {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-400/20">
        <BellOff size={16} className="text-red-400" />
        <span className="text-xs font-body text-red-400">الإشعارات محجوبة</span>
      </div>
    )
  }

  return (
    <button
      onClick={subscribed ? unsubscribe : subscribe}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 w-full ${
        subscribed
          ? 'bg-green-500/10 border-green-400/20 hover:bg-green-500/20'
          : 'bg-white/5 border-white/10 hover:bg-white/10'
      }`}
    >
      {subscribed ? (
        <Bell size={16} className="text-green-400" />
      ) : (
        <BellOff size={16} className="text-white/40" />
      )}
      <span className={`text-xs font-heading font-bold ${
        subscribed ? 'text-green-400' : 'text-white/40'
      }`}>
        {loading ? '...' : subscribed ? 'الإشعارات فعّالة' : 'تفعيل الإشعارات'}
      </span>
    </button>
  )
}
