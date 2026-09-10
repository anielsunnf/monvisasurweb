import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { getAvailableJourneyCities, getReservationWindow, searchJourneys } from '../api'
import { FilterBar } from '../components/FilterBar'
import { useI18n } from '../components/useI18n'

export function SearchTripsPage() {
  const { t } = useI18n()
  const reservationWindow = getReservationWindow()
  const availableCities = getAvailableJourneyCities()
  const [form, setForm] = useState({ from: '', to: '', date: '', passengers: '' })
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [errors, setErrors] = useState({})
  const [requestError, setRequestError] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [filterType, setFilterType] = useState('')
  const [carrier, setCarrier] = useState('')
  const [activeCityField, setActiveCityField] = useState('from')

  function normalizeCity(value) {
    return value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  function isKnownCity(value) {
    return availableCities.some(city => normalizeCity(city) === normalizeCity(value))
  }

  function validate() {
    const errs = {}
    if (!form.from.trim()) errs.from = 'La ville de départ est requise'
    else if (!isKnownCity(form.from)) errs.from = 'Cette ville de départ n’est pas disponible dans nos trajets'
    if (!form.to.trim()) errs.to = 'La ville d\'arrivée est requise'
    else if (!isKnownCity(form.to)) errs.to = 'Cette ville d’arrivée n’est pas disponible dans nos trajets'
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

  function selectCity(city, field = activeCityField) {
    setForm(current => ({ ...current, [field]: city }))
    setErrors(current => ({ ...current, [field]: '' }))
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
            <span className="eyebrow">{t('search.eyebrow')}</span>
            <h1>{t('search.title')}</h1>
            <p>{t('search.description')}</p>
          </div>
        </div>
      </div>

      <div className="container travel-content">
        <section className="travel-search-card">
          <div className="travel-card-heading">
            <h2>{t('search.title')}</h2>
            <span aria-hidden="true">▣</span>
          </div>
          <div className="form-grid">
          <div className="field">
            <label htmlFor="from">{t('search.from')} *</label>
            <input
              id="from"
              placeholder="Ex : Yaoundé"
              value={form.from}
              list="available-cities"
              onFocus={() => setActiveCityField('from')}
              onChange={e => setForm(f => ({ ...f, from: e.target.value }))}
              className={errors.from ? 'input-error' : ''}
              aria-invalid={Boolean(errors.from)}
            />
            {errors.from && <span className="field-error">{errors.from}</span>}
            <div className="city-options" aria-label="Villes de départ disponibles">
              {availableCities.map(city => <button key={`from-${city}`} type="button" className={`city-option ${form.from === city ? 'selected' : ''}`} onClick={() => selectCity(city, 'from')}>{city}</button>)}
            </div>
          </div>

          <div className="field">
            <label htmlFor="to">{t('search.to')} *</label>
            <input
              id="to"
              placeholder="Ex : Douala"
              value={form.to}
              list="available-cities"
              onFocus={() => setActiveCityField('to')}
              onChange={e => setForm(f => ({ ...f, to: e.target.value }))}
              className={errors.to ? 'input-error' : ''}
              aria-invalid={Boolean(errors.to)}
            />
            {errors.to && <span className="field-error">{errors.to}</span>}
            <div className="city-options" aria-label="Villes d’arrivée disponibles">
              {availableCities.map(city => <button key={`to-${city}`} type="button" className={`city-option ${form.to === city ? 'selected' : ''}`} onClick={() => selectCity(city, 'to')}>{city}</button>)}
            </div>
          </div>

          <div className="field">
            <label htmlFor="date">{t('search.date')} *</label>
            <input
              id="date"
              type="date"
              min={reservationWindow.min}
              max={reservationWindow.max}
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className={errors.date ? 'input-error' : ''}
            />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </div>

          <div className="field">
            <label htmlFor="passengers">{t('search.passengers')}</label>
            <select
              id="passengers"
              value={form.passengers}
              onChange={e => setForm(f => ({ ...f, passengers: e.target.value }))}
              className={errors.passengers ? 'input-error' : ''}
            >
              <option value="">{t('common.select')} {t('search.passengers').toLowerCase()}</option>
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n} {n > 1 ? t('ui.passengers') : t('ui.passenger')}</option>
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
              {loading ? `${t('search')}...` : t('search')}
            </button>
          </div>
        </div>
        <datalist id="available-cities">{availableCities.map(city => <option key={city} value={city} />)}</datalist>
        </section>

        <aside className="travel-help-card">
          <span className="eyebrow">Monvisasur</span>
          <h2>{t('booking.assistance')}</h2>
          <p>{t('search.help_description')}</p>
          <div className="help-line"><span aria-hidden="true">✉</span><span>{t('search.help_response')}</span></div>
          <NavLink to="/login" className="btn btn-secondary">{t('search.contact')}</NavLink>
        </aside>
      </div>

      {/* RESULTATS */}
      {searched && (
        <div className="container grid-2 travel-results">
          <div className="list">
            {loading ? (
              <div className="loading-state">
                <div className="spinner" />
                <p>{t('search.searching')}</p>
              </div>
            ) : requestError ? (
              <div className="error-state" role="alert">
                <p>{requestError}</p>
                <button type="button" className="btn btn-primary" onClick={handleSearch}>{t('common.retry')}</button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <p>🔍 {t('search.no_results')}</p>
                <p className="small-muted">{t('search.try_again')}</p>
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
                    <NavLink to={`/reservation/${journey.id}?passengers=${form.passengers}&date=${form.date}`} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                      Choisir
                    </NavLink>
                  </div>
                </article>
              ))
            )}
          </div>

          <aside className="summary-box">
            <h3>{t('search.filters')}</h3>
            <FilterBar sortBy={sortBy} onSortChange={setSortBy} transport={filterType} onTransportChange={setFilterType} carrier={carrier} onCarrierChange={setCarrier} carriers={[...new Set(results.map(journey => journey.transport))]} />
          </aside>
        </div>
      )}
    </main>
  )
}
