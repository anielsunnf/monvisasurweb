import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { getOrders } from '../api'

export function TicketPage({ user }) {
  const { reference } = useParams()
  const [order, setOrder] = useState(null)
  useEffect(() => { getOrders(user.id).then(orders => setOrder(orders.find(item => item.reference === reference))) }, [reference, user.id])

  function downloadTicket() {
    window.print()
  }

  if (!order) return <main className="container page"><div className="empty-state">Billet introuvable.</div></main>
  return <main className="container page"><section className="ticket-card"><span className="eyebrow">Billet électronique</span><h1>{order.route}</h1><p className="ticket-reference">Référence : <strong>{order.reference}</strong></p><div className="ticket-grid"><p><strong>Date</strong><br />{order.selectedDate || order.journey.date}</p><p><strong>Départ</strong><br />{order.journey.departure}</p><p><strong>Arrivée</strong><br />{order.journey.arrival}</p><p><strong>Transporteur</strong><br />{order.journey.transport}</p></div><p><strong>Passagers et documents :</strong></p><ul>{order.passengers.map(passenger => <li key={passenger.name}>{passenger.name} · {passenger.document}</li>)}</ul><p>Paiement : {order.paymentStatus}</p><button type="button" className="btn btn-primary" onClick={downloadTicket}>Télécharger / imprimer le PDF</button><NavLink to="/client" className="btn btn-ghost">Retour à mes commandes</NavLink></section></main>
}
