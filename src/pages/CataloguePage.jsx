import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { getServices } from '../api'
import { localizeService } from '../data/services'
import { useI18n } from '../components/useI18n'

const serviceImages = {
  'visa-schengen': { src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85', alt: 'Architecture parisienne' },
  'titre-sejour': { src: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=85', alt: 'Entrée d’un logement' },
  traduction: { src: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85', alt: 'Écriture et documents' },
  'lettre-invitation': { src: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=85', alt: 'Carnet et lettre' },
  apostille: { src: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=85', alt: 'Documents administratifs' },
  equivalence: { src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85', alt: 'Étudiants réunis' },
}

export function CataloguePage() {
  const { t, language } = useI18n()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch(() => setError(t('common.load_catalogue_error')))
      .finally(() => setLoading(false))
  }, [t])

  if (loading) {
    return (
      <main className="container page">
        <div className="loading-state">
          <div className="spinner" />
          <p>{t('common.loading')}</p>
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
            {t('common.retry')}
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="container page catalogue-page">
      <div className="section-header">
        <div>
          <span className="eyebrow">{t('catalogue.eyebrow')}</span>
          <h1 className="section-title">{t('catalogue')}</h1>
          <p className="lead">{t('catalogue.available_count', { count: services.length })}</p>
        </div>
      </div>

      <div className="page-intro-band">
        <div>
          <span className="eyebrow">Un accompagnement sur mesure</span>
          <h2>Du premier document au dernier suivi.</h2>
        </div>
        <p>Parcourez nos prestations, comparez les délais et ouvrez votre dossier quand vous êtes prêt. Les informations importantes restent visibles à chaque étape.</p>
      </div>

      {services.length === 0 ? (
        <div className="empty-state">
          <p>{t('common.no_services')}</p>
        </div>
      ) : (
        <div className="card-grid">
          {services.map(service => {
            const localizedService = localizeService(service, language)
            const visual = serviceImages[service.id]
            return <article key={service.id} className="card service-card">
              <img className="service-card-image" src={visual.src} alt={visual.alt} loading="lazy" />
              <div className="service-card-content">
              <span className="chip">{localizedService.category}</span>
              <h3>{localizedService.name}</h3>
              <p className="small-muted">{localizedService.description}</p>
              <div className="meta-line" style={{ margin: '0.75rem 0' }}>
                <span>⏱ {localizedService.delay}</span>
                <strong>{localizedService.price.toLocaleString()} FCFA</strong>
              </div>
              <ul className="doc-list">
                {localizedService.documents.map(doc => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
              <div className="card-actions">
                <NavLink to={`/catalogue/${service.id}`} className="btn btn-primary">
                  En savoir plus
                </NavLink>
              </div>
              </div>
            </article>
          })}
        </div>
      )}
    </main>
  )
}
