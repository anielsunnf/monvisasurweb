import { useEffect } from 'react'

export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 3200)
    return () => window.clearTimeout(timeout)
  }, [onClose])
  return <div className={`toast toast-${type}`} role="status" aria-live="polite"><span aria-hidden="true">{type === 'success' ? '✓' : '!'}</span><p>{message}</p><button type="button" onClick={onClose} aria-label="Fermer">×</button></div>
}
