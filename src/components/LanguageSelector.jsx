import { languageOptions } from '../data/translations'
import { useTranslation } from 'react-i18next'

export function LanguageSelector({ language, onLanguageChange }) {
  const { t } = useTranslation()
  return (
    <label className="language-selector">
      <span className="sr-only">{t('common.language')}</span>
      <select value={language} onChange={event => onLanguageChange(event.target.value)} aria-label={t('ui.language_choose')}>
        {languageOptions.map(option => <option key={option.code} value={option.code}>{option.label}</option>)}
      </select>
    </label>
  )
}
