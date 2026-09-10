import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()
  return <footer className="site-footer"><div className="container footer-inner"><NavLink to="/" className="footer-brand" aria-label="Monvisasur"><img className="footer-logo" src="/monvisasur-logo.svg" alt="Monvisasur" /><small>{t('footer.tagline')}</small></NavLink><p className="footer-copy">© {new Date().getFullYear()} Monvisasur. {t('footer.copyright')}</p><nav className="footer-links" aria-label="Navigation secondaire"><NavLink to="/catalogue">{t('footer.services')}</NavLink><NavLink to="/trajets">{t('footer.journeys')}</NavLink><NavLink to="/login">{t('nav.login')}</NavLink></nav></div></footer>
}
