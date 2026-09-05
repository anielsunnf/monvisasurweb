import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { getServiceById } from '../api'
import { EmptyState } from '../components/EmptyState'

export function ServiceDetailPage() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getServiceById(id).then(setService).catch(() => setError('Impossible de charger cette prestation.')).finally(() => setLoading(false))
  }, [id])

  if (loading) return <main className="container page"><div className="loading-state"><p>Chargement de la prestation...</p></div></main>
  if (error) return <main className="container page"><div className="error-state" role="alert"><p>{error}</p><NavLink to="/catalogue" className="btn btn-primary">Retour au catalogue</NavLink></div></main>
  if (!service) return <main className="container page"><EmptyState title="Prestation introuvable" description="Cette prestation n'existe pas ou n'est plus disponible." action={<NavLink to="/catalogue" className="btn btn-primary">Retour au catalogue</NavLink>} /></main>

  return (
    <main className="container page">
      <div className="section-header"><div><span className="eyebrow">Prestation</span><h1 className="section-title">{service.name}</h1></div><span className="chip">{service.category}</span></div>
      <section className="panel">
        <p className="lead">{service.description}</p>
        <div className="meta-line"><span>Délai : {service.delay}</span><strong>{service.price.toLocaleString()} FCFA</strong></div>
        <h2>Pièces nécessaires</h2>
        <ul>{service.documents.map(document => <li key={document}>{document}</li>)}</ul>
        <NavLink to="/login" className="btn btn-primary">Ouvrir un dossier</NavLink>
      </section>
    </main>
  )
}