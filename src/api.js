import { services } from './data/services'
import { journeys } from './data/journeys'

const STORAGE_KEYS = {
  users: 'monvisasur.users', dossiers: 'monvisasur.dossiers', orders: 'monvisasur.orders',
  appointments: 'monvisasur.appointments', notifications: 'monvisasur.notifications',
  catalogue: 'monvisasur.catalogue', journeys: 'monvisasur.journeys', session: 'monvisasur.session',
}

function getStorage() {
  const candidates = []

  try {
    if (typeof window !== 'undefined' && window.localStorage) candidates.push(window.localStorage)
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) candidates.push(globalThis.localStorage)
  } catch {
    // no browser storage available, keep the app functional in tests or non-browser contexts
  }

  const validStorage = candidates.find(storage => storage && typeof storage.getItem === 'function' && typeof storage.setItem === 'function')
  if (validStorage) return validStorage

  const memoryStore = new Map()
  return {
    getItem(key) {
      return memoryStore.has(key) ? memoryStore.get(key) : null
    },
    setItem(key, value) {
      memoryStore.set(key, String(value))
    },
    removeItem(key) {
      memoryStore.delete(key)
    },
    clear() {
      memoryStore.clear()
    },
  }
}

function loadStore(key, fallback) {
  const storage = getStorage()
  if (!storage) return fallback
  try { return JSON.parse(storage.getItem(key) || 'null') || fallback } catch { return fallback }
}
function saveStore(key, value) {
  const storage = getStorage()
  if (!storage) return
  storage.setItem(key, JSON.stringify(value))
}

const demoUsers = [
  { id: 'USR-ADMIN', email: 'admin@monvisasur.test', password: 'Admin123!', role: 'admin', name: 'Administrateur démo' },
  { id: 'USR-ADVISOR', email: 'conseiller@monvisasur.test', password: 'Conseiller123!', role: 'advisor', name: 'Conseiller démo' },
  { id: 'USR-CLIENT', email: 'client@monvisasur.test', password: 'Client123!', role: 'client', name: 'Client démo' },
]

let dossierStore = loadStore(STORAGE_KEYS.dossiers, [])
const USER_STORAGE_KEY = STORAGE_KEYS.users
let userStore = loadStore(USER_STORAGE_KEY, demoUsers)
let orderStore = loadStore(STORAGE_KEYS.orders, [])
let appointmentStore = loadStore(STORAGE_KEYS.appointments, [])
let notificationStore = loadStore(STORAGE_KEYS.notifications, [])
let catalogueStore = loadStore(STORAGE_KEYS.catalogue, services.map(service => ({ ...service, active: service.active !== false })))
let journeyStore = loadStore(STORAGE_KEYS.journeys, journeys)

userStore = [...demoUsers, ...userStore.filter(user => !demoUsers.some(demo => demo.email === user.email))]
saveStore(USER_STORAGE_KEY, userStore)
function persistDossiers() { saveStore(STORAGE_KEYS.dossiers, dossierStore) }
function persistOrders() { saveStore(STORAGE_KEYS.orders, orderStore) }
function persistAppointments() { saveStore(STORAGE_KEYS.appointments, appointmentStore) }
function persistNotifications() { saveStore(STORAGE_KEYS.notifications, notificationStore) }
function persistCatalogue() { saveStore(STORAGE_KEYS.catalogue, catalogueStore) }
function persistJourneys() { saveStore(STORAGE_KEYS.journeys, journeyStore) }

export function getReservationWindow() {
  const today = new Date()
  const todayIso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
  return { min: todayIso, max: '2027-12-31' }
}

function normalizeCity(value) {
  const normalized = value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return normalized === 'younde' ? 'yaounde' : normalized
}

export function getServices() {
  return Promise.resolve(catalogueStore.filter(service => service.active !== false))
}

export function getServiceById(id) {
  return Promise.resolve(catalogueStore.find(service => service.id === id && service.active !== false) ?? null)
}

export function getJourneyById(id) {
  return Promise.resolve(journeyStore.find(journey => journey.id === id) ?? null)
}

