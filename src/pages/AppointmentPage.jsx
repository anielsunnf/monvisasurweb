import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { createAppointment, getAvailableSlots } from '../api'
import { useI18n } from '../components/useI18n'

export function AppointmentPage({ user }) {
  const { t } = useI18n()
  const [form, setForm] = useState({ date: '', slot: '', reason: '' })
  const [slots, setSlots] = useState([])
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => { getAvailableSlots().then(setSlots) }, [])

  async function handleSubmit() {
    if (!form.date || !form.slot || !form.reason.trim()) {
      setError('Choisissez une date, un créneau et indiquez le motif du rendez-vous.')
      return
    }
    setError('')
    await createAppointment({ userId: user.id, date: form.date, slot: form.slot, reason: form.reason })
    setConfirmed(true)
  }

  if (confirmed) return <main className="container page"><div className="success-state"><h1>Rendez-vous confirmé</h1><p>Votre demande a été enregistrée pour le {form.date} à {form.slot}.</p><NavLink to="/client" className="btn btn-primary">Retour à mon espace</NavLink></div></main>

  return <main className="container page"><div className="section-header"><div><span className="eyebrow">Conseiller</span><h1 className="section-title">{t('appointment')}</h1></div></div><section className="panel"><p className="small-muted">{t('appointmentText')}</p>{error && <div className="error-state" role="alert">{error}</div>}<div className="form-grid"><div className="field"><label htmlFor="appointment-date">{t('date')} *</label><input id="appointment-date" type="date" value={form.date} onChange={event => setForm(current => ({ ...current, date: event.target.value }))} /></div><div className="field"><label htmlFor="appointment-slot">{t('slot')} *</label><select id="appointment-slot" value={form.slot} onChange={event => setForm(current => ({ ...current, slot: event.target.value }))}><option value="">{t('select')}</option>{slots.map(slot => <option key={slot} value={slot}>{slot}</option>)}</select></div><div className="field full"><label htmlFor="appointment-reason">{t('reason')} *</label><textarea id="appointment-reason" rows="4" value={form.reason} onChange={event => setForm(current => ({ ...current, reason: event.target.value }))} placeholder={t('reasonPlaceholder')} /></div><div className="field full"><button type="button" className="btn btn-primary" onClick={handleSubmit}>{t('confirmAppointment')}</button></div></div></section></main>
}
