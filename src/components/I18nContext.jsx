import { translations } from '../data/translations'
import { I18nContext } from './i18nContext'

export function I18nProvider({ language, children }) {
  const dictionary = translations[language] || translations.fr
  const t = key => dictionary[key] || translations.fr[key] || key
  return <I18nContext.Provider value={{ language, t }}>{children}</I18nContext.Provider>
}

