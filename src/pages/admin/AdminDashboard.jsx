import { useEffect, useState } from 'react'
import { assignDossierAdvisor, getAdvisors, getAdvisorDossiers, getAllDossiers, getDossierMessages, requestDossierDocument, sendDossierMessage, updateDossierStatus } from '../../api'
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
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState('')

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

  async function handleChatReply() {
    if (!selectedId || !chatInput.trim()) return
    setChatError('')
    try {
      const created = await sendDossierMessage({
        dossierId: selectedId,
        sender: { id: user.id, name: user.name, role: user.role },
        content: chatInput,
      })
      setChatMessages(current => [...current, created])
      setChatInput('')
    } catch (exception) {
      setChatError(exception?.message || t('chat.send_error'))
    }
  }

  function selectDossier(dossier) {
    setSelectedId(dossier.id)
    setStatus(dossier.status)
    setChatError('')
    setChatMessages([])
    setChatLoading(true)
    getDossierMessages(dossier.id, user)
      .then(setChatMessages)
      .catch(() => setChatError(t('chat.load_error')))
      .finally(() => setChatLoading(false))
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
      {user.role === 'admin' && <div className="card-actions"><NavLink to="/admin/catalogue" className="btn btn-secondary">{t('ui.manage_catalogue')}</NavLink><NavLink to="/admin/trajets" className="btn btn-secondary">{t('ui.manage_trips')}</NavLink><NavLink to="/admin/utilisateurs" className="btn btn-secondary">Gérer les utilisateurs</NavLink></div>}
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
                <button key={dossier.id} type="button" className="list-card" onClick={() => selectDossier(dossier)}>
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
                <p><strong>{t('ui.submitted_documents')} :</strong></p>
                {(selectedDossier.documents || []).length === 0 ? (
                  <p className="small-muted">{t('ui.none')}</p>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0' }}>
                    {(selectedDossier.documents || []).map((doc, index) => {
                      const docName = typeof doc === 'string' ? doc : doc.name
                      const docData = typeof doc === 'string' ? null : doc.data
                      return (
                        <li key={`${docName}-${index}`} style={{ marginBottom: '0.5rem' }}>
                          {docData ? (
                            <a href={docData} download={docName} style={{ color: '#0F6E56', textDecoration: 'none', fontWeight: 500 }}>
                              📎 {docName}
                            </a>
                          ) : (
                            <span style={{ color: '#666' }}>📎 {docName}</span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>}
              {user.role === 'admin' && <div className="field"><label htmlFor="advisor">{t('ui.assigned_advisor')}</label><select id="advisor" value={selectedDossier?.advisorId || ''} onChange={event => handleAssign(event.target.value)}><option value="">{t('ui.unassigned')}</option>{advisors.map(advisor => <option key={advisor.id} value={advisor.id}>{advisor.name}</option>)}</select></div>}
              <div className="field"><label htmlFor="document-request">{t('ui.request_document')}</label><textarea id="document-request" rows="3" value={documentRequest} onChange={event => setDocumentRequest(event.target.value)} placeholder={t('ui.request_document_placeholder')} /><button type="button" className="btn btn-secondary" onClick={handleDocumentRequest}>{t('ui.send_request')}</button></div>
              <div className="field"><label htmlFor="admin-status">{t('ui.new_status')}</label><select id="admin-status" value={status} onChange={event => setStatus(event.target.value)}><option value="">{t('ui.select_status')}</option>{statusOptions.map(option => <option key={option.value} value={option.value}>{t(option.label)}</option>)}</select></div>
              <button type="button" className="btn btn-primary" onClick={handleUpdate}>{t('ui.update')}</button>
              <div className="chat-block">
                <h4>💬 {t('chat.title')}</h4>
                {chatLoading ? <p className="small-muted">{t('common.loading')}</p> : chatMessages.length === 0 ? <p className="small-muted">{t('chat.empty')}</p> : (
                  <div className="chat-window chat-window-compact">
                    {chatMessages.map(message => (
                      <div key={message.id} className={`chat-bubble ${message.senderId === user.id ? 'chat-mine' : 'chat-theirs'}`}>
                        <div className="chat-meta">
                          <strong>{message.senderName}</strong>
                          <span>{new Date(message.date).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</span>
                        </div>
                        <p>{message.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                {chatError && <p className="field-error" role="alert">{chatError}</p>}
                <div className="chat-composer">
                  <textarea rows="2" value={chatInput} onChange={event => setChatInput(event.target.value)} placeholder={t('chat.reply_placeholder')} aria-label={t('chat.reply_placeholder')} />
                  <button type="button" className="btn btn-secondary" onClick={handleChatReply} disabled={!chatInput.trim()}>{t('chat.reply')}</button>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </main>
  )
}