export function getAvailableJourneyCities(criteria = {}) {
  const matchingJourneys = journeyStore.filter(journey => (
    (!criteria.from || normalizeCity(journey.from) === normalizeCity(criteria.from))
    && (!criteria.to || normalizeCity(journey.to) === normalizeCity(criteria.to))
  ))
  const cities = criteria.field === 'from'
    ? matchingJourneys.map(journey => journey.from)
    : criteria.field === 'to'
      ? matchingJourneys.map(journey => journey.to)
      : journeyStore.flatMap(journey => [journey.from, journey.to])
  return [...new Set(cities)].sort((a, b) => a.localeCompare(b))
}

export function getAvailableJourneyDates(criteria = {}) {
  return [...new Set(journeyStore
    .filter(journey => (
      (!criteria.from || normalizeCity(journey.from) === normalizeCity(criteria.from))
      && (!criteria.to || normalizeCity(journey.to) === normalizeCity(criteria.to))
    ))
    .map(journey => journey.date))].sort()
}

export function searchJourneys(criteria) {
  const from = normalizeCity(criteria.from)
  const to = normalizeCity(criteria.to)
  const reservationWindow = getReservationWindow()

  return Promise.resolve(journeyStore.filter(journey => (
    normalizeCity(journey.from).includes(from)
    && normalizeCity(journey.to).includes(to)
    && criteria.date >= reservationWindow.min
    && criteria.date <= reservationWindow.max
    && criteria.date >= (journey.availableFrom || journey.date)
    && criteria.date <= (journey.availableTo || reservationWindow.max)
    && (!criteria.transport || journey.type === criteria.transport)
    && journey.seats >= Number(criteria.passengers || 1)
  )))
}

export function getDossiers(userId) {
  return Promise.resolve(dossierStore.filter(dossier => dossier.userId === userId))
}

export function getDossier(id, userId) {
  return Promise.resolve(dossierStore.find(dossier => dossier.id === id && dossier.userId === userId))
}

export function getAllDossiers() {
  return Promise.resolve(dossierStore)
}

export function createDossier(dossier) {
  const created = {
    ...dossier,
    id: `DOS-${Date.now()}`,
    date: new Date().toLocaleDateString('fr-FR'),
    status: 'en_cours',
    history: [{ label: 'Demande créée', date: new Date().toLocaleDateString('fr-FR'), description: 'Dossier ouvert par le client.' }],
    additionalRequest: '',
    clientResponse: '',
  }
  dossierStore = [...dossierStore, created]
  persistDossiers()
  addNotification({ userId: dossier.userId, title: 'Dossier créé', message: `Votre dossier ${created.id} a été enregistré.` })
  return Promise.resolve(created)
}

export function updateDossierStatus(id, status) {
  const target = dossierStore.find(dossier => dossier.id === id)
  dossierStore = dossierStore.map(dossier => dossier.id === id ? {
    ...dossier,
    status,
    history: [...(dossier.history || []), { label: `Statut : ${status}`, date: new Date().toLocaleDateString('fr-FR'), description: 'Statut mis à jour par le conseiller.' }],
  } : dossier)
  persistDossiers()
  if (target) addNotification({ userId: target.userId, title: 'Statut mis à jour', message: `Le dossier ${id} est maintenant : ${status}.` })
  return Promise.resolve()
}

export function requestDossierDocument(id, request) {
  const target = dossierStore.find(dossier => dossier.id === id)
  dossierStore = dossierStore.map(dossier => dossier.id === id ? {
    ...dossier,
    additionalRequest: request,
    history: [...(dossier.history || []), { label: 'Pièce complémentaire demandée', date: new Date().toLocaleDateString('fr-FR'), description: request }],
  } : dossier)
  persistDossiers()
  if (target) addNotification({ userId: target.userId, title: 'Pièce complémentaire demandée', message: request })
  return Promise.resolve()
}

export function respondToDossierRequest(id, response) {
  dossierStore = dossierStore.map(dossier => dossier.id === id ? {
    ...dossier,
    clientResponse: response,
    history: [...(dossier.history || []), { label: 'Réponse du client', date: new Date().toLocaleDateString('fr-FR'), description: response }],
  } : dossier)
  persistDossiers()
  return Promise.resolve()
}

