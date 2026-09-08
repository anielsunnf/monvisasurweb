import { useEffect, useState } from 'react'
import { NavLink, useParams, useSearchParams } from 'react-router-dom'
import { createOrder, getJourneyById, getReservationWindow } from '../api'
import { useI18n } from '../components/useI18n'

export function ReservationPage({ user }) {
  const { t } = useI18n()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const passengerCount = Number(searchParams.get('passengers'))
  const selectedDate = searchParams.get('date') || ''
  const reservationWindow = getReservationWindow()
  const [journey, setJourney] = useState(null)
  const [passengers, setPassengers] = useState(() => Array.from({ length: passengerCount > 0 ? passengerCount : 0 }, () => ({ name: '', document: null })))
  const [payment, setPayment] = useState({ method: '', reference: '' })
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
    if (!selectedDate || selectedDate < reservationWindow.min || selectedDate > reservationWindow.max) nextErrors.date = `La réservation est possible du ${reservationWindow.min} au ${reservationWindow.max}.`
    if (!Number.isInteger(passengerCount) || passengerCount < 1) nextErrors.passengers = 'Le nombre de passagers est invalide.'
    passengers.forEach((passenger, index) => {
      if (!passenger.name.trim()) nextErrors[`passenger-${index}`] = `Le nom du passager ${index + 1} est requis.`
      if (!passenger.document) nextErrors[`document-${index}`] = `Le document d'identité du passager ${index + 1} est requis.`
    })
    if (!payment.method) nextErrors.paymentMethod = 'Choisissez un moyen de paiement simulé.'
    if (!payment.reference.trim()) nextErrors.paymentReference = 'Saisissez une référence de paiement simulée.'
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
        passengers: passengers.map(passenger => ({ name: passenger.name.trim(), document: passenger.document.name })),
        total: journey.price * passengerCount,
        currency: journey.currency,
        journey,
        selectedDate,
        paymentStatus: 'paiement simulé confirmé',
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
      <div className="section-header"><div><span className="eyebrow">{t('travel')}</span><h1 className="section-title">{t('confirmTrip')}</h1></div></div>
      <div className="dashboard-grid">
        <section className="panel">
          <h2>{t('passengers')}</h2>
          <p className="small-muted">Saisissez un nom complet par ligne pour les {passengerCount} passager{passengerCount > 1 ? 's' : ''} sélectionné{passengerCount > 1 ? 's' : ''}.</p>
          {passengers.map((passenger, index) => <div className="passenger-form" key={index}><h3>Passager {index + 1}</h3><div className="form-grid"><div className="field"><label htmlFor={`passenger-name-${index}`}>Nom complet *</label><input id={`passenger-name-${index}`} value={passenger.name} onChange={event => setPassengers(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} aria-invalid={Boolean(errors[`passenger-${index}`])} />{errors[`passenger-${index}`] && <span className="field-error">{errors[`passenger-${index}`]}</span>}</div><div className="field"><label htmlFor={`passenger-document-${index}`}>Document d'identité *</label><input id={`passenger-document-${index}`} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={event => setPassengers(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, document: event.target.files?.[0] || null } : item))} />{errors[`document-${index}`] && <span className="field-error">{errors[`document-${index}`]}</span>}</div></div></div>)}
          <div className="field"><label htmlFor="payment-method">Paiement simulé *</label><select id="payment-method" value={payment.method} onChange={event => setPayment(current => ({ ...current, method: event.target.value }))}><option value="">Choisir un moyen</option><option value="mobile-money">Mobile Money simulé</option><option value="card">Carte simulée</option><option value="bank">Virement simulé</option></select>{errors.paymentMethod && <span className="field-error">{errors.paymentMethod}</span>}</div>
          <div className="field"><label htmlFor="payment-reference">Référence de paiement *</label><input id="payment-reference" value={payment.reference} onChange={event => setPayment(current => ({ ...current, reference: event.target.value }))} placeholder="Référence fournie par la simulation" />{errors.paymentReference && <span className="field-error">{errors.paymentReference}</span>}</div>
          <button type="button" className="btn btn-primary" onClick={handleConfirm} disabled={submitting}>{submitting ? 'Confirmation...' : 'Confirmer la réservation'}</button>
        </section>
        <aside className="summary-box">
          <h2>Récapitulatif</h2>
          <p><strong>{journey.from} → {journey.to}</strong></p>
          <p className="small-muted">{selectedDate || journey.date} · {journey.departure} - {journey.arrival}</p>
          <p className="small-muted">{journey.transport} · {journey.duration}</p>
          <div className="meta-line"><span>{passengerCount} passager{passengerCount > 1 ? 's' : ''}</span><strong>{(journey.price * passengerCount).toLocaleString()} {journey.currency}</strong></div>
        </aside>
      </div>
    </main>
  )
}
