import { languageOptions } from '../data/translations'

export function LanguageSelector({ language, onLanguageChange }) {
  return (
    <label className="language-selector">
      <span className="sr-only">Langue</span>
      <select value={language} onChange={event => onLanguageChange(event.target.value)} aria-label="Choisir la langue">
        {languageOptions.map(option => <option key={option.code} value={option.code}>{option.label}</option>)}
      </select>
    </label>
  )
}
