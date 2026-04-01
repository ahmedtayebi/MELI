'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setPermission(Notification.permission)
    checkSubscription()
  }, [])

  const checkSubscription = async () => {
    if (!('serviceWorker' in navigator)) return
    const reg = await navigator.serviceWorker.getRegistration()
    if (!reg) return
    const sub = await reg.pushManager.getSubscription()
    setSubscribed(!!sub)
  }

  const subscribe = async () => {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready

      const perm = await Notification.requestPermission()
      setPermission(perm)
      if (perm !== 'granted') return

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ) as unknown as ArrayBuffer,
      })

      const subJson = sub.toJSON()
      const supabase = createClient()
      await supabase.from('push_subscriptions').upsert({
        endpoint: subJson.endpoint,
        p256dh: (subJson.keys as Record<string, string>).p256dh,
        auth: (subJson.keys as Record<string, string>).auth,
      }, { onConflict: 'endpoint' })

      setSubscribed(true)
    } catch (err) {
      console.error('Push subscription error:', err)
    } finally {
      setLoading(false)
    }
  }

  const unsubscribe = async () => {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.getRegistration()
      if (!reg) return
      const sub = await reg.pushManager.getSubscription()
      if (!sub) return

      const supabase = createClient()
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', sub.endpoint)

      await sub.unsubscribe()
      setSubscribed(false)
    } finally {
      setLoading(false)
    }
  }

  return { permission, subscribed, loading, subscribe, unsubscribe }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
