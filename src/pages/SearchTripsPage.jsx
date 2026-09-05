import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { searchJourneys } from '../api'
import { FilterBar } from '../components/FilterBar'

export function SearchTripsPage() {
  const [form, setForm] = useState({ from: '', to: '', date: '', passengers: '' })
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [errors, setErrors] = useState({})
  const [requestError, setRequestError] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [filterType, setFilterType] = useState('')
  const [carrier, setCarrier] = useState('')

  function validate() {
    const errs = {}
    if (!form.from.trim()) errs.from = 'La ville de départ est requise'
    if (!form.to.trim()) errs.to = 'La ville d\'arrivée est requise'
    if (!form.date) errs.date = 'La date est requise'
    if (!form.passengers) errs.passengers = 'Le nombre de passagers est requis'
    return errs
  }

  async function handleSearch() {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setRequestError('')
    setLoading(true)
    try {
      const data = await searchJourneys(form)
      setResults(data)
      setSearched(true)
    } catch {
      setResults([])
      setRequestError('La recherche est momentanément indisponible. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = results
    .filter(j => !filterType || j.type === filterType)
    .filter(j => !carrier || j.transport === carrier)
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'duration') return a.duration.localeCompare(b.duration)
      if (sortBy === 'departure') return a.departure.localeCompare(b.departure)
      return 0
    })

  return (
    <main className="travel-page">
      <div className="travel-banner">
        <div className="container travel-banner-inner">
          <div>
            <span className="eyebrow">Mobilité Monvisasur</span>
            <h1>Rechercher un voyage</h1>
            <p>Comparez les trajets disponibles et préparez votre réservation.</p>
          </div>
        </div>
      </div>

      <div className="container travel-content">
        <section className="travel-search-card">
          <div className="travel-card-heading">
            <h2>Rechercher un trajet</h2>
            <span aria-hidden="true">▣</span>
          </div>
          <div className="form-grid">
          <div className="field">
            <label htmlFor="from">Ville de départ *</label>
            <input
              id="from"
              placeholder="Ex : Yaoundé"
              value={form.from}
              onChange={e => setForm(f => ({ ...f, from: e.target.value }))}
              className={errors.from ? 'input-error' : ''}
            />
            {errors.from && <span className="field-error">{errors.from}</span>}
          </div>

          <div className="field">
            <label htmlFor="to">Ville d'arrivée *</label>
            <input
              id="to"
              placeholder="Ex : Douala"
              value={form.to}
              onChange={e => setForm(f => ({ ...f, to: e.target.value }))}
              className={errors.to ? 'input-error' : ''}
            />
            {errors.to && <span className="field-error">{errors.to}</span>}
          </div>

          <div className="field">
            <label htmlFor="date">Date de départ *</label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className={errors.date ? 'input-error' : ''}
            />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </div>

          <div className="field">
            <label htmlFor="passengers">Passagers</label>
            <select
              id="passengers"
              value={form.passengers}
              onChange={e => setForm(f => ({ ...f, passengers: e.target.value }))}
              className={errors.passengers ? 'input-error' : ''}
            >
              <option value="">Sélectionner le nombre de passagers</option>
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n} passager{n > 1 ? 's' : ''}</option>
              ))}
            </select>
            {errors.passengers && <span className="field-error">{errors.passengers}</span>}
          </div>

          <div className="field full">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'Recherche en cours...' : 'Rechercher'}
            </button>
          </div>
        </div>
        </section>

        <aside className="travel-help-card">
          <span className="eyebrow">Monvisasur</span>
          <h2>Besoin d’assistance ?</h2>
          <p>Notre équipe peut vous accompagner dans le choix de votre trajet et de votre dossier.</p>
          <div className="help-line"><span aria-hidden="true">✉</span><span>Réponse depuis votre espace client</span></div>
          <NavLink to="/login" className="btn btn-secondary">Contacter Monvisasur</NavLink>
        </aside>
      </div>

      {/* RESULTATS */}
      {searched && (
        <div className="container grid-2 travel-results">
          <div className="list">
            {loading ? (
              <div className="loading-state">
                <div className="spinner" />
                <p>Recherche des trajets...</p>
              </div>
            ) : requestError ? (
              <div className="error-state" role="alert">
                <p>{requestError}</p>
                <button type="button" className="btn btn-primary" onClick={handleSearch}>Réessayer</button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <p>🔍 Aucun trajet trouvé pour cette recherche.</p>
                <p className="small-muted">Essayez avec d'autres dates ou villes.</p>
              </div>
            ) : (
              filtered.map(journey => (
                <article key={journey.id} className="list-card">
                  <div>
                    <strong>{journey.from} → {journey.to}</strong>
                    <div className="meta-line">
                      <span>🕐 {journey.departure}</span>
                      <span>⏱ {journey.duration}</span>
                      <span className="chip">{journey.type}</span>
                    </div>
                    <p className="small-muted">🚌 {journey.transport} · {journey.seats} places restantes</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="price">{journey.price.toLocaleString()} {journey.currency}</div>
                    <NavLink to={`/reservation/${journey.id}?passengers=${form.passengers}`} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                      Choisir
                    </NavLink>
                  </div>
                </article>
              ))
            )}
          </div>

          <aside className="summary-box">
            <h3>Filtres et tri</h3>
            <FilterBar sortBy={sortBy} onSortChange={setSortBy} transport={filterType} onTransportChange={setFilterType} carrier={carrier} onCarrierChange={setCarrier} carriers={[...new Set(results.map(journey => journey.transport))]} />
          </aside>
        </div>
      )}
    </main>
  )
}