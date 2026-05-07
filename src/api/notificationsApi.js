// TODO(backend): no upstream endpoint — this module stays mock until a notifications service is built
const NOTIFICATIONS = Array.from({ length: 12 }, (_, index) => ({
  id: `notification-${index + 1}`,
  source: 'Social Media Manager',
  title: 'Campaign published',
  message: 'Nora published the Instagram campaign and started tracking engagement.',
  time: '2m Ago',
  read: index === 2 || index === 3,
}))

function delay(ms) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms))
}

let notifications = NOTIFICATIONS.map((notification) => ({ ...notification }))

export const notificationsApi = {
  async listNotifications() {
    await delay(140)
    return notifications.map((notification) => ({ ...notification }))
  },

  async setRead(notificationId, read) {
    await delay(160)
    notifications = notifications.map((notification) => (
      notification.id === notificationId ? { ...notification, read } : notification
    ))

    return notifications.find((notification) => notification.id === notificationId)
  },
}
