import { useTranslation } from 'react-i18next'

export function FilterBar({ sortBy, onSortChange, transport, onTransportChange, carrier, onCarrierChange, carriers }) {
  const { t } = useTranslation()
  return (
    <div className="filter-bar" aria-label={t('filters.label')}>
      <div className="field">
        <label htmlFor="sort">{t('filters.sort')}</label>
        <select id="sort" value={sortBy} onChange={event => onSortChange(event.target.value)}>
          <option value="">{t('filters.default')}</option>
          <option value="price">{t('filters.price')}</option>
          <option value="departure">{t('filters.departure')}</option>
          <option value="duration">{t('filters.duration')}</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="transport">{t('filters.transport')}</label>
        <select id="transport" value={transport} onChange={event => onTransportChange(event.target.value)}>
          <option value="">{t('filters.all')}</option>
          <option value="Avion">{t('filters.plane')}</option>
          <option value="Bus">{t('filters.bus')}</option>
          <option value="Train">{t('filters.train')}</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="carrier">{t('filters.carrier')}</label>
        <select id="carrier" value={carrier} onChange={event => onCarrierChange(event.target.value)}>
          <option value="">{t('filters.all')}</option>
          {carriers.map(value => <option key={value} value={value}>{value}</option>)}
        </select>
      </div>
    </div>
  )
}
