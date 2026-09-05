import { NavLink } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <NavLink to="/" className="footer-brand" aria-label="Accueil Monvisasur">
          <span className="footer-mark">M</span>
          <span>
            <strong>Monvisasur</strong>
            <small>Mobilité et démarches simplifiées</small>
          </span>
        </NavLink>

        <p className="footer-copy">© {new Date().getFullYear()} Monvisasur. Tous droits réservés.</p>

        <nav className="footer-links" aria-label="Navigation secondaire">
          <NavLink to="/catalogue">Prestations</NavLink>
          <NavLink to="/trajets">Trajets</NavLink>
          <NavLink to="/login">Connexion</NavLink>
        </nav>
      </div>
    </footer>
  )
}
