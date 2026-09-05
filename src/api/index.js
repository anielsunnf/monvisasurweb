// ============================================================
// FICHIER UNIQUE À MODIFIER POUR BASCULER VERS L'API RÉELLE
// Remplacez USE_REAL_API = false par true et ajoutez BASE_URL
// ============================================================

const USE_REAL_API = false
const BASE_URL = 'http://localhost:8080/api'

// Import des données simulées
import { services } from '../data/services'
import { journeys } from '../data/journeys'
import { dossiers } from '../data/dossiers'
import { users } from '../data/users'

// Simulation d'un délai réseau
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms))

// ===== SERVICES =====
export async function getServices() {
  if (USE_REAL_API) {
    const res = await fetch(`${BASE_URL}/services`)
    return res.json()
  }
  await delay()
  return services
}

export async function getServiceById(id) {
  if (USE_REAL_API) {
    const res = await fetch(`${BASE_URL}/services/${id}`)
    return res.json()
  }
  await delay()
  return services.find(s => s.id === id) ?? null
}

// ===== TRAJETS =====
export async function searchJourneys({ from, to, date, passengers }) {
  if (USE_REAL_API) {
    const params = new URLSearchParams({ from, to, date, passengers })
    const res = await fetch(`${BASE_URL}/trajets?${params}`)
    return res.json()
  }
  await delay()
  return journeys.filter(j =>
    (!from || j.from.toLowerCase().includes(from.toLowerCase())) &&
    (!to || j.to.toLowerCase().includes(to.toLowerCase()))
  )
}

// ===== DOSSIERS =====
export async function getDossiers(userId) {
  if (USE_REAL_API) {
    const res = await fetch(`${BASE_URL}/dossiers?userId=${userId}`)
    return res.json()
  }
  await delay()
  return dossiers.filter(d => d.userId === userId)
}

export async function getDossier(id, userId) {
  if (USE_REAL_API) {
    const res = await fetch(`${BASE_URL}/dossiers/${id}`)
    return res.json()
  }
  await delay()
  return dossiers.find(d => d.id === id && d.userId === userId) ?? null
}

export async function getDossierById(id) {
  if (USE_REAL_API) {
    const res = await fetch(`${BASE_URL}/dossiers/${id}`)
    return res.json()
  }
  await delay()
  return dossiers.find(d => d.id === id) ?? null
}

export async function createDossier(data) {
  if (USE_REAL_API) {
    const res = await fetch(`${BASE_URL}/dossiers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  }
  await delay()
  const newDossier = {
    id: `DOS-${Date.now()}`,
    ...data,
    status: 'pending',
    date: new Date().toLocaleDateString('fr-FR'),
    history: [{ label: 'Demande créée', date: new Date().toLocaleDateString('fr-FR') }]
  }
  dossiers.push(newDossier)
  return newDossier
}

export async function getAllDossiers() {
  if (USE_REAL_API) {
    const res = await fetch(`${BASE_URL}/admin/dossiers`)
    return res.json()
  }
  await delay()
  return dossiers
}

export async function updateDossierStatus(id, status) {
  if (USE_REAL_API) {
    const res = await fetch(`${BASE_URL}/dossiers/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    return res.json()
  }
  await delay()
  const dossier = dossiers.find(d => d.id === id)
  if (dossier) dossier.status = status
  return dossier
}

// ===== AUTH =====
export async function login(email, password, role) {
  if (USE_REAL_API) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    return res.json()
  }
  await delay()
  const user = users.find(u => u.email === email && u.role === role)
  if (!user) throw new Error('Email ou mot de passe incorrect')
  return user
}