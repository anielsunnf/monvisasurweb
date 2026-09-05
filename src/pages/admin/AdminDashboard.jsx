import { useEffect, useState } from 'react'
import { getAllDossiers, requestDossierDocument, updateDossierStatus } from '../../api'
import { StatusBadge } from '../../components/StatusBadge'
import { EmptyState } from '../../components/EmptyState'
import { NavLink } from 'react-router-dom'

const statusOptions = [
  { value: 'en_cours', label: 'En cours' },
  { value: 'en_validation', label: 'En validation' },
  { value: 'documents_requis', label: 'Pièces manquantes' },
  { value: 'confirmed', label: 'Confirmé' },
  { value: 'cancelled', label: 'Annulé' },
]

export function AdminDashboard() {
  const [dossiers, setDossiers] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [documentRequest, setDocumentRequest] = useState('')

  useEffect(() => {
    getAllDossiers().then(setDossiers).catch(() => setError('Impossible de charger les dossiers.')).finally(() => setLoading(false))
  }, [])

  async function handleUpdate() {
    if (!selectedId || !status) return
    await updateDossierStatus(selectedId, status)
    setDossiers(current => current.map(dossier => dossier.id === selectedId ? { ...dossier, status } : dossier))
  }

  async function handleDocumentRequest() {
    if (!selectedId || !documentRequest.trim()) return
    await requestDossierDocument(selectedId, documentRequest)
    setDossiers(current => current.map(dossier => dossier.id === selectedId ? { ...dossier, additionalRequest: documentRequest } : dossier))
    setDocumentRequest('')
  }

  const counts = {
    total: dossiers.length,
    current: dossiers.filter(dossier => dossier.status === 'en_cours').length,
    confirmed: dossiers.filter(dossier => dossier.status === 'confirmed' || dossier.status === 'confirmé').length,
  }
  const selectedDossier = dossiers.find(dossier => dossier.id === selectedId)

  return (
    <main className="container page">
      <div className="section-header"><div><span className="eyebrow">Back-office</span><h1 className="section-title">Administration</h1></div></div>
      <div className="card-actions"><NavLink to="/admin/catalogue" className="btn btn-secondary">Gérer le catalogue</NavLink><NavLink to="/admin/trajets" className="btn btn-secondary">Gérer les trajets</NavLink></div>
      <div className="grid-3" style={{ marginBottom: '1rem' }}>
        <div className="metric"><strong>{counts.total}</strong><span>Total dossiers</span></div>
        <div className="metric"><strong>{counts.current}</strong><span>Dossiers en cours</span></div>
        <div className="metric"><strong>{counts.confirmed}</strong><span>Dossiers confirmés</span></div>
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <h2>Tous les dossiers</h2>
          {loading ? <div className="loading-state"><p>Chargement...</p></div> : error ? (
            <div className="error-state" role="alert"><p>{error}</p><button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>Réessayer</button></div>
          ) : dossiers.length === 0 ? (
            <EmptyState title="Aucun dossier" description="Aucun dossier n'a encore été soumis par un utilisateur." />
          ) : (
            <div className="list">
              {dossiers.map(dossier => (
                <button key={dossier.id} type="button" className="list-card" onClick={() => { setSelectedId(dossier.id); setStatus(dossier.status) }}>
                  <span><strong>{dossier.id}</strong><span className="meta-line">{dossier.service} · {dossier.date}</span></span>
                  <StatusBadge status={dossier.status} />
                </button>
              ))}
            </div>
          )}
        </section>
        <aside className="summary-box">
          <h3>Gestion du dossier</h3>
          {!selectedId ? <p className="small-muted">Sélectionnez un dossier pour modifier son statut.</p> : (
            <>
              <p className="small-muted">Dossier sélectionné : {selectedId}</p>
              {selectedDossier && <div className="detail-summary">
                <p><strong>Prestation :</strong> {selectedDossier.service}</p>
                <p><strong>Nationalité :</strong> {selectedDossier.nationality || 'Non renseignée'}</p>
                <p><strong>Destination :</strong> {selectedDossier.destination || 'Non renseignée'}</p>
                <p><strong>Motif :</strong> {selectedDossier.motif || 'Non renseigné'}</p>
                <p><strong>Pièces :</strong> {(selectedDossier.documents || []).join(', ') || 'Aucune'}</p>
              </div>}
              <div className="field"><label htmlFor="document-request">Demander une pièce complémentaire</label><textarea id="document-request" rows="3" value={documentRequest} onChange={event => setDocumentRequest(event.target.value)} placeholder="Ex : justificatif de domicile récent" /><button type="button" className="btn btn-secondary" onClick={handleDocumentRequest}>Envoyer la demande</button></div>
              <div className="field"><label htmlFor="admin-status">Nouveau statut</label><select id="admin-status" value={status} onChange={event => setStatus(event.target.value)}><option value="">Sélectionner</option>{statusOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
              <button type="button" className="btn btn-primary" onClick={handleUpdate}>Mettre à jour</button>
            </>
          )}
        </aside>
      </div>
    </main>
  )
}
