import { useTranslation } from 'react-i18next'

const statusConfig = { pending: 'status-pending', en_cours: 'status-pending', en_validation: 'status-review', documents_requis: 'status-rejected', confirmed: 'status-confirmed', confirmé: 'status-confirmed', paid: 'status-paid', payé: 'status-paid', cancelled: 'status-cancelled', accepted: 'status-accepted' }

export function StatusBadge({ status }) {
  const { t } = useTranslation()
  const normalized = status === 'confirmé' ? 'confirmed' : status === 'payé' ? 'paid' : status
  return <span className={`status-badge ${statusConfig[status] ?? 'status-pending'}`}>{t(`status.${normalized}`, { defaultValue: t('status.default') })}</span>
}
