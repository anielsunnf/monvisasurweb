import { useEffect, useRef, useState } from 'react'
import { NavLink, useParams, useSearchParams } from 'react-router-dom'
import { addDossierDocument, getDossier, getDossierAdvisor, getDossierMessages, replaceDossierDocument, respondToDossierRequest, sendDossierMessage } from '../../api'
import { StatusBadge } from '../../components/StatusBadge'
import { EmptyState } from '../../components/EmptyState'
import { Timeline } from '../../components/Timeline'
import { localizeService } from '../../data/services'
import { useTranslation } from 'react-i18next'

function formatMessageDate(value) {
  try {
    return new Date(value).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return value
  }
}

export function DossierDetailPage({ user }) {
	const { i18n, t } = useTranslation()
	const { id } = useParams()
	const [searchParams] = useSearchParams()
	const chatRef = useRef(null)
	const [dossier, setDossier] = useState(null)
	const [loading, setLoading] = useState(true)
	const [response, setResponse] = useState('')
	const [responseSent, setResponseSent] = useState(false)
	const [documentIndex, setDocumentIndex] = useState('')
	const [document, setDocument] = useState(null)
	const [documentMessage, setDocumentMessage] = useState('')
	const [messages, setMessages] = useState([])
	const [messageInput, setMessageInput] = useState('')
	const [advisor, setAdvisor] = useState(null)
	const [messageError, setMessageError] = useState('')
	const [messageSending, setMessageSending] = useState(false)

	useEffect(() => {
		Promise.all([getDossier(id, user.id), getDossierMessages(id, user), getDossierAdvisor(id)])
			.then(([nextDossier, nextMessages, nextAdvisor]) => {
				setDossier(nextDossier)
				setMessages(nextMessages)
				setAdvisor(nextAdvisor)
			})
			.catch(() => setDossier(null))
			.finally(() => setLoading(false))

		if (searchParams.get('chat') === '1') {
			window.setTimeout(() => {
				chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
				chatRef.current?.querySelector('textarea')?.focus()
			}, 400)
		}
	}, [id, user, searchParams])

	async function handleResponse() {
		if (!response.trim()) return
		await respondToDossierRequest(id, response)
		setResponseSent(true)
	}

	async function handleDocumentUpload() {
		if (!document) return
		if (documentIndex === '') await addDossierDocument(id, user.id, document)
		else await replaceDossierDocument(id, user.id, Number(documentIndex), document)
		const updated = await getDossier(id, user.id)
		setDossier(updated)
		setDocument(null)
		setDocumentIndex('')
		setDocumentMessage('Document envoyé avec succès.')
	}

	async function handleSendMessage() {
		if (!messageInput.trim()) return
		setMessageSending(true)
		setMessageError('')
		try {
			const created = await sendDossierMessage({
				dossierId: id,
				sender: { id: user.id, name: user.name, role: user.role },
				content: messageInput,
			})
			setMessages(current => [...current, created])
			setMessageInput('')
		} catch (exception) {
			setMessageError(exception?.message || t('chat.send_error'))
		} finally {
			setMessageSending(false)
		}
	}

	if (loading) {
		return <main className="container page"><div className="loading-state"><p>{t('ui.loading_file')}</p></div></main>
	}

	if (!dossier) {
		return (
			<main className="container page">
				<EmptyState title={t('ui.file_not_found')} description={t('ui.file_not_found_description')} action={<NavLink to="/client" className="btn btn-primary">{t('ui.back_to_area')}</NavLink>} />
			</main>
		)
	}

	return (
		<main className="container page">
			<div className="section-header">
				<div>
					<span className="eyebrow">{t('ui.file')}</span>
					<h1 className="section-title">{dossier.id}</h1>
				</div>
				<StatusBadge status={dossier.status} />
			</div>
			<section className="panel">
				<h2>{dossier.serviceId ? localizeService({ id: dossier.serviceId, name: dossier.service }, i18n.resolvedLanguage || i18n.language).name : dossier.service}</h2>
				<div className="form-grid">
					<div className="field"><label>{t('ui.nationality')}</label><input value={dossier.nationality || ''} readOnly /></div>
					<div className="field"><label>{t('ui.destination')}</label><input value={dossier.destination || ''} readOnly /></div>
					<div className="field full"><label>{t('ui.reason')}</label><textarea value={dossier.motif || ''} readOnly rows="5" /></div>
					<div className="field full"><label>{t('ui.submitted_documents')}</label>
						{(dossier.documents || []).length === 0 ? (
							<input value={t('ui.none')} readOnly />
						) : (
							<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
								{(dossier.documents || []).map((doc, index) => {
									const docName = typeof doc === 'string' ? doc : doc.name
									const docData = typeof doc === 'string' ? null : doc.data
									const docType = typeof doc === 'string' ? '' : (doc.type || '')
									return (
										<li key={`${docName}-${index}`} style={{ marginBottom: '0.5rem' }}>
											{docData ? (
												<a href={docData} download={docName} style={{ color: '#0F6E56', textDecoration: 'none', fontWeight: 500 }}>
													📎 {docName} {docType.startsWith('image/') && <span style={{ fontSize: '0.8em', color: '#666' }}>(aperçu disponible)</span>}
												</a>
											) : (
												<span style={{ color: '#666' }}>📎 {docName}</span>)}
										</li>
									)
								})}
							</ul>
						)}
					</div>
				</div>
			</section>
			<aside className="summary-box">
				<h2>{t('ui.history')}</h2>
				<Timeline entries={dossier.history} />
				{dossier.additionalRequest && <div className="field"><label htmlFor="client-response">{t('ui.send_response')}</label><textarea id="client-response" rows="4" value={response} onChange={event => setResponse(event.target.value)} placeholder={t('ui.response_placeholder')} />{responseSent && <span className="success-message">{t('ui.response_sent')}</span>}<button type="button" className="btn btn-primary" onClick={handleResponse}>{t('ui.send_response')}</button></div>}
				<div className="field document-upload">
					<label htmlFor="additional-document">{t('ui.upload_document')}</label>
					<select id="document-to-replace" value={documentIndex} onChange={event => setDocumentIndex(event.target.value)}>
						<option value="">{t('ui.add_document')}</option>
						{(dossier.documents || []).map((doc, index) => {
							const docName = typeof doc === 'string' ? doc : doc.name
							return <option key={`${docName}-${index}`} value={index}>{t('ui.replace_document', { name: docName })}</option>
						})}
					</select>
					<input id="additional-document" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={event => setDocument(event.target.files?.[0] || null)} />
					{documentMessage && <span className="success-message">{t('ui.document_upload_success')}</span>}
					<button type="button" className="btn btn-secondary" onClick={handleDocumentUpload} disabled={!document}>{t('ui.upload_document')}</button>
				</div>
			</aside>

			<section className="panel chat-panel" ref={chatRef} id="messagerie" aria-label={t('chat.title')}>
				<div className="section-header">
					<div>
						<span className="eyebrow">💬 {t('chat.title')}</span>
						<h2 style={{ margin: 0 }}>{advisor ? `${t('chat.with')} ${advisor.name}` : t('chat.team')}</h2>
					</div>
				</div>
				<div className="chat-window" aria-live="polite">
					{messages.length === 0 ? (
						<div className="chat-empty">
							<p>{t('chat.empty')}</p>
						</div>
					) : (
						messages.map(message => (
							<div key={message.id} className={`chat-bubble ${message.senderId === user.id ? 'chat-mine' : 'chat-theirs'}`}>
								<div className="chat-meta">
									<strong>{message.senderName}</strong>
									<span>{formatMessageDate(message.date)}</span>
								</div>
								<p>{message.content}</p>
							</div>
						))
					)}
				</div>
				{messageError && <p className="field-error" role="alert">{messageError}</p>}
				<div className="chat-composer">
					<textarea rows="2" value={messageInput} onChange={event => setMessageInput(event.target.value)} placeholder={t('chat.placeholder')} aria-label={t('chat.placeholder')} />
					<button type="button" className="btn btn-primary" onClick={handleSendMessage} disabled={messageSending || !messageInput.trim()}>
						{messageSending ? t('common.loading') : t('chat.send')}
					</button>
				</div>
			</section>
		</main>
	)
}
