import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { addDossierDocument, getDossier, replaceDossierDocument, respondToDossierRequest } from '../../api'
import { StatusBadge } from '../../components/StatusBadge'
import { EmptyState } from '../../components/EmptyState'
import { Timeline } from '../../components/Timeline'

export function DossierDetailPage({ user }) {
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
		return <main className="container page"><div className="loading-state"><p>Chargement du dossier...</p></div></main>
	}

	if (!dossier) {
		return (
			<main className="container page">
				<EmptyState title="Dossier introuvable" description="Ce dossier n'existe pas ou ne vous appartient pas." action={<NavLink to="/client" className="btn btn-primary">Retour à mon espace</NavLink>} />
			</main>
		)
	}

	return (
		<main className="container page">
			<div className="section-header">
				<div>
					<span className="eyebrow">Dossier</span>
					<h1 className="section-title">{dossier.id}</h1>
				</div>
				<StatusBadge status={dossier.status} />
			</div>
			<section className="panel">
				<h2>{dossier.service}</h2>
				<div className="form-grid">
					<div className="field"><label>Nationalité</label><input value={dossier.nationality || ''} readOnly /></div>
					<div className="field"><label>Destination</label><input value={dossier.destination || ''} readOnly /></div>
					<div className="field full"><label>Motif</label><textarea value={dossier.motif || ''} readOnly rows="5" /></div>
					<div className="field full"><label>Pièces transmises</label><input value={(dossier.documents || []).join(', ')} readOnly /></div>
				</div>
			</section>
			<aside className="summary-box">
				<h2>Historique</h2>
				<Timeline entries={dossier.history} />
				{dossier.additionalRequest && <div className="field"><label htmlFor="client-response">Répondre à la demande de pièce</label><textarea id="client-response" rows="4" value={response} onChange={event => setResponse(event.target.value)} placeholder="Indiquez la pièce ou l'information transmise" />{responseSent && <span className="success-message">Réponse envoyée avec succès.</span>}<button type="button" className="btn btn-primary" onClick={handleResponse}>Envoyer la réponse</button></div>}
				<div className="field document-upload">
					<label htmlFor="additional-document">Ajouter ou modifier un PDF</label>
					<select id="document-to-replace" value={documentIndex} onChange={event => setDocumentIndex(event.target.value)}>
						<option value="">Ajouter un nouveau document</option>
						{(dossier.documents || []).map((name, index) => <option key={`${name}-${index}`} value={index}>Remplacer : {name}</option>)}
					</select>
					<input id="additional-document" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={event => setDocument(event.target.files?.[0] || null)} />
					{documentMessage && <span className="success-message">{documentMessage}</span>}
					<button type="button" className="btn btn-secondary" onClick={handleDocumentUpload} disabled={!document}>Envoyer le document</button>
				</div>
			</aside>
		</main>
	)
}
