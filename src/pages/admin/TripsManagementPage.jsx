import { useEffect, useState } from 'react'
import { getAllJourneys, updateJourney } from '../../api'
import { Modal } from '../../components/Modal'

export function TripsManagementPage() {
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
      setError('Saisissez un nombre entier supérieur ou égal à zéro.')
      return
    }
    setSaving(true)
    try {
      await updateJourney(selectedJourney.id, { seats: nextSeats })
      setJourneys(current => current.map(item => item.id === selectedJourney.id ? { ...item, seats: nextSeats } : item))
      setSelectedJourney(null)
    } catch {
      setError('La mise à jour a échoué. Veuillez réessayer.')
    } finally { setSaving(false) }
  }

  return <main className="container page">
    <div className="section-header"><div><span className="eyebrow">Back-office</span><h1 className="section-title">Gestion des trajets</h1></div></div>
    {loading ? <div className="loading-state"><p>Chargement...</p></div> : <div className="list">{journeys.map(journey => <article className="list-card" key={journey.id}><div><strong>{journey.from} → {journey.to}</strong><div className="meta-line"><span>{journey.date}</span><span>{journey.transport}</span><span>{journey.price.toLocaleString()} {journey.currency}</span><span>{journey.seats} places</span></div></div><button type="button" className="btn btn-secondary" onClick={() => openSeatsModal(journey)}>Modifier les places</button></article>)}</div>}
    {selectedJourney && <Modal title="Modifier les places" onClose={closeSeatsModal} footer={<><button type="button" className="btn btn-ghost" onClick={closeSeatsModal} disabled={saving}>Annuler</button><button type="button" className="btn btn-primary" onClick={saveSeats} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button></>}>
      <p className="small-muted">{selectedJourney.from} → {selectedJourney.to}</p>
      <div className="field"><label htmlFor="seats">Nombre de places disponibles</label><input id="seats" type="number" min="0" step="1" autoFocus value={seats} onChange={event => setSeats(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') saveSeats() }} aria-invalid={Boolean(error)} />{error && <span className="field-error">{error}</span>}</div>
    </Modal>}
  </main>
}
