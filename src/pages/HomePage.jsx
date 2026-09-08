import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getServices } from '../api'
import { useI18n } from '../components/useI18n'

export function HomePage() {
  const { t } = useI18n()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getServices()
      .then(data => setServices(data.slice(0, 3)))
      .catch(() => setError('Impossible de charger les prestations.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="eyebrow">Mobilité internationale</span>
            <h1>{t('heroTitle')}</h1>
            <p className="lead">
              {t('heroText')}
            </p>
            <div className="cta-row">
              <NavLink to="/catalogue" className="btn btn-primary">
                {t('catalogue')}
              </NavLink>
              <NavLink to="/trajets" className="btn btn-secondary">
                {t('searchTrip')}
              </NavLink>
            </div>
          </div>

          <div className="hero-panel">
            <div className="kicker">Mieux accompagné</div>
            <div className="metric-grid">
              <div className="metric">
                <strong>14K+</strong>
                <span>clients suivis</span>
              </div>
              <div className="metric">
                <strong>96%</strong>
                <span>dossiers traités</span>
              </div>
              <div className="metric">
                <strong>3 min</strong>
                <span>pour ouvrir un dossier</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRESTATIONS */}
      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">{t('popular')}</h2>
          <NavLink to="/catalogue" className="btn btn-ghost">
            {t('discover')} →
          </NavLink>
        </div>

        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="card skeleton" />
            ))}
          </div>
        ) : error ? (
          <div className="error-state" role="alert">
            <p>{error}</p>
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>Réessayer</button>
          </div>
        ) : services.length === 0 ? (
          <div className="empty-state">Aucune prestation disponible pour le moment.</div>
        ) : (
          <div className="card-grid">
            {services.map(service => (
              <article key={service.id} className="card">
                <span className="chip">{service.category}</span>
                <h3>{service.name}</h3>
                <p className="small-muted">{service.description}</p>
                <div className="meta-line">
                  <span>⏱ {service.delay}</span>
                  <strong>{service.price.toLocaleString()} FCFA</strong>
                </div>
                <NavLink
                  to={`/catalogue/${service.id}`}
                  className="btn btn-secondary"
                  style={{ marginTop: '1rem' }}
                >
                  Voir les détails
                </NavLink>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* COMMENT CA MARCHE */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            {t('how')}
          </h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>{t('choose')}</h3>
              <p>Parcourez notre catalogue et sélectionnez le service dont vous avez besoin.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>{t('open')}</h3>
              <p>Remplissez le formulaire et téléversez vos documents en quelques minutes.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>{t('track')}</h3>
              <p>Un conseiller traite votre dossier et vous tient informé à chaque étape.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section container" style={{ textAlign: 'center' }}>
        <h2>{t('start')}</h2>
        <p className="lead">Créez votre compte gratuitement et gérez toute votre mobilité en un seul endroit.</p>
        <NavLink to="/login" className="btn btn-primary">
          {t('create')}
        </NavLink>
      </section>
    </main>
  )
}