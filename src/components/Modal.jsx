import { useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export function Modal({ title, children, onClose, footer }) {
  const { t } = useTranslation()
  const titleId = useId()
  const dialogRef = useRef(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    dialogRef.current?.focus()
    const onKeyDown = event => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  return <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section ref={dialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex="-1">
      <div className="modal-header"><h2 id={titleId}>{title}</h2><button type="button" className="modal-close" onClick={onClose} aria-label={t('common.close')}>×</button></div>
      <div className="modal-body">{children}</div>
      {footer && <div className="modal-footer">{footer}</div>}
    </section>
  </div>
}
