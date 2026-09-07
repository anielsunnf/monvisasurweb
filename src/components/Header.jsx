import { NavLink } from 'react-router-dom'
import { LanguageSelector } from './LanguageSelector'

export function Header({ user, onLogout, language, onLanguageChange, theme, onThemeChange, labels }) {
  return (
    <header className="header">
      <div className="container topbar">
        <NavLink to="/" className="brand" aria-label="Accueil Monvisasur">
          <span className="brand-mark">M</span>
          Monvisasur
        </NavLink>

        <nav className="main-nav" aria-label="Navigation principale">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {labels.home}
          </NavLink>
          <NavLink to="/catalogue" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {labels.catalogue}
          </NavLink>
          <NavLink to="/trajets" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {labels.travel}
          </NavLink>
          {user && (
            <NavLink to="/client" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {labels.client}
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {labels.admin}
            </NavLink>
          )}
        </nav>

        <div className="header-actions">
          <button type="button" className="theme-toggle" onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? labels.light : labels.dark}>{theme === 'dark' ? '☼' : '◐'}</button>
          <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
          {user ? (
            <>
              <span className="user-name">{user.name}</span>
              <span className="role-badge">{user.role}</span>
              <button type="button" className="btn btn-ghost" onClick={onLogout}>
                {labels.logout}
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-secondary">
              {labels.login}
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}