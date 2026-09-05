import { Navigate } from 'react-router-dom'

export function ProtectedRoute({ user, requiredRole, children }) {
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }
  return children
}
