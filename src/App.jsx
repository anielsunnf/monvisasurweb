import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { translations } from './data/translations'
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
  const [user, setUser] = useState(null)
  const [language, setLanguage] = useState(localStorage.getItem('monvisasur.language') || 'fr')
  const [theme, setTheme] = useState(localStorage.getItem('monvisasur.theme') || 'dark')

  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage)
    localStorage.setItem('monvisasur.language', nextLanguage)
  }

  function changeTheme(nextTheme) {
    setTheme(nextTheme)
    localStorage.setItem('monvisasur.theme', nextTheme)
  }

  return (
    <div className={`app-shell theme-${theme}`}>
      <Header user={user} onLogout={() => setUser(null)} language={language} onLanguageChange={changeLanguage} theme={theme} onThemeChange={changeTheme} labels={translations[language]} />
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
        <Route path="/client/notifications" element={<ProtectedRoute user={user} requiredRole="client"><NotificationsPage user={user} /></ProtectedRoute>} />
        <Route path="/admin" element={
          <ProtectedRoute user={user} requiredRole="admin">
            <AdminDashboard />
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