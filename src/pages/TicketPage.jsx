import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { getOrders } from '../api'
import { useTranslation } from 'react-i18next'

export function TicketPage({ user }) {
  const { t } = useTranslation()
  const { reference } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { getOrders(user.id).then(orders => setOrder(orders.find(item => item.reference === reference))).finally(() => setLoading(false)) }, [reference, user.id])

  function downloadTicket() {
    window.print()
  }

  if (loading) return <main className="container page"><div className="loading-state"><div className="spinner" /><p>{t('ui.loading_ticket')}</p></div></main>
  if (!order) return <main className="container page"><div className="empty-state">{t('ui.ticket_not_found')}</div></main>
  return <main className="container page"><section className="ticket-card"><span className="eyebrow">{t('ui.electronic_ticket')}</span><h1>{order.route}</h1><p className="ticket-reference">{t('ui.reference')} : <strong>{order.reference}</strong></p><div className="ticket-grid"><p><strong>{t('ui.date')}</strong><br />{order.selectedDate || order.journey.date}</p><p><strong>{t('ui.departure')}</strong><br />{order.journey.departure}</p><p><strong>{t('ui.arrival')}</strong><br />{order.journey.arrival}</p><p><strong>{t('ui.carrier')}</strong><br />{order.journey.transport}</p></div><p><strong>{t('ui.passengers_documents')}</strong></p><ul>{order.passengers.map(passenger => <li key={passenger.name}>{passenger.name} · {passenger.document}</li>)}</ul><p>{t('ui.payment')} : {order.paymentStatus}</p><button type="button" className="btn btn-primary" onClick={downloadTicket}>{t('ui.print_ticket')}</button><NavLink to="/client" className="btn btn-ghost">{t('ui.back_to_orders')}</NavLink></section></main>
}
