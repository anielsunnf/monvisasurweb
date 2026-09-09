import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { CataloguePage } from './pages/CataloguePage'
import { ServiceDetailPage } from './pages/ServiceDetailPage'
import { SearchTripsPage } from './pages/SearchTripsPage'
import { ReservationPage } from './pages/ReservationPage'
import { AppointmentPage } from './pages/AppointmentPage'
import { TicketPage } from './pages/TicketPage'
import { LoginPage } from './pages/LoginPage'
import { ClientDashboard } from './pages/client/ClientDashboard'
import { NewDossierPage } from './pages/client/NewDossierPage'
import { DossierDetailPage } from './pages/client/DossierDetailPage'
import { NotificationsPage } from './pages/client/NotificationsPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { CatalogueManagementPage } from './pages/admin/CatalogueManagementPage'
import { TripsManagementPage } from './pages/admin/TripsManagementPage'
import './App.css'

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('monvisasur.session') || 'null') } catch { return null }
  })
  const [theme, setTheme] = useState(localStorage.getItem('monvisasur.theme') || 'dark')

  useEffect(() => {
    document.documentElement.style.colorScheme = theme
    document.body.classList.toggle('light-body', theme === 'light')
    return () => document.body.classList.remove('light-body')
  }, [theme])

  function changeTheme(nextTheme) {
    setTheme(nextTheme)
    localStorage.setItem('monvisasur.theme', nextTheme)
  }

  function changeUser(nextUser) {
    setUser(nextUser)
    if (nextUser) localStorage.setItem('monvisasur.session', JSON.stringify(nextUser))
    else localStorage.removeItem('monvisasur.session')
  }

  return (
    <div className={`app-shell theme-${theme}`}>
      <Header user={user} onLogout={() => changeUser(null)} theme={theme} onThemeChange={changeTheme} />
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
        <Route path="/rendez-vous" element={<ProtectedRoute user={user} requiredRole="client"><AppointmentPage user={user} /></ProtectedRoute>} />
        <Route path="/billet/:reference" element={<ProtectedRoute user={user} requiredRole="client"><TicketPage user={user} /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage user={user} setUser={changeUser} />} />
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
        <Route path="/client/notifications" element={<ProtectedRoute user={user} requiredRole="client"><NotificationsPage user={user} /></ProtectedRoute>} />
        <Route path="/admin" element={
          <ProtectedRoute user={user} allowedRoles={['admin', 'advisor']}>
            <AdminDashboard user={user} />
          </ProtectedRoute>
        } />
        <Route path="/admin/catalogue" element={<ProtectedRoute user={user} requiredRole="admin"><CatalogueManagementPage /></ProtectedRoute>} />
        <Route path="/admin/trajets" element={<ProtectedRoute user={user} requiredRole="admin"><TripsManagementPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
