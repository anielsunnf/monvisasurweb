import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header({ user, onLogout, theme, onThemeChange }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const navClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`

  return <header className="header">
    <div className="container topbar">
      <NavLink to="/" className="brand" aria-label={`${t('nav.home')} Monvisasur`}><span className="brand-mark">M</span>Monvisasur</NavLink>
      <nav className="main-nav" aria-label={t('nav.home')}>
        <NavLink to="/" className={navClass}>{t('nav.home')}</NavLink>
        <NavLink to="/catalogue" className={navClass}>{t('nav.catalogue')}</NavLink>
        <NavLink to="/trajets" className={navClass}>{t('nav.book')}</NavLink>
        {user?.role === 'client' && <NavLink to="/client" className={navClass}>{t('nav.client')}</NavLink>}
        {['admin', 'advisor'].includes(user?.role) && <NavLink to="/admin" className={navClass}>{t('nav.backoffice')}</NavLink>}
      </nav>
      <div className="header-actions">
        <div className="history-controls" aria-label="Navigation de page">
          <button type="button" className="history-button" onClick={() => navigate(-1)} aria-label="Page précédente" title="Page précédente">←</button>
          <button type="button" className="history-button" onClick={() => navigate(1)} aria-label="Page suivante" title="Page suivante">→</button>
        </div>
        <button type="button" className="theme-toggle" onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? t('common.light') : t('common.dark')}>{theme === 'dark' ? '☼' : '◐'}</button>
        <LanguageSwitcher />
        {user ? <><span className="user-name">{user.name}</span><span className="role-badge">{user.role}</span><button type="button" className="btn btn-ghost" onClick={onLogout}>{t('nav.logout')}</button></> : <NavLink to="/login" className="btn btn-secondary">{t('nav.login')}</NavLink>}
      </div>
    </div>
  </header>
}
