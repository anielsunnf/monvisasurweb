import { Navigate } from 'react-router-dom'

export function ProtectedRoute({ user, requiredRole, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if ((requiredRole && user.role !== requiredRole) || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />
  }
  return children
}
