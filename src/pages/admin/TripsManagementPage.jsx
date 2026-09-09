import { useEffect, useState } from 'react'
import { getAllJourneys, updateJourney } from '../../api'
import { Modal } from '../../components/Modal'
import { useTranslation } from 'react-i18next'

export function TripsManagementPage() {
  const { t } = useTranslation()
  const [journeys, setJourneys] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJourney, setSelectedJourney] = useState(null)
  const [seats, setSeats] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { getAllJourneys().then(setJourneys).finally(() => setLoading(false)) }, [])

  function openSeatsModal(journey) {
    setSelectedJourney(journey)
    setSeats(String(journey.seats))
    setError('')
  }

  function closeSeatsModal() {
    if (!saving) setSelectedJourney(null)
  }

  async function saveSeats() {
    const nextSeats = Number(seats)
    if (!Number.isInteger(nextSeats) || nextSeats < 0) {
      setError(t('ui.seats_error'))
      return
    }
    setSaving(true)
    try {
      await updateJourney(selectedJourney.id, { seats: nextSeats })
      setJourneys(current => current.map(item => item.id === selectedJourney.id ? { ...item, seats: nextSeats } : item))
      setSelectedJourney(null)
    } catch {
      setError(t('ui.update_error'))
    } finally { setSaving(false) }
  }

  return <main className="container page">
    <div className="section-header"><div><span className="eyebrow">{t('ui.backoffice')}</span><h1 className="section-title">{t('ui.trips_management')}</h1></div></div>
    {loading ? <div className="loading-state"><p>{t('ui.loading')}</p></div> : <div className="list">{journeys.map(journey => <article className="list-card" key={journey.id}><div><strong>{journey.from} → {journey.to}</strong><div className="meta-line"><span>{journey.date}</span><span>{journey.transport}</span><span>{journey.price.toLocaleString()} {journey.currency}</span><span>{journey.seats} {t('ui.seats')}</span></div></div><button type="button" className="btn btn-secondary" onClick={() => openSeatsModal(journey)}>{t('ui.edit_seats')}</button></article>)}</div>}
    {selectedJourney && <Modal title={t('ui.edit_seats')} onClose={closeSeatsModal} footer={<><button type="button" className="btn btn-ghost" onClick={closeSeatsModal} disabled={saving}>{t('ui.cancel')}</button><button type="button" className="btn btn-primary" onClick={saveSeats} disabled={saving}>{saving ? t('ui.saving') : t('ui.save')}</button></>}>
      <p className="small-muted">{selectedJourney.from} → {selectedJourney.to}</p>
      <div className="field"><label htmlFor="seats">{t('ui.available_seats')}</label><input id="seats" type="number" min="0" step="1" autoFocus value={seats} onChange={event => setSeats(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') saveSeats() }} aria-invalid={Boolean(error)} />{error && <span className="field-error">{error}</span>}</div>
    </Modal>}
  </main>
}
