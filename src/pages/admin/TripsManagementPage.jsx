import { useEffect, useState } from 'react'
import { getAllJourneys, updateJourney } from '../../api'
import { Modal } from '../../components/Modal'
import { useTranslation } from 'react-i18next'

export function TripsManagementPage() {
  const { t } = useTranslation()
  const [journeys, setJourneys] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJourney, setSelectedJourney] = useState(null)
  const [journeyForm, setJourneyForm] = useState({})
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { getAllJourneys().then(setJourneys).finally(() => setLoading(false)) }, [])

  function openJourneyModal(journey) {
    setSelectedJourney(journey)
    setJourneyForm({
      from: journey.from,
      to: journey.to,
      date: journey.date,
      departure: journey.departure,
      arrival: journey.arrival,
      seats: String(journey.seats),
      price: String(journey.price),
    })
    setError('')
  }

  function updateField(field, value) {
    setJourneyForm(current => ({ ...current, [field]: value }))
  }

  function closeJourneyModal() {
    if (!saving) setSelectedJourney(null)
  }

  async function saveJourney() {
    const nextSeats = Number(journeyForm.seats)
    const nextPrice = Number(journeyForm.price)
    if (!journeyForm.from.trim() || !journeyForm.to.trim() || !journeyForm.date || !journeyForm.departure || !journeyForm.arrival) {
      setError('Tous les champs du déplacement sont requis.')
      return
    }
    if (!Number.isInteger(nextSeats) || nextSeats < 0 || !Number.isInteger(nextPrice) || nextPrice < 0) {
      setError(t('ui.seats_error'))
      return
    }
    setSaving(true)
    try {
      const changes = { ...journeyForm, seats: nextSeats, price: nextPrice }
      await updateJourney(selectedJourney.id, changes)
      setJourneys(current => current.map(item => item.id === selectedJourney.id ? { ...item, ...changes } : item))
      setSelectedJourney(null)
    } catch {
      setError(t('ui.update_error'))
    } finally { setSaving(false) }
  }

  return <main className="container page">
    <div className="section-header"><div><span className="eyebrow">{t('ui.backoffice')}</span><h1 className="section-title">{t('ui.trips_management')}</h1></div></div>
    {loading ? <div className="loading-state"><p>{t('ui.loading')}</p></div> : <div className="list">{journeys.map(journey => <article className="list-card" key={journey.id}><div><strong>{journey.from} → {journey.to}</strong><div className="meta-line"><span>{journey.date}</span><span>{journey.transport}</span><span>{journey.price.toLocaleString()} {journey.currency}</span><span>{journey.seats} {t('ui.seats')}</span></div></div><button type="button" className="btn btn-secondary" onClick={() => openJourneyModal(journey)}>Modifier le déplacement</button></article>)}</div>}
    {selectedJourney && <Modal title="Modifier le déplacement" onClose={closeJourneyModal} footer={<><button type="button" className="btn btn-ghost" onClick={closeJourneyModal} disabled={saving}>{t('ui.cancel')}</button><button type="button" className="btn btn-primary" onClick={saveJourney} disabled={saving}>{saving ? t('ui.saving') : t('ui.save')}</button></>}>
      <div className="form-grid compact-form">
        <div className="field"><label htmlFor="journey-from">Ville de départ</label><input id="journey-from" value={journeyForm.from || ''} onChange={event => updateField('from', event.target.value)} autoFocus /></div>
        <div className="field"><label htmlFor="journey-to">Ville d’arrivée</label><input id="journey-to" value={journeyForm.to || ''} onChange={event => updateField('to', event.target.value)} /></div>
        <div className="field"><label htmlFor="journey-date">Date</label><input id="journey-date" type="date" value={journeyForm.date || ''} onChange={event => updateField('date', event.target.value)} /></div>
        <div className="field"><label htmlFor="journey-departure">Heure de départ</label><input id="journey-departure" type="time" value={journeyForm.departure || ''} onChange={event => updateField('departure', event.target.value)} /></div>
        <div className="field"><label htmlFor="journey-arrival">Heure d’arrivée</label><input id="journey-arrival" type="time" value={journeyForm.arrival || ''} onChange={event => updateField('arrival', event.target.value)} /></div>
        <div className="field"><label htmlFor="seats">{t('ui.available_seats')}</label><input id="seats" type="number" min="0" step="1" value={journeyForm.seats || ''} onChange={event => updateField('seats', event.target.value)} /></div>
        <div className="field"><label htmlFor="journey-price">Prix (FCFA)</label><input id="journey-price" type="number" min="0" step="1" value={journeyForm.price || ''} onChange={event => updateField('price', event.target.value)} /></div>
      </div>
      {error && <span className="field-error" role="alert">{error}</span>}
    </Modal>}
  </main>
}
