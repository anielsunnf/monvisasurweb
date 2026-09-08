import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../api'
import { useI18n } from '../components/useI18n'

export function LoginPage({ setUser }) {
	const { t } = useI18n()
	const navigate = useNavigate()
	const [mode, setMode] = useState('login')
	const [form, setForm] = useState({ name: '', email: '', password: '', role: '' })
	const [errors, setErrors] = useState({})
	const [submitError, setSubmitError] = useState('')
	const [showPassword, setShowPassword] = useState(false)

	async function handleSubmit() {
		const nextErrors = {}
		if (mode === 'register' && !form.name.trim()) nextErrors.name = 'Le nom est requis.'
		if (!form.email.trim()) nextErrors.email = 'L’adresse email est requise.'
		else if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Saisissez une adresse email valide.'
		if (!form.password) nextErrors.password = 'Le mot de passe est requis.'
		else if (form.password.length < 6) nextErrors.password = 'Le mot de passe doit contenir au moins 6 caractères.'
		if (!form.role) nextErrors.role = 'Sélectionnez un profil.'
		if (Object.keys(nextErrors).length > 0) {
			setErrors(nextErrors)
			return
		}

		setErrors({})
		setSubmitError('')
		try {
			const account = mode === 'register'
				? await registerUser({ ...form, email: form.email.trim() })
				: await loginUser({ email: form.email.trim(), password: form.password, role: form.role })
			setUser(account)
			navigate(account.role === 'admin' ? '/admin' : account.role === 'client' ? '/client' : '/')
		} catch (error) {
			setSubmitError(error.message)
		}
	}

	return (
		<main className="container page">
			<div className="auth-layout">
				<aside className="auth-side">
					<span className="eyebrow" style={{ color: '#f8d36d' }}>Plateforme</span>
					<h1 style={{ color: 'white', margin: '0.8rem 0' }}>Un seul compte pour gérer votre mobilité.</h1>
					<ul>
						<li>Ouvrir un dossier administratif</li>
						<li>Suivre l’avancement en temps réel</li>
						<li>Réserver un billet de train, avion ou bus</li>
					</ul>
				</aside>

				<section className="panel">
					<div className="tab-row" aria-label="Mode d'accès">
						<button type="button" className={`tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setErrors({}); setSubmitError('') }}>{t('login')}</button>
						<button type="button" className={`tab ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setErrors({}); setSubmitError('') }}>{t('register')}</button>
					</div>
					<h2>{mode === 'login' ? t('login') : t('create')}</h2>
					{submitError && <div className="alert alert-error" role="alert">{submitError}</div>}
					<div className="form-grid">
						{mode === 'register' && <div className="field full">
							<label htmlFor="name">Nom complet *</label>
							<input id="name" aria-invalid={Boolean(errors.name)} placeholder="Votre nom complet" value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} />
							{errors.name && <span className="field-error">{errors.name}</span>}
						</div>}
						<div className="field full">
							<label htmlFor="email">{t('email')} *</label>
							<input id="email" type="email" aria-invalid={Boolean(errors.email)} placeholder="votre.email@exemple.com" value={form.email} onChange={event => setForm(current => ({ ...current, email: event.target.value }))} />
							{errors.email && <span className="field-error">{errors.email}</span>}
						</div>
						<div className="field full">
							<label htmlFor="password">{t('password')} *</label>
							<div className="password-field">
								<input id="password" type={showPassword ? 'text' : 'password'} aria-invalid={Boolean(errors.password)} placeholder="Saisissez votre mot de passe" value={form.password} onChange={event => setForm(current => ({ ...current, password: event.target.value }))} />
								<button type="button" className="password-toggle" onClick={() => setShowPassword(current => !current)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} aria-pressed={showPassword}>
									{showPassword ? (
										<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.2A10.8 10.8 0 0 1 12 4c5.2 0 8.9 4.2 10 8-0.4 1.4-1.2 2.7-2.3 3.8M6.2 6.2C4.3 7.6 2.8 9.7 2 12c1.1 3.8 4.8 8 10 8 1.4 0 2.7-.3 3.9-.8" /></svg>
									) : (
										<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-8 10-8 10 8 10 8-3.5 8-10 8S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
									)}
								</button>
							</div>
							{errors.password && <span className="field-error">{errors.password}</span>}
						</div>
						<div className="field full">
							<label htmlFor="role">{t('profile')} *</label>
							<select id="role" aria-invalid={Boolean(errors.role)} value={form.role} onChange={event => setForm(current => ({ ...current, role: event.target.value }))}>
								<option value="">Sélectionner un profil</option>
								<option value="client">Client</option>
								<option value="advisor">Conseiller</option>
								<option value="admin">Administrateur</option>
							</select>
							{errors.role && <span className="field-error">{errors.role}</span>}
						</div>
						<div className="field full">
							<button type="button" className="btn btn-primary" onClick={handleSubmit}>{t('submit')}</button>
						</div>
					</div>
				</section>
			</div>
		</main>
	)
}
