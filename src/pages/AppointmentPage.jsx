import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { createAppointment, getAvailableSlots, getReservationWindow } from '../api'
import { useI18n } from '../components/useI18n'

export function AppointmentPage({ user }) {
  const { t } = useI18n()
  const [form, setForm] = useState({ date: '', slot: '', reason: '' })
  const [slots, setSlots] = useState([])
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const reservationWindow = getReservationWindow()

  useEffect(() => { getAvailableSlots().then(setSlots) }, [])

  async function handleSubmit() {
    if (!form.date || !form.slot || !form.reason.trim()) {
      setError(t('ui.select_date_slot_reason'))
      return
    }
    setError('')
    await createAppointment({ userId: user.id, date: form.date, slot: form.slot, reason: form.reason })
    setConfirmed(true)
  }

  if (confirmed) return <main className="container page"><div className="success-state"><h1>{t('ui.appointment_confirmed')}</h1><p>{t('ui.appointment_saved', { date: form.date, slot: form.slot })}</p><NavLink to="/client" className="btn btn-primary">{t('ui.back_to_area')}</NavLink></div></main>

  return <main className="container page"><div className="section-header"><div><span className="eyebrow">{t('ui.appointment_eyebrow')}</span><h1 className="section-title">{t('booking.appointment')}</h1></div></div><section className="panel"><p className="small-muted">{t('booking.appointment_description')}</p>{error && <div className="error-state" role="alert">{error}</div>}<div className="form-grid"><div className="field"><label htmlFor="appointment-date">{t('search.date')} *</label><input id="appointment-date" type="date" min={reservationWindow.min} max={reservationWindow.max} value={form.date} onChange={event => setForm(current => ({ ...current, date: event.target.value }))} /></div><div className="field"><label htmlFor="appointment-slot">{t('booking.slot')} *</label><select id="appointment-slot" value={form.slot} onChange={event => setForm(current => ({ ...current, slot: event.target.value }))}><option value="">{t('ui.select')}</option>{slots.map(slot => <option key={slot} value={slot}>{slot}</option>)}</select></div><div className="field full"><label htmlFor="appointment-reason">{t('booking.reason')} *</label><textarea id="appointment-reason" rows="4" value={form.reason} onChange={event => setForm(current => ({ ...current, reason: event.target.value }))} placeholder={t('booking.reason_placeholder')} /></div><div className="field full"><button type="button" className="btn btn-primary" onClick={handleSubmit}>{t('ui.confirm_appointment')}</button></div></div></section></main>
}
