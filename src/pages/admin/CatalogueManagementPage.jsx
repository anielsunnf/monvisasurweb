import { useEffect, useState } from 'react'
import { getAllServices, updateService } from '../../api'
import { useTranslation } from 'react-i18next'

export function CatalogueManagementPage() {
  const { t } = useTranslation()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { getAllServices().then(setServices).finally(() => setLoading(false)) }, [])
  async function toggleService(service) {
    const next = { ...service, active: service.active === false }
    await updateService(service.id, next)
    setServices(current => current.map(item => item.id === service.id ? next : item))
  }
  return <main className="container page"><div className="section-header"><div><span className="eyebrow">{t('ui.backoffice')}</span><h1 className="section-title">{t('ui.catalogue_management')}</h1></div></div>{loading ? <div className="loading-state"><p>{t('ui.loading')}</p></div> : <div className="list">{services.map(service => <article className="list-card" key={service.id}><div><strong>{service.name}</strong><div className="meta-line"><span>{service.category}</span><span>{service.price.toLocaleString()} FCFA</span><span>{service.delay}</span></div></div><button type="button" className="btn btn-secondary" onClick={() => toggleService(service)}>{service.active === false ? t('ui.activate') : t('ui.deactivate')}</button></article>)}</div>}</main>
}
