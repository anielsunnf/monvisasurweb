import { services } from './data/services'
import { journeys } from './data/journeys'

const STORAGE_KEYS = {
  users: 'monvisasur.users', dossiers: 'monvisasur.dossiers', orders: 'monvisasur.orders',
  appointments: 'monvisasur.appointments', notifications: 'monvisasur.notifications',
  catalogue: 'monvisasur.catalogue', journeys: 'monvisasur.journeys', session: 'monvisasur.session',
  messages: 'monvisasur.messages',
}

// Convertit un fichier en base64 pour le stockage local
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result })
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier.'))
    reader.readAsDataURL(file)
  })
}

// Convertit un document (nom ou fichier) en objet document normalisé
async function normalizeDocument(document) {
  if (typeof document === 'string') return document
  if (document && typeof document === 'object' && document.data) return document
  if (document instanceof File || document instanceof Blob) {
    return fileToBase64(document)
  }
  return document?.name || 'document.pdf'
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
let messageStore = loadStore(STORAGE_KEYS.messages, [])

// Jeu de démonstration : un dossier client déjà assigné à un conseiller, avec une conversation
const seededDossiers = [{
  id: 'DOS-DEMO-001',
  userId: 'USR-CLIENT',
  advisorId: 'USR-ADVISOR',
  serviceId: 'visa',
  service: 'Visa Schengen',
  nationality: 'Camerounaise',
  destination: 'France',
  motif: 'Séjour touristique de 15 jours.',
  date: new Date().toLocaleDateString('fr-FR'),
  status: 'en_cours',
  documents: ['passeport.pdf'],
  history: [{ label: 'Demande créée', date: new Date().toLocaleDateString('fr-FR'), description: 'Dossier ouvert par le client.' }],
  additionalRequest: '',
  clientResponse: '',
}]

const seededMessages = [
  {
    id: 'MSG-DEMO-1',
    dossierId: 'DOS-DEMO-001',
    senderId: 'USR-ADVISOR',
    senderName: 'Conseiller démo',
    senderRole: 'advisor',
    content: 'Bonjour, votre dossier a bien été reçu. Pouvez-vous confirmer la date prévue de votre départ ?',
    date: '2026-09-10T10:15:00.000Z',
  },
  {
    id: 'MSG-DEMO-2',
    dossierId: 'DOS-DEMO-001',
    senderId: 'USR-CLIENT',
    senderName: 'Client démo',
    senderRole: 'client',
    content: "Bonjour, je prévois de partir début décembre si possible.",
    date: '2026-09-10T14:02:00.000Z',
  },
  {
    id: 'MSG-DEMO-3',
    dossierId: 'DOS-DEMO-001',
    senderId: 'USR-ADVISOR',
    senderName: 'Conseiller démo',
    senderRole: 'advisor',
    content: "C'est noté. Dès réception de votre passeport, je lance la demande. Pensez à le téléverser.",
    date: '2026-09-10T15:40:00.000Z',
  },
]

if (dossierStore.length === 0) dossierStore = seededDossiers
if (messageStore.length === 0) messageStore = seededMessages

userStore = [...demoUsers, ...userStore.filter(user => !demoUsers.some(demo => demo.email === user.email))]
saveStore(USER_STORAGE_KEY, userStore)
function persistDossiers() { saveStore(STORAGE_KEYS.dossiers, dossierStore) }
function persistOrders() { saveStore(STORAGE_KEYS.orders, orderStore) }
function persistAppointments() { saveStore(STORAGE_KEYS.appointments, appointmentStore) }
function persistNotifications() { saveStore(STORAGE_KEYS.notifications, notificationStore) }
function persistCatalogue() { saveStore(STORAGE_KEYS.catalogue, catalogueStore) }
function persistJourneys() { saveStore(STORAGE_KEYS.journeys, journeyStore) }
function persistMessages() { saveStore(STORAGE_KEYS.messages, messageStore) }
persistDossiers()
persistMessages()

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

export async function createDossier(dossier) {
  if (dossier.documents && Array.isArray(dossier.documents)) {
    dossier.documents = await Promise.all(dossier.documents.map(normalizeDocument))
  }
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

export async function addDossierDocument(id, userId, document) {
  const normalized = await normalizeDocument(document)
  const normalizedName = typeof normalized === 'string' ? normalized : normalized.name
  const target = dossierStore.find(dossier => dossier.id === id && dossier.userId === userId)
  if (!target) return Promise.reject(new Error('Dossier introuvable.'))
  dossierStore = dossierStore.map(dossier => dossier.id === id ? {
    ...dossier,
    documents: [...(dossier.documents || []), normalized],
    history: [...(dossier.history || []), { label: 'Pièce complémentaire transmise', date: new Date().toLocaleDateString('fr-FR'), description: typeof normalized === 'string' ? normalized : normalized.name }],
  } : dossier)
  persistDossiers()
  addNotification({ userId, title: 'Pièce complémentaire transmise', message: normalizedName })
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
  if (order.status === 'annulée') return Promise.reject(new Error('Cette commande est déjà annulée.'))
  const departureDate = order.selectedDate || order.journey.date
  const departure = new Date(`${departureDate}T${order.journey.departure || '00:00'}`)
  if (Number.isNaN(departure.getTime())) return Promise.reject(new Error('Date de départ invalide.'))
  const daysUntilDeparture = Math.ceil((departure.getTime() - Date.now()) / 86400000)
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

export async function replaceDossierDocument(id, userId, index, document) {
  const normalized = await normalizeDocument(document)
  const target = dossierStore.find(dossier => dossier.id === id && dossier.userId === userId)
  if (!target) return Promise.reject(new Error('Dossier introuvable.'))
  dossierStore = dossierStore.map(dossier => {
    if (dossier.id !== id) return dossier
    const documents = [...(dossier.documents || [])]
    documents[index] = normalized
    return {
      ...dossier,
      documents,
      history: [...(dossier.history || []), { label: 'Pièce remplacée', date: new Date().toLocaleDateString('fr-FR'), description: typeof normalized === 'string' ? normalized : normalized.name }],
    }
  })
  persistDossiers()
  addNotification({ userId, title: 'Pièce remplacée', message: typeof normalized === 'string' ? normalized : normalized.name })
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

function canAccessDossierMessaging(dossier, requester) {
  if (!dossier) return false
  if (requester.role === 'admin') return true
  if (requester.role === 'client') return dossier.userId === requester.id
  if (requester.role === 'advisor') return !dossier.advisorId || dossier.advisorId === requester.id
  return false
}

export function getDossierMessages(dossierId, requester) {
  const dossier = dossierStore.find(item => item.id === dossierId)
  if (!dossier) return Promise.reject(new Error('Dossier introuvable.'))
  if (!canAccessDossierMessaging(dossier, requester)) {
    return Promise.reject(new Error("Vous n'avez pas accès à la messagerie de ce dossier."))
  }
  const messages = messageStore
    .filter(message => message.dossierId === dossierId)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
  return Promise.resolve(messages)
}

export function sendDossierMessage({ dossierId, sender, content }) {
  const dossier = dossierStore.find(item => item.id === dossierId)
  if (!dossier) return Promise.reject(new Error('Dossier introuvable.'))
  if (!canAccessDossierMessaging(dossier, sender)) {
    return Promise.reject(new Error("Vous n'avez pas le droit d'écrire sur ce dossier."))
  }
  const text = String(content || '').trim()
  if (!text) return Promise.reject(new Error('Le message ne peut pas être vide.'))
  const defaultName = sender.role === 'advisor' ? 'Conseiller' : sender.role === 'admin' ? 'Administration' : 'Client'
  const message = {
    id: `MSG-${Date.now()}`,
    dossierId,
    senderId: sender.id,
    senderName: sender.name || defaultName,
    senderRole: sender.role,
    content: text,
    date: new Date().toISOString(),
  }
  messageStore = [...messageStore, message]
  persistMessages()
  if (sender.role === 'client') {
    if (dossier.advisorId) {
      addNotification({ userId: dossier.advisorId, title: 'Nouveau message client', message: `Message pour le dossier ${dossierId}.` })
    }
  } else {
    addNotification({ userId: dossier.userId, title: 'Réponse du conseiller', message: `Nouveau message sur le dossier ${dossierId}.` })
  }
  return Promise.resolve(message)
}

export function getDossierAdvisor(dossierId) {
  const dossier = dossierStore.find(item => item.id === dossierId)
  if (!dossier || !dossier.advisorId) return Promise.resolve(null)
  const advisor = userStore.find(item => item.id === dossier.advisorId)
  return Promise.resolve(advisor ? { id: advisor.id, name: advisor.name, role: advisor.role } : null)
}
