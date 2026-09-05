import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { getDossier } from '../api'
import { StatusBadge } from '../components/StatusBadge'
import { EmptyState } from '../components/EmptyState'

export function DossierDetailPage({ user }) {
	const { id } = useParams()
	const [dossier, setDossier] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		getDossier(id, user.id).then(setDossier).finally(() => setLoading(false))
	}, [id, user.id])

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
		</main>
	)
}
