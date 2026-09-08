import { useTranslation } from 'react-i18next'

export function useI18n() {
  const { t: translate, i18n } = useTranslation()
  return { t: key => translate(key, { ns: 'legacy' }), language: i18n.resolvedLanguage || i18n.language }
}
