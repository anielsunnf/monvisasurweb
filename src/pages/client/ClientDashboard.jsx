import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cancelAppointment, cancelOrder, getAppointments, getDossiers, getOrders } from '../../api'
import { StatusBadge } from '../../components/StatusBadge'
import { EmptyState } from '../../components/EmptyState'
import { localizeService } from '../../data/services'

export function ClientDashboard({ user }) {
  const { t, i18n } = useTranslation()
  const [dossiers, setDossiers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState([])
  const [appointments, setAppointments] = useState([])
  const [orderError, setOrderError] = useState('')
  useEffect(() => { Promise.all([getDossiers(user.id), getOrders(user.id), getAppointments(user.id)]).then(([nextDossiers, nextOrders, nextAppointments]) => { setDossiers(nextDossiers); setOrders(nextOrders); setAppointments(nextAppointments) }).catch(() => setError(t('client_dashboard.load_error'))).finally(() => setLoading(false)) }, [user.id, t])
  async function handleCancel(orderId) { setOrderError(''); try { await cancelOrder(orderId, user.id); setOrders(current => current.map(order => order.id === orderId ? { ...order, status: 'annulée' } : order)) } catch (exception) { setOrderError(exception.message) } }
  async function handleCancelAppointment(appointmentId) { await cancelAppointment(appointmentId, user.id); setAppointments(current => current.map(appointment => appointment.id === appointmentId ? { ...appointment, status: 'annulé' } : appointment)) }
  const client = 'client_dashboard'
  return <main className="container page"><div className="section-header"><div><span className="eyebrow">{t('nav.client')}</span><h1 className="section-title">{t('nav.client')}</h1></div><NavLink to="/client/dossiers/nouveau" className="btn btn-primary">{t('dossier.title')}</NavLink></div><div className="dashboard-grid">
    <section className="panel"><h2>{t(`${client}.my_files`)}</h2>{loading ? <div className="loading-state"><p>{t(`${client}.loading`)}</p></div> : error ? <div className="error-state" role="alert"><p>{error}</p><button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>{t(`${client}.retry`)}</button></div> : dossiers.length === 0 ? <EmptyState title={t(`${client}.no_file`)} description={t(`${client}.no_file_description`)} action={<NavLink to="/client/dossiers/nouveau" className="btn btn-primary">{t(`${client}.first_file`)}</NavLink>} /> : <div className="list">{dossiers.map(dossier => <article key={dossier.id} className="list-card"><div><strong>{dossier.serviceId ? localizeService({ id: dossier.serviceId, name: dossier.service }, i18n.resolvedLanguage || i18n.language).name : dossier.service}</strong><div className="meta-line"><span>{dossier.id}</span><span>{dossier.date}</span></div></div><div><StatusBadge status={dossier.status} /><NavLink to={`/client/dossiers/${dossier.id}`} className="btn btn-ghost">{t(`${client}.details`)}</NavLink></div></article>)}</div>}</section>
    <aside className="summary-box"><h3>{t(`${client}.my_orders`)}</h3>{orders.length === 0 ? <p className="small-muted">{t(`${client}.no_order`)}</p> : <div className="list">{orders.map(order => <article key={order.id} className="card"><strong>{order.route}</strong><div className="meta-line"><span>{order.id}</span><span>{order.date}</span></div><div className="meta-line"><span>{order.passengers.length} {t(`${client}.passenger`)}{order.passengers.length > 1 ? 's' : ''}</span><strong>{order.total.toLocaleString()} {order.currency}</strong></div><StatusBadge status={order.status === 'annulée' ? 'cancelled' : 'confirmed'} /><div className="card-actions"><NavLink to={`/billet/${order.reference}`} className="btn btn-ghost">{t(`${client}.ticket`)}</NavLink>{order.status !== 'annulée' && <button type="button" className="btn btn-ghost" onClick={() => handleCancel(order.id)}>{t(`${client}.cancel`)}</button>}</div></article>)}</div>}{orderError && <p className="field-error" role="alert">{orderError}</p>}
      <h3 style={{ marginTop: '1.5rem' }}>{t(`${client}.appointments`)}</h3>{appointments.length === 0 ? <p className="small-muted">{t(`${client}.no_appointment`)}</p> : appointments.map(appointment => <div className="appointment-row" key={appointment.id}><p className="small-muted">{appointment.date} · {appointment.slot} : {appointment.reason}<br /><StatusBadge status={appointment.status === 'annulé' ? 'cancelled' : 'confirmed'} /></p>{appointment.status !== 'annulé' && <button type="button" className="btn btn-ghost" onClick={() => handleCancelAppointment(appointment.id)}>{t(`${client}.cancel`)}</button>}</div>)}<NavLink to="/rendez-vous" className="btn btn-secondary">{t(`${client}.make_appointment`)}</NavLink><NavLink to="/client/notifications" className="btn btn-secondary">{t(`${client}.notifications`)}</NavLink>
      <h3 style={{ marginTop: '1.5rem' }}>{t(`${client}.quick_access`)}</h3><div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}><NavLink to="/catalogue" className="btn btn-secondary">{t(`${client}.services_catalogue`)}</NavLink><NavLink to="/trajets" className="btn btn-secondary">{t(`${client}.book_ticket`)}</NavLink></div><p className="small-muted" style={{ marginTop: '1rem' }}>{t(`${client}.profile_hint`)}</p>
    </aside>
  </div></main>
}
