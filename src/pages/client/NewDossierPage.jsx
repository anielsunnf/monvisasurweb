import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { createDossier, getServices } from '../../api'
import { localizeService } from '../../data/services'

export function NewDossierPage({ user }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ serviceId: '', nationality: '', destination: '', motif: '', document: null })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [services, setServices] = useState([])

  useEffect(() => { getServices().then(setServices) }, [])

  function validate() {
    const nextErrors = {}
    if (!form.serviceId) nextErrors.serviceId = t('dossier.err_service')
    if (!form.nationality.trim()) nextErrors.nationality = t('dossier.err_nationality')
    if (!form.motif.trim()) nextErrors.motif = t('dossier.err_motif')
    if (!form.document) nextErrors.document = t('dossier.err_document')
    else if (!['application/pdf', 'image/jpeg', 'image/png'].includes(form.document.type)) nextErrors.document = t('dossier.err_document_type')
    else if (form.document.size > 5 * 1024 * 1024) nextErrors.document = t('dossier.err_document_size')
    return nextErrors
  }

  async function handleSubmit() {
    const nextErrors = validate()
    if (Object.keys(nextErrors).length) return setErrors(nextErrors)
    setLoading(true)
    try {
      const service = services.find(item => item.id === form.serviceId)
      const localizedService = service ? localizeService(service, i18n.resolvedLanguage || i18n.language) : null
      await createDossier({ userId: user.id, serviceId: form.serviceId, service: localizedService?.name ?? form.serviceId, nationality: form.nationality, destination: form.destination, motif: form.motif, documents: [form.document?.name ?? 'document.pdf'] })
      setSuccess(true)
      setTimeout(() => navigate('/client'), 2000)
    } catch {
      setErrors({ submit: t('common.error') })
    } finally { setLoading(false) }
  }

  if (success) return <main className="container page"><div className="success-state"><div className="success-icon">✅</div><h2>{t('dossier.success_title')}</h2><p>{t('dossier.success_desc')}</p><p className="small-muted">{t('dossier.redirecting')}</p></div></main>

  const update = (field, value) => setForm(current => ({ ...current, [field]: value }))
  return <main className="container page"><div className="section-header"><div><span className="eyebrow">{t('dossier.eyebrow')}</span><h1 className="section-title">{t('dossier.title')}</h1></div></div><div className="panel">
    {errors.submit && <div className="alert alert-error">{errors.submit}</div>}
    <div className="form-grid">
      <div className="field full"><label htmlFor="service">{t('dossier.service')} *</label><select id="service" value={form.serviceId} onChange={event => update('serviceId', event.target.value)} className={errors.serviceId ? 'input-error' : ''}><option value="">{t('dossier.service_placeholder')}</option>{services.map(service => <option key={service.id} value={service.id}>{localizeService(service, i18n.resolvedLanguage || i18n.language).name}</option>)}</select>{errors.serviceId && <span className="field-error">{errors.serviceId}</span>}</div>
      <div className="field"><label htmlFor="nationality">{t('dossier.nationality')} *</label><input id="nationality" placeholder={t('dossier.nationality_placeholder')} value={form.nationality} onChange={event => update('nationality', event.target.value)} className={errors.nationality ? 'input-error' : ''} />{errors.nationality && <span className="field-error">{errors.nationality}</span>}</div>
      <div className="field"><label htmlFor="destination">{t('dossier.destination')}</label><input id="destination" placeholder={t('dossier.destination_placeholder')} value={form.destination} onChange={event => update('destination', event.target.value)} /></div>
      <div className="field full"><label htmlFor="motif">{t('dossier.motif')} *</label><textarea id="motif" rows="4" placeholder={t('dossier.motif_placeholder')} value={form.motif} onChange={event => update('motif', event.target.value)} className={errors.motif ? 'input-error' : ''} />{errors.motif && <span className="field-error">{errors.motif}</span>}</div>
      <div className="field full"><label htmlFor="document">{t('dossier.document')} *</label><input id="document" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={event => update('document', event.target.files[0] ?? null)} className={errors.document ? 'input-error' : ''} /><span className="field-hint">{t('dossier.file_hint')}</span>{errors.document && <span className="field-error">{errors.document}</span>}</div>
      <div className="field full"><button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? t('dossier.submitting') : t('dossier.submit')}</button></div>
    </div>
  </div></main>
}
