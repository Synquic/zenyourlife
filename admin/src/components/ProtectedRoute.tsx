import { Navigate } from 'react-router-dom'
import { isAdminAuthenticated } from '../utils/cookies'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Check if admin session cookie exists
  if (!isAdminAuthenticated()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
