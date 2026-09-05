import { useEffect, useState } from 'react'
import { getNotifications } from '../../api'

export function NotificationsPage({ user }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { getNotifications(user.id).then(setNotifications).finally(() => setLoading(false)) }, [user.id])
  return <main className="container page"><div className="section-header"><div><span className="eyebrow">Suivi</span><h1 className="section-title">Notifications</h1></div></div>{loading ? <div className="loading-state"><p>Chargement...</p></div> : notifications.length === 0 ? <div className="empty-state">Aucune notification pour le moment.</div> : <div className="list">{notifications.map(notification => <article className="card" key={notification.id}><strong>{notification.title}</strong><p>{notification.message}</p></article>)}</div>}</main>
}
