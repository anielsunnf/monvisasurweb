import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { getServiceById } from '../api'
import { localizeService } from '../data/services'
import { EmptyState } from '../components/EmptyState'
import { useI18n } from '../components/useI18n'

export function ServiceDetailPage() {
  const { language, t } = useI18n()
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getServiceById(id).then(setService).catch(() => setError(t('service_detail.load_error'))).finally(() => setLoading(false))
  }, [id, t])

  if (loading) return <main className="container page"><div className="loading-state"><p>{t('service_detail.loading')}</p></div></main>
  if (error) return <main className="container page"><div className="error-state" role="alert"><p>{error}</p><NavLink to="/catalogue" className="btn btn-primary">{t('service_detail.back')}</NavLink></div></main>
  if (!service) return <main className="container page"><EmptyState title={t('service_detail.unavailable')} description={t('service_detail.unavailable_description')} action={<NavLink to="/catalogue" className="btn btn-primary">{t('service_detail.back')}</NavLink>} /></main>

  const localizedService = localizeService(service, language)

  return (
    <main className="container page">
      <div className="section-header"><div><span className="eyebrow">{t('service_detail.eyebrow')}</span><h1 className="section-title">{localizedService.name}</h1></div><span className="chip">{localizedService.category}</span></div>
      <section className="panel">
        <p className="lead">{localizedService.description}</p>
        <div className="meta-line"><span>{t('service_detail.delay')}: {localizedService.delay}</span><strong>{localizedService.price.toLocaleString()} FCFA</strong></div>
        <h2>{t('service_detail.documents')}</h2>
        <ul>{localizedService.documents.map(document => <li key={document}>{document}</li>)}</ul>
        <NavLink to="/login" className="btn btn-primary">{t('service_detail.open_file')}</NavLink>
      </section>
    </main>
  )
}
