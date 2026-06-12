import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAdminLoggedIn } from '../services/adminAuthService'

export function RequireAdminAuth() {
  const location = useLocation()

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
