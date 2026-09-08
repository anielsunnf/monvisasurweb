import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import fr from './locales/fr.json'
import en from './locales/en.json'
import ru from './locales/ru.json'
import { translations } from './data/translations'

const dossierTranslations = {
  fr: { eyebrow: 'Nouvelle demande', title: 'Ouvrir un dossier', service: 'Prestation', service_placeholder: 'Sélectionner une prestation', nationality: 'Nationalité', nationality_placeholder: 'Ex : Camerounaise', destination: 'Destination', destination_placeholder: 'Ex : France', motif: 'Motif de la demande', motif_placeholder: 'Décrivez le motif de votre demande...', document: 'Pièce justificative', file_hint: 'Formats acceptés : PDF, JPG, PNG · Max 5 Mo', submit: 'Soumettre le dossier', submitting: 'Envoi en cours...', success_title: 'Dossier soumis avec succès !', success_desc: 'Votre dossier a été créé. Un conseiller vous contactera sous 24h.', redirecting: 'Redirection vers votre espace client...', err_service: 'Veuillez choisir une prestation', err_nationality: 'La nationalité est requise', err_motif: 'Le motif est requis', err_document: 'Au moins un document est requis' },
  en: { eyebrow: 'New request', title: 'Open a file', service: 'Service', service_placeholder: 'Select a service', nationality: 'Nationality', nationality_placeholder: 'e.g. Cameroonian', destination: 'Destination', destination_placeholder: 'e.g. France', motif: 'Reason for request', motif_placeholder: 'Describe the reason for your request...', document: 'Supporting document', file_hint: 'Accepted formats: PDF, JPG, PNG · Max 5 MB', submit: 'Submit file', submitting: 'Submitting...', success_title: 'File submitted successfully!', success_desc: 'Your file has been created. An advisor will contact you within 24h.', redirecting: 'Redirecting to your client area...', err_service: 'Please choose a service', err_nationality: 'Nationality is required', err_motif: 'Reason is required', err_document: 'At least one document is required' },
  ru: { eyebrow: 'Новый запрос', title: 'Открыть дело', service: 'Услуга', service_placeholder: 'Выберите услугу', nationality: 'Гражданство', nationality_placeholder: 'Например: Камерун', destination: 'Направление', destination_placeholder: 'Например: Франция', motif: 'Причина запроса', motif_placeholder: 'Опишите причину вашего запроса...', document: 'Подтверждающий документ', file_hint: 'Допустимые форматы: PDF, JPG, PNG · Макс. 5 МБ', submit: 'Отправить дело', submitting: 'Отправка...', success_title: 'Дело успешно отправлено!', success_desc: 'Ваше дело создано. Консультант свяжется с вами в течение 24 часов.', redirecting: 'Перенаправление в личный кабинет...', err_service: 'Выберите услугу', err_nationality: 'Требуется гражданство', err_motif: 'Требуется причина', err_document: 'Необходим хотя бы один документ' },
}

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: {
    fr: { translation: { ...fr, dossier: dossierTranslations.fr }, legacy: translations.fr },
    en: { translation: { ...en, dossier: dossierTranslations.en }, legacy: translations.en },
    ru: { translation: { ...ru, dossier: dossierTranslations.ru }, legacy: translations.ru },
  },
  fallbackLng: 'fr',
  supportedLngs: ['fr', 'en', 'ru'],
  interpolation: { escapeValue: false },
  detection: { order: ['localStorage', 'navigator'], lookupLocalStorage: 'i18nextLng', caches: ['localStorage'] },
})

export default i18n
