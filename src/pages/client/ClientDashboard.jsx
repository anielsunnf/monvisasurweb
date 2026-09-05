import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { getDossiers, getOrders } from '../../api'
import { StatusBadge } from '../../components/StatusBadge'
import { EmptyState } from '../../components/EmptyState'

export function ClientDashboard({ user }) {
  const [dossiers, setDossiers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState([])

  useEffect(() => {
    Promise.all([getDossiers(user.id), getOrders(user.id)])
      .then(([nextDossiers, nextOrders]) => { setDossiers(nextDossiers); setOrders(nextOrders) })
      .catch(() => setError('Impossible de charger vos données client.'))
      .finally(() => setLoading(false))
  }, [user.id])

  return (
    <main className="container page">
      <div className="section-header">
        <div>
          <span className="eyebrow">Espace client</span>
          <h1 className="section-title">Mon espace client</h1>
        </div>
        <NavLink to="/client/dossiers/nouveau" className="btn btn-primary">Ouvrir un dossier</NavLink>
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
                  <StatusBadge status="confirmed" />
                </article>
              ))}
            </div>
          )}
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
