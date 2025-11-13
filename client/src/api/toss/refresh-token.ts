/**
 * AccessToken 재발급 API
 */

import { env } from '@/config/env'

import type { RefreshTokenRequest } from './types'

/**
 * RefreshToken으로 AccessToken 재발급
 */
export const refreshToken = async (
  request: RefreshTokenRequest,
): Promise<RefreshTokenResponse['success']> => {
  const response = await fetch(`${env.API_BASE_URL}/api/toss/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    let errorMessage = `Failed to refresh token: ${response.statusText}`
    try {
      const errorData = await response.json()
      errorMessage = errorData.error || errorMessage
    } catch {
      // JSON 파싱 실패 시 기본 메시지 사용
    }
    throw new Error(errorMessage)
  }

  const data = await response.json()

  // 백엔드에서 직접 success 객체를 반환하므로 바로 반환
  return data
}

