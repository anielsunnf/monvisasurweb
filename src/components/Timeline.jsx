export function Timeline({ entries = [] }) {
  if (entries.length === 0) return <p className="small-muted">Aucun événement enregistré.</p>

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
