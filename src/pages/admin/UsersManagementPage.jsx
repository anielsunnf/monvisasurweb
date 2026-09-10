import { useEffect, useState } from 'react'
import { getAllUsers } from '../../api'

const roleLabels = { client: 'Client', advisor: 'Conseiller', admin: 'Administrateur' }

export function UsersManagementPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAllUsers().then(setUsers).catch(() => setError('Impossible de charger les utilisateurs.')).finally(() => setLoading(false))
  }, [])

  return <main className="container page">
    <div className="section-header"><div><span className="eyebrow">Back-office</span><h1 className="section-title">Gestion des utilisateurs</h1><p className="lead">Consultez les profils autorisés et vérifiez leurs niveaux d’accès.</p></div></div>
    {loading ? <div className="loading-state"><p>Chargement des utilisateurs...</p></div> : error ? <div className="error-state" role="alert"><p>{error}</p></div> : <div className="list">{users.map(user => <article className="list-card" key={user.id}><div><strong>{user.name}</strong><div className="meta-line"><span>{user.email}</span><span>{user.id}</span></div></div><span className="chip">{roleLabels[user.role] || user.role}</span></article>)}</div>}
  </main>
}