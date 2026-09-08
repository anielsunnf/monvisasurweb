import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { cancelAppointment, cancelOrder, getAppointments, getDossiers, getOrders } from '../../api'
import { StatusBadge } from '../../components/StatusBadge'
import { EmptyState } from '../../components/EmptyState'
import { useI18n } from '../../components/useI18n'

export function ClientDashboard({ user }) {
  const { t } = useI18n()
  const [dossiers, setDossiers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState([])
  const [appointments, setAppointments] = useState([])
  const [orderError, setOrderError] = useState('')

  useEffect(() => {
    Promise.all([getDossiers(user.id), getOrders(user.id), getAppointments(user.id)])
      .then(([nextDossiers, nextOrders, nextAppointments]) => { setDossiers(nextDossiers); setOrders(nextOrders); setAppointments(nextAppointments) })
      .catch(() => setError('Impossible de charger vos données client.'))
      .finally(() => setLoading(false))
  }, [user.id])

  async function handleCancel(orderId) {
    setOrderError('')
    try {
      await cancelOrder(orderId, user.id)
      setOrders(current => current.map(order => order.id === orderId ? { ...order, status: 'annulée' } : order))
    } catch (error) {
      setOrderError(error.message)
    }
  }

  async function handleCancelAppointment(appointmentId) {
    await cancelAppointment(appointmentId, user.id)
    setAppointments(current => current.map(appointment => appointment.id === appointmentId ? { ...appointment, status: 'annulé' } : appointment))
  }

  return (
    <main className="container page">
      <div className="section-header">
        <div>
          <span className="eyebrow">{t('client')}</span>
          <h1 className="section-title">{t('client')}</h1>
        </div>
        <NavLink to="/client/dossiers/nouveau" className="btn btn-primary">{t('newCase')}</NavLink>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <h2>Mes dossiers</h2>
          {loading ? (
            <div className="loading-state"><p>Chargement...</p></div>
          ) : error ? (
            <div className="error-state" role="alert"><p>{error}</p><button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>Réessayer</button></div>
          ) : dossiers.length === 0 ? (
            <EmptyState
              title="Aucun dossier"
              description="Aucun dossier n'est encore enregistré pour votre compte."
              action={<NavLink to="/client/dossiers/nouveau" className="btn btn-primary">Créer mon premier dossier</NavLink>}
            />
          ) : (
            <div className="list">
              {dossiers.map(dossier => (
                <article key={dossier.id} className="list-card">
                  <div>
                    <strong>{dossier.service}</strong>
                    <div className="meta-line"><span>{dossier.id}</span><span>{dossier.date}</span></div>
                  </div>
                  <div>
                    <StatusBadge status={dossier.status} />
                    <NavLink to={`/client/dossiers/${dossier.id}`} className="btn btn-ghost">Voir détail</NavLink>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="summary-box">
          <h3>Mes commandes</h3>
          {orders.length === 0 ? <p className="small-muted">Aucune réservation confirmée.</p> : (
            <div className="list">
              {orders.map(order => (
                <article key={order.id} className="card">
                  <strong>{order.route}</strong>
                  <div className="meta-line"><span>{order.id}</span><span>{order.date}</span></div>
                  <div className="meta-line"><span>{order.passengers.length} passager{order.passengers.length > 1 ? 's' : ''}</span><strong>{order.total.toLocaleString()} {order.currency}</strong></div>
                  <StatusBadge status={order.status === 'annulée' ? 'cancelled' : 'confirmed'} />
                  <div className="card-actions"><NavLink to={`/billet/${order.reference}`} className="btn btn-ghost">Voir le billet</NavLink>{order.status !== 'annulée' && <button type="button" className="btn btn-ghost" onClick={() => handleCancel(order.id)}>Annuler</button>}</div>
                </article>
              ))}
            </div>
          )}
          {orderError && <p className="field-error" role="alert">{orderError}</p>}
          <h3 style={{ marginTop: '1.5rem' }}>Mes rendez-vous</h3>
          {appointments.length === 0 ? <p className="small-muted">Aucun rendez-vous planifié.</p> : appointments.map(appointment => <div className="appointment-row" key={appointment.id}><p className="small-muted">{appointment.date} à {appointment.slot} : {appointment.reason}<br /><StatusBadge status={appointment.status === 'annulé' ? 'cancelled' : 'confirmed'} /></p>{appointment.status !== 'annulé' && <button type="button" className="btn btn-ghost" onClick={() => handleCancelAppointment(appointment.id)}>Annuler</button>}</div>)}
          <NavLink to="/rendez-vous" className="btn btn-secondary">Prendre rendez-vous</NavLink>
          <NavLink to="/client/notifications" className="btn btn-secondary">Voir mes notifications</NavLink>
          <h3 style={{ marginTop: '1.5rem' }}>Accès rapide</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <NavLink to="/catalogue" className="btn btn-secondary">Catalogue des prestations</NavLink>
            <NavLink to="/trajets" className="btn btn-secondary">Réserver un billet</NavLink>
          </div>
          <p className="small-muted" style={{ marginTop: '1rem' }}>Votre profil est associé à l’adresse saisie lors de la connexion.</p>
        </aside>
      </div>
    </main>
  )
}
