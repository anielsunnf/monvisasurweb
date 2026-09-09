import { useTranslation } from 'react-i18next'

export function Timeline({ entries = [] }) {
  const { t } = useTranslation()
  if (entries.length === 0) return <p className="small-muted">{t('ui.none')}</p>

  return (
    <div className="timeline">
      {entries.map((entry, index) => (
        <div className="timeline-item" key={`${entry.date}-${entry.label}-${index}`}>
          <span className="timeline-dot" aria-hidden="true" />
          <div><strong>{entry.label}</strong><div className="small-muted">{entry.date}</div><p>{entry.description}</p></div>
        </div>
      ))}
    </div>
  )
}
