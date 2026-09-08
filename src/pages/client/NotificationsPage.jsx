import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getNotifications } from '../../api'

export function NotificationsPage({ user }) {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { getNotifications(user.id).then(setNotifications).finally(() => setLoading(false)) }, [user.id])
  return <main className="container page"><div className="section-header"><div><span className="eyebrow">{t('notifications.eyebrow')}</span><h1 className="section-title">{t('notifications.title')}</h1></div></div>{loading ? <div className="loading-state"><p>{t('client_dashboard.loading')}</p></div> : notifications.length === 0 ? <div className="empty-state">{t('notifications.empty')}</div> : <div className="list">{notifications.map(notification => <article className="card" key={notification.id}><strong>{notification.title}</strong><p>{notification.message}</p></article>)}</div>}</main>
}
