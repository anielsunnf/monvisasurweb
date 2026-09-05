import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { getServices } from '../api'

export function CataloguePage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch(() => setError('Impossible de charger le catalogue.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main className="container page">
        <div className="loading-state">
          <div className="spinner" />
          <p>Chargement du catalogue...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container page">
        <div className="error-state">
          <p>⚠️ {error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="container page">
      <div className="section-header">
        <div>
          <span className="eyebrow">Prestations</span>
          <h1 className="section-title">Catalogue des services administratifs</h1>
          <p className="lead">{services.length} prestations disponibles</p>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="empty-state">
          <p>Aucune prestation disponible pour le moment.</p>
        </div>
      ) : (
        <div className="card-grid">
          {services.map(service => (
            <article key={service.id} className="card">
              <span className="chip">{service.category}</span>
              <h3>{service.name}</h3>
              <p className="small-muted">{service.description}</p>
              <div className="meta-line" style={{ margin: '0.75rem 0' }}>
                <span>⏱ {service.delay}</span>
                <strong>{service.price.toLocaleString()} FCFA</strong>
              </div>
              <ul className="doc-list">
                {service.documents.map(doc => (
                  <li key={doc}>📎 {doc}</li>
                ))}
              </ul>
              <div className="card-actions">
                <NavLink to={`/catalogue/${service.id}`} className="btn btn-ghost">
                  Détails
                </NavLink>
                <NavLink to="/login" className="btn btn-primary">
                  Ouvrir un dossier
                </NavLink>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}