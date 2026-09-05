export function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">📭</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <div style={{ marginTop: '1rem' }}>
          {action}
        </div>
      )}
    </div>
  )
}
