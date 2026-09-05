export function FilterBar({ sortBy, onSortChange, transport, onTransportChange, carrier, onCarrierChange, carriers }) {
  return (
    <div className="filter-bar" aria-label="Filtres des trajets">
      <div className="field">
        <label htmlFor="sort">Trier par</label>
        <select id="sort" value={sortBy} onChange={event => onSortChange(event.target.value)}>
          <option value="">Par défaut</option>
          <option value="price">Prix croissant</option>
          <option value="departure">Heure de départ</option>
          <option value="duration">Durée</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="transport">Type de transport</label>
        <select id="transport" value={transport} onChange={event => onTransportChange(event.target.value)}>
          <option value="">Tous</option>
          <option value="Avion">Avion</option>
          <option value="Bus">Bus</option>
          <option value="Train">Train</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="carrier">Transporteur</label>
        <select id="carrier" value={carrier} onChange={event => onCarrierChange(event.target.value)}>
          <option value="">Tous</option>
          {carriers.map(value => <option key={value} value={value}>{value}</option>)}
        </select>
      </div>
    </div>
  )
}
