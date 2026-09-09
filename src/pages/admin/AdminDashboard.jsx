import { useEffect, useState } from 'react'
import { assignDossierAdvisor, getAdvisors, getAdvisorDossiers, getAllDossiers, requestDossierDocument, updateDossierStatus } from '../../api'
import { StatusBadge } from '../../components/StatusBadge'
import { EmptyState } from '../../components/EmptyState'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const statusOptions = [
  { value: 'en_cours', label: 'status.en_cours' },
  { value: 'en_validation', label: 'status.en_validation' },
  { value: 'documents_requis', label: 'status.documents_requis' },
  { value: 'confirmed', label: 'status.confirmed' },
  { value: 'cancelled', label: 'status.cancelled' },
]

export function AdminDashboard({ user }) {
  const { t } = useTranslation()
  const [dossiers, setDossiers] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [documentRequest, setDocumentRequest] = useState('')
  const [advisors, setAdvisors] = useState([])

  useEffect(() => {
    const loadDossiers = user.role === 'advisor' ? getAdvisorDossiers(user.id) : getAllDossiers()
    Promise.all([loadDossiers, user.role === 'admin' ? getAdvisors() : Promise.resolve([])])
      .then(([nextDossiers, nextAdvisors]) => { setDossiers(nextDossiers); setAdvisors(nextAdvisors) })
      .catch(() => setError(t('client_dashboard.load_error')))
      .finally(() => setLoading(false))
  }, [t, user.id, user.role])

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

  async function handleAssign(advisorId) {
    if (!selectedId) return
    await assignDossierAdvisor(selectedId, advisorId)
    setDossiers(current => current.map(dossier => dossier.id === selectedId ? { ...dossier, advisorId } : dossier))
  }

  const counts = {
    total: dossiers.length,
    current: dossiers.filter(dossier => dossier.status === 'en_cours').length,
    confirmed: dossiers.filter(dossier => dossier.status === 'confirmed' || dossier.status === 'confirmé').length,
  }
  const selectedDossier = dossiers.find(dossier => dossier.id === selectedId)

  return (
    <main className="container page">
      <div className="section-header"><div><span className="eyebrow">{t('ui.backoffice')}</span><h1 className="section-title">{user.role === 'advisor' ? t('ui.assigned_files') : t('ui.admin_title')}</h1></div></div>
      {user.role === 'admin' && <div className="card-actions"><NavLink to="/admin/catalogue" className="btn btn-secondary">{t('ui.manage_catalogue')}</NavLink><NavLink to="/admin/trajets" className="btn btn-secondary">{t('ui.manage_trips')}</NavLink></div>}
      <div className="grid-3" style={{ marginBottom: '1rem' }}>
        <div className="metric"><strong>{counts.total}</strong><span>{t('ui.total_files')}</span></div>
        <div className="metric"><strong>{counts.current}</strong><span>{t('ui.current_files')}</span></div>
        <div className="metric"><strong>{counts.confirmed}</strong><span>{t('ui.confirmed_files')}</span></div>
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <h2>{t('ui.all_files')}</h2>
          {loading ? <div className="loading-state"><p>{t('ui.loading')}</p></div> : error ? (
            <div className="error-state" role="alert"><p>{error}</p><button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>{t('ui.retry')}</button></div>
          ) : dossiers.length === 0 ? (
            <EmptyState title={t('ui.no_files')} description={t('ui.no_files_description')} />
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
          <h3>{t('ui.file_management')}</h3>
          {!selectedId ? <p className="small-muted">{t('ui.select_file')}</p> : (
            <>
              <p className="small-muted">{t('ui.selected_file', { id: selectedId })}</p>
              {selectedDossier && <div className="detail-summary">
                <p><strong>{t('ui.service')} :</strong> {selectedDossier.service}</p>
                <p><strong>{t('ui.nationality')} :</strong> {selectedDossier.nationality || t('ui.no_value')}</p>
                <p><strong>{t('ui.destination')} :</strong> {selectedDossier.destination || t('ui.no_value')}</p>
                <p><strong>{t('ui.reason')} :</strong> {selectedDossier.motif || t('ui.no_value')}</p>
                <p><strong>{t('ui.submitted_documents')} :</strong> {(selectedDossier.documents || []).join(', ') || t('ui.none')}</p>
              </div>}
              {user.role === 'admin' && <div className="field"><label htmlFor="advisor">{t('ui.assigned_advisor')}</label><select id="advisor" value={selectedDossier?.advisorId || ''} onChange={event => handleAssign(event.target.value)}><option value="">{t('ui.unassigned')}</option>{advisors.map(advisor => <option key={advisor.id} value={advisor.id}>{advisor.name}</option>)}</select></div>}
              <div className="field"><label htmlFor="document-request">{t('ui.request_document')}</label><textarea id="document-request" rows="3" value={documentRequest} onChange={event => setDocumentRequest(event.target.value)} placeholder={t('ui.request_document_placeholder')} /><button type="button" className="btn btn-secondary" onClick={handleDocumentRequest}>{t('ui.send_request')}</button></div>
              <div className="field"><label htmlFor="admin-status">{t('ui.new_status')}</label><select id="admin-status" value={status} onChange={event => setStatus(event.target.value)}><option value="">{t('ui.select_status')}</option>{statusOptions.map(option => <option key={option.value} value={option.value}>{t(option.label)}</option>)}</select></div>
              <button type="button" className="btn btn-primary" onClick={handleUpdate}>{t('ui.update')}</button>
            </>
          )}
        </aside>
      </div>
    </main>
  )
}
