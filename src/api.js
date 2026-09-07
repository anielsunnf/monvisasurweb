import { services } from './data/services'
import { journeys } from './data/journeys'

let dossierStore = []
const USER_STORAGE_KEY = 'monvisasur.users'
let userStore = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]')
let orderStore = []
let appointmentStore = []
let notificationStore = []
let catalogueStore = [...services]
let journeyStore = [...journeys]

function normalizeCity(value) {
  const normalized = value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return normalized === 'younde' ? 'yaounde' : normalized
}

export function getServices() {
  return Promise.resolve(catalogueStore)
}

export function getServiceById(id) {
  return Promise.resolve(catalogueStore.find(service => service.id === id) ?? null)
}

export function getJourneyById(id) {
  return Promise.resolve(journeyStore.find(journey => journey.id === id) ?? null)
}

export function searchJourneys(criteria) {
  const from = normalizeCity(criteria.from)
  const to = normalizeCity(criteria.to)

  return Promise.resolve(journeyStore.filter(journey => (
    normalizeCity(journey.from).includes(from)
    && normalizeCity(journey.to).includes(to)
    && criteria.date >= (journey.availableFrom || journey.date)
    && criteria.date <= (journey.availableTo || journey.date)
    && (!criteria.transport || journey.type === criteria.transport)
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
  if (target) addNotification({ userId: target.userId, title: 'Pièce complémentaire demandée', message: request })
  return Promise.resolve()
}

export function respondToDossierRequest(id, response) {
  dossierStore = dossierStore.map(dossier => dossier.id === id ? {
    ...dossier,
    clientResponse: response,
    history: [...(dossier.history || []), { label: 'Réponse du client', date: new Date().toLocaleDateString('fr-FR'), description: response }],
  } : dossier)
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
  addNotification({ userId, title: 'Pièce complémentaire transmise', message: document.name })
  return Promise.resolve()
}

export function registerUser({ email, password, role, name }) {
  const normalizedEmail = email.trim().toLowerCase()
  const existing = userStore.find(user => user.email === normalizedEmail)
  if (existing) return Promise.reject(new Error('Cette adresse email est déjà utilisée.'))

  const user = { id: `USR-${Date.now()}`, email: normalizedEmail, password, role, name: name.trim() }
  userStore = [...userStore, user]
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userStore))
  return Promise.resolve({ id: user.id, email: user.email, role: user.role, name: user.name })
}

export function loginUser({ email, password, role }) {
  const normalizedEmail = email.trim().toLowerCase()
  const user = userStore.find(candidate => candidate.email === normalizedEmail && candidate.password === password && candidate.role === role)
  return user
    ? Promise.resolve({ id: user.id, email: user.email, role: user.role, name: user.name })
    : Promise.reject(new Error('Email, mot de passe ou profil incorrect.'))
}

export function createOrder(order) {
  const created = {
    ...order,
    id: `CMD-${Date.now()}`,
    status: 'confirmée',
    paymentStatus: order.paymentStatus || 'paiement simulé confirmé',
    date: new Date().toLocaleDateString('fr-FR'),
    reference: `MON-${Date.now().toString().slice(-8)}`,
    cancelledAt: '',
  }
  orderStore = [...orderStore, created]
  addNotification({ userId: order.userId, title: 'Réservation confirmée', message: `Commande ${created.reference} confirmée.` })
  return Promise.resolve(created)
}

export function getOrders(userId) {
  return Promise.resolve(orderStore.filter(order => order.userId === userId))
}

export function cancelOrder(id, userId) {
  const order = orderStore.find(candidate => candidate.id === id && candidate.userId === userId)
  if (!order) return Promise.reject(new Error('Commande introuvable.'))
  const daysUntilDeparture = Math.ceil((new Date(`${order.journey.date}T${order.journey.departure}`) - new Date()) / 86400000)
  if (daysUntilDeparture < 2) return Promise.reject(new Error('Annulation possible jusqu’à 48 heures avant le départ.'))
  orderStore = orderStore.map(candidate => candidate.id === id ? { ...candidate, status: 'annulée', cancelledAt: new Date().toLocaleDateString('fr-FR') } : candidate)
  addNotification({ userId, title: 'Commande annulée', message: `La commande ${order.reference} a été annulée.` })
  return Promise.resolve()
}

export function createAppointment(appointment) {
  const created = { ...appointment, id: `RDV-${Date.now()}`, status: 'confirmé' }
  appointmentStore = [...appointmentStore, created]
  addNotification({ userId: appointment.userId, title: 'Rendez-vous confirmé', message: `Rendez-vous le ${appointment.date} à ${appointment.slot}.` })
  return Promise.resolve(created)
}

export function cancelAppointment(id, userId) {
  const appointment = appointmentStore.find(item => item.id === id && item.userId === userId)
  if (!appointment) return Promise.reject(new Error('Rendez-vous introuvable.'))
  appointmentStore = appointmentStore.map(item => item.id === id ? { ...item, status: 'annulé' } : item)
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
  return Promise.resolve()
}

export function updateService(id, changes) {
  catalogueStore = catalogueStore.map(service => service.id === id ? { ...service, ...changes } : service)
  return Promise.resolve()
}

export function updateJourney(id, changes) {
  journeyStore = journeyStore.map(journey => journey.id === id ? { ...journey, ...changes } : journey)
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
  addNotification({ userId, title: 'Pièce remplacée', message: document.name })
  return Promise.resolve()
}