export function addDossierDocument(id, userId, document) {
  const target = dossierStore.find(dossier => dossier.id === id && dossier.userId === userId)
  if (!target) return Promise.reject(new Error('Dossier introuvable.'))
  dossierStore = dossierStore.map(dossier => dossier.id === id ? {
    ...dossier,
    documents: [...(dossier.documents || []), document.name],
    history: [...(dossier.history || []), { label: 'Pièce complémentaire transmise', date: new Date().toLocaleDateString('fr-FR'), description: document.name }],
  } : dossier)
  persistDossiers()
  addNotification({ userId, title: 'Pièce complémentaire transmise', message: document.name })
  return Promise.resolve()
}

export function registerUser({ email, password, role, name }) {
  const normalizedEmail = email.trim().toLowerCase()
  const existing = userStore.find(user => user.email === normalizedEmail)
  if (existing) return Promise.reject(new Error('Cette adresse email est déjà utilisée.'))

  if (role !== 'client') return Promise.reject(new Error('Seul un compte client peut être créé depuis cette page.'))
  const user = { id: `USR-${Date.now()}`, email: normalizedEmail, password, role: 'client', name: name.trim() }
  userStore = [...userStore, user]
  saveStore(USER_STORAGE_KEY, userStore)
  return Promise.resolve({ id: user.id, email: user.email, role: user.role, name: user.name })
}

export function loginUser({ email, password, role }) {
  const normalizedEmail = email.trim().toLowerCase()
  const user = userStore.find(candidate => candidate.email === normalizedEmail && candidate.password === password && candidate.role === role)
  return user
    ? Promise.resolve({ id: user.id, email: user.email, role: user.role, name: user.name })
    : Promise.reject(new Error('Email, mot de passe ou profil incorrect.'))
}

