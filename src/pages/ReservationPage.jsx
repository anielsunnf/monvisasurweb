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
  const [confirmedOrder, setConfirmedOrder] = useState(null)
  const [submitError, setSubmitError] = useState('')

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
      else if (!['application/pdf', 'image/jpeg', 'image/png'].includes(passenger.document.type)) nextErrors[`document-${index}`] = 'Le document doit être au format PDF, JPG ou PNG.'
      else if (passenger.document.size > 5 * 1024 * 1024) nextErrors[`document-${index}`] = 'Le document ne doit pas dépasser 5 Mo.'
    })
    if (journey && journey.seats < passengerCount) nextErrors.passengers = 'Le nombre de places disponibles est insuffisant.'
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
    setSubmitError('')
    setSubmitting(true)
    try {
      const createdOrder = await createOrder({
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
      setConfirmedOrder(createdOrder)
      setConfirmed(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'La réservation n’a pas pu être confirmée. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <main className="container page"><div className="loading-state"><p>{t('ui.loading_trip')}</p></div></main>
  if (!journey) return <main className="container page"><div className="error-state" role="alert"><p>{t('ui.unavailable_trip')}</p><NavLink to="/trajets" className="btn btn-primary">{t('ui.back_to_trips')}</NavLink></div></main>
  if (confirmed && confirmedOrder) return <main className="container page"><div className="success-state"><span className="eyebrow">{t('ui.simulated_payment_confirmed')}</span><h1>{t('ui.booking_confirmed')}</h1><p>{t('ui.booking_saved')}</p><div className="summary-box"><p>{t('ui.booking_reference')}</p><strong className="ticket-reference">{confirmedOrder.reference}</strong><p className="small-muted">{confirmedOrder.route} · {confirmedOrder.selectedDate} · {confirmedOrder.passengers.length} {confirmedOrder.passengers.length > 1 ? t('ui.passengers') : t('ui.passenger')}</p><strong>{confirmedOrder.total.toLocaleString()} {confirmedOrder.currency}</strong></div><div className="card-actions"><NavLink to={`/billet/${confirmedOrder.reference}`} className="btn btn-primary">{t('ui.view_ticket')}</NavLink><NavLink to="/client" className="btn btn-ghost">{t('ui.back_to_orders')}</NavLink></div></div></main>

  return (
    <main className="container page">
      <div className="section-header"><div><span className="eyebrow">{t('nav.book')}</span><h1 className="section-title">{t('ui.confirm_trip')}</h1></div></div>
      <div className="dashboard-grid">
        <section className="panel">
          <h2>{t('search.passengers')}</h2>
          {submitError && <div className="alert alert-error" role="alert">{submitError}</div>}
          <p className="small-muted">{t('ui.passenger_instruction', { count: passengerCount })}</p>
          {passengers.map((passenger, index) => <div className="passenger-form" key={index}><h3>{t('ui.passenger_label', { number: index + 1 })}</h3><div className="form-grid"><div className="field"><label htmlFor={`passenger-name-${index}`}>{t('ui.full_name')} *</label><input id={`passenger-name-${index}`} value={passenger.name} onChange={event => setPassengers(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} aria-invalid={Boolean(errors[`passenger-${index}`])} />{errors[`passenger-${index}`] && <span className="field-error">{errors[`passenger-${index}`]}</span>}</div><div className="field"><label htmlFor={`passenger-document-${index}`}>{t('ui.identity_document')} *</label><input id={`passenger-document-${index}`} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={event => setPassengers(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, document: event.target.files?.[0] || null } : item))} />{errors[`document-${index}`] && <span className="field-error">{errors[`document-${index}`]}</span>}</div></div></div>)}
          <div className="field"><label htmlFor="payment-method">{t('ui.simulated_payment')} *</label><select id="payment-method" value={payment.method} onChange={event => setPayment(current => ({ ...current, method: event.target.value }))}><option value="">{t('ui.choose_method')}</option><option value="mobile-money">{t('ui.simulated_payment')} Mobile Money</option><option value="card">{t('ui.payment')} Card</option><option value="bank">{t('ui.payment')} Bank</option></select>{errors.paymentMethod && <span className="field-error">{errors.paymentMethod}</span>}</div>
          <div className="field"><label htmlFor="payment-reference">{t('ui.payment_reference')} *</label><input id="payment-reference" value={payment.reference} onChange={event => setPayment(current => ({ ...current, reference: event.target.value }))} placeholder={t('ui.payment_reference_placeholder')} />{errors.paymentReference && <span className="field-error">{errors.paymentReference}</span>}</div>
          <button type="button" className="btn btn-primary" onClick={handleConfirm} disabled={submitting}>{submitting ? t('ui.confirming') : t('ui.confirm_booking')}</button>
        </section>
        <aside className="summary-box">
          <h2>{t('ui.summary')}</h2>
          <p><strong>{journey.from} → {journey.to}</strong></p>
          <p className="small-muted">{selectedDate || journey.date} · {journey.departure} - {journey.arrival}</p>
          <p className="small-muted">{journey.transport} · {journey.duration}</p>
          <div className="meta-line"><span>{passengerCount} {passengerCount > 1 ? t('ui.passengers') : t('ui.passenger')}</span><strong>{(journey.price * passengerCount).toLocaleString()} {journey.currency}</strong></div>
        </aside>
      </div>
    </main>
  )
}
