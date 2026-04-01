self.addEventListener('push', function(event) {
  if (!event.data) return

  const data = event.data.json()

  const options = {
    body: data.body,
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/admin' },
    actions: [
      { action: 'open', title: 'فتح الطلبات' },
      { action: 'close', title: 'إغلاق' },
    ],
    dir: 'rtl',
    lang: 'ar',
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()

  if (event.action === 'close') return

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        const url = event.notification.data.url || '/admin'
        for (const client of clientList) {
          if (client.url.includes('/admin') && 'focus' in client) {
            return client.focus()
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url)
        }
      })
  )
})
