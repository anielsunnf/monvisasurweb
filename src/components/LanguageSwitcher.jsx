import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const languages = [{ code: 'fr', label: 'Français', flag: '🇫🇷' }, { code: 'en', label: 'English', flag: '🇬🇧' }, { code: 'ru', label: 'Русский', flag: '🇷🇺' }]

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const language = i18n.resolvedLanguage || i18n.language
  const current = languages.find(item => item.code === language) ?? languages[0]
  return <div className="lang-switcher">
    <button type="button" className="btn btn-ghost lang-btn" onClick={() => setOpen(value => !value)} aria-label={`${t('common.language')}: ${current.label}`} aria-expanded={open}><span className="language-globe" aria-hidden="true">◎</span><span>{current.code.toUpperCase()}</span><span className="language-chevron" aria-hidden="true">⌄</span></button>
    {open && <div className="lang-dropdown">{languages.map(lang => <button key={lang.code} type="button" className={`lang-option ${language === lang.code ? 'active' : ''}`} onClick={() => { i18n.changeLanguage(lang.code); setOpen(false) }}>{lang.flag} {lang.label}</button>)}</div>}
  </div>
}