export function resetPassword({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const user = userStore.find(candidate => candidate.email === normalizedEmail)
  if (!user) return Promise.reject(new Error('Aucun compte ne correspond à cette adresse email.'))
  userStore = userStore.map(candidate => candidate.email === normalizedEmail ? { ...candidate, password } : candidate)
  saveStore(USER_STORAGE_KEY, userStore)
  return Promise.resolve()
}

export function createOrder(order) {
  const journey = journeyStore.find(candidate => candidate.id === order.journeyId)
  const passengerCount = order.passengers?.length || 0
  if (!journey) return Promise.reject(new Error('Trajet introuvable.'))
  if (passengerCount < 1 || journey.seats < passengerCount) return Promise.reject(new Error('Le nombre de places disponibles est insuffisant.'))
  const created = {
    ...order,
    journey: { ...journey },
    id: `CMD-${Date.now()}`,
    status: 'confirmée',
    paymentStatus: order.paymentStatus || 'paiement simulé confirmé',
    date: new Date().toLocaleDateString('fr-FR'),
    reference: `MON-${Date.now().toString().slice(-8)}`,
    cancelledAt: '',
  }
  orderStore = [...orderStore, created]
  journeyStore = journeyStore.map(candidate => candidate.id === journey.id ? { ...candidate, seats: candidate.seats - passengerCount } : candidate)
  persistOrders()
  persistJourneys()
  addNotification({ userId: order.userId, title: 'Réservation confirmée', message: `Commande ${created.reference} confirmée.` })
  return Promise.resolve(created)
}

export function getOrders(userId) {
  return Promise.resolve(orderStore.filter(order => order.userId === userId))
}

export function cancelOrder(id, userId) {
  const order = orderStore.find(candidate => candidate.id === id && candidate.userId === userId)
  if (!order) return Promise.reject(new Error('Commande introuvable.'))
  const departureDate = order.selectedDate || order.journey.date
  const daysUntilDeparture = Math.ceil((new Date(`${departureDate}T${order.journey.departure}`) - new Date()) / 86400000)
  if (daysUntilDeparture < 2) return Promise.reject(new Error('Annulation possible jusqu’à 48 heures avant le départ.'))
  orderStore = orderStore.map(candidate => candidate.id === id ? { ...candidate, status: 'annulée', cancelledAt: new Date().toLocaleDateString('fr-FR') } : candidate)
  journeyStore = journeyStore.map(candidate => candidate.id === order.journeyId ? { ...candidate, seats: candidate.seats + order.passengers.length } : candidate)
  persistOrders()
  persistJourneys()
  addNotification({ userId, title: 'Commande annulée', message: `La commande ${order.reference} a été annulée.` })
  return Promise.resolve()
}

export function createAppointment(appointment) {
  const created = { ...appointment, id: `RDV-${Date.now()}`, status: 'confirmé' }
  appointmentStore = [...appointmentStore, created]
  persistAppointments()
  addNotification({ userId: appointment.userId, title: 'Rendez-vous confirmé', message: `Rendez-vous le ${appointment.date} à ${appointment.slot}.` })
  return Promise.resolve(created)
}

export function cancelAppointment(id, userId) {
  const appointment = appointmentStore.find(item => item.id === id && item.userId === userId)
  if (!appointment) return Promise.reject(new Error('Rendez-vous introuvable.'))
  appointmentStore = appointmentStore.map(item => item.id === id ? { ...item, status: 'annulé' } : item)
  persistAppointments()
  addNotification({ userId, title: 'Rendez-vous annulé', message: `Le rendez-vous du ${appointment.date} à ${appointment.slot} a été annulé.` })
  return Promise.resolve()
}

export function getAppointments(userId) {
  return Promise.resolve(appointmentStore.filter(appointment => appointment.userId === userId))
}

export function getAvailableSlots() {
  return Promise.resolve(['09:00', '10:30', '14:00', '15:30'])
}

export function getNotifications(userId) {
  return Promise.resolve(notificationStore.filter(notification => notification.userId === userId))
}

export function addNotification(notification) {
  notificationStore = [...notificationStore, { ...notification, id: `NOT-${Date.now()}`, channel: 'email-simulé', read: false }]
  persistNotifications()
  return Promise.resolve()
}

export function updateService(id, changes) {
  catalogueStore = catalogueStore.map(service => service.id === id ? { ...service, ...changes } : service)
  persistCatalogue()
  return Promise.resolve()
}

export function updateJourney(id, changes) {
  journeyStore = journeyStore.map(journey => journey.id === id ? { ...journey, ...changes } : journey)
  persistJourneys()
  return Promise.resolve()
}

export function getAllServices() {
  return Promise.resolve(catalogueStore)
}

export function getAllJourneys() {
  return Promise.resolve(journeyStore)
}

export function replaceDossierDocument(id, userId, index, document) {
  const target = dossierStore.find(dossier => dossier.id === id && dossier.userId === userId)
  if (!target) return Promise.reject(new Error('Dossier introuvable.'))
  dossierStore = dossierStore.map(dossier => {
    if (dossier.id !== id) return dossier
    const documents = [...(dossier.documents || [])]
    documents[index] = document.name
    return {
      ...dossier,
      documents,
      history: [...(dossier.history || []), { label: 'Pièce remplacée', date: new Date().toLocaleDateString('fr-FR'), description: document.name }],
    }
  })
  persistDossiers()
  addNotification({ userId, title: 'Pièce remplacée', message: document.name })
  return Promise.resolve()
}

export function getAdvisors() {
  return Promise.resolve(userStore
    .filter(user => user.role === 'advisor')
    .map(({ password: _password, ...user }) => user))
}

export function getAllUsers() {
  return Promise.resolve(userStore.map(({ password: _password, ...user }) => user))
}

export function assignDossierAdvisor(id, advisorId) {
  dossierStore = dossierStore.map(dossier => dossier.id === id ? { ...dossier, advisorId } : dossier)
  persistDossiers()
  return Promise.resolve()
}

export function getAdvisorDossiers(advisorId) {
  return Promise.resolve(dossierStore.filter(dossier => dossier.advisorId === advisorId))
}
