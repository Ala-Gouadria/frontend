import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import { notificationsApi } from '../../api/notificationsApi'
import './Notifications.css'

const FILTERS = ['All', 'Read', 'Unread']

function NotificationIcon() {
  return (
    <svg viewBox="0 0 26 26" aria-hidden="true" className="notification-item__icon">
      <rect x="4" y="5" width="16" height="17" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 10h6M9 14h5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="19" cy="7" r="3.5" fill="#ffffff" stroke="currentColor" strokeWidth="1.5" />
      <path d="M19 5.7v2.6M17.7 7h2.6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export default function Notifications({ onNavigate }) {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('All')
  const [pendingId, setPendingId] = useState(null)

  useEffect(() => {
    let isMounted = true

    notificationsApi.listNotifications().then((items) => {
      if (isMounted) {
        setNotifications(items)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const visibleNotifications = useMemo(() => {
    if (filter === 'Read') {
      return notifications.filter((notification) => notification.read)
    }

    if (filter === 'Unread') {
      return notifications.filter((notification) => !notification.read)
    }

    return notifications
  }, [filter, notifications])

  const toggleRead = async (notification) => {
    setPendingId(notification.id)
    const updated = await notificationsApi.setRead(notification.id, !notification.read)

    setNotifications((items) => items.map((item) => (
      item.id === updated.id ? updated : item
    )))
    setPendingId(null)
  }

  const filterLabel = (key) => {
    if (key === 'All') return t('notifications.filterAll')
    if (key === 'Read') return t('notifications.filterRead')
    return t('notifications.filterUnread')
  }

  return (
    <main className="notifications-page">
      <Photo />
      <MainNav activeId="album" onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <section className="notifications-content">
        <header className="notifications-header">
          <h1>{t('notifications.title')}</h1>
          <p>{t('notifications.subtitle')}</p>
        </header>

        <div className="notifications-divider" />

        <div className="notifications-toolbar">
          <div className="notifications-tabs" role="tablist" aria-label="Notification filters">
            {FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                className={filter === item ? 'notifications-tabs__button notifications-tabs__button--active' : 'notifications-tabs__button'}
                onClick={() => setFilter(item)}
                role="tab"
                aria-selected={filter === item}
              >
                {filterLabel(item)}
              </button>
            ))}
          </div>

          <p className="notifications-count">{t('notifications.newCount', { count: unreadCount })}</p>
        </div>

        <div className="notifications-list">
          {visibleNotifications.map((notification) => (
            <article
              key={notification.id}
              className={`notification-item ${notification.read ? 'notification-item--read' : ''}`}
            >
              <NotificationIcon />

              <div className="notification-item__copy">
                <h2>{notification.source}</h2>
                <strong>{notification.title}</strong>
                <p>{notification.message}</p>
              </div>

              <span className="notification-item__time">{notification.time}</span>

              <button
                type="button"
                className="notification-item__action"
                onClick={() => toggleRead(notification)}
                disabled={pendingId === notification.id}
              >
                {notification.read ? t('notifications.markAsUnread') : t('notifications.markAsRead')}
              </button>
            </article>
          ))}
        </div>
      </section>

      <BottomAIStatusTools />
    </main>
  )
}
