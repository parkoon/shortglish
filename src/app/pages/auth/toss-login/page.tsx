/**
 * 토스 로그인 랜딩 페이지
 */

import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { PageLayout } from '@/components/layouts/page-layout'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { signInWithToss } from '@/lib/toss-auth'
import { useAuthStore } from '@/stores/auth-store'

const TossLoginPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const setUser = useAuthStore(state => state.setUser)

  const redirectTo = searchParams.get('redirectTo') || '/'

  const handleTossLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // 토스 로그인 플로우 실행
      const { user } = await signInWithToss()

      // 인증 스토어에 사용자 설정
      setUser(user)

      // 리다이렉트
      navigate(redirectTo, { replace: true })
    } catch (err) {
      console.error('토스 로그인 실패:', err)
      setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.')
      setIsLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">숏글리시에 오신 것을 환영합니다</h1>
            <p className="text-muted-foreground">토스 로그인으로 간편하게 시작하세요</p>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
          )}

          <Button onClick={handleTossLogin} disabled={isLoading} size="lg" className="w-full">
            {isLoading ? (
              <>
                <Spinner className="size-4" />
                로그인 중...
              </>
            ) : (
              '토스로 로그인'
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </PageLayout>
  )
}

export default TossLoginPage
