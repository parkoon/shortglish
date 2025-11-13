/**
 * AccessToken 발급 API
 */

import { env } from '@/config/env'

import type { GenerateTokenRequest, GenerateTokenResponse } from './types'

/**
 * 인가 코드로 AccessToken 발급
 */
export const generateToken = async (
  request: GenerateTokenRequest,
): Promise<GenerateTokenResponse['success']> => {
  const response = await fetch(`${env.API_BASE_URL}/api/toss/generate-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    let errorMessage = `Failed to generate token: ${response.statusText}`
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
