import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getServices } from '../api'
import { localizeService } from '../data/services'
import { destinations } from '../data/destinations'
import { useI18n } from '../components/useI18n'

export function HomePage() {
  const { t, language } = useI18n()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getServices()
      .then(data => setServices(data.slice(0, 3)))
      .catch(() => setError(t('common.load_services_error')))
      .finally(() => setLoading(false))
  }, [t])

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="eyebrow">{t('home.eyebrow')}</span>
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
            <div className="kicker">{t('home.support')}</div>
            <div className="metric-grid">
              <div className="metric">
                <strong>14K+</strong>
                <span>{t('home.clients')}</span>
              </div>
              <div className="metric">
                <strong>96%</strong>
                <span>{t('home.files_processed')}</span>
              </div>
              <div className="metric">
                <strong>3 min</strong>
                <span>{t('home.opening_time')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-intro container" aria-labelledby="editorial-title">
        <div className="editorial-image" role="img" aria-label="Accompagnement Monvisasur pour vos projets de mobilité" />
        <div className="editorial-copy">
          <span className="eyebrow">Monvisasur</span>
          <h2 id="editorial-title">Des démarches claires pour avancer sereinement.</h2>
          <p>Un même espace pour préparer vos documents, suivre vos demandes et organiser vos déplacements. Chaque étape est pensée pour vous laisser le temps de comprendre et d’agir.</p>
          <div className="editorial-points">
            <span><strong>01</strong> Choisir la bonne prestation</span>
            <span><strong>02</strong> Préparer un dossier complet</span>
            <span><strong>03</strong> Suivre chaque avancée</span>
          </div>
        </div>
      </section>

      {/* PRESTATIONS */}
      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">{t('popular')}</h2>
          <NavLink to="/catalogue" className="btn btn-ghost">
            {t('discover')}
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
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>{t('common.retry')}</button>
          </div>
        ) : services.length === 0 ? (
          <div className="empty-state">{t('common.no_services')}</div>
        ) : (
          <div className="card-grid">
            {services.map(service => {
              const localizedService = localizeService(service, language)
              return <article key={service.id} className="card">
                <span className="chip">{localizedService.category}</span>
                <h3>{localizedService.name}</h3>
                <p className="small-muted">{localizedService.description}</p>
                <div className="meta-line">
                  <span>⏱ {localizedService.delay}</span>
                  <strong>{localizedService.price.toLocaleString()} FCFA</strong>
                </div>
                <NavLink
                  to={`/catalogue/${service.id}`}
                  className="btn btn-secondary"
                  style={{ marginTop: '1rem' }}
                >
                  {t('common.view_details')}
                </NavLink>
              </article>
            })}
          </div>
        )}
      </section>

      <section className="destination-section section" aria-labelledby="destinations-title">
        <div className="container">
          <div className="section-header destination-heading">
            <div>
              <span className="eyebrow">Voyager au Cameroun</span>
              <h2 id="destinations-title" className="section-title">Des villes qui donnent envie d’avancer.</h2>
            </div>
            <p>Préparez votre prochain départ avec des informations simples et un accompagnement qui reste proche de votre réalité.</p>
          </div>
          <div className="destination-grid">
            {destinations.map(destination => (
              <article className="destination-card" key={destination.city}>
                <img src={destination.image} alt={destination.alt} loading="lazy" />
                <div className="destination-card-body">
                  <span className="eyebrow">{destination.region}</span>
                  <h3>{destination.city}</h3>
                  <p>{destination.description}</p>
                  <NavLink to={`/trajets?to=${encodeURIComponent(destination.city)}`} className="destination-link">Voir les trajets <span aria-hidden="true">→</span></NavLink>
                </div>
              </article>
            ))}
          </div>
        </div>
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
              <p>{t('home.step1_desc')}</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>{t('open')}</h3>
              <p>{t('home.step2_desc')}</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>{t('track')}</h3>
              <p>{t('home.step3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
