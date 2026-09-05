import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { CataloguePage } from './pages/CataloguePage'
import { ServiceDetailPage } from './pages/ServiceDetailPage'
import { SearchTripsPage } from './pages/SearchTripsPage'
import { ReservationPage } from './pages/ReservationPage'
import { LoginPage } from './pages/LoginPage'
import { ClientDashboard } from './pages/client/ClientDashboard'
import { NewDossierPage } from './pages/client/NewDossierPage'
import { DossierDetailPage } from './pages/client/DossierDetailPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  return (
    <div className="app-shell">
      <Header user={user} onLogout={() => setUser(null)} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogue" element={<CataloguePage />} />
        <Route path="/catalogue/:id" element={<ServiceDetailPage />} />
        <Route path="/trajets" element={<SearchTripsPage />} />
        <Route path="/reservation/:id" element={
          <ProtectedRoute user={user} requiredRole="client">
            <ReservationPage user={user} />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginPage user={user} setUser={setUser} />} />
        <Route path="/client" element={
          <ProtectedRoute user={user} requiredRole="client">
            <ClientDashboard user={user} />
          </ProtectedRoute>
        } />
        <Route path="/client/dossiers/nouveau" element={
          <ProtectedRoute user={user} requiredRole="client">
            <NewDossierPage user={user} />
          </ProtectedRoute>
        } />
        <Route path="/client/dossiers/:id" element={
          <ProtectedRoute user={user} requiredRole="client">
            <DossierDetailPage user={user} />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute user={user} requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App