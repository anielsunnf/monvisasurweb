import { useEffect, useState } from 'react'
import { getAllJourneys, updateJourney } from '../../api'

export function TripsManagementPage() {
  const [journeys, setJourneys] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { getAllJourneys().then(setJourneys).finally(() => setLoading(false)) }, [])
  async function updateSeats(journey) {
    const seats = Number(window.prompt('Nombre de places disponibles', journey.seats))
    if (!Number.isFinite(seats) || seats < 0) return
    await updateJourney(journey.id, { seats })
    setJourneys(current => current.map(item => item.id === journey.id ? { ...item, seats } : item))
  }
  return <main className="container page"><div className="section-header"><div><span className="eyebrow">Back-office</span><h1 className="section-title">Gestion des trajets</h1></div></div>{loading ? <div className="loading-state"><p>Chargement...</p></div> : <div className="list">{journeys.map(journey => <article className="list-card" key={journey.id}><div><strong>{journey.from} → {journey.to}</strong><div className="meta-line"><span>{journey.date}</span><span>{journey.transport}</span><span>{journey.price.toLocaleString()} {journey.currency}</span></div></div><button type="button" className="btn btn-secondary" onClick={() => updateSeats(journey)}>Modifier les places</button></article>)}</div>}</main>
}
