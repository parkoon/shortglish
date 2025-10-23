import { Navigate, useLocation } from 'react-router'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const isLoggedIn = false

  if (!isLoggedIn) {
    return (
      <Navigate to={`/auth/login?redirectTo=${encodeURIComponent(location.pathname)}`} replace />
    )
  }

  return children
}
