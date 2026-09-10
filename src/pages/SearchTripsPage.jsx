import { useState } from 'react'
import { NavLink, useSearchParams } from 'react-router-dom'
import { getAvailableJourneyCities, getAvailableJourneyDates, getReservationWindow, searchJourneys } from '../api'
import { FilterBar } from '../components/FilterBar'
import { useI18n } from '../components/useI18n'

export function SearchTripsPage() {
  const { t } = useI18n()
  const [searchParams] = useSearchParams()
  const reservationWindow = getReservationWindow()
  const [form, setForm] = useState(() => ({ from: searchParams.get('from') || '', to: searchParams.get('to') || '', date: '', passengers: '' }))
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [errors, setErrors] = useState({})
  const [requestError, setRequestError] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [filterType, setFilterType] = useState('')
  const [carrier, setCarrier] = useState('')
  const [activeCityField, setActiveCityField] = useState('from')
  const availableDepartureCities = getAvailableJourneyCities({ field: 'from', to: form.to })
  const availableArrivalCities = getAvailableJourneyCities({ field: 'to', from: form.from })
  const availableDates = getAvailableJourneyDates({ from: form.from, to: form.to })

  function normalizeCity(value) {
    return value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  function validate() {
    const errs = {}
    if (!form.from.trim()) errs.from = 'La ville de départ est requise'
    else if (!isKnownCity(form.from, 'from')) errs.from = 'Cette ville de départ n’est pas disponible dans nos trajets'
    if (!form.to.trim()) errs.to = 'La ville d\'arrivée est requise'
    else if (!isKnownCity(form.to, 'to')) errs.to = 'Cette ville d’arrivée n’est pas disponible dans nos trajets'
    if (!form.date) errs.date = 'La date est requise'
    else if (!availableDates.includes(form.date)) errs.date = 'Cette date n’est pas disponible pour ce trajet'
    if (!form.passengers) errs.passengers = 'Le nombre de passagers est requis'
    else if (!Number.isInteger(Number(form.passengers)) || Number(form.passengers) < 1) errs.passengers = 'Saisissez un nombre entier de passagers supérieur à zéro'
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
    setForm(current => ({ ...current, [field]: city, ...(field === 'from' ? { to: '', date: '' } : { date: '' }) }))
    setErrors(current => ({ ...current, [field]: '' }))
  }

  function isKnownCity(value, field) {
    const cities = field === 'from' ? availableDepartureCities : availableArrivalCities
    return cities.some(city => normalizeCity(city) === normalizeCity(value))
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
              {availableDepartureCities.map(city => <button key={`from-${city}`} type="button" className={`city-option ${form.from === city ? 'selected' : ''}`} onClick={() => selectCity(city, 'from')}>{city}</button>)}
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
              {availableArrivalCities.map(city => <button key={`to-${city}`} type="button" className={`city-option ${form.to === city ? 'selected' : ''}`} onClick={() => selectCity(city, 'to')}>{city}</button>)}
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
              list="available-dates"
              aria-invalid={Boolean(errors.date)}
            />
            {errors.date && <span className="field-error">{errors.date}</span>}
            {availableDates.length > 0 && <div className="city-options date-options" aria-label="Dates disponibles">
              {availableDates.map(date => <button key={date} type="button" className={`city-option ${form.date === date ? 'selected' : ''}`} onClick={() => setForm(current => ({ ...current, date }))}>{new Date(`${date}T00:00:00`).toLocaleDateString('fr-FR')}</button>)}
            </div>}
          </div>

          <div className="field">
            <label htmlFor="passengers">{t('search.passengers')}</label>
            <input
              id="passengers"
              type="number"
              min="1"
              max="99"
              step="1"
              inputMode="numeric"
              placeholder="Ex : 1"
              value={form.passengers}
              onChange={e => setForm(f => ({ ...f, passengers: e.target.value }))}
              className={errors.passengers ? 'input-error' : ''}
              aria-invalid={Boolean(errors.passengers)}
            />
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
        <datalist id="available-cities">{[...new Set([...availableDepartureCities, ...availableArrivalCities])].map(city => <option key={city} value={city} />)}</datalist>
        <datalist id="available-dates">{availableDates.map(date => <option key={date} value={date} />)}</datalist>
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
