import { services } from './data/services'
import { journeys } from './data/journeys'

let dossierStore = []
let userStore = []
let orderStore = []

export function getServices() {
  return Promise.resolve(services)
}

export function getServiceById(id) {
  return Promise.resolve(services.find(service => service.id === id) ?? null)
}

export function getJourneyById(id) {
  return Promise.resolve(journeys.find(journey => journey.id === id) ?? null)
}

export function searchJourneys(criteria) {
  const from = criteria.from.trim().toLowerCase()
  const to = criteria.to.trim().toLowerCase()

  return Promise.resolve(journeys.filter(journey => (
    journey.from.toLowerCase().includes(from)
    && journey.to.toLowerCase().includes(to)
    && journey.date === criteria.date
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
  }
  dossierStore = [...dossierStore, created]
  return Promise.resolve(created)
}

export function updateDossierStatus(id, status) {
  dossierStore = dossierStore.map(dossier => dossier.id === id ? { ...dossier, status } : dossier)
  return Promise.resolve()
}

export function registerUser({ email, password, role, name }) {
  const existing = userStore.find(user => user.email === email)
  if (existing) return Promise.reject(new Error('Cette adresse email est déjà utilisée.'))

  const user = { id: `USR-${Date.now()}`, email, password, role, name }
  userStore = [...userStore, user]
  return Promise.resolve({ id: user.id, email: user.email, role: user.role, name: user.name })
}

export function loginUser({ email, password, role }) {
  const user = userStore.find(candidate => candidate.email === email && candidate.password === password && candidate.role === role)
  return user
    ? Promise.resolve({ id: user.id, email: user.email, role: user.role, name: user.name })
    : Promise.reject(new Error('Email, mot de passe ou profil incorrect.'))
}

export function createOrder(order) {
  const created = {
    ...order,
    id: `CMD-${Date.now()}`,
    status: 'confirmée',
    date: new Date().toLocaleDateString('fr-FR'),
  }
  orderStore = [...orderStore, created]
  return Promise.resolve(created)
}

export function getOrders(userId) {
  return Promise.resolve(orderStore.filter(order => order.userId === userId))
}