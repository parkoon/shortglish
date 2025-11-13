import { Navigate, useLocation } from 'react-router'

import { paths } from '@/config/paths'
import { useAuth } from '@/stores/auth-store'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const { isAuthenticated, isLoading, isInitialized } = useAuth()

  // 인증 상태가 초기화되지 않았거나 로딩 중이면 대기
  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 인증되지 않은 경우 토스 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return (
      <Navigate
        to={paths.auth.tossLogin.getHref(location.pathname)}
        replace
      />
    )
  }

  return children
}
