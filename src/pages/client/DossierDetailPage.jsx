import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { addDossierDocument, getDossier, replaceDossierDocument, respondToDossierRequest } from '../../api'
import { StatusBadge } from '../../components/StatusBadge'
import { EmptyState } from '../../components/EmptyState'
import { Timeline } from '../../components/Timeline'
import { localizeService } from '../../data/services'
import { useTranslation } from 'react-i18next'

export function DossierDetailPage({ user }) {
	const { i18n } = useTranslation()
	const { id } = useParams()
	const [dossier, setDossier] = useState(null)
	const [loading, setLoading] = useState(true)
	const [response, setResponse] = useState('')
	const [responseSent, setResponseSent] = useState(false)
	const [documentIndex, setDocumentIndex] = useState('')
	const [document, setDocument] = useState(null)
	const [documentMessage, setDocumentMessage] = useState('')

	useEffect(() => {
		getDossier(id, user.id).then(setDossier).finally(() => setLoading(false))
	}, [id, user.id])

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
					<div className="field full"><label>{t('ui.submitted_documents')}</label><input value={(dossier.documents || []).join(', ')} readOnly /></div>
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
						{(dossier.documents || []).map((name, index) => <option key={`${name}-${index}`} value={index}>{t('ui.replace_document', { name })}</option>)}
					</select>
					<input id="additional-document" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={event => setDocument(event.target.files?.[0] || null)} />
					{documentMessage && <span className="success-message">{t('ui.document_upload_success')}</span>}
					<button type="button" className="btn btn-secondary" onClick={handleDocumentUpload} disabled={!document}>{t('ui.upload_document')}</button>
				</div>
			</aside>
		</main>
	)
}
