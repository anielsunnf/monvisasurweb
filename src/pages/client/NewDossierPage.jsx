import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDossier } from '../../api'
import { services } from '../../data/services'

export function NewDossierPage({ user }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    serviceId: '',
    nationality: '',
    destination: '',
    motif: '',
    document: null,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function validate() {
    const errs = {}
    if (!form.serviceId) errs.serviceId = 'Veuillez choisir une prestation'
    if (!form.nationality.trim()) errs.nationality = 'La nationalité est requise'
    if (!form.motif.trim()) errs.motif = 'Le motif est requis'
    if (!form.document) errs.document = 'Au moins un document est requis'
    return errs
  }

  async function handleSubmit() {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setLoading(true)
    try {
      const service = services.find(s => s.id === form.serviceId)
      await createDossier({
        userId: user.id,
        serviceId: form.serviceId,
        service: service?.name ?? form.serviceId,
        nationality: form.nationality,
        destination: form.destination,
        motif: form.motif,
        documents: [form.document?.name ?? 'document.pdf'],
      })
      setSuccess(true)
      setTimeout(() => navigate('/client'), 2000)
    } catch {
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="container page">
        <div className="success-state">
          <div className="success-icon">✅</div>
          <h2>Dossier soumis avec succès !</h2>
          <p>Votre dossier a été créé. Un conseiller vous contactera sous 24h.</p>
          <p className="small-muted">Redirection vers votre espace client...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container page">
      <div className="section-header">
        <div>
          <span className="eyebrow">Nouvelle demande</span>
          <h1 className="section-title">Ouvrir un dossier</h1>
        </div>
      </div>

      <div className="panel">
        {errors.submit && (
          <div className="alert alert-error">{errors.submit}</div>
        )}

        <div className="form-grid">
          <div className="field full">
            <label htmlFor="service">Prestation *</label>
            <select
              id="service"
              value={form.serviceId}
              onChange={e => setForm(f => ({ ...f, serviceId: e.target.value }))}
              className={errors.serviceId ? 'input-error' : ''}
            >
              <option value="">Sélectionner une prestation</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {errors.serviceId && <span className="field-error">{errors.serviceId}</span>}
          </div>

          <div className="field">
            <label htmlFor="nationality">Nationalité *</label>
            <input
              id="nationality"
              placeholder="Ex : Camerounaise"
              value={form.nationality}
              onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))}
              className={errors.nationality ? 'input-error' : ''}
            />
            {errors.nationality && <span className="field-error">{errors.nationality}</span>}
          </div>

          <div className="field">
            <label htmlFor="destination">Destination</label>
            <input
              id="destination"
              placeholder="Ex : France"
              value={form.destination}
              onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
            />
          </div>

          <div className="field full">
            <label htmlFor="motif">Motif de la demande *</label>
            <textarea
              id="motif"
              rows="4"
              placeholder="Décrivez le motif de votre demande..."
              value={form.motif}
              onChange={e => setForm(f => ({ ...f, motif: e.target.value }))}
              className={errors.motif ? 'input-error' : ''}
            />
            {errors.motif && <span className="field-error">{errors.motif}</span>}
          </div>

          <div className="field full">
            <label htmlFor="document">Pièce justificative *</label>
            <input
              id="document"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={e => setForm(f => ({ ...f, document: e.target.files[0] ?? null }))}
              className={errors.document ? 'input-error' : ''}
            />
            <span className="field-hint">Formats acceptés : PDF, JPG, PNG · Max 5 Mo</span>
            {errors.document && <span className="field-error">{errors.document}</span>}
          </div>

          <div className="field full">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Soumettre le dossier'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}