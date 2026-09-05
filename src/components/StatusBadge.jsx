const statusConfig = {
  pending: { label: 'En attente', className: 'status-pending' },
  en_cours: { label: 'En cours', className: 'status-pending' },
  en_validation: { label: 'En validation', className: 'status-review' },
  documents_requis: { label: 'Pièces manquantes', className: 'status-rejected' },
  confirmed: { label: 'Confirmé', className: 'status-confirmed' },
  confirmé: { label: 'Confirmé', className: 'status-confirmed' },
  paid: { label: 'Payé', className: 'status-paid' },
  payé: { label: 'Payé', className: 'status-paid' },
  cancelled: { label: 'Annulé', className: 'status-cancelled' },
  accepted: { label: 'Accepté', className: 'status-accepted' },
}

export function StatusBadge({ status }) {
  const config = statusConfig[status] ?? { label: 'À traiter', className: 'status-pending' }
  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  )
}