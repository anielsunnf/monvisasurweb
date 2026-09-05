import { NavLink } from 'react-router-dom'

export function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="container topbar">
        <NavLink to="/" className="brand" aria-label="Accueil Monvisasur">
          <span className="brand-mark">M</span>
          Monvisasur
        </NavLink>

        <nav className="main-nav" aria-label="Navigation principale">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Accueil
          </NavLink>
          <NavLink to="/catalogue" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Catalogue
          </NavLink>
          <NavLink to="/trajets" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Réserver un billet
          </NavLink>
          {user && (
            <NavLink to="/client" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Espace client
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Back-office
            </NavLink>
          )}
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <span className="user-name">{user.name}</span>
              <span className="role-badge">{user.role}</span>
              <button type="button" className="btn btn-ghost" onClick={onLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-secondary">
              Connexion
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}