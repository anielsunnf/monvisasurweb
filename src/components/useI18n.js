import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

const legacyKeys = {
  home: 'nav.home',
  catalogue: 'nav.catalogue',
  travel: 'nav.book',
  client: 'nav.client',
  admin: 'nav.backoffice',
  login: 'nav.login',
  logout: 'nav.logout',
  language: 'common.language',
  light: 'common.light',
  dark: 'common.dark',
  heroTitle: 'home.title',
  heroText: 'home.lead',
  popular: 'home.section_services',
  discover: 'home.see_all',
  how: 'home.how_title',
  choose: 'home.step1_title',
  open: 'home.step2_title',
  track: 'home.step3_title',
  start: 'home.cta_final_title',
  create: 'home.cta_final_btn',
  searchTrip: 'search.title',
  compare: 'search.description',
  search: 'search.search_btn',
  departure: 'search.from',
  arrival: 'search.to',
  date: 'search.date',
  passengers: 'search.passengers',
  email: 'login.email',
  password: 'login.password',
  profile: 'login.profile',
  submit: 'login.submit',
  register: 'login.register',
  details: 'common.view_details',
  newCase: 'dossier.title',
  confirmTrip: 'booking.confirm_trip',
  appointment: 'booking.appointment',
  appointmentText: 'booking.appointment_description',
  slot: 'booking.slot',
  select: 'common.select',
  reason: 'booking.reason',
  reasonPlaceholder: 'booking.reason_placeholder',
  confirmAppointment: 'booking.confirm_appointment',
  assistance: 'booking.assistance',
}

export function useI18n() {
  const { t: translate, i18n } = useTranslation()
  const t = useCallback((key, options) => translate(legacyKeys[key] || key, options), [translate])
  return {
    t,
    language: i18n.resolvedLanguage || i18n.language,
  }
}
