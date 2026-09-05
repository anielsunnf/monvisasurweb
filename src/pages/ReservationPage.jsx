import { useEffect, useState } from 'react'
import { NavLink, useParams, useSearchParams } from 'react-router-dom'
import { createOrder, getJourneyById } from '../api'

export function ReservationPage({ user }) {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const passengerCount = Number(searchParams.get('passengers'))
  const [journey, setJourney] = useState(null)
  const [passengerNames, setPassengerNames] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    getJourneyById(id).then(setJourney).finally(() => setLoading(false))
  }, [id])

  function validate() {
    const nextErrors = {}
    if (!journey) nextErrors.journey = 'Le trajet sélectionné est introuvable.'
    if (!Number.isInteger(passengerCount) || passengerCount < 1) nextErrors.passengers = 'Le nombre de passagers est invalide.'
    const names = passengerNames.split('\n').map(name => name.trim()).filter(Boolean)
    if (names.length !== passengerCount) nextErrors.passengerNames = `Saisissez exactement ${passengerCount} nom${passengerCount > 1 ? 's' : ''}, un par ligne.`
    return nextErrors
  }

  async function handleConfirm() {
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      await createOrder({
        userId: user.id,
        journeyId: journey.id,
        route: `${journey.from} → ${journey.to}`,
        passengers: passengerNames.split('\n').map(name => name.trim()).filter(Boolean),
        total: journey.price * passengerCount,
        currency: journey.currency,
        journey,
      })
      setConfirmed(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <main className="container page"><div className="loading-state"><p>Chargement du trajet...</p></div></main>
  if (!journey) return <main className="container page"><div className="error-state" role="alert"><p>Le trajet sélectionné est introuvable.</p><NavLink to="/trajets" className="btn btn-primary">Retour aux trajets</NavLink></div></main>
  if (confirmed) return <main className="container page"><div className="success-state"><h1>Réservation confirmée</h1><p>Votre commande a été enregistrée dans votre espace client.</p><NavLink to="/client" className="btn btn-primary">Voir mes commandes</NavLink></div></main>

  return (
    <main className="container page">
      <div className="section-header"><div><span className="eyebrow">Réservation</span><h1 className="section-title">Confirmer votre trajet</h1></div></div>
      <div className="dashboard-grid">
        <section className="panel">
          <h2>Passagers</h2>
          <p className="small-muted">Saisissez un nom complet par ligne pour les {passengerCount} passager{passengerCount > 1 ? 's' : ''} sélectionné{passengerCount > 1 ? 's' : ''}.</p>
          <div className="field">
            <label htmlFor="passenger-names">Noms des passagers *</label>
            <textarea id="passenger-names" rows="6" value={passengerNames} onChange={event => setPassengerNames(event.target.value)} aria-invalid={Boolean(errors.passengerNames)} placeholder="Nom complet du passager 1\nNom complet du passager 2" />
            {errors.passengerNames && <span className="field-error">{errors.passengerNames}</span>}
          </div>
          <button type="button" className="btn btn-primary" onClick={handleConfirm} disabled={submitting}>{submitting ? 'Confirmation...' : 'Confirmer la réservation'}</button>
        </section>
        <aside className="summary-box">
          <h2>Récapitulatif</h2>
          <p><strong>{journey.from} → {journey.to}</strong></p>
          <p className="small-muted">{journey.date} · {journey.departure} - {journey.arrival}</p>
          <p className="small-muted">{journey.transport} · {journey.duration}</p>
          <div className="meta-line"><span>{passengerCount} passager{passengerCount > 1 ? 's' : ''}</span><strong>{(journey.price * passengerCount).toLocaleString()} {journey.currency}</strong></div>
        </aside>
      </div>
    </main>
  )
}
