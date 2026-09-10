import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../api'
import { useI18n } from '../components/useI18n'
import { useTranslation } from 'react-i18next'
import { Toast } from '../components/Toast'

export function LoginPage({ user, setUser }) {
	const { t } = useI18n()
	const { t: translate } = useTranslation()
	const navigate = useNavigate()
	const [mode, setMode] = useState('login')
	const [form, setForm] = useState({ name: '', email: '', password: '', role: '' })
	const [errors, setErrors] = useState({})
	const [submitError, setSubmitError] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [toast, setToast] = useState(null)

	if (user) {
		const target = user.role === 'admin' || user.role === 'advisor' ? '/admin' : '/client'
		return <Navigate to={target} replace />
	}

	async function handleSubmit(event) {
		event?.preventDefault()
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
		setIsSubmitting(true)
		try {
			const account = mode === 'register'
				? await registerUser({ ...form, role: 'client', email: form.email.trim() })
				: await loginUser({ email: form.email.trim(), password: form.password, role: form.role })
			setUser(account)
			const messageKey = account.role === 'admin' ? 'feedback.admin_success' : account.role === 'advisor' ? 'feedback.advisor_success' : 'feedback.client_success'
			setToast({ type: 'success', message: translate(messageKey) })
			window.setTimeout(() => navigate(account.role === 'admin' ? '/admin' : account.role === 'client' ? '/client' : '/'), 900)
		} catch (error) {
			setSubmitError(error.message)
			setToast({ type: 'error', message: translate('feedback.login_error') })
		} finally { setIsSubmitting(false) }
	}

	return (
		<main className="container page">
			{toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
			<div className="auth-layout">
				<aside className="auth-side">
					<span className="eyebrow" style={{ color: '#f8d36d' }}>{t('login.title')}</span>
					<h1 style={{ color: 'white', margin: '0.8rem 0' }}>{t('login.title')}</h1>
					<ul>
						<li>{t('home.step2_title')}</li>
						<li>{t('home.step3_title')}</li>
						<li>{t('nav.book')}</li>
					</ul>
				</aside>

				<section className="panel">
					<div className="tab-row" aria-label="Mode d'accès">
						<button type="button" disabled={isSubmitting} className={`tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setErrors({}); setSubmitError('') }}>{t('login')}</button>
						<button type="button" disabled={isSubmitting} className={`tab ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setForm(current => ({ ...current, role: 'client' })); setErrors({}); setSubmitError('') }}>{t('register')}</button>
					</div>
					<h2>{mode === 'login' ? t('login') : t('create')}</h2>
					{submitError && <div className="alert alert-error" role="alert">{submitError}</div>}
					<form className="form-grid" onSubmit={handleSubmit} noValidate>
						{mode === 'register' && <div className="field full">
							<label htmlFor="name">{t('ui.full_name')} *</label>
							<input id="name" name="name" autoComplete="name" aria-invalid={Boolean(errors.name)} placeholder="Votre nom complet" value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} />
							{errors.name && <span className="field-error">{errors.name}</span>}
						</div>}
						<div className="field full">
							<label htmlFor="email">{t('email')} *</label>
							<input id="email" name="email" type="email" autoComplete="email" disabled={isSubmitting} aria-invalid={Boolean(errors.email)} placeholder="votre.email@exemple.com" value={form.email} onChange={event => setForm(current => ({ ...current, email: event.target.value }))} />
							{errors.email && <span className="field-error">{errors.email}</span>}
						</div>
						<div className="field full">
							<label htmlFor="password">{t('password')} *</label>
							<div className="password-field">
								<input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} aria-invalid={Boolean(errors.password)} placeholder="Saisissez votre mot de passe" value={form.password} onChange={event => setForm(current => ({ ...current, password: event.target.value }))} />
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
						{mode === 'login' && <div className="field full">
							<label htmlFor="role">{t('profile')} *</label>
							<select id="role" disabled={isSubmitting} aria-invalid={Boolean(errors.role)} value={form.role} onChange={event => setForm(current => ({ ...current, role: event.target.value }))}>
								<option value="">{t('common.select')}</option>
								<option value="client">{t('nav.client')}</option>
								<option value="advisor">{t('ui.advisor')}</option>
								<option value="admin">{t('ui.admin_title')}</option>
							</select>
							{errors.role && <span className="field-error">{errors.role}</span>}
						</div>}
						<div className="field full">
							<button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting && <span className="button-loader" aria-hidden="true" />}{isSubmitting ? translate('feedback.logging_in') : t('submit')}</button>
						</div>
					</form>
				</section>
			</div>
		</main>
	)
}
