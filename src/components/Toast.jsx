import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export function Toast({ message, type = 'success', onClose }) {
  const { t } = useTranslation()
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 3200)
    return () => window.clearTimeout(timeout)
  }, [onClose])
  return <div className={`toast toast-${type}`} role="status" aria-live="polite"><span aria-hidden="true">{type === 'success' ? '✓' : '!'}</span><p>{message}</p><button type="button" onClick={onClose} aria-label={t('common.close')}>×</button></div>
}
