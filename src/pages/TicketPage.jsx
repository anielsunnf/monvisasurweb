import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { getOrders } from '../api'
import { useTranslation } from 'react-i18next'
import { useI18n } from '../components/useI18n'

function formatDate(isoOrShort, language) {
  if (!isoOrShort) return ''
  const d = new Date(isoOrShort)
  if (isNaN(d.getTime())) return isoOrShort
  return d.toLocaleDateString(language || 'fr', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export function TicketPage({ user }) {
  const { t } = useTranslation()
  const { language } = useI18n()
  const { reference } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getOrders(user.id)
      .then((orders) => {
        const found = orders.find((item) => item.reference === reference)
        setOrder(found ?? null)
        if (!found) setError(t('ui.ticket_not_found'))
      })
      .catch(() => setError(t('common.load_error')))
      .finally(() => setLoading(false))
  }, [reference, user.id, t])

  function downloadTicket() {
    window.print()
  }

  const labels = {
    title: t('ui.electronic_ticket'),
    reference_label: t('ui.reference'),
    date_label: t('ui.date'),
    departure_label: t('ui.departure'),
    arrival_label: t('ui.arrival'),
    carrier_label: t('ui.carrier'),
    passengers_label: t('ui.passengers_documents'),
    payment_label: t('ui.payment'),
    payment_none: t('ui.no_value'),
    back: t('ui.back_to_orders'),
    view_ticket: t('ui.print_ticket'),
  }

  if (loading) {
    return (
      <main className="container page">
        <div className="loading-state">
          <div className="spinner" />
          <p>{t('ui.loading_ticket')}</p>
        </div>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="container page">
        <div className="empty-state">
          <p>{error || t('ui.ticket_not_found')}</p>
          <NavLink to="/client" className="btn btn-primary">
            {labels.back}
          </NavLink>
        </div>
      </main>
    )
  }

  return (
    <main className="container page">
      <section className="ticket-card">
        <span className="eyebrow">{labels.title}</span>
        <h1>{order.route}</h1>
        <p className="ticket-reference">
          {labels.reference_label} : <strong>{order.reference}</strong>
        </p>
        <div className="ticket-grid">
          <p>
            <strong>{labels.date_label}</strong>
            <br />
            {formatDate(order.selectedDate || order.journey?.date, language)}
          </p>
          <p>
            <strong>{labels.departure_label}</strong>
            <br />
            {order.journey?.departure || labels.payment_none}
          </p>
          <p>
            <strong>{labels.arrival_label}</strong>
            <br />
            {order.journey?.arrival || labels.payment_none}
          </p>
          <p>
            <strong>{labels.carrier_label}</strong>
            <br />
            {order.journey?.transport || labels.payment_none}
          </p>
        </div>
        <p><strong>{labels.passengers_label}</strong></p>
        <ul style={{ margin: '0.5rem 0 0', padding: 0 }}>
          {order.passengers.map((passenger) => (
            <li key={`${passenger.name}-${passenger.document}`}>
              {passenger.name} · {passenger.document}
            </li>
          ))}
        </ul>
        <p style={{ marginTop: '1rem' }}>
          <strong>{labels.payment_label}</strong> :{' '}
          {order.paymentStatus || labels.payment_none}
        </p>
        <div
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={downloadTicket}
          >
            {labels.view_ticket}
          </button>
          <NavLink to="/client" className="btn btn-ghost">
            {labels.back}
          </NavLink>
        </div>
      </section>
    </main>
  )
}
